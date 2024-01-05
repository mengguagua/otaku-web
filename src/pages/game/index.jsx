import './index.css';
import { enemyAll, enemyTeam1 } from './enemy.js';
import {cardAll , fate1} from './card.js';
import {useEffect, useState} from "react";
import {Icon} from "@iconify/react";
import {useNavigate} from "react-router-dom";

let cardAllLength = Object.keys(cardAll).length;
let fateDic = {
  1: fate1,
};
let enemyTeamDic = {
  1: enemyTeam1,
};

let game =() => {
  const navigate = useNavigate();
  let [round, setRound] = useState(0); // 轮次
  let [fateCardList, setFateCardList] = useState([]); // 天赋
  let [enemyTeam, setEnemyTeam] = useState([]); // 敌队
  let [arrowIndex, setArrowIndex] = useState(0);
  let [cardIndex, setCardIndex] = useState(0);
  let [enemyId, setEnemyId] = useState(0);

  let [pageHtml, setPageHtml] = useState(<div/>);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (round !== 0) {
      drawHtml(fateCardList, enemyTeam);
    }
  }, [arrowIndex, cardIndex]);


  // 切换卡片
  let selectCard = (index) => {
    if (index === cardIndex) {
      calculation(fateCardList[index]);
    } else {
      setCardIndex(index);
    }
  };

  // 计算
  let calculation = (cardInfo) => {
    let tempEnemyTeam = [...enemyTeam];
    if (cardInfo.type === 1) { // 攻击卡
      let currentBlood = enemyTeam[arrowIndex].currentBlood - cardInfo.number
      if (currentBlood <= 0) {
        // 血量低于0，销毁对象
        tempEnemyTeam.splice(arrowIndex, 1)
        setEnemyTeam(tempEnemyTeam);
      } else {
        tempEnemyTeam[arrowIndex].currentBlood = currentBlood;
        setEnemyTeam(tempEnemyTeam);
      }
    }
    // 销毁已使用的卡
    let tempCardList = [...fateCardList];
    tempCardList.splice(cardIndex, 1)
    // 设置计算后状态（卡队列和敌人队列）
    setFateCardList(tempCardList);
    setEnemyTeam(tempEnemyTeam);
    // console.log('tempCardList-tempEnemyTeam', tempCardList, tempEnemyTeam);
    drawHtml(tempCardList, tempEnemyTeam);
  };

  let goStart = (round, fate) => {
    setRound(round);
    setFateCardList(fateDic[fate]);
    // todo 随机出怪
    let randomNum = 1;
    setEnemyTeam(enemyTeamDic[randomNum]);
    drawHtml(fateDic[fate], enemyTeamDic[randomNum]);
  };

  let drawHtml = (cardList, enemyList) => {
    // console.log('cardList', cardList);
    let cardListHtml =  cardList.map((item,index) => {
      return <div
        className={cardIndex === index ? 'game-card-one game-selected-card' : 'game-card-one'}
        onClick={ () => {selectCard(index)} }
        key={index} />
    });
    let enemyListHtml = enemyList.map((item,index) => {
      return <div>
        <div className={'game-fire'} onClick={ () => {setArrowIndex(index)} } key={index}/>
        <div className={'game-blood-bar'} key={index}/>
      </div>
    });
    setPageHtml(
      <div className={'game-fight-top'}>
        <div className={'game-fate game-fate1 game-owner'}/>
        <div className={'game-enemy-block'}>
          <div className={`game-enemy-arrow game-enemy-arrow${arrowIndex}`}/>
          {enemyListHtml}
        </div>
        <div className={'game-card-head'}>
          {cardListHtml}
        </div>
      </div>
    );
  }

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
              <div className={'game-fate game-fate1'} onClick={() => goStart(1,1)}/>
            </div>
            <div className={'game-card'} style={{marginRight: '40px'}}>
              <div className={'game-fate game-fate2'} onClick={goStart}/>
            </div>
            <div className={'game-card'}>
              <div className={'game-fate game-fate3'} onClick={goStart}/>
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
export default game;
