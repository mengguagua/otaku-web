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
// 判断是否是移动端
const isMobileScreen = window.matchMedia("(max-width: 767px)").matches;

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
    // 加上 { passive: false } 才能阻止默认滚动; 宽度小就是手机，不禁止滚动
    if (winWidth > 700) {
      containerRef.current.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      containerRef.current?.removeEventListener('wheel', handleWheel);  // options 可省略 capture 默认为 false
    };
  }, []);

  // 首屏和第二屏来回切换，圆角效果
  useEffect(() => {
    const onScroll = () => {
      const winHeight =  window.innerHeight;
      const winWidth = window.innerWidth;
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
      if (window.scrollY == 0 && winWidth > 700) {
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
      { threshold: .5 } // threshold: 0.5：当视频有 50% 可见时触发回调。root：指定根元素，默认为浏览器视口。
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
        <div className={styles['top-menu']}  style={{position: "fixed", zIndex: '1000', right: '-20px', top: '-20px', transform: 'scale(.7)'}}>
          <AnimateMenu/>
        </div>
        {/*左上角icon*/}
        <div className={styles['eye-svg']} style={{zIndex: '1000'}}>
          <OwlIcon color={'#459582'}/>
        </div>
        {/*第一屏*/}
        <div ref={containerRef} className={styles['first-screen']} style={isMobileScreen? {display: "none"} : {transform: `scale(${screenSize})`, borderRadius: `0 0 ${(1-screenSize)*1000}px ${(1-screenSize)*1000}px`}}>
          <MouseFollow/>
          <div className={styles['black-area']}>
            {/*文字动画*/}
            {/*<Letters letters={'Gaocc'} marginLeftIndex={5}/>*/}
            {/*文字动画*/}
            {/*<LettersSecond letters={'WebDeveloper'} marginLeftIndex={3}/>*/}
          </div>
          {/*中间横向滚动文字*/}
          <div className={styles['middle-road']} style={{width: deltaYDistance}}>
            <div className={styles['middle-road-text']} style={{
              width: `${middleRoadTextWidth}px`,
              opacity: middleRoadTextWidth > 0 ? 1 : 0,
              left: `${leftWidth}px`,
            }}>
              Technical skillset
              {/*Hello, GAOCC. You can do this.*/}
            </div>
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
          <div className={styles['second-screen-row']}>
            <div className={styles['mine-img']}/>
            <div className={styles['mine-text']}>
              <div style={{fontSize: 'var(--title-01)'}}>Gaocc</div>
              <div style={{fontSize: 'var(--title-02)', color: '#555'}}>Staff Web Developer</div>
              <div className={styles['head-row']}>
                <div className={styles['mine-head']}/>
                <div>
                  <div style={{fontWeight: 700,fontSize: '18px'}}>Gaocc</div>
                  <div style={{color: '#555',fontSize: '14px',marginTop: '4px'}}>
                    <span className={styles['icons--position-marker']}/>
                    HangZhou
                  </div>
                </div>
              </div>
              <div style={{padding: '16px 0', lineHeight: '24px'}}>作为一名经验丰富的web工程师，拥有扎实的web工程背景，我专注于设计和实现各类系统，如政府门户、货车系统、加油系统、券商系统、公示大屏等等。并为 普通开发者 定制专业搭建工具，以革新开发流程，规范系统风格。我常驻杭州，擅长处理产品与后端开发的交界任务，拥有软件全生命周期开发能力和经验。</div>
              <div style={{padding: '0 0 16px 0', lineHeight: '24px'}}>凭借前端、服务端、运维环境的混合专业能力，我善于搭建前端、后端团队和运维团队之间的桥梁，提升三方在系统研发过程中的流畅性。我通过创建将 github和cli 集成的搭建工具，实现一键搭建前端工程的效果，加速开发，尽早交付项目给客户。</div>
              <div style={{padding: '0 0 16px 0', lineHeight: '24px'}}>在我的职业生涯中，我成功领导过前端团队，目前也是公司前端负责人，完成过高技术复杂度和业务复杂度的项目，协同项目经理和服务端开发负责人，将大型项目拆解为可执行的工作任务。通过对资源的合理管理与分配，我确保项目的顺利推进，并交付超出预期的成果。</div>
              <div style={{padding: '0 0 16px 0', lineHeight: '24px'}}>如果你对开发充满热情，愿意探索协作机会，欢迎随时联系我！我期待与志同道合的人士交流，迎接Web+AI时代新篇章。</div>
            </div>
          </div>
        </div>
        {/* 第四屏视频 */}
        {/*muted：静音播放，允许视频在某些浏览器中自动播放。playsinline：在移动设备上防止视频全屏播放。preload="auto"：提前加载视频数据，减少播放延迟。pointer-events: none;：防止用户与视频交互，隐藏右键菜单等。*/}
        <div style={isMobileScreen? {display: "none"} : {height: '100vh', zIndex: 10}}>
          <video
            id="fourthVideo"
            src="/public/home/iLoveTheWorld.mp4"
            muted
            playsInline
            preload="auto"
            style={{width: '100%', height: '100vh', display: 'block',position: 'relative', zIndex: 10, pointerEvents: 'none', objectPosition: 'center top', objectFit: 'cover'}}
          />
        </div>
        {/* 第三屏图片 */}
        <div className={styles['third-screen']} style={{zIndex: 10}}>
          <div className={styles['img-text-block']}>
            <div className={styles['game-img']} onClick={() => setPreImgVisible(true)}/>
            {/*<div style={{padding: '0 10px'}}>Hi,我是一个来自杭州的coder，工作上擅长前端，当然也能全栈。想看具体技能，点击上方游戏机来打开吧</div>*/}
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
        {/* 第五屏视频 */}
        <div className={styles['five-screen']} style={{visibility: "hidden"}}>
          <div style={{position: "absolute", left: '15vw', top: '24vw'}}>
            <video
              id="fiveVideo"
              src="/public/home/baby.mov"
              muted
              loop
              playsInline
              preload="auto"
              style={isMobileScreen? {display: "none"} : {
                height: '40vh', display: 'block',
                zIndex: 10, pointerEvents: 'none',
                objectPosition: 'center top', objectFit: 'cover',
                borderRadius: '10px 0 0 10px',
                opacity: 0.88, maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                maskRepeat: 'no-repeat'
              }}
            />
            <div className={styles['baby-text']}>2025年3月，我的生活中多出了一个小生命.</div>
          </div>
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
            style={isMobileScreen || windowScrollY > 2000 ? {width: '100vw', height: '100vh', display: 'block', pointerEvents: 'none', objectPosition: 'center top', objectFit: 'cover'} : {display: "none"}}
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
