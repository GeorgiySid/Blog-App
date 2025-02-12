/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

import { useFavoriteArticalMutation, useUnfavoriteArticalMutation } from '../blog-service/blog-service'
import './article-item.scss'

const ArticleItems = ({ article, token }) => {
  const navigate = useNavigate()

  if (!article) {
    return null
  }
  const [favoriteArtical] = useFavoriteArticalMutation()
  const [unfavoriteArtical] = useUnfavoriteArticalMutation()

  const [likesCount, setLikesCount] = useState(article.favoritesCount || 0)
  const [isLiked, setIsLiked] = useState(article.favorited || false)

  if (!article || typeof article !== 'object') {
    return null
  }

  const handleLike = async (slug) => {
    if (!token) {
      navigate('/sign-in')
      return
    }
    try {
      if (isLiked) {
        await unfavoriteArtical(slug)
      } else {
        await favoriteArtical(slug)
      }
      setIsLiked((prevIsLiked) => {
        const newIsLiked = !prevIsLiked
        setLikesCount((prevLikesCount) => (newIsLiked ? prevLikesCount + 1 : prevLikesCount - 1))
        return newIsLiked
      })
    } catch (error) {
      console.error('Ошибка оценки:', error)
    }
  }

  const formattedDate = format(new Date(article.createdAt), 'MMMM d, yyyy')

  const proessedTags = article.tagList ? article.tagList.map((tag) => tag.trim()).filter((tag) => tag !== '') : []
  return (
    <div className="article">
      <div className="article-title">
        <Link  className="article-title__a" to={`/articles/${article.slug}`}>{article.title}</Link>
      </div>
      <div className="article-liked">
        <button className="article-liked__button" onClick={() => handleLike(article.slug)}>
          {isLiked ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
        </button>
        <div className="article-liked__follow">{likesCount}</div>
      </div>
      <div className="article-tags">
        {proessedTags.map((tag, index) => (
          <span key={index} className="article-tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="article-description">{article.description}</div>
      <div className="article-author">
        <div className="left-box">
          <div className="username">{article.author.username}</div>
          <div className="createDate">{formattedDate}</div>
        </div>
        <img src={article.author.image} className="user-image" alt="avatar" />
      </div>
    </div>
  )
}

export default ArticleItems
