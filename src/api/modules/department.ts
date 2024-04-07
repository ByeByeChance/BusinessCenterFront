import { Department } from '@/api/interface/department';
import { ResPage } from '@/api/interface/index';
import http from '@/api';

/**
 * @name 部门管理模块
 */
// 获取部门列表
export const getDepartmentList = (params: Partial<Department.ReqDepartmentParams>) => {
  return http.get<ResPage<Department.DepartmentItem>>(`/api/department/getDepartmentList`, params, { loading: false });
};

// 新增部门
export const addDepartment = (params: { id: string }) => {
  return http.post(`/api/department/addDepartment`, params);
};

// 编辑部门
export const updateDepartment = (params: { id: string }) => {
  return http.post(`/api/department/updateDepartment`, params);
};

// 删除部门
export const deleteDepartment = (params: { id: string[] }) => {
  return http.delete(`/api/department/deleteDepartment`, params);
};

// 切换部门状态
export const updateDepartmentStatus = (params: { id: string; status: number }) => {
  return http.post(`/api/department/updateDepartmentStatus`, params);
};
