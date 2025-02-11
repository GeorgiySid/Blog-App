/* eslint-disable prettier/prettier */
import { configureStore } from '@reduxjs/toolkit'

import rootReducer from './reducer'
import { blogApi } from './blog-service/blog-service'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(blogApi.middleware),
})