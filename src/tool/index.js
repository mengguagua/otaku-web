// 获取url上变量
export let getQueryStringArgs = () => {
  let queryData = '';
  if (location.search) {
    queryData = location.search;
  } else if (location.hash) {
    queryData = '?' + location.hash.split('?')[1];
  }
  let qs = (queryData.length > 0 ? queryData.substring(1) : '');
  let args = [];
  for (let item of qs.split('&').map( kv => kv.split('=') )) {
    let name = decodeURIComponent(item[0]);
    let value = decodeURIComponent(item[1]);
    if (name) {
      args[name] = value;
    }
  }
  return args;
};

// 下载流通用处理方式，如果是word则设置为msword，excel为excel
export let downloadFile = (res, type = 'application/pdf;chartset=UTF-8', filename) =>{
  // 创建blob对象，解析流数据
  const blob = new Blob([res], {
    // 如何后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
    type: type
  })
  const a = document.createElement('a')
  // 兼容webkix浏览器，处理webkit浏览器中href自动添加blob前缀，默认在浏览器打开而不是下载
  const URL = window.URL || window.webkitURL
  // 根据解析后的blob对象创建URL 对象
  const herf = URL.createObjectURL(blob)
  // 下载链接
  a.href = herf
  // 下载文件名
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // 在内存中移除URL 对象
  window.URL.revokeObjectURL(herf)
};

export let checkEmail = (email) => {
  // 定义邮箱正则表达式
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  // 使用正则表达式进行匹配
  return emailRegex.test(email);
}

// 将数组随机化，返回指定数量的前count个的数组和剩下的数组
export let getRandomElementsFromArray = (array, count) => {
  // 随机排序数组
  const shuffledArray = array.sort(() => Math.random() - 0.5);
  // 从随机排序的数组中截取前count个元素
  const selectedElements = shuffledArray.slice(0, count);
  const otherElements = shuffledArray.slice(count, shuffledArray.length);

  return [selectedElements, otherElements];
}

export function isEmptyFunction(func) {
  if (typeof func !== 'function') return false;
  const body = func.toString()
    .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '') // 去注释:ml-citation{ref="7" data="citationList"}
    .replace(/\s+/g, '') // 去空格:ml-citation{ref="6" data="citationList"}
    .split(/{|}/)[1]; // 提取函数体内容:ml-citation{ref="5" data="citationList"}
  return body.trim() === '';
}

// 图片分块，然后返回每一块图的url和下标
export function splitImage(imgUrl, rows = 4, cols = 4) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // 解决跨域问题（如果是同源图片可以去掉）
    img.src = imgUrl;

    img.onload = () => {
      // body 默认16px == 1rem, 图片长/宽 太大要按窗口比例折算成rem
      const pieceWidth = img.width / cols;
      const pieceHeight = img.height / rows;
      let {shwoWidht, showHeight} = dealRem(pieceWidth, pieceHeight, cols);
      let result = {
        urls: [], // key:url的映射，key为`row,col`
        width: shwoWidht,
        height: showHeight,
      };
      console.log('width', shwoWidht, 'height', showHeight, 'rows', rows, 'cols', cols);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const canvas = document.createElement("canvas");
          canvas.width = pieceWidth;
          canvas.height = pieceHeight;
          const ctx = canvas.getContext("2d");

          ctx.drawImage(
            img,
            col * pieceWidth, // 裁剪区域的起点x（根据列数计算）
            row * pieceHeight, // 裁剪区域的起点y（根据行数计算）
            pieceWidth, // 裁剪区域宽度
            pieceHeight, // 裁剪区域高度
            0, // 绘制到canvas的x坐标（放在左上角）
            0, // 绘制到canvas的y坐标
            pieceWidth, // 绘制宽度（缩放到这个大小）
            pieceHeight  // 绘制高度（缩放到这个大小）
          );

          let key = `${row},${col}`;
          result.urls.push({
            [key]: canvas.toDataURL("image/png")
          });
        }
      }

      resolve(result);
    };

    img.onerror = (err) => reject(err);
  });
}
let dealRem = (width, height, cols) => {
  // innerWidth小于768 认为是移动端（12px），否则是pc(16px)
  // pc的话，总显示宽度最大为，内容宽度的1/3; 移动端暂不考虑
  let maxWidth =  window.innerWidth / 3;
  let shwoWidht = maxWidth / cols;
  let showHeight = (height * shwoWidht) / width;
  console.log('maxWidth', maxWidth, 'shwoWidht', shwoWidht, 'showHeight', showHeight);
  if (window.innerWidth < 768) {
    return {
      shwoWidht: shwoWidht / 12,
      showHeight: showHeight / 12,
    }
  } else {
    return {
      shwoWidht: shwoWidht / 16,
      showHeight: showHeight / 16,
    }
  }
  
}