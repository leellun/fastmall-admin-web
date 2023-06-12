import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { BaseEntity, Page, PageSearch, SortEntity } from "../types";
export interface CommentSearch extends PageSearch, SortEntity{
  id:any
  userId:any
  valueId:any
  name:string
}
export interface Comment  extends BaseEntity {
  name:string
  desc:string
  picUrl:string
  sortOrder:number
  floorPrice:number
}

export function _listComment(query:CommentSearch) {
  return httpRequest<Page<Comment>>({
    url: '/admin/comment',
    method: 'get',
    params: query
  })
}

export function _deleteComment(id:any) {
  return httpRequestWithMsg({
    url: `/admin/comment/${id}`,
    method: 'delete'
  })
}
