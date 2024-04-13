import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

//<React.StrictMode> entre app para modo desarrollo

//Manda 2 veces las peticiones

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />,
)
