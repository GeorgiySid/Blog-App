/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Spin } from 'antd'

import BlogService from '../blog-service'

const blogService = new BlogService()
const token = localStorage.getItem('token')
const UpdateArticle = () => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
    control,
  } = useForm({
    mode: 'onChange',
  })
  const [loading, setLoading] = useState(true)
  const title = watch('title')
  const description = watch('description')
  const body = watch('body')
  const { slug } = useParams()
  const navigate = useNavigate()
  const [canEdit, setCanEdit] = useState(false)
  const { fields, append, remove } = useFieldArray({
    name: 'tags',
    control,
  })
  useEffect(() => {
    if (!token) {
      navigate('/articles')
    }
    const fetchData = async () => {
      try {
        const res = await blogService.getArticlesBySlug(slug)
        if (token) {
          const userData = await blogService.getUser(token)
          if (res.article.author.username === userData.user.username) {
            setCanEdit(true)
          }
        }
        setValue('title', res.article.title)
        setValue('description', res.article.description)
        setValue('body', res.article.body)
        if (res.article.tagList && res.article.tagList.length > 0) {
          fields.forEach((field, index) => remove(index))
          res.article.tagList.forEach((tag) => append({ value: tag }))
        } else if (fields.length === 0) {
          append({ value: '' })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [append])

  if (loading) {
    return (
      <div className="spin-container">
        <Spin size="large" tip="Загрузка..." />
      </div>
    )
  }
  const onSubmit = async (data) => {
    try {
      const tagList = data.tags.map((tag) => tag.value)
      await blogService.updateArticle(
        {
          article: {
            title: data.title,
            description: data.description,
            body: data.body,
            tagList: tagList,
          },
        },
        token,
        slug
      )
      navigate('/article')
    } catch (error) {
      console.error(error)
      if (error.message) {
        console.log(error.message)
      }
    }
  }

  return (
    <div className="new-article-cont registration-cont">
      {canEdit ? (
        <ul className="new-article-list registration-list">
          <span>Edit article</span>
          <li className="title-force reg-email-force">
            Title
            <input
              type="text"
              placeholder="Title"
              className="title-force reg-email-force__input"
              defaultValue={title}
              {...register('title', {
                required: 'Название обязательное',
              })}
            />
            {errors.title && <p className="error error-title">{errors.title.message}</p>}
          </li>
          <li className="description-force reg-email-force">
            Short description
            <input
              type="text"
              placeholder="Title"
              defaultValue={description}
              className="description-force reg-email-force__input"
              {...register('description', {
                required: 'Описание обязательное',
              })}
            />
            {errors.description && <p className="error error-desc">{errors.description.message}</p>}
          </li>
          <li className="body-force reg-email-force">
            Text
            <textarea
              type="text"
              placeholder="Text"
              defaultValue={body}
              className="body-force reg-email-force__input"
              {...register('body', {
                required: 'Текст обязателен',
              })}
            />
            {errors.body && <p className="error error-body">{errors.body.message}</p>}
          </li>
          <li className="tags-force">
            <label>Tags</label>
            <div className="tags-list">
              {fields.map((field, index) => (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    className="tags-force__input"
                    placeholder="Tag"
                    {...register(`tags[${index}].value`)}
                    defaultValue={field.value}
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)} className="delete-button">
                      Delete
                    </button>
                  )}
                  {index === fields.length - 1 && (
                    <button className="add-button" type="button" onClick={() => append({ value: '' })}>
                      Add tag
                    </button>
                  )}
                </div>
              ))}
            </div>
          </li>
          <li className="send-cont create-cont create-cont-login">
            <button className="send-cont__button create-cont__button" onClick={handleSubmit(onSubmit)}>
              Send
            </button>
          </li>
        </ul>
      ) : (
        <Alert
          message="Ошибка"
          description="Вы не имеете прав для редактирования данной статьи"
          type="error"
          showIcon
        />
      )}
    </div>
  )
}

export default UpdateArticle
