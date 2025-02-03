/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import './registration.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import BlogService from '../blog-service/blog-service'

const blogService = new BlogService()

const Registration = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm()

  const [serverError, setServerError] = useState({})

  const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {
      const res = await blogService.registerUser({
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      })
      localStorage.setItem('token', res.user.token)
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

  const password = watch('password')

  return (
    <div className="registration-cont">
      <ul className="registration-list">
        <span>Create new account</span>
        <li className="reg-username-force">
          Username
          <input
            type="text"
            placeholder="Username"
            className="reg-username-force__input"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
              maxLength: {
                value: 20,
                message: 'Username must be no more than 20 characters',
              },
            })}
          />
          {errors.username && <p className="error error-user">{errors.username.message}</p>}
          {serverError.username && <p className="error error-user">{serverError.username}</p>}
        </li>
        <li className="reg-email-force">
          Email address
          <input
            type="email"
            placeholder="Email address"
            className="reg-email-force__input"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p className="error error-email">{errors.email.message}</p>}
          {serverError.email && <p className="error error-email">{serverError.email}</p>}
        </li>
        <li className="reg-password-force">
          Password
          <input
            type="password"
            placeholder="Password"
            className="reg-password-force__input"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
              maxLength: {
                value: 40,
                message: 'Password must be no more than 40 characters',
              },
            })}
          />
          {errors.password && <p className="error error-pass">{errors.password.message}</p>}
        </li>
        <li className="reg-password-force repeat">
          Repeat password
          <input
            type="password"
            placeholder="Password"
            className="reg-password-force__input"
            {...register('repeatPassword', {
              required: 'Please repeat your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
          {errors.repeatPassword && <p className="error error-pass-rep">{errors.repeatPassword.message}</p>}
        </li>
        <div className="line"></div>
        <li className="agree-cont">
          <label className="agree-cont__label">
            <input
              type="checkbox"
              className="agree-cont__checkbox"
              {...register('agree', {
                required: 'You must agree to the processing of personal information',
              })}
            />
            <div className="custom-checkbox" />I agree to the processing of my personal information
          </label>
          {errors.agree && <p className="error error-checkbox">{errors.agree.message}</p>}
        </li>
        <li className="create-cont">
          <button className="create-cont__button" onClick={handleSubmit(onSubmit)}>
            Create
          </button>
          <div className="create-cont__desc">
            Alredy have an account? <Link to={'/sign-in'}>Sign in</Link>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default Registration
