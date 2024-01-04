import './index.css';
import {useEffect, useState} from "react";
import {Icon} from "@iconify/react";
import {useNavigate} from "react-router-dom";

let type =({changeType , currentKey}) => {
  const navigate = useNavigate();
  // 轮次
  let [round, setRound] = useState(0);
  let [pageHtml, setPageHtml] = useState('');

  useEffect(() => {
    init();
  }, []);

  let selectCard = (e) => {
    let item = JSON.parse(e.currentTarget.dataset.item);
    console.log('card', item);

    e.currentTarget.parentNode.childNodes.forEach((ret) => {
      if (e.currentTarget != ret) {
        ret.classList.remove('game-selected-card');
      }
    });
    // console.log('e.currentTarget.classList', e.currentTarget.classList)
    if (e.currentTarget.classList.contains('game-selected-card')) {
      e.currentTarget.classList.remove('game-selected-card');
    } else {
      e.currentTarget.classList.add('game-selected-card')
    }
  };

  let goStart = () => {
    setRound(1);
    let cardList = [
      {
        name: 'attack',
        type: 1,
        num: 5,
      }, {
        name: 'defend',
        type: 2,
        num: 3,
      }
    ]
    let cardListHtml =  cardList.map((item,index) => {
      return <div className={'game-card-one'} onClick={selectCard} key={index} data-item={JSON.stringify(item)}></div>
    });
    setPageHtml(
      <div className={'game-fight-top'}>
        <div className={'game-fate game-fate1 game-owner'}></div>
        <div className={'game-fire game-enemy1'}></div>
        <div className={'game-fire game-enemy2'}></div>
        <div className={'game-fire game-enemy3'}></div>
        <div className={'game-card-head'}>
          {cardListHtml}
        </div>
      </div>
    );

  };

  let init = () => {
    // 查询接口获取round
    // todo
    // 跳到对应第几轮
    if (round === 0) {
      setPageHtml(
        <div className={'root-flex game-top'} style={{justifyContent: "center", alignItems: "center"}}>
          <div className={'game-card-line'}>
            <div className={'game-card'} style={{marginRight: '40px'}}>
              <div className={'game-desc'}>
                {/*<div style={{opacity: 0}}>这是描述</div>*/}
                {/*<div style={{position: "absolute", bottom: '40px',left: '80px'}}>确定</div>*/}
              </div>
              <div className={'game-fate game-fate1'} onClick={goStart}></div>
            </div>
            <div className={'game-card'} style={{marginRight: '40px'}}>
              <div className={'game-fate game-fate2'} onClick={goStart}></div>
            </div>
            <div className={'game-card'}>
              <div className={'game-fate game-fate3'} onClick={goStart}></div>
            </div>
          </div>
        </div>
      );
    }
  }

  return(
    <>
      {pageHtml}
    </>
  );
};
export default type;
