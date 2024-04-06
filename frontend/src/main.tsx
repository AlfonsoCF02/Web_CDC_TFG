import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header />
      <App />
    <Footer />
  </React.StrictMode>,
)