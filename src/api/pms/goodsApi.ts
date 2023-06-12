import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch, BaseEntity, SortEntity } from "../types";
export interface GoodsSearch extends PageSearch, SortEntity {
  goodsId: any;
  goodsSn: string;
  name: string;
}
export interface Goods extends BaseEntity {
  goodsSn: string;
  name: string;
  categoryId: any;
  goodsGroupId: any;
  brandId: any;
  gallery: string[];
  keywords: string[];
  brief: string;
  isOnSale: number;
  sortOrder: number;
  isNew: number;
  isHot: number;
  counterPrice: number;
  retailPrice: number;
  picUrl: string;
  shareUrl: string;
  unit: string;
  detail: string; //商品详细介绍，是富文本格式
}
export interface GoodsSpecification extends BaseEntity {
  goodsId: any;
  saleAttrId: any;
  goodsAttrId: any;
  goodsValueId: any;
  name: string;
  value: string;
  picUrl: string;
}
export interface GoodsAttributeValue extends BaseEntity {
  goodsId: any;
  goodsAttrId: any;
  name: string;
  value: string;
}
export interface GoodsProduct extends BaseEntity {
  goodsId: any;
  specifications: Array<string>;
  price: number;
  number: number;
  url: string;
}
export interface GoodsProductSpecRelation extends BaseEntity {
  specId: any;
  productId: any;
  itemSort: number;
  name: string;
  value: string;
}
export interface GoodsProductVo extends GoodsProduct{
  goodsProductSpecRelations:Array<GoodsProductSpecRelation>
}
export interface GoodsAllinoneDTO {
  goods: Goods;
  goodsSaleAttrVos: Array<GoodsSaleAttrVo>;
  attributes: GoodsAttributeValue[];
  products: GoodsProductVo[];
}
export interface GoodsAllinoneVO extends GoodsAllinoneDTO {
  categoryIds: Array<any>;
}
export interface CateVO {
  value: any;
  label: string;
  children: Array<CateVO>;
}
export interface BrandVO {
  value: any;
  label: string;
}
export interface BrandAndCategoryVO {
  categoryList: Array<CateVO>;
  brandList: Array<BrandVO>;
}
export interface GoodsSaleAttr extends BaseEntity{
  goodsId: any;
  goodsAttrId: any;
  name: string;
  picUrl: string;
}
export interface GoodsSaleAttrVo extends GoodsSaleAttr {
  goodsSpecs: Array<GoodsSpecification>;
}
export function _listGoods(query: GoodsSearch) {
  return httpRequest<Page<Goods>>({
    url: "/admin/goods",
    method: "get",
    params: query,
  });
}

export function _deleteGoods(id: any) {
  return httpRequestWithMsg({
    url: `/admin/goods/${id}`,
    method: "delete",
  });
}

export function _publishGoods(data: GoodsAllinoneDTO) {
  return httpRequestWithMsg({
    url: "/admin/goods",
    method: "post",
    data,
  });
}

export function _detailGoods(id: any) {
  return httpRequest<GoodsAllinoneVO>({
    url: `/admin/goods/${id}`,
    method: "get",
  });
}

export function _editGoods(id: any, data: GoodsAllinoneDTO) {
  return httpRequestWithMsg({
    url: `/admin/goods/${id}`,
    method: "put",
    data,
  });
}

export function _listCatAndBrand() {
  return httpRequest<BrandAndCategoryVO>({
    url: "/admin/goods/catAndBrand",
    method: "get",
  });
}
