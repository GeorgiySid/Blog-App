/* eslint-disable prettier/prettier */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://blog-platform.kata.academy/api/',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token')
    if (token) {
      headers.set('Authorization', `Token ${token}`)
    }
    return headers
  },
})

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery,
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: (page = 1) => `articles?limit=5&offset=${(page - 1) * 5}`,
      transformResponse: (response) => response,
    }),
    getArticlesBySlug: builder.query({
      query: (slug) => `articles/${slug}`,
      transformResponse: (response) => response,
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: 'users',
        method: 'POST',
        body: userData,
      }),
      transformErrorResponse: (response) => {
        console.error('Error in registerUser:', response)
        return { message: response.data?.errors || 'Registration failed' }
      },
    }),
    getUser: builder.query({
      query: () => 'user',
      transformResponse: (response) => response,
      transformErrorResponse: (response) => {
        console.error('Error in getUser:', response)
        return { status: response.status, message: response.data?.message || 'Failed to fetch user' }
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem('username', data.user.username)
        } catch (error) {
          console.log(error)
        }
      },
    }),
    signInUser: builder.mutation({
      query: (userData) => ({
        url: 'users/login',
        method: 'POST',
        body: userData,
      }),
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: 'user',
        method: 'PUT',
        body: userData,
      }),
    }),
    favoriteArtical: builder.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: 'POST',
      }),
    }),
    unfavoriteArtical: builder.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: 'DELETE',
      }),
    }),
    createArticle: builder.mutation({
      query: (articleData) => ({
        url: 'articles',
        method: 'POST',
        body: { article: articleData },
      }),
    }),
    updateArticle: builder.mutation({
      query: ({ slug, articleData }) => ({
        url: `articles/${slug}`,
        method: 'PUT',
        body: { article: articleData },
      }),
    }),
    deleteArticle: builder.mutation({
      query: (slug) => ({
        url: `articles/${slug}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetArticlesQuery,
  useGetArticlesBySlugQuery,
  useRegisterUserMutation,
  useGetUserQuery,
  useSignInUserMutation,
  useUpdateUserMutation,
  useFavoriteArticalMutation,
  useUnfavoriteArticalMutation,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = blogApi
