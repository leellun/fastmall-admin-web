import { TRouter } from "./types";
import { rootRouter } from './basicRouter'

export default [
  rootRouter,
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue')
  },
  {
    path: "/:path(.*)",
    name: "NoMatch",
    component: () => import("@/pages/exception/404.vue"),
  },
] as TRouter[];
