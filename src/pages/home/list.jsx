import './list.css';
import React, {useEffect, useState} from "react";
import { Input, Radio, Button, message } from 'antd';
import { linkCreate } from '../../service/interface';
import {Icon} from "@iconify/react";

const { Search } = Input;

let index =({listData, searchData, userInfo}) => {
  let [messageApi, contextHolder] = message.useMessage();

  let [listHtml, setListHtml] = useState([]);
  let [showAdd, setShowAdd] = useState(false);
  let [formData, setFormData] = useState({type: '乐趣'});

  useEffect(()=> {
    initData();
  }, [])

  let initListHtml = (listData) => {
    let html = listData.map((item,index) => {
      return <div className={'home-list-line'} key={index}>
        <div className={'home-list-title'} onClick={() => {openWindow(item)}}>{item.name}</div>
        <div className={'home-list-sub'}>
          <span>{item.nickName || '无名'}</span>
          <span className={'home-list-circle'}></span>
          <span style={{color: '#ccc', fontWeight: 400}}>{item.updateTime}</span>
        </div>
        <div className={'home-list-number'}>{item.goodNumber}</div>
      </div>
    });
    // console.log('html-',html)
    setListHtml(html);
  }

  let openWindow = (item) => {
    window.open(item?.url);
  }

  const onChange = (e) => {
    console.log(`radio checked:${e.target.value}`);
    setFormData({...formData, type: e.target.value});
  };

  let initData = async () => {
    initListHtml(listData);
  }

  let doSave = () => {
    if (!formData.name || !formData.url) {
      messageApi.warning('名称或者url为空');
      return false;
    }
    linkCreate(formData).then((resp) => {
      messageApi.success('已保存');
      searchData();
    });
  }

  return(
    <>
      {contextHolder}
      <div className={'home-list-container'}>
        <Search
          allowClear
          placeholder="请输入链接名称"
          onSearch={searchData}
          style={{
            marginBottom: '8px',
            width: 200,
          }}
        >
        </Search>
        <div style={{backgroundColor: '#e2e2e2', height: '1px'}}></div>
        {
          // 判断是公开列表还是个人列表
          !!userInfo?.data?.sub ?
            <div className={'list-tool-container'}>
              <div onClick={() => {setShowAdd(!showAdd)}}>
                {
                  showAdd ?
                    <Icon icon="streamline:subtract-square-solid" color="#333" width="22" /> :
                    <Icon icon="typcn:plus-outline" color="#333" width="26" />
                }
              </div>
              {
                showAdd ?
                  <div className={'list-tool-body'}>
                    <Radio.Group onChange={onChange} buttonStyle="solid" defaultValue="乐趣" style={{margin: '0 0 4px'}}>
                      <Radio.Button value="新闻">新闻</Radio.Button>
                      <Radio.Button value="游戏">游戏</Radio.Button>
                      <Radio.Button value="技术">技术</Radio.Button>
                      <Radio.Button value="问答">问答</Radio.Button>
                      <Radio.Button value="乐趣">乐趣</Radio.Button>
                      <Radio.Button value="其它">其它</Radio.Button>
                    </Radio.Group>
                    <Input
                      placeholder="Enter your url name"
                      prefix={<Icon icon="game-icons:compact-disc" width="20" />}
                      onChange={(e) => {setFormData({...formData, name: e.target.value})}}
                    />
                    <Input
                      style={{margin: '4px 0'}}
                      placeholder="Enter your url"
                      prefix={<Icon icon="game-icons:crowned-heart" color="#333" width="20" />}
                      onChange={(e) => {setFormData({...formData, url: e.target.value})}}
                    />
                    <div className={'root-flex'} style={{justifyContent: 'center', margin: '4px 0'}}>
                      <Button type={'primary'} size={'small'} style={{margin: '0 4px 0 0'}} onClick={doSave}>保 存</Button>
                      <Button size={'small'} onClick={() => {setShowAdd(false)}}>取 消</Button>
                    </div>
                  </div>
                  : <div className={'list-tool-empty'}></div>
              }
            </div>
            : ''
        }
        {
          listData.length ? listHtml :
            <div className={'home-list-empty'}>
              <div>
                <Icon icon="game-icons:dripping-sword" color="#333" width="60" />
                <div>empty data...</div>
              </div>
            </div>
        }
      </div>
    </>
  );
};
export default index;
