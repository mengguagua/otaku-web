// 动画效果菜单，适用于门户，博客，个人网站
import React, {useEffect, useState} from "react";
import styles from "./index.module.css";

// 动画字符；如果是单词，需要设置间距的下标
function Letters({letters = 'hello', marginLeftIndex = 100}) {
  useEffect(() => {
  }, []);

  let lettersHtml = Array.from(letters).map((item, index) => {
    if (marginLeftIndex === index) {
      return <span className={styles['letter']} style={{marginLeft: '60px', '--i': index}} key={index}>{item}</span>
    } else {
      return <span className={styles['letter']} style={{'--i': index}} key={index}>{item}</span>
    }
  });

  return(
    <>
      <div className={styles['line-letter']}>
        {/*Exploring My Digital Universe*/}
        {lettersHtml}
      </div>
    </>
  );
}
export function LettersSecond({letters = 'hello', marginLeftIndex = 100}) {
  let lettersHtml = Array.from(letters).map((item, index) => {
    if (marginLeftIndex === index) {
      return <span className={styles['letter']} style={{marginLeft: '60px', '--i': index}} key={index}>{item}</span>
    } else {
      return <span className={styles['letter']} style={{'--i': index}} key={index}>{item}</span>
    }
  });

  return(
    <>
      <div className={styles['line-letter']}>
        {/*Exploring My Digital Universe*/}
        {lettersHtml}
      </div>
    </>
  );
}

export default Letters;
