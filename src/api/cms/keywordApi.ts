import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface KeywordSearch extends PageSearch, SortEntity{
  keyword:string
  url:string
}
export interface Keyword  extends BaseEntity {
  keyword:string
  url:string
  isHot:number
  isDefault:number
  sortOrder:number
}
export function _listKeyword(query:KeywordSearch) {
  return httpRequest<Page<Keyword>>({
    url: '/admin/keyword',
    method: 'get',
    params: query
  })
}

export function _createKeyword(data:Keyword) {
  return httpRequestWithMsg({
    url: '/admin/keyword',
    method: 'post',
    data
  })
}

export function _getKeyword(id:any) {
  return httpRequest<Keyword>({
    url: `/admin/keyword/${id}`,
    method: 'get'
  })
}

export function _updateKeyword(data:Keyword) {
  return httpRequestWithMsg({
    url: '/admin/keyword',
    method: 'put',
    data
  })
}

export function _deleteKeyword(id:any) {
  return httpRequestWithMsg({
    url: `/admin/keyword/${id}`,
    method: 'delete'
  })
}
