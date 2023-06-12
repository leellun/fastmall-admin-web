import { httpRequest, httpRequestWithMsg } from "@/utils/request";
export interface Info {
  userTotal: number;
  goodsTotal: number;
  productTotal: number;
  orderTotal: number;
}
export function _info() {
  return httpRequest<Info>({
    url: "/admin/dashboard",
    method: "get"
  });
}
