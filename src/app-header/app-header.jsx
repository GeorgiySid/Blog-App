/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import './app-header.scss'
import { Link } from 'react-router-dom'

import BlogService from '../blog-service'
const blogService = new BlogService()

const AppHeader = () => {
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('/avatar.svg')
  const token = localStorage.getItem('token')

  const handleSignOut = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  const handleGetUser = async (token) => {
    try {
      const res = await blogService.getUser(token)
      setUsername(res.user.username)
      if (res.user.image) {
        setAvatar(res.user.image)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (token) {
      handleGetUser(token)
    }
  }, [token])

  return (
    <div className="app-header">
      <Link to="/articles" className="app-header__title">
        Realworld Blog
      </Link>
      <div className="app-header__registr-cont">
        {token ? (
          <>
            <Link to={'/new-article'} className="app-header__create-art">
              Create article
            </Link>
            <div className="avatar-cont">
              <Link to={'/profile'} className="avatar-name">
                {username}
              </Link>
              <Link to={'/profile'}>
                <img src={avatar} className="avatar-img" />
              </Link>
            </div>
            <button className="log-out" onClick={handleSignOut}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to={'/sign-in'} className="app-header__login">
              Sign In
            </Link>
            <Link to={'/sign-up'} className="app-header__registr">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
export default AppHeader
