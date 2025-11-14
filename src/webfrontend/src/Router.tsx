import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Client } from './api/Client.ts'
import { Storage } from './storage/Storage.ts'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { MainView } from './MainView.tsx'
import { Login } from './Login.tsx'
import "./globals.css"

const client = new Client()
const storage = new Storage()

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainView client={client} onLogout={() => { }} />
  },
  {
    path: "/Login",
    element: <Login client={client} storage={storage} onLogin={() => { }} />
  }
])


const root = document.getElementById('root')!

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

