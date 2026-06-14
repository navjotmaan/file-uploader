import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Dashboard } from './components/Dashboard.tsx'
import { Login } from './components/forms/Login.tsx'
import { Register } from './components/forms/Register.tsx'
import { Error } from './components/helpers/Error.tsx'
import { UserProvider } from './components/helpers/ContextApi.tsx'
import { ProtectedRoute } from './components/helpers/ProtectedRoute.tsx'
import { Files } from './components/Files.tsx'

const router = createBrowserRouter([
  {
    errorElement: <Error />,
    children: [
      { path: '/', element: <App /> },
      { path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute>},
      { path: '/folder/:id', element: <ProtectedRoute><Files /></ProtectedRoute>},
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
