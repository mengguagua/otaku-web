// animateJS, 网站首页
import React, {useState, useEffect, useRef} from "react";
import styles from './index.module.css';
import {animate, createDraggable, createScope, utils} from 'animejs';

const START_POSITION = 1300; // 右滑距离，触发卡片显示的位置

let index = () => {
  let [deltaYDistance, setDeltaYDistance] = useState(0);
  let [cardOpacity, setCardOpacity] = useState(0);
  let [middleRoadTextWidth, setMiddleRoadTextWidth] = useState(0);
  let [areaLeftWidth, setAreaLeftWidth] = useState(1300); // 首屏浮现文案
  let [leftWidth, setLeftWidth] = useState(220); // 首屏中间绿带
  const containerRef = useRef(null);
  const animateRef = useRef(null);
  let draggableFirstScreen = useRef(() => {});

  // 首屏交互
  useEffect(() => {
    const winWidth = window.innerWidth;
    console.log('可视窗口宽度：', winWidth);
    // 创建可以x轴横移的物体
    initDraggableFirstScreen();
    let totalDeltaY = 0;
    const handleWheel = e => {
      e.preventDefault();
      // console.log('wheel', e.deltaY);
      // e.deltaY: 滚轮动作希望滚动的“距离”。正值时向下，负值时向上
      totalDeltaY = totalDeltaY + e.deltaY;
      totalDeltaY = totalDeltaY > 0 ? totalDeltaY : 0
      setDeltaYDistance(totalDeltaY + 80); // 添加中间横条的背景色。宽度额外加一段，防止移动时候不贴边
      draggableFirstScreen.current.setX(totalDeltaY); // 设置横移位置
      // console.log('totalDeltaY---', totalDeltaY);
      // 设置中间背景条上的文字左边距，值取css变量
      const elem = document.documentElement; // 1、获取全局document元素
      let cssVar = getComputedStyle(elem).getPropertyValue('--middle-road-text-left').trim(); // 2、获取css里的变量
      cssVar = cssVar.slice(0, -2) // 去掉尾部的'px'
      setMiddleRoadTextWidth(totalDeltaY + 80 - cssVar); // 设置具体距离
      // 设置物体右滑结束后，后续内容的位置移动
      if (totalDeltaY > 1200 && totalDeltaY < 2420) {
        setLeftWidth(1200 - totalDeltaY + 220);
      }
      let moveDistance = 1600 - winWidth / 2; // 模块居中的位置
      if (totalDeltaY > START_POSITION && totalDeltaY < (START_POSITION + moveDistance)) {
        setAreaLeftWidth( START_POSITION - (totalDeltaY - START_POSITION));
        setCardOpacity((totalDeltaY - START_POSITION) / 200); // 透明渐变出现
      }
      if (totalDeltaY < START_POSITION) {
        setCardOpacity(0);
      }
      // 滚动到一定距离后删除横向滚动，进行竖向滚动
      if (totalDeltaY - winWidth - 1000 > 0) {
        containerRef.current.removeEventListener('wheel', handleWheel);
      }
    };
    // 创建滚轮监听的对象
    // 加上 { passive: false } 才能阻止默认滚动
    containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      containerRef.current.removeEventListener('wheel', handleWheel);  // options 可省略 capture 默认为 false
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
        {/*第一屏*/}
        <div ref={containerRef} className={styles['first-screen']}>
          <div className={styles['black-area']}/>
          <div className={styles['middle-road']} style={{width: deltaYDistance}}>
            <div className={styles['middle-road-text']} style={{
              width: `${middleRoadTextWidth}px`,
              opacity: middleRoadTextWidth > 0 ? 1 : 0,
              left: `${leftWidth}px`,
            }}>Hello, GAOCC. You can do this.</div>
          </div>
          <div className={styles['notion-obj']}/>
          <div className={styles['black-area']} style={{top: '60vh'}}/>
          <div className={styles['introduce-area']} style={{left: `${areaLeftWidth}px`}}>
            <div className={styles['introduce-block1']} style={{opacity: cardOpacity}}>
              <div>JS</div>
              <div style={{fontSize: '20px'}}>
                <div>Versatile</div>
                <div>Dynamic</div>
              </div>
            </div>
            <div className={styles['introduce-block2']} style={{opacity: cardOpacity}}>
              <div>React</div>
              <div style={{fontSize: '20px'}}>Component‑based</div>
              <div style={{fontSize: '20px'}}>Flexible</div>
            </div>
            <div className={styles['introduce-block3']} style={{opacity: cardOpacity - 1}}>
              <div>CSS</div>
              <div style={{fontSize: '16px', marginLeft: '4px', color: '#eae5e2'}}>
                CSS is the language that elegantly transforms structure into styled, responsive layouts.
              </div>
            </div>
            <div className={styles['introduce-block4']} style={{opacity: cardOpacity - 1}}>
              <span>Vue、</span>
              <span style={{fontSize: '40px'}}>Html、</span>
              <span style={{fontSize: '30px'}}>Node、</span>
              <span style={{fontSize: '27px'}}>Tauri、</span>
              <span style={{fontSize: '25px'}}>Svelte、</span>
              <span style={{fontSize: '20px'}}>NestJS、</span>
              <span style={{fontSize: '16px'}}>微信小程序、</span>
              <span style={{fontSize: '16px'}}>支付宝小程序</span>
              <span style={{fontSize: '40px'}}>......</span>
            </div>
          </div>
        </div>
        {/*第二屏*/}
        <div className={styles['second-screen']}></div>
      </div>
    </>
  )

}

export default index;
