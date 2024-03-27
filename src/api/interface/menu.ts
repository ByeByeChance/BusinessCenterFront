import { ReqPage } from "./index";
// 菜单管理模块
export namespace Menu {
  export interface ReqMenuForm {
    id?: number;
    parentId?: number;
    name: string;
    path: string;
    component: string;
    redirect: string;
    icon: string;
    title: string;
    isLink: string;
    isHide: boolean;
    isFull: boolean;
    isAffix: boolean;
    isKeepAlive: boolean;
  }
  export interface ReqMenuParams extends ReqPage {
    path?: string;
    title?: string;
    isHide?: boolean;
    createTime?: string[];
  }
  export interface MenuItem {
    id: number;
    parentId?: number;
    name: string;
    path: string;
    component: string;
    redirect: string;
    icon: string;
    title: string;
    isLink: string;
    isHide: boolean;
    isFull: boolean;
    isAffix: boolean;
    isKeepAlive: boolean;
    sort: number;
  }
}
