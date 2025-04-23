import './index.css';
import {useState, useEffect} from "react";
import { Icon } from '@iconify/react';
// 导入redux切片的reducers
import {fetchData, setToken} from '../../store/userSlice'
// 导入触发hook
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from "react-router-dom";
import {Popconfirm} from "antd";

let index =() => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    // 在组件挂载时调用远程接口
    dispatch(fetchData());
  }, [dispatch]);

  let goPage = () => {
    if(userInfo?.data?.username) {
      navigate('user/');
    } else {
      navigate('login/');
    }
  }
  let goRegister = () => {
    navigate('register/');
  }

  let goHome = () => {
    navigate('home/');
  }

  let goLogout = () => {
    dispatch(setToken(''));
    dispatch(fetchData());
    navigate('home/');
  }

  let goGithub = () => {
    window.open('https://github.com/mengguagua/otaku-web');
  };


  return(
    <>
      <div className={'header-container'}>
        {/*<Icon icon="line-md:coffee-half-empty-twotone-loop" color="#333" width={40} />*/}
        <div className={'header-loading'}></div>
        <div style={{fontSize: '24px',cursor: 'pointer'}} onClick={goHome}>LINK</div>
        <div className={'header-github'} onClick={goGithub}></div>
        <div className={'header-user root-flex'}>
          <div onClick={goPage}>
            {userInfo?.data?.username ?
              <span className={'root-flex'}>
                <Icon icon="pixelarticons:user" color="#333" width="20" />
              {userInfo?.data?.nickName || userInfo?.data?.username}
              </span>
              : '登录'}
          </div>

          {
            userInfo?.data?.username ? '' : <div style={{marginLeft: '4px'}} onClick={goRegister}>注册</div>
          }

          {userInfo?.data?.username ?
            <Popconfirm
              title="提示"
              icon={''}
              description={`嘎嘎噶，要离开了吗?`}
              onConfirm={goLogout}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <div className={'header-logout'}>登出</div>
            </Popconfirm>
            : ''}
        </div>
      </div>
    </>
  );
};
export default index;
