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
