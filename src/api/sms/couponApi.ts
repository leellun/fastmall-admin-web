import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface CouponSearch extends PageSearch, SortEntity {
  type: number;
  status: number;
  name: string;
}
export interface CouponUserSearch extends PageSearch, SortEntity {
  userId: any;
  couponId: any;
  status: number;
}
export interface Coupon extends BaseEntity {
  name: string;
  description: string;
  tag: string;
  total: number;
  discount: number;
  min: number;
  limitCount: number;
  days: number;
  timeType: number; //有效时间限制，如果是0，则基于领取时间的有效天数days；如果是1，则start_time和end_time是优惠券有效期；
  goodsType: number; //商品限制类型，如果0则全商品，如果是1则是类目限制，如果是2则是商品限制。
  status: number; //优惠券状态，如果是0则是正常可用；如果是1则是过期; 如果是2则是下架。
  type: number; //优惠券赠送类型，如果是0则通用券，用户领取；如果是1，则是注册赠券；如果是2，则是优惠券码兑换；
  goodsValue: string[]; //商品限制值，goods_type如果是0则空集合，如果是1则是类目集合，如果是2则是商品集合。
  code: string;
  startTime: string;
  endTime: string;
}
export interface CouponUser extends BaseEntity {
  couponId:any
  status:number // 使用状态, 如果是0则未使用；如果是1则已使用；如果是2则已过期；如果是3则已经下架；
  usedTime:string
  startTime:string
  endTime:string
  orderId:any
}
export function _listCoupon(query: CouponSearch) {
  return httpRequest<Page<Coupon>>({
    url: "/admin/coupon",
    method: "get",
    params: query,
  });
}

export function _createCoupon(data: Coupon) {
  return httpRequestWithMsg({
    url: "/admin/coupon",
    method: "post",
    data,
  });
}

export function _getCoupon(id: any) {
  return httpRequest<Coupon>({
    url: `/admin/coupon/${id}`,
    method: "get",
  });
}

export function _updateCoupon(data: Coupon) {
  return httpRequestWithMsg({
    url: "/admin/coupon",
    method: "put",
    data,
  });
}

export function _deleteCoupon(id: any) {
  return httpRequestWithMsg({
    url: `/admin/coupon/${id}`,
    method: "delete",
  });
}

export function _listCouponUser(query: CouponUserSearch) {
  return httpRequest<Page<CouponUser>>({
    url: "/admin/coupon/listuser",
    method: "get",
    params: query,
  });
}
