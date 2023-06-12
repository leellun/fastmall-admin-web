import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Goods } from "../pms/goodsApi";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface RecordSearch extends PageSearch, SortEntity{
  grouponRuleId:any
}
export interface GrouponSearch extends PageSearch, SortEntity{
  goodsId:any
}
export interface GrouponRules  extends BaseEntity {
  goodsId:any
  goodsName:string
  picUrl:string
  discount:number
  discountMember:number
  status:number //团购规则状态，正常上线则0，到期自动下线则1，管理手动下线则2
  expireTime:string
}
export interface Groupon  extends BaseEntity {
  orderId:any
  grouponId:any
  rulesId:any
  userId:any
  creatorUserId:any
  shareUrl:string
  creatorUserTime:string
  status:number //团购活动状态，开团未支付则0，开团中则1，开团失败则2
}
export interface GrouponListItemVO {
  groupon:Groupon
  subGroupons:Array<Groupon>
  rules:GrouponRules
  goods:Goods
}

export function _listRecord(query:RecordSearch) {
  return httpRequest<Page<GrouponListItemVO>>({
    url: '/admin/groupon/listRecord',
    method: 'get',
    params: query
  })
}

export function _listGroupon(query:GrouponSearch) {
  return httpRequest<Page<GrouponRules>>({
    url: '/admin/groupon',
    method: 'get',
    params: query
  })
}

export function _deleteGroupon(id:any) {
  return httpRequestWithMsg({
    url: `/admin/groupon/${id}`,
    method: 'delete'
  })
}

export function _publishGroupon(data:GrouponRules) {
  return httpRequestWithMsg({
    url: '/admin/groupon',
    method: 'post',
    data
  })
}

export function _editGroupon(data:GrouponRules) {
  return httpRequestWithMsg({
    url: '/admin/groupon',
    method: 'put',
    data
  })
}
