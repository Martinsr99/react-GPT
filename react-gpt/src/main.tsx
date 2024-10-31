import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ReactGPT } from './ReactGPT'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ReactGPT></ReactGPT>
  </React.StrictMode>
)
