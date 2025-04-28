// animateJS练习页面
import React, {useState, useEffect, useRef} from "react";
import styles from './index.module.css';
import {createScope, createTimer, utils, animate, createTimeline, createDraggable} from 'animejs';
import { isEmptyFunction } from '../../../tool/index'

let timeLoopCount = 0;
let reversedTimeStr = '0';

let index = () => {
  const [timeStr, setTimeStr] = useState('0');
  const [timeLoopStr, setTimeLoopStr] = useState('0');
  const [timeLine1, setTimeLine1] = useState('0');
  const [timeLine2, setTimeLine2] = useState('0');
  const [timeLine3, setTimeLine3] = useState('0');
  const [playbackRate, setPlaybackRate] = useState('1.0');
  let timeRef = useRef(null);
  let timer = useRef(() => {});
  let timerLoop = useRef(() => {});

  // 确保 DOM 已渲染完成
  useEffect(() => {
    // 1）创建一个 scope，指定 root 为真实的 DOM 容器
    const scope = createScope({ root: timeRef.current });
    // 2）在 scope 中添加我们的动画逻辑。即告诉 Anime.js “只在这个容器里找”
    scope.add(() => {
      // createTimerDelay();
      initCreateDraggable();
    });
    // 组件卸载时清理 scope，移除所有动画
    return () => scope.revert();
  }, []);

  // 示例1----------
  let createTimerDelay = () => {
    if (!isEmptyFunction(timer.current)) {
      return false;
    }
    // console.log('createTimerDelay-click');
    timer.current = createTimer({
      // delay: 2000, // 延迟2s执行。默认值0
      duration: 10000, // 执行10s后停止。默认值：Infinity--无限
      // reversed: true, // 如果duration有值，iterationCurrentTime将反转，就是倒计时到0停止。默认是false
      playbackRate: playbackRate, // 播放速率。默认值1
      // 按照指定的 frameRate(fps)对正在运行的计时器的每一帧执行一个函数。默认是120，即1s执行120次。当然fps受限显示器硬件是否支持高刷
      onUpdate: self => {
        reversedTimeStr = `${utils.round(self.iterationCurrentTime, 0)}`;
        setTimeStr(`${utils.round(self.currentTime, 0)}`); // round四舍五入小数位数，保留0位小数。
      },
      // 当createTimer的所有迭代（loop）都完成后，执行。回调返回createTimer本身对象
      onComplete: self => {
        console.log('createTimerDelay-onComplete-self', self);
      },
    });
  };
  let reloadTimerDelay = () => {
    timer.current.revert();
    reversedTimeStr = '0';
    setTimeStr('0');
  };
  let changeSpeed = (e) => {
    // console.log('changeSpeed', e.target.value);
    const speed = utils.roundPad(e.target.value, 1); // roundPad四舍五入，保留1位小数，没有小数则补0
    setPlaybackRate(speed);
    // console.log('changeSpeed--speed', speed);
    if (speed) {
      utils.sync(() => timer.current.speed = speed); // 同步切换速率
    }
  }

  // 示例2----------
  let createTimerLoop = () => {
    timerLoop.current = createTimer({
      loop: true, // 循环执行。默认值0
      loopDelay: 750, // 停止750ms后再循环。默认值0
      duration: 250, // 执行250ms后停止
      // 每次计时器迭代完成，执行一次。
      onLoop: () => ++timeLoopCount,
      // onUpdate: self => setTimeLoopStr(`${self.iterationCurrentTime}`)
      // clamp参数：初始化值，可返回的最小值，可以返回的最大值
      onUpdate: self => setTimeLoopStr(`${utils.clamp(self.iterationCurrentTime, 0, 250)}`)
    });
  }
  let reloadTimerLoop = () => {
    timerLoop.current.cancel(); // 暂停计时器，将其从引擎的主循环中移除，并释放内存。
    timeLoopCount = 0;
    setTimeLoopStr('0');
  };

  // 示例3----------
  let reloadAnimate = () => {
    // CSS Modules会编译class为哈希，所以需要这样取值
    // 参数：第一个是选择器，值规范和document.querySelectorAll()一致。第二个参数是对象，需要变化的属性
    animate(`.${styles['motion-block']}`, {
      // 值可以是个function，如class选择多个元素，可以根据index等进行不同处理。参数：target当前element、下标、选中元素的数组长度
      'border-radius': (target, index, length) => { return `${(index+1) * 15}px` },
      // []就是keyframes，可以给一个属性设置多个关键帧
      // right: [
      //   // {to: 'calc(80vw - 20px)'},
      //   {to: '260px'},
      //   {to: '40vw'},
      // ],
      translateX: ['0vw', 0, 50, 50, 0, 0], // 定义第一个值后，后面单位可省略，会默认取第一个值的单位
      translateY: ['0rem', -1.5, -1.5, 1.5, 1.5, 0],
      // 可以直接设置keyframes，1基于百分比
      // keyframes: {
      //   '0%': {scale: 1,},
      //   '50%': {scale: 1.3,},
      //   '70%': {scale: .6,},
      //   '100%': {scale: 1.5,},
      // },
      // 可以直接设置keyframes，2基于持续时间(根据最外层的duration来计算总时间)
      keyframes: [
        { scale: 1,duration: 400 },
        { scale: 1.3,duration: 400 },
        { scale: .6, },
        { scale: 1.5,duration: 400 },
      ],
      'background-color': 'rgba(255,131,51,.8)',
      // 动画轨迹，参考https://codepen.io/juliangarnier/pen/gbOqbVR
      // ease: 'outElastic(1, .5)',
      // ease: 'step(10)',
      ease: 'cubicBezier(0.570, -0.600, 0.215, 1.650)', // 可视化定义贝塞尔曲线参考：https://www.bejson.com/ui/css3beziertool/
      duration: 6000, // 动画持续时间
    });
  };

  // 示例4----------
  let cTimerLine = async () => {
    // 创建定时器，显示进度
    const timer1 = createTimer({
      duration: 1250, // 执行1250ms后停止
      onUpdate: self => setTimeLine1(`${utils.roundPad(self.progress * 100, 1)}%`)
    });
    // 给指定元素创建动画
    let animate1 = animate(`.${styles['three-part']}>div:nth-child(2)`, {
      width: ['15%', '25%'],
      // rotateY: [0, 360],
      duration: 1500,
      opacity: [0,0.8,1,1,1],
      translateX: ['-450px', '-300px', '-150px','0', 0, 0, 0, 0, 0],
      translateY:[0, '-75px', -100, -18.75, 0, '-8px', 0, '-3px', 0],
      ease: 'ease-in-out',
    })
    let animate2 = animate(`.${styles['three-part']}>div:nth-child(3)`, {
      duration: 500,
      translateX: [0, '50px']
    })
    // 创建时间轴，先同步执行定时器1，再同步执行动画，再添加2个定时器
    // sync(),add(),都可以给第二个参数，设置开始的时间，不设置则默认定位在时间线的末尾。写法1 '+=100'最后一个元素之后 100ms。写法2 '-=100'最后一个元素结束前 100ms。其它参考：https://animejs.com/documentation/timeline/time-position
    createTimeline({
      // 时间线本身支持很多设置
      loop: 1,
      alternate: true, // 循环反方是不是相反，默认值 false
      playbackRate: 1, // 播放速率，默认值1。越大越快，0则停止
      // playbackEase: 'cubicBezier(0.570, -0.600, 0.215, 1.650)', // 设置时间线的整体速率，默认是 null
    }).sync(timer1).sync(animate1).sync(animate2, ).add({
      duration: 500,
      onUpdate: self => setTimeLine2(`${self.iterationCurrentTime}`),
    }, '-=1500').add({
      duration: 777,
      onUpdate: self => setTimeLine3(`${utils.roundPad(self.iterationCurrentTime, 1)}`),
    })
  };
  let reloadTimerLine = () => {
    setTimeLine1('0');
    setTimeLine2('0');
    setTimeLine3('0');
  };

  // 示例5----------
  let initCreateDraggable = () => {
    // x、y可拖动的方向，默认值都是 true
    createDraggable(`.${styles['four-part']}>div:nth-child(1)`, {
      x: false,
      y: true,
    });
    createDraggable(`.${styles['four-part']}>div:nth-child(2)`, {
      x: true,
      y: false,
    });
    createDraggable(`.${styles['four-part']}>div:nth-child(3)`, {
      container: `.${styles['time-block-drag']}`, // 设置可拖动的范围
      // snap: [100], // 可以一次性设置，也能分别设置
      x: { snap: [-100, 0, 100, 200, 300, 400, 500, 600, 700] }, // 每次移动的增量
      y: { snap: [-100, 0, 100, 200] }, // 每次移动的增量
      releaseEase: 'outElastic', // 指定在释放、捕捉事件或拖出边界时重新定位后应用于拖动元素的自定义缓动。
    });
  };


  let numberArea = (numberStr, width = '40%') => {
    return (
      <div className={styles['time-back']} style={{width: width}}>
        {/* 数字不等宽，为了数字不抖动，分割然后设置等宽。1ch意思是：元素的宽度等于当前字体里字符 0 的宽度 ×1。 */}
        {
          numberStr.split('').map((ch,i)=>
            <span key={i} style={{display:'inline-block', width:'1ch'}}>
              {ch}
            </span>
          )
        }
      </div>
    );
  };


  return (
    <>
      <div className={styles['top-layer']}>
        <div ref={timeRef}>
          {/*示例1-------------*/}
          <div className={styles['time-block']}>
            <div>delay、duration、playbackRate：</div>
            <div>延时0s触发、运行10s停止、速率(默认1):运行速度*比例</div>
            <div className={styles['normal-row']}>
              <div className={`${styles['time-back']} ${styles['time-back-short']}`}>
                {
                  reversedTimeStr.split('').map(
                    (ch,i) => <span key={i} style={{display:'inline-block', width:'1ch'}}>{ch}</span>
                  )
                }
              </div>
              {numberArea(timeStr)}
            </div>
            <div className={styles['rang-block']}>
              <div className={styles['rang-speed']}>{playbackRate}</div>
              <input onChange={(e) => {changeSpeed(e)}} type="range" min="0" max="10" value={playbackRate} step="0.1" />
            </div>
            <div className={styles['btn-reload']} onClick={reloadTimerDelay}/>
            <div className={styles['btn-handle']} style={{right: '140px'}} onClick={createTimerDelay}>createTimer</div>
            <div className={styles['btn-handle']} onClick={() => {timer.current.play()}}>play</div>
            <div className={styles['btn-handle']} style={{top: '72px'}} onClick={() => {timer.current.pause()}}>pause</div>
            <div className={styles['btn-handle']} style={{top: '104px'}} onClick={() => {timer.current.resume()}}>resume</div>
            {/*可以反转 iterationCurrentTime 这个值*/}
            <div className={styles['btn-handle']} style={{top: '136px'}} onClick={() => timer.current.reverse()}>reverse</div>
          </div>
          {/*示例2-------------*/}
          <div className={styles['time-block']}>
            <div>loop、loopDelay：执行250ms，暂停750ms，计算循环次数：</div>
            <div className={styles['normal-row']}>
              <div className={`${styles['time-back']} ${styles['time-back-short']}`}>{timeLoopCount}</div>
              {numberArea(timeLoopStr)}
            </div>
            <div className={styles['btn-reload']} onClick={reloadTimerLoop}/>
            <div className={styles['btn-handle']} onClick={createTimerLoop}>createTimer</div>
          </div>
          {/*示例3-------------*/}
          <div className={styles['time-block']} style={{height: '200px'}}>
            <div className={styles['motion-block']}/>
            <div className={styles['motion-block']} style={{top: '120px'}}/>
            <div className={styles['btn-reload']} onClick={reloadAnimate}/>
          </div>
          {/*示例4-------------*/}
          <div className={styles['time-block']}>
            <div>Timeline：设置每个时间段的动画</div>
            <div className={`${styles['normal-row']} ${styles['three-part']}`}>
              {numberArea(timeLine1, '250px')}
              {numberArea(timeLine2, '15%')}
              {numberArea(timeLine3, '25%')}
            </div>
            <div className={styles['btn-handle']} onClick={cTimerLine}>cTimerLine</div>
            <div className={styles['btn-reload']} onClick={reloadTimerLine}/>
          </div>
          {/*示例5-------------*/}
          <div className={`${styles['time-block']} ${styles['time-block-drag']}`} style={{height: '300px'}}>
            <div>createDraggable：可拖拽的设置</div>
            <div className={`${styles['normal-row']} ${styles['four-part']}`}>
              <div className={styles['time-back']} style={{width: '100px', height: '100px'}}>1</div>
              <div className={styles['time-back']} style={{width: '100px', height: '100px'}}>2</div>
              <div className={styles['time-back']} style={{width: '100px', height: '100px'}}>3</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
