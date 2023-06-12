import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface IssueSearch extends PageSearch, SortEntity{
  question:string
}
export interface Issue  extends BaseEntity {
  question:string
  answer:string
}
export function _listIssue(query:IssueSearch) {
  return httpRequest<Page<Issue>>({
    url: '/admin/issue/list',
    method: 'get',
    params: query
  })
}

export function _createIssue(data:Issue) {
  return httpRequestWithMsg({
    url: '/admin/issue/create',
    method: 'post',
    data
  })
}

export function _getIssue(id:any) {
  return httpRequest<Issue>({
    url: `/admin/issue/${id}`,
    method: 'get'
  })
}

export function _updateIssue(data:Issue) {
  return httpRequestWithMsg({
    url: '/admin/issue',
    method: 'put',
    data
  })
}

export function _deleteIssue(id:any) {
  return httpRequestWithMsg({
    url: `/admin/issue/${id}`,
    method: 'delete'
  })
}
