import './index.css';
import {useState, useEffect} from "react";
import { Icon } from '@iconify/react';
import {useNavigate} from "react-router-dom";
import {Form, Input, Button} from "antd";

let index =() => {
  const navigate = useNavigate();

  let [modalForm] = Form.useForm();

  useEffect(() => {

  }, []);

  let goHome = () => {
    navigate('/otaku/home/');
  }

  const onFinish = async (values) => {

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
          <Form
            form={modalForm}
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            colon={false}
            labelAlign={'right'}
          >
            <div className={'form-block'}>
              <Form.Item label=""
                         rules={[
                           { required: true, message: '必填'},
                         ]}
                         name="phone">
                <span className={'login-label'}>手机号</span>
                <Input style={{width: 320}} placeholder={'输入手机号'}/>
              </Form.Item>
              <Form.Item label=""
                         rules={[
                           { required: true, message: '必填'},
                         ]}
                         name="password">
                <span className={'login-label'}>密码</span>
                <Input style={{width: 320}} placeholder={'输入密码'}/>
              </Form.Item>
              <Button type="primary" htmlType="submit" style={{marginLeft: '90px'}}> 登 录 </Button>
              <div className={'login-forget'}>我忘记了密码</div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};
export default index;
