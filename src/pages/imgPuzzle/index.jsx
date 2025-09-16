import React, {useState, useEffect} from 'react';
import {DragDropProvider} from '@dnd-kit/react';
import Draggable from './draggable';
import Droppable from './droppable';
import styles from './index.module.css';
import {splitImage} from '../../tool';
import {useShuffle} from '../../hook/useShuffle';

let imgPuzzle = () => {
  const [isDroppedItems, setIsDroppedItems] = useState([]);

  const [dragItems, setDragItems] = useState([]);
  // 单位用rem，可以通过媒体查询 or 根字体 vw 方案。实现响应式
  const [itemHeight, setItemHeight] = useState(10);
  const [itemWidth, setItemWidth] = useState(10);
  let rows = 4; // 分块数（rows * cols）
  let cols = 4;

  const imgUrl = "/home/dendy.png"; // 图片
  useEffect(() => {
    // 图片url，分块数（rows * cols）
    splitImage(imgUrl, rows, cols).then(({urls, height, width}) => {
      setItemHeight(height);
      setItemWidth(width);
      console.log('urls', urls);
      let temp = urls.map((item) => {
        return {
          index: Object.keys(item)[0],
          url: Object.values(item)[0],
        }
      });
      // console.log('temp', temp, height, width);
      setDragItems(temp);
    });
  }, []);
  const shuffled = useShuffle(dragItems); // 打乱数组（setDragItems会重新渲染，useShuffle是个hook，所以会执行，这时dragItems已经更新了，所以能拿大打乱后的数组）
  console.log('shuffled--', shuffled);

  // 打乱数组后，再渲染Draggable
  let draggables = shuffled.map((item) => {
    if ( isDroppedItems.includes(item.index) ) {
      // 空标签也要给key，不然会有警告
      return (<React.Fragment key={`empty-${item.index}`} />)
    }
    return (
      <Draggable key={`drag-${item.index}`} dragItem={item} itemHeight={itemHeight} itemWidth={itemWidth} />
    );
  });
  
  let droppables = dragItems.map((item) => (
    <Droppable key={`drop-${item.index}`} id={item.index} itemHeight={itemHeight} itemWidth={itemWidth} >
      {isDroppedItems.includes(item.index) && <Draggable dragItem={item} itemHeight={itemHeight} itemWidth={itemWidth} />}
    </Droppable>
  ));

  return (
    <>
      <div className={styles['img-puzzle-container']}>
        <DragDropProvider
          onDragEnd={(event) => {
            if (event.canceled) return;
            // console.log('onDragEnd->event.operation', event.operation);
            // target是Droppable的id，source是Draggable的id
            const { target, source } = event.operation;
            target?.id === source?.id && setIsDroppedItems((prev) => [...prev, target?.id]);
          }}
        >
          <div className={styles['row-disorder-item']}>
            {draggables}
          </div>

          <div className={styles['row-drop-item']} style={{ width: `${itemWidth * cols + 1}rem` }}>
            {droppables}
          </div>
        </DragDropProvider>  
        <div className={styles['row-drop-item']} style={{ backgroundColor: '#f5f5f5', padding: '0.1rem',  width: `${itemWidth * cols}rem`, marginTop: '10rem'}}>
          <img src={imgUrl} alt={`imgUrl`} style={{ margin: "0.2rem", width: `100%`}} />
        </div>
      </div>
    </>
  );
}

export default imgPuzzle;