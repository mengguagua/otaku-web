import './type.css';
import {useState} from "react";

let type =({changeType , currentKey}) => {
  // todo 增加最新
  let typeDic = [
    {
      key: 'all',
      label: '全部',
    }, {
      key: 'happy',
      label: '乐趣',
    }, {
      key: 'news',
      label: '新闻',
    }, {
      key: 'game',
      label: '游戏',
    }, {
      key: 'technology',
      label: '技术',
    }, {
      key: 'qa',
      label: '问答',
    }, {
      key: 'other',
      label: '其它',
    },
  ];

  let menu = typeDic.map((item, index) => {
    return <div key={index} onClick={changeType} data-item={JSON.stringify(item)} className={item.label === currentKey ? 'type-menu-select' :'type-menu'}>{item.label}</div>
  });

  return(
    <>
      <div className={'type-container'}>
        {menu}
      </div>
    </>
  );
};
export default type;
