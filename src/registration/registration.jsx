/* eslint-disable prettier/prettier */
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Alert } from 'antd'

import { useRegisterUserMutation } from '../blog-service/blog-service'

import './registration.scss'

const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({
    mode: 'onChange',
  })
  const navigate = useNavigate()


  const [registerUser, { isLoading, isError, error }] = useRegisterUserMutation()

  const onSubmit = async (data) => {
    try {
      await registerUser({ user: data }).unwrap()
      navigate('/sign-in')
    } catch (err) {
      console.error(err)

      if (err.data && err.data.errors) {
        if (err.data.errors.username) {
          setError('username', { type: 'server', message: err.data.errors.username.join(', ') })
        }
        if (err.data.errors.email) {
          setError('email', { type: 'server', message: err.data.errors.email.join(', ') })
        }
      }
    }
  }

  return (
    <div className="registration">
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
                required: 'Имя пользователя обязательно',
                minLength: {
                  value: 3,
                  message: 'Имя пользователя должно быть не менее 3 символов',
                },
                maxLength: {
                  value: 20,
                  message: 'Имя пользователя не может быть более 20 символов',
                },
              })}
            />
            {errors.username && <p className="error error-user">{errors.username.message}</p>}
          </li>
          <li className="reg-email-force">
            Email address
            <input
              type="email"
              placeholder="Email address"
              className="reg-email-force__input"
              {...register('email', {
                required: 'Email обязателен',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Неверный формат email',
                },
              })}
            />
            {errors.email && <p className="error error-email">{errors.email.message}</p>}
          </li>
          <li className="reg-password-force">
            Password
            <input
              type="password"
              placeholder="Password"
              className="reg-password-force__input"
              {...register('password', {
                required: 'Пароль обязателен',
                minLength: {
                  value: 6,
                  message: 'Пароль должен содержать не менее 6 символов',
                },
                maxLength: {
                  value: 40,
                  message: 'Пароль не может содержать более 40 символов',
                },
              })}
            />
            {errors.password && <p className="error error-pass">{errors.password.message}</p>}
          </li>
          <li className="reg-password-force repeat">
            Repeat Password
            <input
              type="password"
              placeholder="Repeat Password"
              className="reg-password-force__input"
              {...register('repeatPassword', {
                required: 'Повторите пароль',
                validate: (value) => value === watch('password') || 'Пароли не совпадают',
              })}
            />
            {errors.repeatPassword && <p className="error error-repeat-pass">{errors.repeatPassword.message}</p>}
          </li>
          <li className="create-cont">
            <button className="create-cont__button" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading ? 'Регистрация...' : 'Create'}
            </button>
          </li>
          {isError && <Alert message="Ошибка при регистрации" description={error?.message} type="error" showIcon />}
          <div className="already-account">
            Already have an account?
            <Link to="/sign-in">Sign In</Link>
          </div>
        </ul>
      </div>
    </div>
  )
}

export default Registration
