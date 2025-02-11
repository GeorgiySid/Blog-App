/* eslint-disable prettier/prettier */
import React from 'react'
import './app.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Alert } from 'antd'
import { useSelector } from 'react-redux'

import AppHeader from '../app-header'
import ArticleList from '../article-list'
import ArticlePage from '../article-page'
import SignIn from '../sign-in'
import Registration from '../registration'
import ProfileEdit from '../profile-edit'
import ArticleForm from '../article-form'

const App = () => {
  const token = useSelector((state) => state.session.token)
  return (
    <BrowserRouter>
      <div className="main">
        <AppHeader token={token} />
        <Routes>
          <Route path="*" element={<Alert message="Ошибка 404" type="error" showIcon />} />
          <Route path="/" element={<ArticleList />} />
          <Route path="/articles/" element={<ArticleList token={token} />} />
          <Route path="/articles/:slug/" element={<ArticlePage token={token} />} />
          <Route path="/sign-up/" element={<Registration />} />
          <Route path="/sign-in/" element={<SignIn />} />
          <Route path="/profile/" element={<ProfileEdit token={token} />} />
          <Route path="/new-article/" element={<ArticleForm token={token} />} />
          <Route path="/articles/:slug/edit/" element={<ArticleForm token={token} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
