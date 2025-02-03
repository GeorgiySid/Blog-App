/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Alert, Pagination, Spin } from 'antd'
import './article-list.scss'
import { useSearchParams } from 'react-router-dom'

import ArticleItems from '../article-item'
import BlogService from '../blog-service'

const blogService = new BlogService()

const ArticleList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [articlesData, setArticlesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const token = localStorage.getItem('token')

  const currentPage = Number(searchParams.get('page')) || 1

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await blogService.getArticles(currentPage, token)
        setArticlesData(data.articles)
        setTotal(data.articlesCount)
      } catch (err) {
        setError('Ошибка при загрузке данных')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentPage, token, setSearchParams])

  const onPageChange = (page) => {
    setSearchParams({page : page.toString()})
  }

  const content = loading ? (
    <div className="spin-container">
      <Spin size="large" />
    </div>
  ) : error ? (
    <Alert message={error} type="error" />
  ) : (
    <div className="article-list">
      {articlesData.map((articleItem) => (
        <ArticleItems key={articleItem.slug} article={articleItem} />
      ))}
      <Pagination current={currentPage} pageSize={5} total={total} onChange={onPageChange} />
    </div>
  )

  return content
}

export default ArticleList
