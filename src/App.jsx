
import './App.css'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Home from './pages/Home'
import Login from './pages/Login'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import TribePage from './pages/TribePage'

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";


function App() {
  const queryClient = new QueryClient()


  const Layout = () => {
    return (
      
      <div className=''>
          <QueryClientProvider client={queryClient}>
      <Navbar/>
      <Outlet/>
      </QueryClientProvider>
      </div>
     
       
     )
  
  }



  const router = createBrowserRouter([
    {
        path:"/",
        element:<Layout />,
        children:[
            {
                path:"/",
                element:<Login/>,
            },
            {
              path:"/register",
              element:<Register/>,
          },
         
            {
              path:"/home",
              element:<Home/>,
          },
          {
            path:"/tribepage",
            element:<TribePage/>,
        },
       
          
        ]
    }
])


return <RouterProvider router={router}/>;

}

export default App
