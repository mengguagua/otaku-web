// 业务接口都写在interface这个文件内
import axios from './api';

// 系统公共接口
// 查询菜单
export function menuList(req) {
  return axios.get(`/otaku-web/link/getPublic`, {params: req});
}
// 查询公共link
export function linkGetPublic(req) {
  return axios.post(`/otaku-web/link/getPublic`, req);
}
// 查询用户
export function getUserInfo(req) {
  return axios.post(`/otaku-web/auth/userInfo`, req);
}
// 登录
export function authLogin(req) {
  return axios.post(`/otaku-web/auth/login`, req);
}
// 注册
export function userCreate(req) {
  return axios.post(`/otaku-web/user/create`, req);
}
