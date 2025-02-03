/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import BlogService from '../blog-service'

import './new-article.scss'

const blogService = new BlogService()
const token = localStorage.getItem('token')
const NewArticle = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm()
  const navigate = useNavigate()
  const { fields, append, remove } = useFieldArray({
    name: 'tags',
    control,
  })

  useEffect(() => {
    if (!token) {
      navigate('/article')
    }
    if (fields.length === 0) {
      append({ value: '' })
    }
  }, [append, fields.length])

  const onSubmit = async (data) => {
    try {
      const tagList = data.tags.map((tag) => tag.value)
      await blogService.newArticle(
        {
          article: {
            title: data.title,
            description: data.description,
            body: data.body,
            tagList: tagList,
          },
        },
        token
      )
      navigate('/article')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="new-article-cont registration-cont">
      <ul className="new-article-list registration-list">
        <span>Create new article</span>
        <li className="title-force reg-email-force">
          Title
          <input
            type="text"
            placeholder="Title"
            className="title-force reg-email-force__input"
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
    </div>
  )
}

export default NewArticle
