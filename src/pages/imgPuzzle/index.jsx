import React, {useState, useEffect} from 'react';
import {DragDropProvider} from '@dnd-kit/react';
import {Select, message, Modal} from 'antd';
import Draggable from './draggable';
import Droppable from './droppable';
import styles from './index.module.css';
import {splitImage} from '../../tool';
import {useShuffle} from '../../hook/useShuffle';
import {useSplitArray} from '../../hook/useSplitArray';


const imgPuzzleLevel = [
  { value: '3', label: '3x3' },
  { value: '4', label: '4x4' },
  { value: '5', label: '5x5' },
  { value: '6', label: '6x6' },
  { value: '7', label: '7x7' },
  { value: '8', label: '8x8' },
  { value: '9', label: '9x9' },
  { value: '10', label: '10x10' },
  { value: '11', label: '11x11' },
  { value: '12', label: '12x12' },
]

const imgUrlObj = {
  1: '/imgPuzzle/001.jpg',
  2: '/imgPuzzle/002.jpg',
  3: '/imgPuzzle/003.png',
  4: '/imgPuzzle/004.png',
  5: '/imgPuzzle/005.png',
  6: '/imgPuzzle/006.png',
  7: '/imgPuzzle/007.png',
}; 

let imgPuzzle = () => {
  let [messageApi, contextHolder] = message.useMessage();
  const [modal, contextHolderModal] = Modal.useModal();
  const [isDroppedItems, setIsDroppedItems] = useState([]);

  const [dragItems, setDragItems] = useState([]);
  // 单位用rem，可以通过媒体查询 or 根字体 vw 方案。实现响应式
  const [itemHeight, setItemHeight] = useState(10);
  const [itemWidth, setItemWidth] = useState(10);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showOrignImg, setShowOrignImg] = useState(false);
  const [rows, setRows] = useState(5); // 拼图分块数（rows * cols）
  const [cols, setCols] = useState(5); 

  // const imgUrl = "/home/dendy.png"; // 图片
  const [imgUrl, setImgUrl] = useState("/home/dendy.png");

  useEffect(() => {
    // 图片url，分块数（rows * cols）
    splitImage(imgUrl, rows, cols).then(({urls, height, width}) => {
      setItemHeight(height);
      setItemWidth(width);
      setContainerWidth(width * cols + 0.2 * cols); // 拼图容器的宽度
      let temp = urls.map((item) => {
        return {
          index: Object.keys(item)[0],
          url: Object.values(item)[0],
        }
      });
      // console.log('temp', temp, height, width);
      setDragItems(temp);
    });
  }, [rows, imgUrl]);
  // 打乱数组（setDragItems会重新渲染，useShuffle是个hook，所以会执行，这时dragItems已经更新了，所以能拿大打乱后的数组）
  const shuffled = useShuffle(dragItems); 
  // console.log('shuffled--', shuffled);

  let changeImgUrl = () => {
    const num = Math.floor(Math.random() * 7) + 1;
    setImgUrl(imgUrlObj[num]);
  }

  let changeRowCol = (e) => {
    // messageApi.warning({
    //     content: '切换难度会失去当前记录，确定切换吗？',
    // });
    
    setRows(e);
    setCols(e);
  };

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

  let draggablesWithFour = useSplitArray(draggables, 4); // 把可拖放的4等分
  // console.log('draggablesWithFour', draggablesWithFour);
  
  let droppables = dragItems.map((item) => (
    <Droppable key={`drop-${item.index}`} id={item.index} itemHeight={itemHeight} itemWidth={itemWidth} >
      {isDroppedItems.includes(item.index) && <Draggable dragItem={item} itemHeight={itemHeight} itemWidth={itemWidth} />}
    </Droppable>
  ));

  return (
    <>
      {contextHolder}
      {contextHolderModal}
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
          {/* 按钮操作 */}
          <div className={styles['btn-container']} style={{ width: `${containerWidth}rem` }}>
            <div className={styles['btn']} onClick={() => setShowOrignImg(!showOrignImg)}>查看原图</div>
            <div className={styles['btn']} style={{marginLeft: '0.5rem'}} onClick={changeImgUrl}>切图</div>
            <Select
              prefix="切换难度"
              defaultValue="5"
              style={{ width: 140, marginLeft: '0.5rem' }}
              onChange={changeRowCol}
              options={imgPuzzleLevel}
            />
          </div>
          {/* 上部：可拖放的拼图 */}
          <div className={styles['row-disorder-item']} style={{ width: `${containerWidth}rem` }}>
            {draggablesWithFour[1]}
          </div>
          {/* flex 设置左右拼图 */}
          <div className={styles['flex-container']}>
            {/* 左部分 */}
            <div className={styles['vertical-disorder-item']} 
              style={{ 
                height: `${itemHeight * rows + 0.2 * rows}rem`,
                width: `${Math.ceil(cols / 4) * itemWidth + 0.2 * cols}rem`,
              }}>
              {draggablesWithFour[0]}
            </div>
            {/* 中间可拖放部分 */}
            <div className={styles['row-drop-item']} style={{ width: `${containerWidth}rem` }}>
              {droppables}
            </div>
            {/* 右部分 */}
            <div className={styles['vertical-disorder-item']} 
              style={{ 
                height: `${itemHeight * rows + 0.2 * rows}rem`,
                width: `${Math.ceil(cols / 4) * itemWidth + 0.2 * cols}rem`,
                flexWrap: 'wrap'
              }}>
              {draggablesWithFour[2]}
            </div>
          </div>
          {/* 下部：可拖放的拼图 */}
          <div className={styles['row-disorder-item']} style={{ width: `${containerWidth}rem`, flexWrap: 'wrap' }}>
            {draggablesWithFour[3]}
          </div>
        </DragDropProvider>  
        { showOrignImg && 
          <div className={styles['orign-img']} style={{width: `${itemWidth * cols}rem`}}>
            <img src={imgUrl} alt={`imgUrl`} style={{width: `100%`}} />
          </div>
        }
      </div>
    </>
  );
}

export default imgPuzzle;