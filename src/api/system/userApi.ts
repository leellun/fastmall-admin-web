import request,{ httpRequest,httpRequestWithMsg } from "@/utils/request";
import type { Page } from "@/api/types";

export interface AuthResult {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  code: number;
  msg: string;
}
export interface UserSearch {
  pageNo: number;
  pageSize: number;
  blurry: string;
  createTime: Array<string>;
  enabled: number;
  deptIds: Array<string>;
}
export interface UserItem {
  id: string;
  createTime: string;
  updateTime: string;
  username: string;
  realName: string;
  nickName: string;
  gender: number;
  phone: string;
  email: string;
  avatar: string;
  enabled: number;
  failLockTime: string;
  pwdResetTime: string;
  lastLoginTime: string;
  deptName: string;
  roleName: string;
  canDeleted?: number;
}
export interface UserRequest {
  id: String;
  username: string;
  realName: string;
  nickName: string;
  deptId: String;
  deptName: String;
  gender: number;
  phone: string;
  email: string;
  avatar?: string;
  enabled?: number;
  jobId: string;
  roleIds: string[];
}
export const _auth_login = (username: string, password: string) => {
  return httpRequestWithMsg<string>({
    url: "/admin/auth/login",
    method: "post",
    data: {
      username,
      password,
    },
  });
};
export const _auth_login2 = (username: string, password: string) => {
  return httpRequestWithMsg<AuthResult>({
    url: "/uaa/oauth2/token",
    method: "post",
    params: {
      client_id: "messaging-client",
      client_secret: "secret",
      grant_type: "jwt",
      username,
      password,
    },
  });
};

export const _getUsersPage = (data: UserSearch) => {
  return httpRequest<Page<UserItem>>({
    url: "/admin/sysUser/list",
    method: "post",
    data,
  });
};
export const _addUser = (data: UserRequest) => {
  return httpRequestWithMsg({
    url: "/admin/sysUser",
    method: "post",
    data,
  });
};
export const _updateUser = (data: UserRequest) => {
  return httpRequestWithMsg({
    url: "/admin/sysUser",
    method: "put",
    data,
  });
};
export const _enableUser = (id: string, enable: number) => {
  return httpRequestWithMsg({
    url: `/admin/sysUser/enable/${id}`,
    method: "put",
    params: { enable },
  });
};
export const _getUser = (id: string) => {
  return httpRequest<UserRequest>({
    url: `/admin/sysUser/${id}`,
    method: "get",
  });
};
export const _deleteUser = (data: string[]) => {
  return httpRequestWithMsg({
    url: `/admin/sysUser`,
    method: "delete",
    data
  });
};
export const _resetPass = (id: string) => {
  return httpRequestWithMsg({
    url: `/admin/sysUser/resetPass/${id}`,
    method: "put"
  });
};
