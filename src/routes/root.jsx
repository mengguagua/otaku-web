// 最外层页面，包含头部组件
import { Outlet } from "react-router-dom";
import './root.css';
// 加载框
import { Spin } from 'antd'
import { useSelector } from 'react-redux'
import React from "react";
import Header from "../pages/header";

let Root = () => {
  // 获取全局加载状态
  let loadingType = useSelector(state => state.loading.value)
  return (
    <div>
      <Header/>
      <div className={'main'}>
        <Spin style={{zIndex: '2000', maxHeight: '100%'}} spinning={loadingType}>
          <div className={'right'}>
            <Outlet />
          </div>
        </Spin>
      </div>
    </div>
  );
}
export default Root;
