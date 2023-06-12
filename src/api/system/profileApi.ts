import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface BrandSearch extends PageSearch, SortEntity{
  id:any
  name:string
}
export interface Brand  extends BaseEntity {
  name:string
  desc:string
  picUrl:string
  sortOrder:number
  floorPrice:number
}

export function _changePassword(data:any) {
  return httpRequestWithMsg({
    url: '/admin/profile/password',
    method: 'post',
    data
  })
}

export function _nNotice() {
  return httpRequest({
    url: '/admin/profile/nnotice',
    method: 'get'
  })
}

export function _listNotice(query:any) {
  return httpRequest<Page<any>>({
    url: '/admin/profile/lsnotice',
    method: 'get',
    params: query
  })
}

export function _catNotice(data:any) {
  return httpRequestWithMsg({
    url: '/admin/profile/catnotice',
    method: 'post',
    data
  })
}

export function _bcatNotice(data:any) {
  return httpRequestWithMsg({
    url: '/admin/profile/bcatnotice',
    method: 'post',
    data
  })
}

export function _rmNotice(data:any) {
  return httpRequestWithMsg({
    url: '/admin/profile/rmnotice',
    method: 'post',
    data
  })
}

export function _brmNotice(data:any) {
  return httpRequestWithMsg({
    url: '/admin/profile/brmnotice',
    method: 'post',
    data
  })
}

