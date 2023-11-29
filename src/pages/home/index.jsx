import './index.css';
import Type from './type';
import List from './list';
import React, {useEffect, useState} from "react";
import {linkGetPublic, linkGetByUserId} from "../../service/interface";
import { Icon } from '@iconify/react';
import {useSelector} from "react-redux";

let currentMineListPage = 1;
let pageSize = 20;
let originalMineList = []

let home =() => {
  let [showFlag, setShowFlag] = useState(true);
  let [listData, setListData] = useState([]);
  let [mineListData, setMineListData] = useState([]);
  let [currentKey, setCurrentKey] = useState('全部');
  const userInfo = useSelector((state) => {
    return state.user;
  });
  useEffect(()=> {
    searchData();
    searchMineData();
  }, [])

  const changeType = async (e) => {
    let item = JSON.parse(e.target.dataset.item);
    let resp;
    if (item.label === '全部') {
      resp = await linkGetPublic();
    } else {
      resp = await linkGetPublic({ type:item.label });
    }
    setCurrentKey(item.label);
    setListData(resp?.data);
  };

  // 默认执行
  let searchData = async (e) => {
    let resp = await linkGetPublic({name: e || '', type: currentKey === '全部' ? '' : currentKey});
    // 标记公开的链接是不是已经在个人链接里，来是否显示收藏按钮
    let res = await linkGetByUserId({name: ''});
    resp?.data.forEach((item) => {
      res?.data.forEach((ret) => {
        if (item.url === ret.url) {
          item.isHas = true;
        }
      })
    });
    if (resp?.data.length > pageSize) {
      setListData(resp?.data.slice(0, pageSize));
    } else {
      setListData(resp?.data);
    }
  }
  let searchMineData = async (e) => {
    let res = await linkGetPublic({name: '', type: '' });
    // 标记是不是重复的链接，且公开的链接id不是个人的。防止同一个链接，重复出现在公开列表
    let resp = await linkGetByUserId({name: e || ''});
    resp?.data.forEach((item) => {
      res?.data.forEach((ret) => {
        if (item.url === ret.url && item.id !== ret.id) {
          item.isRepeat = true;
        }
      })
    });
    originalMineList = resp?.data;
    getCurrentPage(resp?.data, 1);
  }

  let getCurrentPage = (table, page) => {
    currentMineListPage = page;
    // console.log(currentMineListPage);
    if (table.length > pageSize * currentMineListPage) {
      setMineListData(table.slice((currentMineListPage-1) * pageSize, pageSize * currentMineListPage));
    } else {
      setMineListData(table);
    }
  }

  let changePage = (num) => {
    if (currentMineListPage + num < 1) {
      return false;
    }
    getCurrentPage(originalMineList, currentMineListPage + num);
  }

  return(
    <>
      <div className={'home-container'}>
        <div className={'home-type-list'}>
          <Type changeType={changeType} currentKey={currentKey} />
          <List key={listData} listData={listData} userInfo={userInfo} searchData={searchData} searchMineData={searchMineData} isPublic={true}/>
        </div>
        {
          !!userInfo?.data?.sub ?
            <div className={'home-switch'} onClick={() => {setShowFlag(!showFlag)}}>
              {
                showFlag ? <Icon icon="line-md:person-remove-filled" width="40" /> :
                  <Icon icon="line-md:person-add-filled" width="40" />
              }
            </div> : ''
        }
        {
          !!userInfo?.data?.sub && showFlag ?
          <div className={'home-type--mine-list'}>
            <List key={mineListData} listData={mineListData} userInfo={userInfo} searchData={searchMineData} changePage={changePage} total={originalMineList.length}/>
          </div> :
            <div className={'home-type-empty'}></div>
        }
      </div>
    </>
  );
};
export default home;
