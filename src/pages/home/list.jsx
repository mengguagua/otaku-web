import './list.css';
import React, {useEffect, useState} from "react";
import { Input } from 'antd';
import { linkGetPublic } from '../../service/interface';
import {Icon} from "@iconify/react";

const { Search } = Input;

let index =({listData, searchData}) => {
  let [listHtml, setListHtml] = useState([]);

  useEffect(()=> {
    initData();
  }, [])

  let initListHtml = (listData) => {
    let html = listData.map((item,index) => {
      return <div className={'home-list-line'} key={index}>
        <div className={'home-list-title'}>{item.name}</div>
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

  let initData = async () => {
    initListHtml(listData);
  }

  return(
    <>
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
        {
          listData.length ? listHtml :
            <div className={'home-list-empty'}>
              <Icon icon="eos-icons:bubble-loading" color="#333" width="60" />
            </div>
        }
      </div>
    </>
  );
};
export default index;
