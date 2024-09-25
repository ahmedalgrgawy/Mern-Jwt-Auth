import { Route, Routes } from "react-router-dom"
import Signup from "./Pages/Signup"
import Login from "./Pages/Login"
import FloatingShape from "./Components/FloatingShape"
import VerifyEmail from "./Pages/VerifyEmail"
import { Toaster } from "react-hot-toast"
import { useAuth } from "./store/auth"
import { useEffect } from "react"
import { RedirectAuthenticated } from "./routes/RedirectAuthenticated"
import { ProtectedRoutes } from "./routes/ProtectedRoutes"
import { Home } from "./Pages/Home"
import { LoadingSpinner } from "./Components/LoadingSpinner"

function App() {

  const { isCheckingAuth, checkAuth, isAuthenticated } = useAuth();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // if (isCheckingAuth) return <LoadingSpinner />

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 flex items-center justify-center relative overflow-hidden'>

      <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
      <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
      <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

      <Routes>

        <Route path="/" element={
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        } />

        <Route path="/signup" element={
          <RedirectAuthenticated>
            <Signup />
          </RedirectAuthenticated>
        } />

        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/login" element={
          <RedirectAuthenticated>
            <Login />
          </RedirectAuthenticated>
        } />
      </Routes>

      <Toaster />

    </div >
  )
}

export default App
