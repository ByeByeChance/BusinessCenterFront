import { ReqPage } from './index';

// 部门管理模块
export namespace Department {
  export interface ReqDepartmentForm {
    id?: number;
    parentId?: number;
    directorNickname: string;
    status: boolean;
  }
  export interface ReqDepartmentParams extends ReqPage {
    name?: string;
    directorNickname?: string;
    status?: boolean;
    createTime?: string[];
  }
  export interface DepartmentItem {
    id: number; // 部门id
    parentId: number; // 上级id
    name: string; // 部门名称
    status: number; // 部门状态：1是正常,0是禁用
    sort: number; // 排序
    directorUserId: number; // 负责人
    directorNickname: string; // 负责人姓名
    createUserId: number; // 创建人
    createNickname: string; // 创建人姓名
    createTime: string;
    updateTime: string;
    children?: DepartmentItem[];
  }
}
