/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import './sign-in.scss'
import '../registration/registration.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import { useSignInUserMutation } from '../blog-service/blog-service'
import { SET_USER } from '../reducer'

const SignIn = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()

  const [invalid, setInvalid] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const [signInUser, { isLoading }] = useSignInUserMutation()

  const onSubmit = async (data) => {
    setInvalid('')
    try {
      const result = await signInUser({ user: data }).unwrap()
      localStorage.setItem('token', result.user.token)
      dispatch({
        type: SET_USER,
        payload: { user: result.user.user, token: result.user.token },
      })
      navigate('/articles')
      window.location.reload()
    } catch (err) {
      setInvalid('Неверные данные')
      console.error(err)
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
        {invalid ? <p className="error-invalid">Произошла ошибка, скорее всего неверные данные</p> : null}
        <li className="create-cont create-cont-login">
          <button className="create-cont__button" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Login'}
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
