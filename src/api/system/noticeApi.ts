import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { BaseEntity, Page, PageSearch, SortEntity } from "../types";
export interface NoticeSearch extends PageSearch, SortEntity{
  id:any
  name:string
}
export interface Notice  extends BaseEntity {
  name:string
  desc:string
  picUrl:string
  sortOrder:number
  floorPrice:number
}

export function listNotice(query:NoticeSearch) {
  return httpRequest<Page<Notice>>({
    url: '/admin/notice',
    method: 'get',
    params: query
  })
}

export function createNotice(data:Notice) {
  return httpRequestWithMsg({
    url: '/admin/notice',
    method: 'post',
    data
  })
}

export function _getNotice(id:any) {
  return httpRequest<Notice>({
    url: `/admin/notice/${id}`,
    method: 'get'
  })
}

export function updateNotice(data:Notice) {
  return httpRequestWithMsg({
    url: '/admin/notice',
    method: 'put',
    data
  })
}

export function deleteNotice(id:any) {
  return httpRequestWithMsg({
    url: `/admin/notice/${id}`,
    method: 'delete'
  })
}

export function batchDeleteNotice(data:Array<any>) {
  return httpRequestWithMsg({
    url: '/admin/notice/batchDelete',
    method: 'post',
    data
  })
}
