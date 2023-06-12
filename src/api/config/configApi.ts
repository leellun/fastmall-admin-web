import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { BaseEntity } from "../types";
export interface Config extends BaseEntity {
  keyName: string;
  keyValue: string;
  type: number; //配置类型 1 商城 2 运费 3 订单 4 小程序
}
export function _listMall() {
  return httpRequest<Array<Config>>({
    url: "/admin/config/mall",
    method: "get",
  });
}

export function _updateMall(data: Array<Config>) {
  return httpRequestWithMsg({
    url: "/admin/config/mall",
    method: "post",
    data,
  });
}

export function _listExpress() {
  return httpRequest<Array<Config>>({
    url: "/admin/config/express",
    method: "get",
  });
}

export function _updateExpress(data: Array<Config>) {
  return httpRequestWithMsg({
    url: "/admin/config/express",
    method: "post",
    data,
  });
}

export function _listOrder() {
  return httpRequest<Array<Config>>({
    url: "/admin/config/order",
    method: "get",
  });
}

export function _updateOrder(data: Array<Config>) {
  return httpRequestWithMsg({
    url: "/admin/config/order",
    method: "post",
    data,
  });
}

export function _listWx() {
  return httpRequest<Array<Config>>({
    url: "/admin/config/wx",
    method: "get",
  });
}

export function _updateWx(data: Array<Config>) {
  return httpRequestWithMsg({
    url: "/admin/config/wx",
    method: "post",
    data,
  });
}
