import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Client } from './api/Client.ts'
import { Storage } from './storage/Storage.ts'
import { createBrowserRouter, RouterProvider } from 'react-router'

const client = new Client()
const storage = new Storage()

const router = createBrowserRouter([
  {
    path: "/",
    element: <App client={client} storage={storage} />
  }
])


const root = document.getElementById('root')!

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

