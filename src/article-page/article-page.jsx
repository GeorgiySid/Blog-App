/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Spin, Alert, Popconfirm } from 'antd'
import '../article-item/article-item.scss'
import './article-page.scss'
import { format } from 'date-fns'
import Markdown from 'markdown-to-jsx'

import BlogService from '../blog-service'
const token = localStorage.getItem('token')
const blogService = new BlogService()
const ArticlePage = () => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [canEdit, setCanEdit] = useState(false)
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await blogService.getArticlesBySlug(slug)
        setArticle(data.article)
        if (token) {
          const userData = await blogService.getUser(token)
          if (data.article.author.username === userData.user.username) {
            setCanEdit(true)
          }
        }
      } catch (err) {
        setError('Не удалось загрузить статью')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [slug])

  const onDelete = async () => {
    try {
      await blogService.deleteArticle(token, slug)
      navigate('/articles')
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const formattedDate = article ? format(new Date(article.createdAt), 'MMMM d, yyyy') : null

  const proessedTags =
    article && article.tagList ? article.tagList.map((tag) => tag.trim()).filter((tag) => tag !== '') : []

  const content = loading ? (
    <div className="spin-container">
      <Spin size="large" />
    </div>
  ) : error ? (
    <Alert message={error} type="error" />
  ) : article ? (
    <div className="article-page">
      <div className="article-head article">
        <div className="article-title">{article.title}</div>
        <div className="article-tags">
          {proessedTags.map((tag, index) => (
            <span key={index} className="article-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="article-description">{article.description}</div>
        <div className="article-author">
          <div className="left-box">
            <div className="username">{article.author.username}</div>
            <div className="createDate">{formattedDate}</div>
          </div>
          <img src={article.author.image} className="user-image" alt="avatar" />
        </div>
        {canEdit ? (
          <div className="button-container-head">
            <Popconfirm
              placement="rightTop"
              title={'Вы уверенны что хотите удалить статью?'}
              description={'Вы навсегда потеряете статью'}
              okText="Да"
              cancelText="Нет"
              onConfirm={() => onDelete()}
            >
              <button className="delete-article-button">Delete</button>
            </Popconfirm>
            <Link to={`/articles/${slug}/edit`} className="edit-article-button">
              Edit
            </Link>
          </div>
        ) : null}
      </div>
      <div className="article-main">
        <div className="article-body">
          <Markdown>{article.body}</Markdown>
        </div>
      </div>
    </div>
  ) : null

  return content
}

export default ArticlePage
