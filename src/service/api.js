// 全局拦截器，全局方法等逻辑
import axios from 'axios';
import { message } from 'antd';
// 修改全局状态-loading
import store from '../store/store';
// 通过loading防止重复点击
import { openLoading, closeLoading } from '../store/loadingSlice'

// 查询类接口不加载loading框
let ignoreUrl = [
  '/otaku-web/link/getPublic',
  '/otaku-web/link/getByUserId',
];

// request请求拦截处理
axios.interceptors.request.use(
  config => {
    if (!ignoreUrl.includes(config.url)) {
      store.dispatch(openLoading());
    }
    if (config.method === 'get') {
      config.params = Object.assign({ t: Date.now() }, config.params);
    }
    let state = store.getState();
    let token = '';
    let BearerToken = localStorage.getItem('BearerToken');
    if (state?.user?.data?.token || BearerToken) {
      config.headers = {
        'authorization': `Bearer ${token || BearerToken}`,
        'X-Requested-With': 'XMLHttpRequest',
      };
    } else {
      config.headers = {
        'X-Requested-With': 'XMLHttpRequest',
      };
    }
    return config;
  },
  error => {
    store.dispatch(closeLoading());
    return Promise.reject(error)
  }
);

// response响应拦截处理
axios.interceptors.response.use(
  res => {
    store.dispatch(closeLoading());
    // 文件下载统一处理
    if (res.config.method == 'get' && res.config.params.isBlobRequest) {
      if (res.data.type === 'application/json') {
        // 如果返回的是json格式，说明导出接口报错，将blob数据转为json数据，读取并提示报错信息
        let reader = new FileReader()
        reader.readAsText(res.data, 'utf-8')
        reader.onload = (e) => {
          res.data = JSON.parse(reader.result)
          message.error(res.data.message || '文件下载出错', 5);
        }
        return Promise.reject()
      }
      const fileName = decodeURIComponent(res.headers['content-disposition'].split(';')[1].split('=')[1].split('"').join(''))
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      return res.data
    }
    // 请求成功，但是操作不成功时显示后端返回的错误信息
    if (res.data.status !== 1) {
      let errorMessage = res.data.data;
      if (errorMessage?.length > 60) { // 限制报错提示长度
        errorMessage = res.data.message.slice(0,58) + '...'
        console.log('ERROR：', res.data.message)
      }
      if (res.data.status == 1004) {
        message.warning(errorMessage || '网络拥堵，稍后再试', 3);
      } else {
        message.error(errorMessage || '网络拥堵，稍后再试', 5);
      }
      return Promise.reject(res.data);
    }
    return res.data;
  },
  err => {
    if (err?.response?.data?.data?.message === "Unauthorized") {
      // message.warning('请先登录', 3);
    } else {
      console.log('err', err);
      let offlineDataUrl = [
        '/otaku-web/auth/userInfo',
        '/otaku-web/link/getPublic',
      ];
      if (offlineDataUrl.includes(err.config.url)) {
        message.warning('当前为离线状态', 3);
      } else {
        message.error('网络拥堵，稍后再试', 5);
      }
    }
    store.dispatch(closeLoading());
    return Promise.reject(err);
  }
);

export default axios;
