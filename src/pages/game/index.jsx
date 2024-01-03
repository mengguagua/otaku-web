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

  let goStart = () => {
    setRound(1);
    setPageHtml(
      <div className={'game-fight-top'}>
        <div className={'game-fate game-fate1 game-owner'}></div>
        <div className={'game-fire game-enemy'}></div>
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
