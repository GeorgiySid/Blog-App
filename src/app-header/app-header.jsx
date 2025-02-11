/* eslint-disable prettier/prettier */
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { CLEAR_USER } from '../reducer'
import './app-header.scss'
import { useGetUserQuery } from '../blog-service/blog-service'

const AppHeader = ({ token }) => {
  const dispatch = useDispatch()
  const { data } = useGetUserQuery(undefined, {
    skip: !token,
  })

  const handleSignOut = () => {
    localStorage.removeItem('token')
    dispatch({ type: CLEAR_USER })
    window.location.reload()
  }

  let username = null
  let avatar = '/avatar.svg'

  if (data) {
    username = data.user.username
    avatar = data.user.image || '/avatar.svg'
  }

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
