/* eslint-disable prettier/prettier */
import { combineReducers } from '@reduxjs/toolkit'

import { blogApi } from './blog-service/blog-service'

export const SET_USER = 'SET_USER'
export const CLEAR_USER = 'CLEAR_USER'

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
}

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
  case SET_USER:
    return {
      ...state,
      user: action.payload.user,
      token: action.payload.token,
    }
  case CLEAR_USER:
    return {
      ...state,
      user: null,
      token: null,
    }
  default:
    return state
  }
}

const rootReducer = combineReducers({
  session: sessionReducer,
  [blogApi.reducerPath]: blogApi.reducer,
})

export default rootReducer
