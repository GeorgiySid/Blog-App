/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import './profile-edit.scss'
import { Spin } from 'antd'

import BlogService from '../blog-service/blog-service'

const blogService = new BlogService()

const ProfileEdit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm({
    mode: 'onChange',
  })
  const [loading, setLoading] = useState(true)
  const username = watch('username')
  const email = watch('email')
  const image = watch('image')
  const [serverError, setServerError] = useState({})
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const handleGetUser = async (token) => {
    try {
      const res = await blogService.getUser(token)
      setValue('username', res.user.username)
      setValue('email', res.user.email)
      if (res.user.image) {
        setValue('image', res.user.image)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      handleGetUser(token)
    }
  }, [token, setValue])

  const saveSubmit = async (data) => {
    try {
      await blogService.updateUser({
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
          image: data.image ? data.image : null,
        },
        token,
      })
      navigate('/articles')
      window.location.reload()
    } catch (error) {
      console.error(error)
      setServerError(error.message)
      if (error.message) {
        try {
          const errorObj = JSON.parse(error.message)
          if (errorObj.errors && errorObj.errors.username) {
            setError('username', { type: 'server', message: errorObj.errors.username })
          }
          if (errorObj.errors && errorObj.errors.email) {
            setError('email', { type: 'server', message: errorObj.errors.email })
          }
        } catch (error) {
          setError('username', { type: 'server', message: error.message })
          setError('email', { type: 'server', message: error.message })
        }
      }
    }
  }
  if (loading) {
    return (
      <div className="spin-container">
        <Spin size="large" tip="Загрузка..." />
      </div>
    )
  }
  return (
    <div className="edit">
      <div className="registration-cont edit-cont">
        <ul className="registration-list edit-list">
          <span>Edit Profile</span>
          <li className="reg-username-force edit-username-force">
            Username
            <input
              type="text"
              placeholder="Username"
              defaultValue={username}
              className="reg-username-force__input edit-username-force__input"
              {...register('username', {
                required: 'имя обязательно',
                minLength: {
                  value: 3,
                  message: 'Имя пользователя должно быть больше 3х символов',
                },
                maxLength: {
                  value: 20,
                  message: 'Имя пользователя не может быть больше 20 символов',
                },
              })}
            />
            {errors.username && <p className="error error-user">{errors.username.message}</p>}
            {serverError.username && <p className="error error-user">{serverError.username}</p>}
          </li>
          <li className="reg-email-force edit-email-force">
            Email address
            <input
              type="email"
              placeholder="Email address"
              defaultValue={email}
              className="reg-email-force__input edit-email-force__input"
              {...register('email', {
                required: 'Почта обязательна',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Неправильный формат почты',
                },
              })}
            />
            {errors.email && <p className="error error-email">{errors.email.message}</p>}
            {serverError.email && <p className="error error-email">{serverError.email}</p>}
          </li>
          <li className="reg-password-force edit-password-force">
            Password
            <input
              type="password"
              placeholder="Password"
              className="reg-password-force__input edit-password-force__input"
              {...register('password', {
                minLength: {
                  value: 6,
                  message: 'Пароль должен быть больше 6 символов',
                },
                maxLength: {
                  value: 40,
                  message: 'Пароль не может быть больше 40 символво',
                },
              })}
            />
            {errors.password && <p className="error error-pass">{errors.password.message}</p>}
          </li>
          <li className="reg-password-force edit-image-force">
            Image
            <input
              type="text"
              placeholder="Image link"
              defaultValue={image}
              className="reg-password-force__input edit-Image-force__input"
              {...register('image')}
            />
          </li>
          <li className="create-cont">
            <button className="create-cont__button" onClick={handleSubmit(saveSubmit)}>
              Save
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ProfileEdit
