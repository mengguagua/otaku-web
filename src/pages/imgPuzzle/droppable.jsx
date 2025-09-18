import {useDroppable} from '@dnd-kit/react';

export default function Droppable({id, children, itemHeight, itemWidth}) {
  const {ref} = useDroppable({
    id,
  });

  return (
    <div ref={ref} style={{width: `${itemWidth}rem`, height: `${itemHeight}rem`, border: '1px solid #e5e5e5', boxSizing: 'border-box'}}>
      {children}
    </div>
  );
}