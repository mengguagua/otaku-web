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
// 注册用户
export function userCreate(req) {
  return axios.post(`/otaku-web/user/create`, req);
}
// 修改用户
export function userEdit(req) {
  return axios.post(`/otaku-web/user/edit`, req);
}
// 查询某个用户的link列表
export function linkGetByUserId(req) {
  return axios.post(`/otaku-web/link/getByUserId`, req);
}
// 新增链接
export function linkCreate(req) {
  return axios.post(`/otaku-web/link/create`, req);
}
// 修改链接
export function linkEdit(req) {
  return axios.post(`/otaku-web/link/edit`, req);
}
// 修改链接是否公开
export function linkChangeIsPublic(req) {
  return axios.post(`/otaku-web/link/changeIsPublic`, req);
}
// 修改个人链接排序
export function changeRank(req) {
  return axios.post(`/otaku-web/link/changeRank`, req);
}
// 修改公开链接点赞数
export function changeGoodNumber(req) {
  return axios.post(`/otaku-web/link/changeGoodNumber`, req);
}
