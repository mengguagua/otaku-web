import './index.css';
import {useState, useEffect} from "react";
import { Icon } from '@iconify/react';
import {useNavigate} from "react-router-dom";
import {Form, Input, Button, Alert} from "antd";
// 暂时用阿里智慧验证码
import { SmartCaptcha } from '@pansy/smart-captcha';
import { authLogin } from "../../service/interface";
import md5 from 'md5';

let index =() => {
  const navigate = useNavigate();

  let [canLogin, setCanLogin] = useState(false);
  let [warningMessage, setWarningMessage] = useState('');
  let [modalForm] = Form.useForm();

  useEffect(() => {

  }, []);

  let goHome = () => {
    navigate('/otaku/home/');
  }

  const onFinish = async (values) => {
    if (!values.phone) {
      setWarningMessage('用户为空');
      return false;
    }
    if (!values.password) {
      setWarningMessage('密码为空');
      return false;
    }
    let md5Code = md5(values.password);
    let resp = await authLogin({
      phone: values.phone,
      password: md5Code,
    });
    debugger
  }

  let isSuccess = (data) => {

    setCanLogin(true);
  }


  return(
    <>
      <div style={{minHeight: '100vh', backgroundColor: '#e2e2e2', paddingTop: '20px'}}>
        <div className={'login-container'}>
          <div className={'login-row'}>
            <div onClick={goHome} className={'root-cursor'}>Link</div>
            <Icon icon="fe:arrow-up" color="#333" rotate={1} />
            <span style={{color: '#333'}}>login</span>
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
                  <Input style={{width: 320}} placeholder={'输入手机号'}/>
                </div>
              </Form.Item>
              <Form.Item label="" name="password">
                <div>
                  <span className={'login-label'}>密码</span>
                  <Input style={{width: 320}} placeholder={'输入密码'}/>
                </div>
              </Form.Item>
              <SmartCaptcha style={{marginLeft: '90px', marginBottom: '10px'}} onSuccess={isSuccess}/>
              <Button type="primary" htmlType="submit" style={{marginLeft: '90px'}} disabled={!canLogin}> 登 录 </Button>
              <div className={'login-forget'}>我忘记了密码</div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};
export default index;
