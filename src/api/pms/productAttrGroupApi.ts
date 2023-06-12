import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page, PageSearch } from "../types";
import type { ProductAttribute } from "./productAttrApi";
export interface AttributeGroup {
  id: string;
  name: string;
  categoryId: any;
  attributeCount: number;
  paramCount: number;
}
export interface AttributeGroupItem {
  goodsGroup: AttributeGroup;
  categoryIds: Array<any>;
}
export interface AttributeGroupItemVo extends AttributeGroup {
  productAttributeList: Array<ProductAttribute>;
}
export function _getPageAttrGroup(params: PageSearch) {
  return httpRequest<Page<AttributeGroup>>({
    url: "/admin/groupGroup/list",
    method: "get",
    params: params,
  });
}
export function _getTotalAttrGroup(categoryId: any) {
  return httpRequest<Array<AttributeGroup>>({
    url: "/admin/groupGroup/category/" + categoryId,
    method: "get",
  });
}

export function _createProductAttrGroup(data: AttributeGroup) {
  return httpRequestWithMsg<any>({
    url: "/admin/groupGroup/create",
    method: "post",
    data,
  });
}

export function _getProductAttrGroup(id: any) {
  return httpRequest<AttributeGroupItem>({
    url: "/admin/groupGroup/" + id,
    method: "get",
  });
}
export function _deleteProductAttrGroup(id: string) {
  return httpRequestWithMsg<any>({
    url: "/admin/groupGroup/delete/" + id,
    method: "delete",
  });
}

export function _updateProductAttrGroup(data: AttributeGroup) {
  return httpRequestWithMsg({
    url: "/admin/groupGroup/update",
    method: "put",
    data,
  });
}
export function fetchListWithAttr() {
  return httpRequest<Array<AttributeGroupItemVo>>({
    url: "/admin/groupGroup/list/withAttr",
    method: "get",
  });
}
export function _bindAttrs(gid: any,data:Array<any>) {
  return httpRequestWithMsg<AttributeGroupItem>({
    url: "/admin/groupGroup/bind/" + gid,
    method: "post",
    data
  });
}
export function _unbindAttrs(gid: any,data:Array<any>) {
  return httpRequestWithMsg<AttributeGroupItem>({
    url: "/admin/groupGroup/unbind/" + gid,
    method: "post",
    data
  });
}
