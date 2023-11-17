// 路由配置
import React from 'react';
// 路由官网：https://reactrouter.com/en/main/start/tutorial
import {createBrowserRouter} from 'react-router-dom';
// 路由的根页面和错误页面
import Root from './root';
import ErrorPage from "../errorPage";
import Home from '../pages/home/index'
import Login from '../pages/login/index'
import Register from '../pages/register/index'

const router = createBrowserRouter([
  {
    path: "/otaku/",
    element: <Root/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      }, {
        path: "home",
        element: <Home />,
      }, {
        path: "login",
        element: <Login />,
      }, {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
export default router;
