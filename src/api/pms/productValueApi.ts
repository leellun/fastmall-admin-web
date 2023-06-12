import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch } from "../types";
export interface ValueSearchDto extends PageSearch {
  goodsAttrId: any;
}
export interface GoodsValue {
  id: any;
  goodsAttrId: any;
  name: string;
  value: string;
}
export const _getProductValuePage = (params: ValueSearchDto) => {
  return httpRequest<Page<GoodsValue>>({
    url: `/admin/goodsValue/list`,
    method: "get",
    params: params,
  });
};

export const _deleteProductValue = (data: Array<string>) => {
  return httpRequestWithMsg<any>({
    url: `/admin/goodsValue/delete`,
    method: "delete",
    data: data,
  });
};

export const _createProductValue = (data: GoodsValue) => {
  return httpRequestWithMsg<any>({
    url: "/admin/goodsValue/create",
    method: "post",
    data: data,
  });
};

export const _updateProductValue = (id: string, data: GoodsValue) => {
  return httpRequestWithMsg<any>({
    url: `/admin/goodsValue/update/${id}`,
    method: "put",
    data: data,
  });
};
