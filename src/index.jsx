import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App, { store } from './app/app'

const rootElement = document.querySelector('.blog-app')
ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <App />
  </Provider>
)
