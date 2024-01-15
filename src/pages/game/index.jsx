import './index.css';
import { enemyAll, enemyTeam1 } from './enemy.js';
import {cardAll , fate1} from './card.js';
import {gamerAll} from './gamer.js';
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

let FAIL = 100;

let game =() => {
  const navigate = useNavigate();
  let [gamer, setGamer] = useState({}); // 玩家
  let [round, setRound] = useState(0); // 轮次。 100--游戏失败
  let [fateCardList, setFateCardList] = useState([]); // 天赋
  let [enemyTeam, setEnemyTeam] = useState([]); // 敌队
  let [arrowIndex, setArrowIndex] = useState(0); // 箭头指向
  let [cardIndex, setCardIndex] = useState(0); // 卡牌下标
  let [stage, setStage] = useState(1); // 1玩家回合 2敌人回合 3特殊效果触发回合(待做)

  let [pageHtml, setPageHtml] = useState(<div/>);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (round !== 0) {
      drawHtml(fateCardList, enemyTeam);
    }
  }, [arrowIndex, cardIndex, fateCardList, enemyTeam, gamer]);


  // 切换卡片。 选中当前卡片再点击就触发计算
  let selectCard = (index) => {
    if (index === cardIndex) {
      // console.log('fateCardList', fateCardList)
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
    console.log('tempCardList-tempEnemyTeam', tempCardList, tempEnemyTeam);
    drawHtml(tempCardList, tempEnemyTeam);
  };

  let goStart = (round, fate) => {
    setRound(round);
    setFateCardList(fateDic[fate]);
    setGamer(gamerAll[1]); // 设置玩家信息
    // todo 随机出怪
    let randomNum = 1;
    setEnemyTeam(enemyTeamDic[randomNum]);
    drawHtml(fateDic[fate], enemyTeamDic[randomNum]);
  };

  let actionOver = (stage) => {
    setStage(stage);
    calculationEnemyAction();
  };

  // 目前只实现攻击行为
  let calculationEnemyAction = () => {
    let tempGamer = {...gamer}
    enemyTeam.forEach((item) => {
      tempGamer.currentBlood = Number(tempGamer.currentBlood) - Number(item.attack);
    });
    if (tempGamer.currentBlood < 0) {
      setRound(FAIL);
    } else {
      setGamer(tempGamer);
    }
  };

  let drawHtml = (cardList, enemyList) => {
    // console.log('cardList', cardList);
    let cardListHtml =  cardList.map((item,index) => {
      return <div
        className={cardIndex === index ? 'game-card-one game-selected-card' : 'game-card-one'}
        onClick={ () => {selectCard(index)} }
        key={`card-${index}`} />
    });
    let enemyListHtml = enemyList.map((item,index) => {
      return <div>
        <div className={'game-fire'} onClick={ () => {setArrowIndex(index)} } key={index}/>
        <div className={`game-blood-bar game-blood-bar${index}`} key={`enemy-${index}`}
             style={
               item.currentBlood == item.blood ? {} :
               {backgroundPosition: `${-160 * (Number(item.currentBlood / Number(item.blood)))}px 0`}
             }
        >
          <div className={`game-blood-number`}>{item.currentBlood}</div>
        </div>
      </div>
    });
    setPageHtml(
      <div className={'game-fight-top'}>
        <div className={'game-fate game-fate1 game-owner'}>
          <div className={`game-blood-gamer`}
               style={
                 gamer?.currentBlood == gamer?.blood ? {} :
                   {backgroundPosition: `${-200 * (Number(gamer?.currentBlood / Number(gamer?.blood)))}px 0`}
               }
          >
            <div className={`game-blood-number`}>{gamer?.currentBlood}</div>
          </div>
        </div>
        <div className={'game-enemy-block'}>
          <div className={`game-enemy-arrow game-enemy-arrow${arrowIndex}`}/>
          {enemyListHtml}
        </div>
        <div className={'game-btn-over'} onClick={() => {actionOver(2)}}>结束回合</div>
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
