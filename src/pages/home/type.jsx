import './type.css';
import {useState} from "react";
import {linkGetPublic} from "../../service/interface";


let type =({changeType , currentKey}) => {
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
    },
  ];

  // let changeData = async (e)=> {
  //   let item = JSON.parse(e.target.dataset.item);
  //   let resp = {};
  //   if (item.label === '全部') {
  //     resp = await linkGetPublic();
  //   } else {
  //     resp = await linkGetPublic({ type:item.label });
  //   }
  //   changeType(resp?.data);
  //   setCurrentKey(item.label);
  // };

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
