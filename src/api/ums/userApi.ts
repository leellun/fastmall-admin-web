import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface UserSearch extends PageSearch, SortEntity {
  username: string;
  mobile: string;
}
export interface AddressSearch extends PageSearch, SortEntity {
  userId: any;
  name: string;
}
export interface CollectSearch extends PageSearch, SortEntity {
  userId: any;
  valueId: any;
}
export interface FeedbackSearch extends PageSearch, SortEntity {
  userId: any;
  username: string;
}
export interface FootprintSearch extends PageSearch, SortEntity {
  userId: any;
  goodsId: any;
}
export interface HistorySearch extends PageSearch, SortEntity {
  userId: any;
  keyword: string;
}
export interface User extends BaseEntity {
  username: string;
  password: string;
  gender: number;
  birthday: string;
  lastLoginTime: string;
  lastLoginIp: string;
  userLevel: number;
  nickname: string;
  mobile: string;
  avatar: string;
  status: number; //0 可用, 1 禁用, 2 注销
}
export interface Address extends BaseEntity {
  name: string;
  userId: any;
  province: string;
  city: string;
  county: string;
  addressDetail: string;
  areaCode: string;
  postalCode: string;
  tel: string;
  isDefault: string;
}
export interface Feedback  extends BaseEntity {
  userId:any
  username:string
  mobile:string
  feedType:string
  content:string
  picUrls:string
  status:number
  hasPicture:boolean
}
export interface Footprint  extends BaseEntity {
  userId:any
  goodsId:any
}
export interface Collect extends BaseEntity {
  userId:any
  valueId:any
  type:number
}
export interface SearchHistory  extends BaseEntity {
  userId:any
  keyword:string
  source:string
}
export function _userList(query: UserSearch) {
  return httpRequest<Page<User>>({
    url: "/admin/user",
    method: "get",
    params: query,
  });
}

export function _userDetail(id: any) {
  return httpRequest<User>({
    url: `/admin/user/${id}`,
    method: "get"
  });
}

export function _updateUser(data: User) {
  return httpRequestWithMsg({
    url: "/admin/user",
    method: "put",
    data,
  });
}

export function _listAddress(query:AddressSearch) {
  return httpRequest<Page<Address>>({
    url: "/admin/address",
    method: "get",
    params: query,
  });
}

export function _listCollect(query:CollectSearch) {
  return httpRequest<Page<Collect>>({
    url: "/admin/collect",
    method: "get",
    params: query,
  });
}

export function _listFeedback(query:FeedbackSearch) {
  return httpRequest<Page<Feedback>>({
    url: "/admin/feedback",
    method: "get",
    params: query,
  });
}

export function _listFootprint(query:FootprintSearch) {
  return httpRequest<Page<Footprint>>({
    url: "/admin/footprint",
    method: "get",
    params: query,
  });
}

export function _listHistory(query:HistorySearch) {
  return httpRequest<Page<SearchHistory>>({
    url: "/admin/history",
    method: "get",
    params: query,
  });
}
