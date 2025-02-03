/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { createStore } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import './app.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Alert } from 'antd'

import AppHeader from '../app-header'
import BlogService from '../blog-service'
import ArticleList from '../article-list'
import ArticlePage from '../article-page'
import SignIn from '../sign-in'
import reducer from '../reducer'
import { setArticles } from '../actions'
import Registration from '../registration'
import ProfileEdit from '../profile-edit'
import NewArticle from '../new-article'
import UpdateArticle from '../update-article'
export const store = createStore(reducer)
const blogService = new BlogService()

const getArticles = async (dispatch) => {
  let allArticles = await blogService.getArticles()
  dispatch(setArticles(allArticles))
}

const App = () => {
  const dispatch = useDispatch()
  const articles = useSelector((state) => state.allArticles)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getArticles(dispatch)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [dispatch])

  return (
    <BrowserRouter>
      <div className="main">
        <AppHeader />
        <Routes>
          <Route path="*" element={<Alert message="Ошибка 404" type="error" showIcon />} />
          <Route path="/" element={<ArticleList articles={articles} />} />
          <Route path="/articles/" element={<ArticleList articles={articles} />} />
          <Route path="/articles/:slug/" element={<ArticlePage />} />
          <Route path="/sign-up/" element={<Registration />} />
          <Route path="/sign-in/" element={<SignIn />} />
          <Route path="/profile/" element={<ProfileEdit />} />
          <Route path="/new-article/" element={<NewArticle />} />
          <Route path="/articles/:slug/edit/" element={<UpdateArticle />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
