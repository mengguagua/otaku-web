// animateJS, 网站首页
import React, {useState, useEffect, useRef} from "react";
import styles from './index.module.css';
import {animate, createDraggable, createScope, utils} from 'animejs';

let index = () => {
  let [deltaYDistance, setDeltaYDistance] = useState(0);
  let [middleRoadTextWidth, setMiddleRoadTextWidth] = useState(0);
  const containerRef = useRef(null);
  const animateRef = useRef(null);
  let draggableFirstScreen = useRef(() => {});

  useEffect(() => {
    // 创建可以x轴横移的物体
    initDraggableFirstScreen();
    let totalDeltaY = 0;
    const handleWheel = e => {
      e.preventDefault();
      // console.log('wheel', e.deltaY); // 滚轮动作希望滚动的“距离”。正值时向下，负值时向上
      totalDeltaY = totalDeltaY + e.deltaY;
      totalDeltaY = totalDeltaY > 0 ? totalDeltaY : 0
      setDeltaYDistance(totalDeltaY + 80); // 添加中间横条的背景色。宽度额外加一段，防止移动时候不贴边
      draggableFirstScreen.current.setX(totalDeltaY); // 设置横移位置
      console.log('totalDeltaY---', totalDeltaY);
      // 设置中间背景条上的文字左边距，值取css变量
      const elem = document.documentElement; // 1、获取全局document元素
      let cssVar = getComputedStyle(elem).getPropertyValue('--middle-road-text-left').trim(); // 2、获取css里的变量
      cssVar = cssVar.slice(0, -2) // 去掉尾部的'px'
      setMiddleRoadTextWidth(totalDeltaY + 80 - cssVar); // 设置具体距离
    };
    // 创建滚轮监听的对象
    // 加上 { passive: false } 才能阻止默认滚动
    containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      containerRef.current.removeEventListener('wheel', handleWheel);  // options 可省略 capture 默认为 false&#8203;:contentReference[oaicite:5]{index=5}
    };
  }, []);

  let initDraggableFirstScreen = () => {
    draggableFirstScreen.current = createDraggable(`.${styles['notion-obj']}`, {
      x: true,
      y: false,
    });
  }

  let initRoad = () => {
    animate(`.${styles['middle-road']}`,{

    })
  }

  return (
    <>
      <div  ref={animateRef} className={styles['top-layout']}>
        <div ref={containerRef} className={styles['first-screen']}>
          <div className={styles['black-area']}/>
          <div className={styles['middle-road']} style={{width: deltaYDistance}}>
            <div className={styles['middle-road-text']} style={{width: `${middleRoadTextWidth}px`, opacity: middleRoadTextWidth > 0 ? 1 : 0}}>Hello GAOCC</div>
          </div>
          <div className={styles['notion-obj']}/>
          <div className={styles['black-area']} style={{top: '60vh'}}/>
        </div>
      </div>
    </>
  )

}

export default index;
