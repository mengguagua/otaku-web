import './index.css';
import Type from './type';
import List from './list';
import React, {useEffect, useState} from "react";
import {linkGetPublic} from "../../service/interface";

let home =() => {
  let [listData, setListData] = useState([]);
  let [currentKey, setCurrentKey] = useState('全部');

  useEffect(()=> {
    searchData();
  }, [])

  let searchData = async (e) => {
    let resp = await linkGetPublic({name: e || '', type: currentKey === '全部' ? '' : currentKey});
    setListData(resp?.data);
  }

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

  return(
    <>
      <div className={'home-container'}>
        <div className={'home-type-list'}>
          <Type changeType={changeType} currentKey={currentKey} />
          <List key={listData} listData={listData} searchData={searchData}/>
        </div>
      </div>
    </>
  );
};
export default home;
