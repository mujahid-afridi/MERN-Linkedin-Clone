import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Signup from './Pages/Signup.jsx'
import Login from './Pages/Login.jsx'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />
    </Routes>
  )
}

export default App

