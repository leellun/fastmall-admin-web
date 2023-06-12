import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { BaseEntity, Page, PageSearch, SortEntity } from "../types";
export interface OrderSearch extends PageSearch, SortEntity {
  orderStatusArray: Array<number>;
  nickname: string;
  consignee: string;
  orderSn: string;
  start: string;
  end: string;
}
export interface Order extends BaseEntity {
  id: any;
  userId: any;
  orderSn: string;
  orderStatus: number;
  aftersaleStatus: number; //售后状态，0是可申请，1是用户已申请，2是管理员审核通过，3是管理员退款成功，4是管理员审核拒绝，5是用户已取消
  consignee: string; //收货人名称
  mobile: string;
  address: string;
  message: string;
  goodsPrice: number; //商品总费用
  freightPrice: number; //配送费用
  couponPrice: number; //优惠券减免
  integralPrice: number; //用户积分减免
  grouponPrice: number; //团购优惠价减免
  orderPrice: number; //订单费用， = goods_price + freight_price - coupon_price
  actualPrice: number; //实付费用， = order_price - integral_price
  payId: string; //微信付款编号
  payTime: string;
  shipSn: string; //发货编号
  shipChannel: string; //发货快递公司
  shipTime: string; //发货开始时间
  refundAmount: number; //实际退款金额，（有可能退款金额小于实际支付金额）
  refundType: string; //退款方式
  refundContent: string; //退款备注
  refundTime: string; //退款时间
  confirmTime: string; //用户确认收货时间
  comments: number; //待评价订单商品数量
  endTime: string; //订单关闭时间
}
export interface OrderGoods {
  orderId: any;
  goodsId: any;
  productId: any;
  goodsName: string;
  goodsSn: string;
  number: number;
  price: number;
  specifications: string[];
  picUrl: string;
  comment: number; // 订单商品评论，如果是-1，则超期不能评价；如果是0，则可以评价；如果其他值，则是comment表里面的评论ID。
}
export interface UserVO {
  nickname: string;
  avatar: string;
}
export interface OrderDetailVO {
  order: Order;
  orderGoods: Array<OrderGoods>;
  user: UserVO;
}
export interface OrderVO {
  id: any;
  userId: any;
  userName: string;
  userAvatar: string;
  consignee: string;
  address: string;
  mobile: string;
  shipChannel: string;
  shipSn: string;
  message: string;
  orderSn: string;
  orderStatus: number;
  actualPrice: number;
  integralPrice: number;
  freightPrice: number;
  orderPrice: number;
  createTime: string;
  payTime: string;
  goodsVoList: Array<OrderGoodsVO>;
}
export interface OrderGoodsVO {
  id: any;
  goodsName: string;
  picUrl: string;
  goodsId: any;
  productId: any;
  specifications: string[];
  location: string;
  number: number;
  price: number;
}
export interface OrderShipDTO {
  orderId: any;
  shipSn: string;
  shipChannel: string;
}
export interface OrderPayDTO {
  orderId: any;
  newMoney: number;
}
export interface OrderRefundDTO {
  orderId: any;
  refundMoney: number;
}
export interface OrderReplyDTO {
  commentId: any;
  content: string;
}
export function _listOrder(query: OrderSearch) {
  var param: any = {};
  Object.keys(query).forEach((key) => {
    param[key] = (query as any)[key];
  });
  param["orderStatusArray"] = query.orderStatusArray?.join(",");
  return httpRequest<Page<OrderVO>>({
    url: "/admin/order",
    method: "get",
    params: param,
  });
}

export function _detailOrder(id: any) {
  return httpRequest<OrderDetailVO>({
    url: `/admin/order/${id}`,
    method: "get",
  });
}

export function _shipOrder(data: OrderShipDTO) {
  return httpRequestWithMsg({
    url: "/admin/order/ship",
    method: "post",
    data,
  });
}

export function _refundOrder(data: OrderRefundDTO) {
  return httpRequestWithMsg({
    url: "/admin/order/refund",
    method: "post",
    data,
  });
}

export function _payOrder(data: OrderPayDTO) {
  return httpRequestWithMsg({
    url: "/admin/order/pay",
    method: "post",
    data,
  });
}

export function _deleteOrder(id: any) {
  return httpRequestWithMsg({
    url: `/admin/order/${id}`,
    method: "delete",
  });
}

export function _replyComment(data: OrderReplyDTO) {
  return httpRequestWithMsg({
    url: "/admin/order/reply",
    method: "post",
    data,
  });
}

export function _listChannel(orderId?: any) {
  return httpRequest<Array<any>>({
    url: `/admin/order/channel`,
    method: "get",
  });
}
