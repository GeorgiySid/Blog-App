/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Spin, Alert, Popconfirm } from 'antd'
import '../article-item/article-item.scss'
import './article-page.scss'
import { format } from 'date-fns'
import Markdown from 'markdown-to-jsx'

import { useDeleteArticleMutation, useGetArticlesBySlugQuery, useGetUserQuery } from '../blog-service/blog-service'

const ArticlePage = () => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const token = localStorage.getItem('token')
  
  const { data, isLoading: isArticleLoading, isError: isArticleError } = useGetArticlesBySlugQuery(slug)
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetUserQuery(undefined, { skip: !token })
  const [deleteArticle, { isLoading: isDeleteLoading }] = useDeleteArticleMutation()

  const [canEdit, setCanEdit] = useState(false)

  useEffect(() => {
    if (data && data.article && user && user.user) {
      const isAuthor = data.article.author.username === user.user.username
      setCanEdit(isAuthor)
    }
  }, [data, user, token])

  const onDelete = async () => {
    try {
      await deleteArticle(slug).unwrap()
      navigate('/articles')
    } catch (error) {
      console.error(error)
    }
  }

  const formattedDate = data && data.article ? format(new Date(data.article.createdAt), 'MMMM d, yyyy') : null
  const proessedTags =
    data && data.article && data.article.tagList
      ? data.article.tagList.map((tag) => tag.trim()).filter((tag) => tag !== '')
      : []

  let content
  if (isArticleLoading || isUserLoading) {
    content = (
      <div className="spin-container">
        <Spin size="large" />
      </div>
    )
  } else if (isArticleError) {
    content = <Alert message="Не удалось загрузить статью" type="error" />
  } else if (isUserError) {
    content = <Alert message="Не удалось загрузить данные пользователя" type="error" />
  } else if (!data || !data.article) {
    content = null
  } else {
    content = (
      <div className="article-page">
        <div className="article-head article">
          <div className="article-title">{data.article.title}</div>
          <div className="article-tags">
            {proessedTags.map((tag, index) => (
              <span key={index} className="article-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="article-description">{data.article.description}</div>
          <div className="article-author">
            <div className="left-box">
              <div className="username">{data.article.author.username}</div>
              <div className="createDate">{formattedDate}</div>
            </div>
            <img src={data.article.author.image} className="user-image" alt="avatar" />
          </div>
          {canEdit ? (
            <div className="button-container-head">
              <Popconfirm
                placement="rightTop"
                title={'Вы уверенны что хотите удалить статью?'}
                description={'Вы навсегда потеряете статью'}
                okText="Да"
                cancelText="Нет"
                onConfirm={onDelete}
              >
                <button className="delete-article-button" disabled={isDeleteLoading}>
                  Delete
                </button>
              </Popconfirm>
              <Link to={`/articles/${slug}/edit`} className="edit-article-button">
                Edit
              </Link>
            </div>
          ) : null}
        </div>
        <div className="article-main">
          <div className="article-body">
            <Markdown>{data.article.body}</Markdown>
          </div>
        </div>
      </div>
    )
  }

  return content
}

export default ArticlePage
