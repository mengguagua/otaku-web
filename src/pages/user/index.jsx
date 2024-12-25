import './index.css';
import React, {useState, useEffect} from "react";
import { Icon } from '@iconify/react';
import {useNavigate} from "react-router-dom";
import {Form, Input, Button, Alert, message} from "antd";
import { userEdit } from "../../service/interface";
import {useDispatch, useSelector} from "react-redux";
import { checkEmail } from '../../tool/index';

let index =() => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => {
    return state.user;
  });
  let [messageApi, contextHolder] = message.useMessage();
  let [warningMessage, setWarningMessage] = useState('');
  let [modalForm] = Form.useForm();

  useEffect(() => {

  }, []);

  let goHome = () => {
    navigate('/otaku/home/');
  }

  let showMessage = (content, type = 'success') => {
    if (type === 'success') {
      messageApi.success({
        content: content,
        icon: <Icon icon="clarity:success-standard-solid" color="#333" style={{marginRight: '4px'}}/>,
      });
    } else if (type === 'warning') {
      messageApi.warning({
        content: content,
        icon: <Icon icon="fa:exclamation" color="#333" style={{marginRight: '4px'}}/>,
      });
    }
  }

  const onFinish = async (values) => {
    if (values.email && !checkEmail(values.email)) {
      setWarningMessage('邮箱格式错误');
      return false;
    }
    await userEdit(values);
    showMessage('已修改，重新登录后生效');
    goHome();
  }

  let goBack = () => {
    history.go(-1);
  }

  return(
    <>
      {contextHolder}
      <div style={{minHeight: '100vh', backgroundColor: '#e2e2e2', paddingTop: '20px'}}>
        <div className={'login-container'}>
          <div className={'login-row'}>
            <div onClick={goHome} className={'root-cursor'}>Link</div>
            <Icon icon="fe:arrow-up" color="#333" rotate={1} />
            <span style={{color: '#333'}}>用户中心</span>
          </div>
          {
            warningMessage.length > 0 ? <Alert message={warningMessage} type="warning" showIcon closable style={{marginTop: '4px'}} onClose={() => {setWarningMessage('')}} /> : ''
          }
          <Form
            form={modalForm}
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            colon={false}
            labelAlign={'right'}
          >
            <div className={'form-block'}>
              <Form.Item label="" name="phone">
                <div>
                  <span className={'login-label'}>手机号</span>
                  <Input style={{width: 320}} value={userInfo.data.username} disabled placeholder={'输入手机号'}/>
                </div>
              </Form.Item>
              <Form.Item label="" name="nickName">
                <div>
                  <span className={'login-label'}>昵称</span>
                  <Input style={{width: 320}} placeholder={userInfo.data.nickName || '输入昵称'}/>
                </div>
              </Form.Item>
              <Form.Item label="" name="email">
                <div>
                  <span className={'login-label'}>邮箱</span>
                  <Input style={{width: 320}} placeholder={userInfo.data.email || '输入邮箱'}/>
                </div>
              </Form.Item>
              <Button type="primary" htmlType="submit" style={{marginLeft: '90px'}}> 保 存 </Button>
              <Button onClick={goBack} style={{marginLeft: '10px'}}> 返 回 </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};
export default index;
