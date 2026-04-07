import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Signup from './Pages/Signup.jsx'
import Login from './Pages/Login.jsx'
import { useContext } from 'react'
import { userDataContext } from './context/userContext.jsx'


function App() {
  let {userData} = useContext(userDataContext)
  return (
    <Routes>
      <Route path="/" element={userData ? <Home/> : <Navigate to='/login' />} />
      <Route path="/signup" element={userData ? <Navigate to="/" /> : <Signup /> } />
      <Route path="/login" element={userData ? <Navigate to="/" /> : <Login />} />
    </Routes>
  )
}

export default App

