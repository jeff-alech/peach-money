import LoginRoutes from '../components/LoginRoutes';
import ProtectedRoutes from '../components/ProtectedRoutes';
import Login from '../pages/Login'
import Main from '../pages/Main'
import SignUp from '../pages/SignUp'
import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    
    <>
        <Routes>
          <Route element={<LoginRoutes redirectTo={'/main'}/>}>
            <Route path='/' element={<Login />} />
            <Route path='/sign-up' element={<SignUp />} />
          </Route>
          <Route element={<ProtectedRoutes redirectTo={'/'}/>}>
            <Route path='/main' element={<Main />} />
          </Route>
        </Routes>
    </>
  )
}
