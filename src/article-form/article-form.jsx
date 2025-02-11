/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Alert, Spin } from 'antd'

import './new-article.scss'
import {
  useCreateArticleMutation,
  useGetArticlesBySlugQuery,
  useUpdateArticleMutation,
} from '../blog-service/blog-service'

const ArticleForm = ({ token }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    mode: 'onChange',
  })
  const navigate = useNavigate()
  const { slug } = useParams()
  const location = useLocation()
  const isEditMode = location.pathname.includes('/edit')

  const [createArticle, { isLoading: isCreating, isError: isCreateError }] = useCreateArticleMutation()
  const [updateArticle, { isLoading: isUpdating, isError: isUpdateError }] = useUpdateArticleMutation()
  const {
    data,
    isLoading: isArticleLoading,
    isError: isArticleError,
  } = useGetArticlesBySlugQuery(slug, {
    skip: !isEditMode || !slug,
  })
  const { fields, append, remove } = useFieldArray({
    name: 'tags',
    control,
  })

  useEffect(() => {
    if (!token) {
      navigate('/sign-in')
      return
    }

    if (isEditMode && data && data.article) {
      setValue('title', data.article.title)
      setValue('description', data.article.description)
      setValue('body', data.article.body)
      if (data.article.tagList && data.article.tagList.length > 0) {
        while (fields.length > 0) {
          remove(0)
        }
        data.article.tagList.forEach((tag) => append({ value: tag }))
      }
    } else if (fields.length === 0) {
      append({ value: '' })
    }
  }, [isEditMode, append])

  const onSubmit = async (data) => {
    const tagList = data.tags ? data.tags.map((tag) => tag.value) : []
    const article = {
      title: data.title,
      description: data.description,
      body: data.body,
      tagList: tagList,
    }

    try {
      if (isEditMode) {
        await updateArticle({ slug: slug, articleData: article }).unwrap()
      } else {
        await createArticle(article).unwrap()
      }
      navigate('/articles')
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  const loading = isArticleLoading || isCreating || isUpdating
  const error = isArticleError || isCreateError || isUpdateError

  if (loading) {
    return (
      <div className="spin-container">
        <Spin size="large" tip="Загрузка..." />
      </div>
    )
  }

  if (error) {
    return <Alert message="Произошла ошибка при загрузке или сохранении данных" type="error" />
  }

  return (
    <div className="new-article-cont registration-cont">
      <ul className="new-article-list registration-list">
        <span>{isEditMode ? 'Edit article' : 'Create new article'}</span>
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
            placeholder="Description"
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
          <button
            className="send-cont__button create-cont__button"
            onClick={handleSubmit(onSubmit)}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? 'Сохранение...' : 'Send'}
          </button>
        </li>
      </ul>
    </div>
  )
}

export default ArticleForm
