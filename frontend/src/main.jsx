import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Layout from './routes/Layouts/Layout.jsx';
import EncryptPage from './pages/EncryptPage.jsx';
import DecryptPage from './pages/DecryptPage.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='encImg' element={<EncryptPage/>}/>
      <Route path='decText' element={<DecryptPage/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
)
