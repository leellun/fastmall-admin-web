import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface BrandSearch extends PageSearch, SortEntity{
  id:any
  name:string
}
export interface Brand  extends BaseEntity {
  name:string
  description:string
  picUrl:string
  sortOrder:number
  floorPrice:number
}
export function _listBrand(query:BrandSearch) {
  return httpRequest<Page<Brand>>({
    url: '/admin/brand',
    method: 'get',
    params: query
  })
}

export function _createBrand(data:Brand) {
  return httpRequestWithMsg({
    url: '/admin/brand',
    method: 'post',
    data
  })
}

export function _getBrand(id:any) {
  return httpRequest({
    url: `/admin/brand/${id}`,
    method: 'get'
  })
}

export function _updateBrand(data:Brand) {
  return httpRequestWithMsg({
    url: '/admin/brand',
    method: 'put',
    data
  })
}

export function _deleteBrand(id:any) {
  return httpRequestWithMsg({
    url: `/admin/brand/${id}`,
    method: 'delete'
  })
}
