import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface StorageSearch extends PageSearch,SortEntity{
  key:string
  name:string
}
export interface Storage  extends BaseEntity {
  key:string
  name:string
  type:string
  url:string
  size:number
}
export function _listStorage(query:StorageSearch) {
  return httpRequest<Page<Storage>>({
    url: '/admin/storage',
    method: 'get',
    params: query
  })
}

export function _createStorage(data:FormData) {
  return httpRequestWithMsg({
    url: '/admin/storage',
    method: 'post',
    data
  })
}

export function _getStorage(id:any) {
  return httpRequest<Storage>({
    url: `/admin/storage/${id}`,
    method: 'get'
  })
}

export function _updateStorage(data:Storage) {
  return httpRequestWithMsg({
    url: '/admin/storage',
    method: 'put',
    data
  })
}

export function _deleteStorage(key:any) {
  return httpRequestWithMsg({
    url: `/admin/storage/${key}`,
    method: 'delete'
  })
}

const uploadPath = import.meta.env.VITE_APP_BASE_API + '/admin/storage'
export { uploadPath }
