// 左侧分类栏。提供分类，和其它功能的跳转
import './type.css';
import {useState} from "react";
import {Icon} from "@iconify/react";
import {useNavigate} from "react-router-dom";

let type =({changeType , currentKey}) => {
  const navigate = useNavigate();
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

  let goPage = () => {
    navigate('/otaku/technology/');
  }

  let goTextPage = () => {
    // navigate('/otaku/article/');
    window.open('https://cake-drill-cc0.notion.site/1678faad6d8a80b698e6d301b18170b6')
  }

  let goGame = () => {
    return false; // 暂时不开放
    navigate('/otaku/game/');
  }

  let goAIPage = () => {
    navigate('/otaku/ai/');
  }

  return(
    <>
      <div>
        <div className={'type-container'}>
          {menu}
        </div>
        <div className={'type-card-roguelike'} onClick={goGame}>
          Roguelike
        </div>
        <div className={'type-card-coffee'}>
          <div>请站长一杯</div>
          <div className={'root-flex'} style={{justifyContent: 'center', marginTop: '4px'}}>咖啡<Icon icon="raphael:coffee" color="#333" width={18}/></div>
          <img src="/public/code-wx-pay.jpg" alt="二维码" style={{margin: "10px auto 0", width: '80px'}}/>
          <div onClick={goPage} style={{fontSize: '13px',marginTop:'10px',textDecoration: "underline", cursor: 'pointer'}}>站点技术框架</div>
          <div onClick={goTextPage} style={{fontSize: '13px',marginTop:'10px',textDecoration: "underline", cursor: 'pointer'}}>推荐文章</div>
          <div onClick={goAIPage} style={{fontSize: '11px',margin:'10px 0',textDecoration: "underline", cursor: 'pointer'}}>DeepSeek</div>
        </div>
      </div>
    </>
  );
};
export default type;
