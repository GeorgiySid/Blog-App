/* eslint-disable prettier/prettier */
import React from 'react'
import { Alert, Pagination, Spin } from 'antd'
import './article-list.scss'
import { useSearchParams } from 'react-router-dom'

import { useGetArticlesQuery } from '../blog-service/blog-service'
import ArticleItems from '../article-item'

const ArticleList = ({ token }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const { data, isLoading, isError } = useGetArticlesQuery(currentPage)

  const onPageChange = (page) => {
    setSearchParams({ page: page.toString() })
  }
  let content
  if (isLoading) {
    content = (
      <div className="spin-container">
        <Spin size="large" />
      </div>
    )
  } else if (isError) {
    content = <Alert message="Ошибка при загрузке данных" type="error" />
  } else {
    content = (
      <div className="article-list">
        {data.articles.map((articleItem) => (
          <ArticleItems key={articleItem.slug} article={articleItem} token={token} />
        ))}
        <Pagination current={currentPage} pageSize={5} total={data.articlesCount} onChange={onPageChange} />
      </div>
    )
  }

  return content
}

export default ArticleList
