// 请求响应参数（不包含data）
export interface Result {
  code: number;
  message: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNumber: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNumber: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    access_token: string;
    token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
    roleId: number;
  }
  export interface ResUserList {
    id: number;
    username: string;
    nickname: string;
    gender: number;
    birthday: string;
    phone: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    jobId: number;
    departmentId: number;
    roleId: number;
    lastLoginDate: string;
    updateTime: string;
    children?: ResUserList[];
  }
  export interface ReqUser {
    id?: number;
    password: string;
    username: string;
    nickname: string;
    gender: number;
    birthday: string;
    phone: number;
    email: string;
    jobId: number;
    departmentId: number;
    roleId: number;
    status: number;
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: number;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: number;
    name: string;
    children?: ResDepartment[];
  }
}
