import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/******************************************************************************
 *
 * @author          Alfonso Cabezas Fernández
 * 
 * @description    Herramiento de carga la aplicación de CDC
 * 
 ******************************************************************************/

//<React.StrictMode> entre app para modo desarrollo manda 2 veces las peticiones

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />,
)
