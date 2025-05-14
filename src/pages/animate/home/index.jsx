// animateJS, 网站首页
import React, {useState, useEffect, useRef} from "react";
import styles from './index.module.css';
import {animate, createDraggable, createScope, utils} from 'animejs';
import OwlIcon from "../../../components/OwlIcon/OwlIcon";
import AnimateMenu from "../../../components/AnimateMenu/AnimateMenu";
import '../../../components/AnimateMenu/index.scss';

const START_POSITION = 1300; // 右滑距离，触发卡片显示的位置

let handleWheel = null;
let totalDeltaY = 0;

let index = () => {
  let [deltaYDistance, setDeltaYDistance] = useState(0);
  let [cardOpacity, setCardOpacity] = useState(0);
  let [middleRoadTextWidth, setMiddleRoadTextWidth] = useState(0);
  let [areaLeftWidth, setAreaLeftWidth] = useState(1300); // 首屏浮现文案
  let [leftWidth, setLeftWidth] = useState(220); // 首屏中间绿带
  let [screenSize, setScreenSize] = useState(1); // 首屏和第二屏的切换效果，缩放1屏
  const containerRef = useRef(null);
  const animateRef = useRef(null);
  let draggableFirstScreen = useRef(() => {});

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'; // 关闭自动恢复位置。在“前进/后退”或刷新时是否恢复滚动位置
    }
  }, [])

  // 首屏交互
  useEffect(() => {
    const winWidth = window.innerWidth;
    console.log('可视窗口宽度：', winWidth);
    // 创建可以x轴横移的物体
    initDraggableFirstScreen();
    totalDeltaY = 0;
    handleWheel = e => {
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
      containerRef.current?.removeEventListener('wheel', handleWheel);  // options 可省略 capture 默认为 false
    };
  }, []);

  // 首屏和第二屏来回切换的效果
  useEffect(() => {
    const onScroll = () => {
      const winHeight =  window.innerHeight;
      console.log('页面滚动 Y:', window.scrollY)
      let scalePosition = winHeight * 3 / 5 // 缩放大小的滚动位置
      if (window.scrollY < winHeight && window.scrollY > scalePosition) {
        setScreenSize(1 - ( (window.scrollY - scalePosition) / winHeight ) * 0.2)
      }
      if (window.scrollY < winHeight / 2) {
        setScreenSize(1);
      }
      // 回复横屏滚动效果，totalDeltaY多减一点，避免偶发再次removeEventListener('wheel', handleWheel)
      if (window.scrollY == 0) {
        containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
        totalDeltaY = totalDeltaY - 100;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  let initDraggableFirstScreen = () => {
    draggableFirstScreen.current = createDraggable(`.${styles['notion-obj']}`, {
      x: true,
      y: false,
    });
  }

  const handleScroll = e => {
    const scrollTop = e.currentTarget.scrollTop;
    console.log('div 滚动距离：', scrollTop);
  };

  let initRoad = () => {
    animate(`.${styles['middle-road']}`,{

    })
  }

  return (
    <>
      <div  ref={animateRef} className={styles['top-layout']}>
        {/*第一屏*/}
        <div ref={containerRef} className={styles['first-screen']} style={{transform: `scale(${screenSize})`, borderRadius: `0 0 ${(1-screenSize)*1000}px ${(1-screenSize)*1000}px`}}>
          {/*右上角菜单*/}
          <div style={{position: "absolute", zIndex: '1000', right: '-20px', top: '-20px', transform: 'scale(.7)'}}>
            <AnimateMenu/>
          </div>
          {/*左上角icon*/}
          <div className={styles['eye-svg']}>
            <OwlIcon/>
          </div>
          <div className={styles['black-area']}/>
          <div className={styles['middle-road']} style={{width: deltaYDistance}}>
            <div className={styles['middle-road-text']} style={{
              width: `${middleRoadTextWidth}px`,
              opacity: middleRoadTextWidth > 0 ? 1 : 0,
              left: `${leftWidth}px`,
            }}>Hello, GAOCC. You can do this.</div>
          </div>
          <div className={styles['notion-obj']}/>
          <div className={styles['black-area']} style={{top: '60vh', borderRadius: `0 0 ${(1-screenSize)*1000}px ${(1-screenSize)*1000}px`}}/>
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
        <div className={styles['second-screen']} onScroll={handleScroll}></div>
      </div>
    </>
  )

}

export default index;
