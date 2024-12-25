import './index.css';
import { enemyAll, enemyTeam1 } from './enemy.js';
import {cardAll , fate1} from './card.js';
import {gamerAll} from './gamer.js';
import {useEffect, useState} from "react";
import {Icon} from "@iconify/react";
import {useNavigate} from "react-router-dom";
import { getRandomElementsFromArray } from '../../tool/index';

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
  let [handCardList, setHandCardList] = useState([]); // 手牌
  let [cardPile, setCardPile] = useState([]); // 牌堆
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
      drawHtml(handCardList, enemyTeam);
    }
  }, [arrowIndex, cardIndex, handCardList, enemyTeam, gamer, stage]);


  // 切换卡片。 选中当前卡片再点击就触发计算
  let selectCard = (index) => {
    if (index === cardIndex) {
      calculation(handCardList[index]);
    } else {
      setCardIndex(index);
    }
  };

  let calculationType1 = (cardInfo) => {
    let tempEnemyTeam = [...enemyTeam];
    let currentBlood = enemyTeam[arrowIndex].currentBlood - cardInfo.number
    if (currentBlood <= 0) {
      // 血量低于0，销毁对象
      tempEnemyTeam.splice(arrowIndex, 1)
      setEnemyTeam(tempEnemyTeam);
    } else {
      tempEnemyTeam[arrowIndex].currentBlood = currentBlood;
      setEnemyTeam(tempEnemyTeam);
    }
    return tempEnemyTeam
  }

  let calculationType2 = (cardInfo) => {
    let shield = Number(gamer.shield) + cardInfo.number
    setGamer({...gamer, shield: shield});
    let tempEnemyTeam = [...enemyTeam];
    return tempEnemyTeam;
  }

  // // 对应card.js里的type字段
  let calculationDic = {
    1: calculationType1,
    2: calculationType2,
  };

  // 计算
  let calculation = (cardInfo) => {
    let tempEnemyTeam = calculationDic[cardInfo.type](cardInfo);
    // 销毁已使用的卡
    let tempCardList = [...handCardList];
    tempCardList.splice(cardIndex, 1)
    // 设置计算后状态（卡队列和敌人队列）
    setHandCardList(tempCardList);
    setEnemyTeam(tempEnemyTeam);
    console.log('tempCardList-tempEnemyTeam', tempCardList, tempEnemyTeam);
    // drawHtml(tempCardList, tempEnemyTeam);
  };

  let goStart = (round, fate) => {
    setRound(round);
    // 牌组中随机取4张。将数组随机化，返回指定数量的前count个的数组和剩下的数组
    let cardList = getRandomElementsFromArray(fateDic[fate], 4);
    setCardPile(cardList[1]); // 设置牌堆
    setHandCardList(cardList[0]); // 设置手牌
    setGamer(gamerAll[1]); // 设置玩家信息
    // todo 随机出怪
    let randomNum = 1;
    setEnemyTeam(enemyTeamDic[randomNum]);
    drawHtml(cardList[0], enemyTeamDic[randomNum]);
  };

  let actionOver = (stage) => {
    setStage(stage);
    calculationEnemyAction();
  };

  // 目前只实现攻击行为
  let calculationEnemyAction = () => {
    let tempGamer = {...gamer}
    enemyTeam.forEach((item) => {
      let shield = Number(tempGamer.shield) - Number(item.attack)
      if (shield >= 0) {
        tempGamer.shield = shield;
      } else {
        tempGamer.currentBlood = Number(tempGamer.currentBlood) + shield;
        tempGamer.shield = 0;
      }
    });
    console.log('tempGamer.currentBlood：', tempGamer.currentBlood)
    if (tempGamer.currentBlood <= 0) {
      console.log('FAIL')
      setRound(FAIL);
    } else {
      setGamer({...tempGamer, shield: 0});
      setStage(1); // 玩家回合
      updateCard(); // 回合开始，更新手牌
    }
  };

  // 回合开始，更新手牌
  let updateCard = () => {
    console.log('cardPile', cardPile)
    if (cardPile.length >= 2) {
      let cardList = getRandomElementsFromArray(cardPile, 2);
      setCardPile(cardList[1]); // 设置牌堆
      setHandCardList([...handCardList, ...cardList[0]]); // 设置手牌
    } else if (cardPile.length === 1) {
      let cardList = getRandomElementsFromArray(fateDic[1], 1);
      setCardPile(cardList[1]); // 设置牌堆
      setHandCardList([...handCardList, ...cardPile, ...cardList[0]]); // 设置手牌
    } else {
      let cardList = getRandomElementsFromArray(fateDic[1], 2);
      setCardPile(cardList[1]); // 设置牌堆
      setHandCardList([...handCardList, ...cardList[0]]); // 设置手牌
    }
  }

  let drawHtml = (cardList, enemyList) => {
    // console.log('cardList', cardList);
    let cardListHtml =  cardList.map((item,index) => {
      return <div
        className={cardIndex === index ? 'game-card-one game-selected-card' : 'game-card-one'}
        onClick={ () => {selectCard(index)} }
        key={`card-${index}`} >{item.name}-{item.number}</div>
    });
    let enemyListHtml = enemyList.map((item,index) => {
      return <div>
        {/*怪物*/}
        <div className={'game-fire'} onClick={ () => {setArrowIndex(index)} } key={index}/>
        {/*血条*/}
        <div className={`game-blood-bar game-blood-bar${index}`} key={`enemy-${index}`}
             style={
               item.currentBlood == item.blood ? {} :
               {backgroundPosition: `${-160 * (Number(item.currentBlood / Number(item.blood)))}px 0`}
             }
        >
          {/*血量*/}
          <div className={`game-blood-number`}>{item.currentBlood}</div>
        </div>
      </div>
    });
    setPageHtml(
      <div className={'game-fight-top'}>
        {
          // 游戏失败
          round == 100 ?<div className={'game-over'}>
            <div className={'game-over-btn'}/>
          </div> : ''
        }
        {/*角色*/}
        <div className={'game-gamer game-fate1 game-owner'}>
          {/*角色血条*/}
          <div className={`game-blood-gamer`}
               style={
                 gamer?.currentBlood == gamer?.blood ? {} :
                   {backgroundPosition: `${200 * (Number(gamer?.currentBlood / Number(gamer?.blood))) - 200}px 0`}
               }
          >
            {/*角色血量/护驾*/}
            <div className={`game-blood-number`}>
              {gamer?.currentBlood}
              {
                gamer.shield ? `护甲(${gamer.shield})` : ''
              }
            </div>
          </div>
        </div>
        <div className={'game-enemy-block'}>
          {/*怪物选择箭头*/}
          <div className={`game-enemy-arrow game-enemy-arrow${arrowIndex}`}/>
          {enemyListHtml}
        </div>
        {/*回合结束，进入敌人回合*/}
        <div className={'game-btn-over'} onClick={() => {actionOver(2)}}>结束回合</div>
        {/*卡牌列表*/}
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
