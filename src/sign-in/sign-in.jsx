/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import './sign-in.scss'
import '../registration/registration.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import BlogService from '../blog-service'

const blogService = new BlogService()

const SignIn = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()

  const [Invalid, setInvalid] = useState('')

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setInvalid('')
    try {
      console.log(data)
      const res = await blogService.signInUser({
        user: {
          email: data.email,
          password: data.password,
        },
      })
      localStorage.setItem('token', res.user.token)
      console.log(res)
      navigate('/articles')
      window.location.reload()
    } catch (error) {
      setInvalid('Неверные данные')
    }
  }
  return (
    <div className="sign-cont registration-cont">
      <ul className="registration-list">
        <span>Sign in</span>
        <li className="reg-email-force">
          Email addres
          <input
            type="email"
            placeholder="Email address"
            className="reg-email-force__input"
            {...register('email', {
              required: 'Почта обязательна',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неправильный тип почты',
              },
            })}
          />
          {errors.email && <p className="error error-email error-email-login">{errors.email.message}</p>}
        </li>
        <li className="reg-password-force">
          Password
          <input
            type="password"
            placeholder="Password"
            className="reg-password-force__input"
            {...register('password', {
              required: 'Пароль обязательный',
            })}
          />
        </li>
        {Invalid ? <p className="error-invalid">Произошла ошибка , скорее всего неверные данные</p> : null}
        <li className="create-cont create-cont-login">
          <button className="create-cont__button" onClick={handleSubmit(onSubmit)}>
            Login
          </button>
          <div className="create-cont__desc">
            Don`t have an account? <Link to={'/sign-up'}>Sign Up</Link>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default SignIn
