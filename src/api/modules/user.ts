import { ResPage, User } from '@/api/interface/index';
import { PORT1 } from '@/api/config/servicePort';
import http from '@/api';

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: Partial<User.ReqUserParams>) => {
  return http.get<ResPage<User.ResUserList>>(`/api/user/getUserList`, params, { loading: false });
};

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(`/api/user/addUser`, params);
};

// 编辑用户
export const updateUser = (params: { id: string }) => {
  return http.post(`/api/user/updateUser`, params);
};

// 删除用户
export const deleteUser = (params: { id: string[] }) => {
  return http.delete(`/api/user/deleteUser`, params);
};

// 切换用户状态
export const updateUserStatus = (params: { id: string; status: number }) => {
  return http.post(`/api/user/updateUserStatus`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(`/api/user/resetPassword`, params);
};

// 导出用户数据
export const exportUserList = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/api/user/exportUserList`, params);
};

// 获取用户状态字典
export const getUserStatus = () => {
  return http.get<User.ResStatus[]>(PORT1 + `/user/status`);
};

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<User.ResGender[]>(PORT1 + `/user/gender`);
};

// 获取用户部门列表
export const getUserDepartment = () => {
  return http.get<User.ResDepartment[]>(PORT1 + `/user/department`);
};

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<User.ResRole[]>(PORT1 + `/user/role`);
};
