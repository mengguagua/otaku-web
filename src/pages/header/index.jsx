import './index.css';
import {useState} from "react";
import { Icon } from '@iconify/react';


let index =() => {
  let [currentKey, setCurrentKey] = useState('happy');


  return(
    <>
      <div className={'header-container'}>
        <Icon icon="line-md:coffee-half-empty-twotone-loop" color="#333" width={40} />
        <div style={{fontSize: '24px'}}>LINK</div>
      </div>
    </>
  );
};
export default index;
