import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import RouterComponent from './components/main/router.component'

function App() {

  return (
    <BrowserRouter>
      <RouterComponent />
    </BrowserRouter>
  )
}

export default App
