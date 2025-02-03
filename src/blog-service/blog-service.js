/* eslint-disable prettier/prettier */
class BlogService {
  getArticles = async (page = 1, token = null) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers.Authorization = `Token ${token}`
      }
      const res = await fetch(`https://blog-platform.kata.academy/api/articles?limit=5&offset=${(page - 1) * 5}`, {
        headers,
      })
      if (!res.ok) {
        throw new Error('Ошибка при получении статей')
      }
      const data = await res.json()
      return data
    } catch (error) {
      console.error('Ошибка при получении статей', error)
      throw error
    }
  }
  getArticlesBySlug = async (slug, token = null) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers.Authorization = `Token ${token}`
      }
      const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, { headers })
      if (!res.ok) {
        throw new Error('Ошибка при получении статьи')
      }
      const data = await res.json()
      return data
    } catch (error) {
      console.error('Ошибка при получении статьи', error)
      throw error
    }
  }
  registerUser = async (userData) => {
    try {
      const res = await fetch('https://blog-platform.kata.academy/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      if (!res.ok) {
        const errorData = await res.text()
        try {
          const parsedError = JSON.parse(errorData)
          throw new Error(JSON.stringify(parsedError))
        } catch (error) {
          throw new Error(errorData)
        }
      }
      const data = await res.json()
      return data
    } catch (error) {
      console.error('Ошибка при регистрации', error)
      throw error
    }
  }
  getUser = async (token = null) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers.Authorization = `Token ${token}`
      }
      const res = await fetch('https://blog-platform.kata.academy/api/user', { headers })
      if (!res.ok) {
        const errorData = await res.text()
        try {
          const parsedError = JSON.parse(errorData)
          throw new Error(JSON.stringify(parsedError))
        } catch (error) {
          throw new Error(errorData)
        }
      }
      const data = res.json()
      return data
    } catch (error) {
      console.error(error)
    }
  }
  signInUser = async (userData) => {
    try {
      const res = await fetch('https://blog-platform.kata.academy/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(
          JSON.stringify({
            status: res.status,
            ...errorData,
          })
        )
      }
      const data = await res.json()
      return data
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error(
          JSON.stringify({
            status: 500,
            message: 'Не удалось подключиться к серверу',
          })
        )
      }
      throw error
    }
  }
  updateUser = async (userData) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('https://blog-platform.kata.academy/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(userData),
      })
      if (!res.ok) {
        const errorData = await res.text()
        try {
          const parsedError = JSON.parse(errorData)
          throw new Error(JSON.stringify(parsedError))
        } catch (error) {
          throw new Error(errorData)
        }
      }
      const data = res.json()
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  favoriteArtical = async (slug, token) => {
    try {
      const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      })
      if (!res.ok) {
        throw new Error()
      }
      const data = res.json()
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  unfavoriteArtical = async (slug, token) => {
    try {
      const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      })
      if (!res.ok) {
        throw new Error()
      }
      const data = res.json()
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  newArticle = async (articleData, token) => {
    try {
      const res = await fetch('https://blog-platform.kata.academy/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(articleData),
      })
      if (!res.ok) {
        throw new Error()
      }
      const data = res.json()
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  updateArticle = async (articleData, token, slug) => {
    try {
      const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(articleData),
      })
      if (!res.ok) {
        throw new Error()
      }
      const data = res.json()
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  deleteArticle = async (token, slug) => {
    try {
      const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      })
      if (!res.ok) {
        throw new Error()
      }
      return
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
export default BlogService
