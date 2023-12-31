import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page } from "../types";

export interface Menu {
  id: any;
  createTime: string;
  pid: any;
  parentName: string;
  subCount: number;
  type: number;
  title: string;
  name: string;
  component: string;
  menuSort: number;
  icon: string;
  path: string;
  target: number;
  keepAlive: number;
  enabled: number;
  hidden: number;
  permission: string;
  children: Array<Menu>;
}
export interface MenuSearch {
  pageNo: number;
  pageSize: number;
}
export const _getPageMenus = (params: MenuSearch) => {
  return httpRequest<Page<Menu>>({
    url: `/admin/menu`,
    method: "get",
    params,
  });
};
export const _getCatalogues = async () => {
  return httpRequest<Array<Menu>>({
    url: `/admin/menu/catalogue`,
    method: "get",
  });
};
export const _getUserPermissions = async () => {
  return httpRequest<Array<string>>({
    url: `/admin/menu/permission`,
    method: "get",
  });
};
export const _getMenu = (id: string) => {
  return httpRequest<Menu>({
    url: `/admin/menu/${id}`,
    method: "get",
  });
};
export const _getSubMenus = (pid: string) => {
  return httpRequest<Array<Menu>>({
    url: `/admin/menu/sub/${pid}`,
    method: "get",
  });
};
export const _addMenu = (data: Menu) => {
  return httpRequestWithMsg({
    url: `/admin/menu`,
    method: "post",
    data,
  });
};
export const _updateMenu = (data: Menu) => {
  return httpRequestWithMsg({
    url: `/admin/menu`,
    method: "put",
    data,
  });
};
export const _updateMenuSort = (id: string, menuSort: number) => {
  return httpRequest({
    url: `/admin/menu/sort/${id}`,
    method: "put",
    params: { menuSort },
  });
};
export const _deleteMenu = (data: string[]) => {
  return httpRequestWithMsg({
    url: `/admin/menu`,
    method: "delete",
    data,
  });
};
export const _enableMenu = (id: string, enable: number) => {
  return httpRequestWithMsg({
    url: `/admin/menu/enable/${id}`,
    method: "put",
    params: { enable },
  });
};
