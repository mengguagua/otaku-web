// gaocc网站首页
import React, {useState, useEffect, useRef} from "react";
import styles from './index.module.css';
import {animate, createDraggable, createScope, utils} from 'animejs';
import OwlIcon from "../../../components/OwlIcon/OwlIcon";
import AnimateMenu from "../../../components/AnimateMenu/AnimateMenu";
import '../../../components/AnimateMenu/index.scss';
import Letters, {LettersSecond} from "../../../components/Letters/Letters";
import MouseFollow from "../../../components/MouseFollow/MouseFollow";
import { Image } from 'antd';

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
  let [windowScrollY, setWindowScrollY] = useState(0);
  const [preImgVisible, setPreImgVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const animateRef = useRef(null);
  const characterRef = useRef(null); // 首屏人物动画


  // 等待页面资源加载
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000)
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'; // 关闭自动恢复位置。在“前进/后退”或刷新时是否恢复滚动位置
    }
  }, [])

  // 首屏交互
  useEffect(() => {
    const winWidth = window.innerWidth;
    console.log('可视窗口宽度：', winWidth);
    totalDeltaY = 0;
    let someTotalDeltaY = 0;
    handleWheel = e => {
      e.preventDefault();
      // console.log('wheel', e.deltaY);
      // e.deltaY: 滚轮动作希望滚动的“距离”。正值时向下，负值时向上
      totalDeltaY = totalDeltaY + e.deltaY;
      totalDeltaY = totalDeltaY > 0 ? totalDeltaY : 0
      setDeltaYDistance(totalDeltaY); // 添加中间横条的背景色。
      walk(totalDeltaY, e.deltaY);
      // console.log('totalDeltaY---', totalDeltaY);
      // 设置中间背景条上的文字左边距，值取css变量
      const elem = document.documentElement; // 1、获取全局document元素
      let cssVar = getComputedStyle(elem).getPropertyValue('--middle-road-text-left').trim(); // 2、获取css里的变量
      cssVar = cssVar.slice(0, -2) // 去掉尾部的'px'
      if (totalDeltaY > 1260) { // 额外处理横溢一定距离后的长度，让动画更自然
        someTotalDeltaY = someTotalDeltaY + e.deltaY;
        setMiddleRoadTextWidth(totalDeltaY + 60 - (cssVar - someTotalDeltaY)); // 设置具体距离
      } else {
        setMiddleRoadTextWidth(totalDeltaY + 0 - cssVar); // 设置具体距离
      }

      // 设置物体右滑结束后，后续内容的位置移动
      if (totalDeltaY > 1200 && totalDeltaY < 2420) {
        setLeftWidth(1200 - totalDeltaY + 220);
      }
      let moveDistance = 1710 - winWidth / 2; // 模块居中的位置
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

  // 首屏和第二屏来回切换，圆角效果
  useEffect(() => {
    const onScroll = () => {
      const winHeight =  window.innerHeight;
      setWindowScrollY(window.scrollY)
      // console.log('页面滚动 Y:', window.scrollY)
      let scalePosition = winHeight * 3 / 5 // 缩放大小的滚动位置
      if (window.scrollY < winHeight && window.scrollY > scalePosition) {
        setScreenSize(1 - ( (window.scrollY - scalePosition) / winHeight ) * 0.2)
      }
      if (window.scrollY < winHeight / 2) {
        setScreenSize(1);
      }
      // 恢复横屏滚动效果，totalDeltaY多减一点，避免偶发再次removeEventListener('wheel', handleWheel)
      if (window.scrollY == 0) {
        containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
        totalDeltaY = totalDeltaY - 100;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 视频，自动播放等设置
  useEffect(() => {
    const video = document.getElementById("fourthVideo");
    const fiveVideo = document.getElementById("fiveVideo");
    const sixVideo = document.getElementById("sixVideo");
    const observer = new IntersectionObserver( // 浏览器提供的API，用户异步观察目标元素和指定元素（默认根元素即浏览器窗口）的交叉情况
      (entries) => {
        // console.log('entries',entries)
        // entries 参数是一个对象数组。每个对象有多个属性，常用是：1、isIntersecting：一个布尔值，指示目标元素是否与根容器发生了交叉（即是否可见）。2、intersectionRatio：目标元素与根容器交叉区域的比例，范围从 0（完全不可见）到 1（完全可见）。
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play();
            fiveVideo.play();
            sixVideo.play();
          } else {
            if (entry.target.id === 'fourthVideo') {
              video.pause();
              video.currentTime = 0; // 重制到最开始
            }
            if (entry.target.id === 'fiveVideo') {
              fiveVideo.pause();
              fiveVideo.currentTime = 0;
            }
            if (entry.target.id === 'sixVideo') {
              sixVideo.pause();
              sixVideo.currentTime = 0;
            }
          }
        });
      },
      { threshold: .01 } // threshold: 0.5：当视频有 50% 可见时触发回调。root：指定根元素，默认为浏览器视口。
    );
    observer.observe(video); // 设置观察对象
    observer.observe(fiveVideo);
    observer.observe(sixVideo);
  }, []);

  // 首屏宇航员图片动画
  let walk = (scrollAccum, deltaY) => {
    const pixelsPerFrame = 70; // 每滚动 n个px 切换一帧
    const totalFrames = 4; // 总的动画帧数
    const frameWidth = 12.26; // 每一帧的宽度
    const rawFrameIndex = Math.floor(scrollAccum / pixelsPerFrame);
    const frameIndex = ((rawFrameIndex % totalFrames) + totalFrames) % totalFrames;
    // 计算是否在倒退
    let isReversing = deltaY < 0;
    if (scrollAccum < 1) {
      isReversing = false;
    }
    // console.log('isReversing',isReversing)
    if (characterRef.current) {
      characterRef.current.style.backgroundPosition = `-${frameIndex * frameWidth}vh 0`;
      characterRef.current.style.transform = isReversing ? `translateX(${scrollAccum}px) scaleX(-1)` : `translateX(${scrollAccum}px) scaleX(1)`;
    }
  }

  return (
    <>
      {
        loading? <div className={styles['loading-screen']}>
          <div className={styles['loader']}></div>
        </div>:''
      }
      <div ref={animateRef} className={styles['top-layout']} style={loading? {display: "none"}: {display: "block"}}>
        {/*右上角菜单*/}
        <div style={{position: "fixed", zIndex: '1000', right: '-20px', top: '-20px', transform: 'scale(.7)'}}>
          <AnimateMenu/>
        </div>
        {/*左上角icon*/}
        <div className={styles['eye-svg']} style={{zIndex: '1000'}}>
          <OwlIcon color={'#459582'}/>
        </div>
        {/*第一屏*/}
        <div ref={containerRef} className={styles['first-screen']} style={{transform: `scale(${screenSize})`, borderRadius: `0 0 ${(1-screenSize)*1000}px ${(1-screenSize)*1000}px`}}>
          <MouseFollow/>
          <div className={styles['black-area']}>
            {/*文字动画*/}
            <Letters letters={'ExploringGaocc'} marginLeftIndex={9}/>
            {/*文字动画*/}
            <LettersSecond letters={'DigitalUniverse'} marginLeftIndex={7}/>
          </div>
          {/*中间横向滚动文字*/}
          <div className={styles['middle-road']} style={{width: deltaYDistance}}>
            <div className={styles['middle-road-text']} style={{
              width: `${middleRoadTextWidth}px`,
              opacity: middleRoadTextWidth > 0 ? 1 : 0,
              left: `${leftWidth}px`,
            }}>Hello, GAOCC. You can do this.</div>
          </div>
          {/*滚动的方块*/}
          <div className={styles['notion-obj']} ref={characterRef}/>
          <div className={styles['black-area']} style={{top: '60vh', borderRadius: `0 0 ${(1-screenSize)*1000}px ${(1-screenSize)*1000}px`}}>
          </div>
          {/*滚动后展示的方块和内容*/}
          <div className={styles['introduce-area']} style={{left: `${areaLeftWidth}px`}}>
            <div className={styles['introduce-block1']} style={{opacity: cardOpacity}}>
              <div>JS</div>
              <div style={{fontSize: '20px',color:'#636363',marginLeft: '4px'}}>
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
        {/*第二屏图文*/}
        <div className={styles['second-screen']} style={{zIndex: 10,backgroundColor: '#eaeaea'}}>
          <div className={styles['big-title']}>My Temperament</div>
          <div className={styles['img-row']}>
            <div className={`${styles['img-base']} ${styles['img-url1']}`}/>
            <div className={`${styles['img-base']} ${styles['img-url2']}`}/>
            <div className={`${styles['img-base']} ${styles['img-url3']}`}/>
          </div>
        </div>
        {/* 第三屏图片 */}
        <div className={styles['third-screen']} style={{zIndex: 10}}>
          <div className={styles['img-text-block']}>
            <div className={styles['game-img']} onClick={() => setPreImgVisible(true)}/>
            <div style={{padding: '0 10px'}}>Hi,我是一个来自杭州的coder，工作上擅长前端，当然也能全栈。想看具体技能，点击上方游戏机来打开吧</div>
            <Image
              width={400}
              style={{ display: 'none' }}
              preview={{
                visible: preImgVisible,
                src: '/public/home/tech.png',
                onVisibleChange: value => {
                  setPreImgVisible(value);
                },
              }}
            />
          </div>
        </div>
        {/* 第四屏视频 */}
        {/*muted：静音播放，允许视频在某些浏览器中自动播放。playsinline：在移动设备上防止视频全屏播放。preload="auto"：提前加载视频数据，减少播放延迟。pointer-events: none;：防止用户与视频交互，隐藏右键菜单等。*/}
        <div style={{height: '100vh', zIndex: 10}}>
          <video
            id="fourthVideo"
            src="/public/home/iLoveTheWorld.mp4"
            muted
            playsInline
            preload="auto"
            style={{width: '100%', height: '100vh', display: 'block',position: 'relative', zIndex: 10, pointerEvents: 'none', objectPosition: 'center top', objectFit: 'cover'}}
          />
        </div>
        {/* 第五屏视频 */}
        <div style={{height: '100vh', zIndex: 10}}>
          <video
            id="fiveVideo"
            src="/public/home/bye.mp4"
            muted
            loop
            playsInline
            preload="auto"
            style={{width: '100%', height: '100vh', display: 'block',position: 'relative', zIndex: 10, pointerEvents: 'none', objectPosition: 'center top', objectFit: 'cover'}}
          />
        </div>
        <div style={{height: '100vh', backgroundColor: "transparent", zIndex: 10}}/>
        {/* 第六屏视频 */}
        <div style={{height: '100vh', position: "fixed", bottom: '0', zIndex: 0}}>
          <video
            id="sixVideo"
            src="/public/home/contact.mp4"
            muted
            loop
            playsInline
            preload="auto"
            className={styles['video-loop']}
            style={windowScrollY > 2000 ? {width: '100%', height: '100vh', display: 'block', pointerEvents: 'none', objectPosition: 'center top', objectFit: 'cover'} : {display: "none"}}
          />
        </div>
        {/*todo 第二到第三屏开始，每次滑动都用整屏显示，不好实现1、2屏之间的切换*/}
        {/*<div className={styles['full-screen']}>*/}
        {/*</div>*/}
      </div>
    </>
  )

}

export default index;
