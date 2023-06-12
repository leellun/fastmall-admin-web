import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page } from "@/api/types";
export interface Role {
  id: string;
  name: string;
  code: string;
  level: number;
  enabled: number;
  description: string;
}
export interface RoleSearch {
  pageNo: number;
  pageSize: number;
  name: string;
  enabled: number;
}
export const _getAllRoles = () => {
  return httpRequest<Array<Role>>({
    url: "/admin/role/all",
    method: "get",
  });
};
export const _getRolesPage = (data: RoleSearch) => {
  return httpRequest<Page<Role>>({
    url: "/admin/role/list",
    method: "post",
    data,
  });
};
export const _getRole = (id: string) => {
  return httpRequest<Role>({
    url: `/admin/role/${id}`,
    method: "get",
  });
};
export const _addRole = (data: Role) => {
  return httpRequest({
    url: `/admin/role`,
    method: "post",
    data,
  });
};
export const _updateRole = (data: Role) => {
  return httpRequest({
    url: `/admin/role`,
    method: "put",
    data,
  });
};
export const _deleteRole = (data: string[]) => {
  return httpRequest<Role>({
    url: `/admin/role`,
    method: "delete",
    data,
  });
};
export const _enableRole = (id: string, enable: number) => {
  return httpRequestWithMsg({
    url: `/admin/role/enable/${id}`,
    method: "put",
    params: { enable },
  });
};

export const _getMenuPermission = (roleId: string) => {
  return httpRequest<any, Array<string>>({
    url: `/admin/role/permission/${roleId}`,
    method: "get",
  });
};

export const _addMenuPermission = (roleId: string, data: string[]) => {
  return httpRequestWithMsg({
    url: `/admin/role/permission/${roleId}`,
    method: "post",
    data,
  });
};
