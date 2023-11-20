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

  let goLogout = () => {

    dispatch(setToken(''));
  }


  return(
    <>
      <div className={'header-container'}>
        <Icon icon="line-md:coffee-half-empty-twotone-loop" color="#333" width={40} />
        <div style={{fontSize: '24px',cursor: 'pointer'}} onClick={goHome}>LINK</div>
        {
          userInfo?.data?.username ? '' : <div className={'header-register'} onClick={goRegister}>注册</div>
        }
        <div className={'header-user'} onClick={goLogin}>
          {userInfo?.data?.username ? `用户 ${userInfo?.data?.username}` : '登录'}
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
