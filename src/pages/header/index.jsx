import './index.css';
import {useState, useEffect} from "react";
import { Icon } from '@iconify/react';
// 导入redux切片的reducers
import { fetchData } from '../../store/userSlice'
// 导入触发hook
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from "react-router-dom";

let index =() => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // const [user, setUser] = useState({});
  const userInfo = useSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    // 在组件挂载时调用远程接口
    dispatch(fetchData());
  }, [dispatch]);

  let goLogin = () => {
    navigate('login/');
  }
  let goRegister = () => {
    navigate('register/');
  }

  let goHome = () => {
    navigate('home/');
  }


  return(
    <>
      <div className={'header-container'}>
        <Icon icon="line-md:coffee-half-empty-twotone-loop" color="#333" width={40} />
        <div style={{fontSize: '24px',cursor: 'pointer'}} onClick={goHome}>LINK</div>
        {
          userInfo?.data?.name ? '' : <div className={'header-register'} onClick={goRegister}>注册</div>
        }
        <div className={'header-user'} onClick={goLogin}>{userInfo?.data?.name || '登录'}</div>
      </div>
    </>
  );
};
export default index;
