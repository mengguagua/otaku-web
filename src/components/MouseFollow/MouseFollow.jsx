// 鼠标跟随效果
import React, {useEffect, useState} from "react";
import './index.scss';

// 动画字符；如果是单词，需要设置间距的下标
function MouseFollow() {
  useEffect(() => {
  }, []);

  const gridArray = Array(400).fill(0);
  let cellHtml = gridArray.map((item, index) => {
    return <div className={"mouse-follow-cell"}/>
  });

  return(
    <div className={'mouse-follow-top'}>
      {cellHtml}
      <div className={'mouse-follow-content'}>
        <div className={'mouse-follow-square'}/>
      </div>
    </div>
  );
}

export default MouseFollow;
