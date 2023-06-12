import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface AftersaleSearch extends PageSearch, SortEntity {
  orderId: any;
  aftersaleSn: string;
  status: number;
}
export interface Aftersale extends BaseEntity {
  aftersaleSn: string;
  reason: string;
  comment: string;
  handleTime: string;
  orderId: any;
  userId: any;
  type: number; //售后类型，0是未收货退款，1是已收货（无需退货）退款，2用户退货退款
  status: number; //售后状态，0是可申请，1是用户已申请，2是管理员审核通过，3是管理员退款成功，4是管理员审核拒绝，5是用户已取消
  amount: number;
  pictures: Array<string>;
}
export function _listAftersale(query: AftersaleSearch) {
  return httpRequest<Page<Aftersale>>({
    url: "/admin/aftersale",
    method: "get",
    params: query,
  });
}

export function _receptAftersale(data: Aftersale) {
  return httpRequestWithMsg({
    url: "/admin/aftersale/recept",
    method: "post",
    data,
  });
}

export function _batchReceptAftersale(ids: Array<any>) {
  return httpRequestWithMsg({
    url: "/admin/aftersale/batchRecept",
    method: "post",
    data: ids.join(","),
  });
}

export function _rejectAftersale(data: Aftersale) {
  return httpRequestWithMsg({
    url: "/admin/aftersale/reject",
    method: "post",
    data,
  });
}

export function _batchRejectAftersale(ids: Array<any>) {
  return httpRequestWithMsg({
    url: "/admin/aftersale/batchReject",
    method: "post",
    data: ids.join(","),
  });
}

export function _refundAftersale(data: Aftersale) {
  return httpRequestWithMsg({
    url: "/admin/aftersale/refund",
    method: "post",
    data,
  });
}
