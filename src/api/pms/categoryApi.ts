import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface Category  extends BaseEntity {
  name:string
  keywords:string
  description:string
  iconUrl:string
  picUrl:string
  level:string
  pid:any
  sortOrder:number
}
export interface  CategoryVO {
  id:any
  name:string
  keywords:string
  description:string
  iconUrl:string
  picUrl:string
  level:string
  children:Array<CategoryVO>
}
export interface CateVO {
  value:any
  label:string
  children:Array<CateVO>
}
export function _listCategory() {
  return httpRequest<Array<CategoryVO>>({
    url: '/admin/category',
    method: 'get'
  })
}

export function _listCatL1() {
  return httpRequest<Array<Category>>({
    url: '/admin/category/l1',
    method: 'get'
  })
}
export function _listCats() {
  return httpRequest<Array<CateVO>>({
    url: '/admin/category/cat',
    method: 'get'
  })
}

export function _createCategory(data:Category) {
  return httpRequestWithMsg({
    url: '/admin/category',
    method: 'post',
    data
  })
}

export function _getCategory(id:any) {
  return httpRequest<Category>({
    url: `/admin/category/${id}`,
    method: 'get'
  })
}

export function _updateCategory(data:Category) {
  return httpRequestWithMsg({
    url: '/admin/category',
    method: 'put',
    data
  })
}

export function _deleteCategory(id:any) {
  return httpRequestWithMsg({
    url: `/admin/category/${id}`,
    method: 'delete'
  })
}
