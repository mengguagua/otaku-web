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
import User from '../pages/user/index'
import Technology from '../pages/mdPage/technology'
import Article from '../pages/article/index'
import Text from '../pages/article/text'
import Game from '../pages/game/index'

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
      }, {
        path: "user",
        element: <User />,
      }, {
        path: "technology",
        element: <Technology />,
      }, {
        path: "article",
        element: <Article />,
      }, {
        path: "article/text",
        element: <Text />,
      }, {
        path: "game",
        element: <Game />,
      },
    ],
  },
]);
export default router;
