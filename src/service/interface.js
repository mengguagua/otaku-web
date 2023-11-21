// 业务接口都写在interface这个文件内
import axios from './api';

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
// 查询某个用户的link列表
export function linkGetByUserId(req) {
  return axios.post(`/otaku-web/link/getByUserId`, req);
}
