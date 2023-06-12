import { httpRequest, httpRequestWithMsg } from "@/utils/request";

export interface StatUserVO {
  day: string;
  users: any;
}
export interface StatOrderVO {
  day: string;
  orders: any;
  customers: any;
  amount: number;
  pcr: number;
}
export interface StatGoodsVO {
  day: string;
  orders: any;
  products: any;
  amount: number;
}
export function _statUser() {
  return httpRequest<Array<StatUserVO>>({
    url: "/admin/stat/user",
    method: "get"
  });
}

export function _statOrder() {
  return httpRequest<Array<StatOrderVO>>({
    url: "/admin/stat/order",
    method: "get"
  });
}

export function _statGoods() {
  return httpRequest<Array<StatGoodsVO>>({
    url: "/admin/stat/goods",
    method: "get"
  });
}
