// animateJS, 网站首页
import React, {useState, useEffect, useRef} from "react";
import styles from './index.module.css';
import {createDraggable, createScope, utils} from 'animejs';

let index = () => {
  const containerRef = useRef(null);
  const animateRef = useRef(null);
  let draggableFirstScreen = useRef(() => {});

  useEffect(() => {
    // 创建可以x轴横移的物体
    initDraggableFirstScreen();
    let totalDeltaY = 0;
    const handleWheel = e => {
      e.preventDefault();
      console.log('wheel', e.deltaY); // 滚轮动作希望滚动的“距离”。正值时向下，负值时向上
      totalDeltaY = totalDeltaY + e.deltaY;
      console.log('totalDeltaY', totalDeltaY);
      draggableFirstScreen.current.setX(totalDeltaY);
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

  return (
    <>
      <div  ref={animateRef} className={styles['top-layout']}>
        <div ref={containerRef} className={styles['first-screen']}>
          <div className={styles['road']}/>
          <div className={styles['notion-obj']}/>
          <div className={styles['road']} style={{top: '60vh'}}/>
        </div>
      </div>
    </>
  )

}

export default index;
