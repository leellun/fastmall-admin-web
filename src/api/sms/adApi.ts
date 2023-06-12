import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface AdSearch extends PageSearch, SortEntity {
  content: string;
  name: string;
}
export interface Ad extends BaseEntity {
  name: string;
  link: string;
  url: string;
  content: string;
  position: number;
  enabled: number;
}
export function _listAd(query: AdSearch) {
  return httpRequest<Page<Ad>>({
    url: "/admin/ad",
    method: "get",
    params: query,
  });
}

export function _createAd(data: Ad) {
  return httpRequestWithMsg({
    url: "/admin/ad",
    method: "post",
    data,
  });
}

export function _getAd(id: any) {
  return httpRequest<Ad>({
    url: `/admin/ad/${id}`,
    method: "get",
  });
}

export function _updateAd(data: Ad) {
  return httpRequestWithMsg({
    url: "/admin/ad",
    method: "put",
    data,
  });
}

export function _deleteAd(id: any) {
  return httpRequestWithMsg({
    url: `/admin/ad/${id}`,
    method: "delete",
  });
}
