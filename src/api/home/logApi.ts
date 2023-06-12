import { httpRequest } from "@/utils/request";
import type { Page, PageSearch, SortEntity, BaseEntity } from "../types";
export interface LogSearch extends PageSearch, SortEntity {
  name: string;
}
export interface Log extends BaseEntity {
  admin: string;
  ip: string;
  type: number;
  action: string;
  status: number;
  result: string;
  comment: string;
}
export function _listLog(query: LogSearch) {
  return httpRequest<Page<Log>>({
    url: "/admin/log/list",
    method: "get",
    params: query,
  });
}
