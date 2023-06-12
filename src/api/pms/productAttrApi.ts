import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity } from "../types";
export interface ProductAttributeSearchDto extends PageSearch {
  type: number;
}
export interface ProductAttributeDto {
  name: string;
  selectType: number;
  inputType: number;
  inputList: string;
  attrSort: number;
  filterType: number;
  searchType: number;
  relatedStatus: number;
  handAddStatus: number;
  type: number;
}
export interface ProductAttribute {
  id: string;
  name: string;
  selectType: number;
  inputType: number;
  inputList: string;
  sort: number;
  filterType: number;
  searchType: number;
  relatedStatus: number;
  handAddStatus: number;
  type: number;
  hasPic: number;
}
export interface GoodsValue extends BaseEntity {
  goodsAttrId: any;
  name: string;
  value: string;
}
export interface ProductAttrWithValue extends ProductAttribute {
  values: Array<GoodsValue>;
}

export interface ProductAttrInfoVo extends ProductAttribute {
  attributeId: string;
  attributeCategoryId: string;
}
export const _getProductAttrPage = (params: ProductAttributeSearchDto) => {
  return httpRequest<Page<ProductAttribute>>({
    url: `/admin/goodsAttr/list`,
    method: "get",
    params: params,
  });
};
export const _getGroupBindAttribute = (gid: string, type: number) => {
  return httpRequest<Array<ProductAttribute>>({
    url: `/admin/goodsAttr/all/${gid}`,
    method: "get",
    params: {
      type,
    },
  });
};
export const _getBindWithValue = (gid: string, type: number) => {
  return httpRequest<Array<ProductAttrWithValue>>({
    url: `/admin/goodsAttr/bindWithValue/${gid}`,
    method: "get",
    params: {
      type,
    },
  });
};
export const _getGroupUnBindAttribute = (
  gid: string,
  params: ProductAttributeSearchDto
) => {
  return httpRequest<Page<ProductAttribute>>({
    url: `/admin/goodsAttr/unbind/${gid}`,
    method: "get",
    params,
  });
};

export const _deleteProductAttr = (data: Array<string>) => {
  return httpRequestWithMsg<any>({
    url: `/admin/goodsAttr/delete`,
    method: "delete",
    data: data,
  });
};

export const _createProductAttr = (data: ProductAttributeDto) => {
  return httpRequestWithMsg<any>({
    url: "/admin/goodsAttr/create",
    method: "post",
    data: data,
  });
};

export const _updateProductAttr = (id: string, data: ProductAttributeDto) => {
  return httpRequestWithMsg<any>({
    url: `/admin/goodsAttr/update/${id}`,
    method: "put",
    data: data,
  });
};
export const _getProductAttr = (id: string) => {
  return httpRequest<ProductAttribute>({
    url: `/admin/goodsAttr/${id}`,
    method: "get",
  });
};

export const _getProductAttrInfo = (productCategoryId: string) => {
  return httpRequest<Array<ProductAttrInfoVo>>({
    url: `/admin/goodsAttr/attrInfo/${productCategoryId}`,
    method: "get",
  });
};
