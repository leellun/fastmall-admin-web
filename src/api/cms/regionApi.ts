import { httpRequest } from "@/utils/request";
import { BaseEntity } from "../types";
export interface Region extends BaseEntity {
  pid: any;
  name: string;
  type: number;
  code: string;
}
export interface RegionVO extends Region {
  children: Array<RegionVO>;
}

export function _listRegion() {
  return httpRequest<Array<RegionVO>>({
    url: "/admin/region",
    method: "get",
  });
}

export function _listSubRegion(id: any) {
  return httpRequest<Array<Region>>({
    url: `/admin/region/clist/${id}`,
    method: "get",
  });
}
