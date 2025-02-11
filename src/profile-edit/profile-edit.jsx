/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spin, Alert } from 'antd'
import { useForm } from 'react-hook-form'

import './profile-edit.scss'
import { useGetUserQuery, useUpdateUserMutation } from '../blog-service/blog-service'

const ProfileEdit = ({ token }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: 'onChange',
  })
  const navigate = useNavigate()


  const { data, isLoading, isError } = useGetUserQuery(undefined, { skip: !token })
  const [updateUser, { isLoading: isUpdating, isError: isUpdateError, error: updateError }] = useUpdateUserMutation()

  useEffect(() => {
    if (data) {
      setValue('username', data.user.username)
      setValue('email', data.user.email)
      setValue('image', data.user.image)
    }
  }, [data, setValue])

  const saveSubmit = async (dataToUpdate) => {
    try {
      await updateUser({ user: dataToUpdate }).unwrap()
      navigate('/articles')
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="spin-container">
        <Spin size="large" tip="Загрузка..." />
      </div>
    )
  }

  if (isError) {
    return <Alert message="Ошибка загрузки данных пользователя" type="error" />
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
          </li>
          <li className="reg-email-force edit-email-force">
            Email address
            <input
              type="email"
              placeholder="Email address"
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
              className="reg-password-force__input edit-Image-force__input"
              {...register('image')}
            />
          </li>
          <li className="create-cont">
            <button className="create-cont__button" onClick={handleSubmit(saveSubmit)} disabled={isUpdating}>
              {isUpdating ? 'Сохранение...' : 'Save'}
            </button>
            {isUpdateError && (
              <Alert message="Ошибка при обновлении профиля" description={updateError?.message} type="error" showIcon />
            )}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ProfileEdit
