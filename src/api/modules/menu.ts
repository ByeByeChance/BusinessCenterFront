import { ResPage } from '@/api/interface';
import { Menu as MenuNew } from '@/api/interface/menu';
import http from '@/api';

/**
 * @name 菜单模块
 */
// 获取菜单列表
export const getMenuList = (params?: MenuNew.ReqMenuParams) => {
  return http.get<ResPage<Menu.MenuOptions>>(`/api/menu/getMenuList`, params);
};

// 新增菜单
export const addMenu = (params: MenuNew.ReqMenuForm) => {
  return http.post(`/api/menu/addMenu`, params);
};

// 更新菜单
export const updateMenu = (params: MenuNew.ReqMenuForm) => {
  return http.post(`/api/menu/updateMenu`, params);
};

// 删除菜单
export const deleteMenuById = (params: { id: string }) => {
  return http.delete(`/api/menu/deleteMenuById`, params);
};
