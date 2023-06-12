import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface TopicSearch extends PageSearch, SortEntity {
  title: string;
  subtitle: string;
}
export interface Topic extends BaseEntity {
  title: string;
  subtitle: string;
  price: number;
  sortOrder: number;
  readCount: string;
  picUrl: string;
  goods: Array<any>;
  content: string;
}

export function _listTopic(query: TopicSearch) {
  return httpRequest<Page<Topic>>({
    url: "/admin/topic",
    method: "get",
    params: query,
  });
}

export function _createTopic(data: Topic) {
  return httpRequestWithMsg({
    url: "/admin/topic",
    method: "post",
    data,
  });
}

export function _getTopic(id: any) {
  return httpRequest<Topic>({
    url: `/admin/topic/${id}`,
    method: "get",
  });
}

export function _updateTopic(data: Topic) {
  return httpRequestWithMsg({
    url: "/admin/topic/update",
    method: "put",
    data,
  });
}

export function _deleteTopic(id: any) {
  return httpRequestWithMsg({
    url: `/admin/topic/${id}`,
    method: "delete",
  });
}

export function _batchDeleteTopic(data: Array<any>) {
  return httpRequestWithMsg({
    url: "/admin/topic/batchDelete",
    method: "post",
    data,
  });
}
