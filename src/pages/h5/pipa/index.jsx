// 枇杷宣传h5
import React, {useState, useEffect, useRef} from "react";
import styles from './index.module.css';
import {Icon} from "@iconify/react";
import {message} from "antd";
import {CopyToClipboard} from "react-copy-to-clipboard";

let map = null;
let marker = null;
let index = () => {
  let [messageApi, contextHolder] = message.useMessage();
  const [copied, setCopied] = useState(false);

  // 初始化地图配置，定位在塘栖镇-邵家坝村委
  useEffect(() => {
    initGDmap();
  }, []);

  // 打开高德地图导航
  const openAmap = (lat, lng, name) => {
    const scheme = /iPhone|iPad/.test(navigator.userAgent)
      ? `iosamap://viewGeo?sourceApplication=MyApp&poiname=${encodeURIComponent(name)}&lat=${lat}&lon=${lng}&dev=0`  // iOS
      : `androidamap://viewGeo?sourceApplication=MyApp&poiname=${encodeURIComponent(name)}&lat=${lat}&lon=${lng}&dev=0`; // Android
    window.location.href = scheme;
    setTimeout(() => {
      window.location.href = `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(name)}`;
    }, 2000);
  };

  let initGDmap = () => {
    map = new AMap.Map("container", {
      center: [120.184263,30.491405],
      zoom: 13
    });
    //异步加载控件
    AMap.plugin('AMap.ToolBar', () => {
      let toolbar = new AMap.ToolBar(); //缩放工具条实例化
      map.addControl(toolbar);
    });
    AMap.plugin('AMap.Scale', () => {
      let scale = new AMap.Scale(); //比例尺工具条实例化
      map.addControl(scale);
    });
    const icon = new AMap.Icon({
      image: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
      imageSize: new AMap.Size(26, 35), // 按图标实际大小缩放比例
    });
    marker = new AMap.Marker({
      map: map,
      position: [120.184263,30.491405],
      icon: icon,
      label: {
        offset: new AMap.Pixel(10, 10),//修改label相对于maker的位置
        content: "点击红点打开高德地图"
      }
      // offset: new AMap.Pixel(-13, -26),
    });
    marker.on('click', () => {
      openAmap(120.184263,30.491405,'塘栖镇-邵家坝村委');
    });
    map.setFitView();
  };

  let handleCopy = () => {
    debugger
    navigator.clipboard.writeText('g844972580');
    messageApi.success({
      content: '复制成功',
      icon: <Icon icon="clarity:success-standard-solid" color="#333" style={{marginRight: '4px'}}/>,
    });
  };

  return (
    <>
      {contextHolder}
      <div className={styles['top-layout']}>
        <div className={styles['top-img']}/>
        <div className={`${styles['display-area']} ${styles['display-area-back']}`}>
          <div className={styles['title']}>近期价格(5月10日-5月16日 )</div>
          <div className={styles['text']} style={{fontSize:'4vw'}}>品种：白沙枇杷</div>
          <div className={styles['text']}>杭州的超市价格比较贵，我们自家有70+棵树，给老爹带个货</div>
          <div className={styles['text']}>10元/斤（现场直接购买）</div>
          <div className={styles['text']}>20元/斤（邮寄顺丰购买）</div>
          <div className={styles['text']}>12元/斤（上地采摘）</div>
          <CopyToClipboard text={'g844972580'} onCopy={() => setCopied(true)}>
            <div className={styles['text']} style={{display: 'flex', alignItems: 'center'}} onClick={handleCopy}>联系方式：微信号g844972580
              <div className={styles['btn']}>{copied ? '已复制' : '复制微信'}</div>
            </div>
          </CopyToClipboard>
          <div className={styles['text']} style={{paddingBottom: '4vw'}}>现场地址：塘栖镇邵家坝村委，或点底部高德导航</div>
          {/*<div className={styles['overlay']}/>*/}
        </div>
        <div className={styles['top-img2']}/>
        <div className={styles['top-img3']}/>
        <div className={`${styles['display-area']} ${styles['display-area-back']}`} style={{backgroundColor: 'rgba(255,255,255,0.9)'}}>
          <div className={styles['title']}>其它介绍</div>
          <div className={styles['text']}>上图是新鲜现摘模样，特点带酸，冰箱放置2-3天可甜，现场可吃，也适合邮寄</div>
          <div className={styles['text']}>其它熟透带斑的，熟过头的，剥皮去核，加冰糖和江小白40度白酒，泡三个月，制枇杷酒，加冰夏天很好喝～</div>
          <div className={styles['text']} style={{paddingBottom: '4vw'}}>熟过的6元/斤（只支持现场购买，买10斤正常的可以赠送1斤）</div>
        </div>
        <div className={styles['display-area']}>
          <div className={styles['title']}>高德定位</div>
          <div id="container" style={{ height: "30vh", width: "100%"}}/>
        </div>
        {/*<div className={styles['middle-img']}/>*/}
        <div className={styles['qr-img']}/>
      </div>
    </>
  )

}

export default index;
