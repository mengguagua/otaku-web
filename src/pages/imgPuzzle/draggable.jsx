import {useDraggable} from '@dnd-kit/react';

export default function Draggable({dragItem, itemHeight, itemWidth}) {
  // console.log('useDraggable->dragItem.index', dragItem.index);
  const {ref} = useDraggable({
    id: dragItem.index,
  });

  return (
    <div ref={ref} style={{ backgroundColor: '#f5f5f5' }}>
      <img src={dragItem.url} alt={`dragItem-${dragItem.index}`} style={{ width: `${itemWidth}rem`, margin: "0.1rem" }} />
    </div>
  );
}