/* eslint-disable prettier/prettier */
import { SET_ARTICLES } from './actions'

const initialState = {
  allArticles: [],
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
  case SET_ARTICLES:{
    return{
      ...state,
      allArticles: action
    }
  }
  default:
    return state
  }
}

export default reducer