<template>
  <div id="tags-view-container" class="tags-view-container" ref="tagsView">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <div v-for="tag in visitedViews" ref="tag" :key="tag.fullPath" :class="isActive(tag) ? 'active' : ''" tag="span"
        class="tags-view-item" :style="activeStyle(tag)" @click.stop="jumpMenu(tag)"
        @contextmenu.prevent.native="openMenu(tag, $event)">
        {{ tag.meta.title }}

        <el-icon v-if="isActive(tag)" @click.prevent.stop="refreshSelectedTag(selectedTag)" class="el-icon-refresh">
          <RefreshRight />
        </el-icon>
        <el-icon v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)">
          <CloseBold />
        </el-icon>
      </div>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <el-icon>
          <RefreshRight />
        </el-icon> 刷新页面
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <el-icon>
          <Close />
        </el-icon> 关闭当前
      </li>
      <li @click="closeOthersTags(selectedTag)">
        <el-icon>
          <CircleClose />
        </el-icon> 关闭其他
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags(selectedTag)">
        <el-icon>
          <Back />
        </el-icon> 关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags(selectedTag)">
        <el-icon>
          <Right />
        </el-icon> 关闭右侧
      </li>
      <li @click="closeAllTags">
        <el-icon>
          <CircleClose />
        </el-icon> 全部关闭
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from "vue";
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from "vue-router";
import {
  CloseBold,
  RefreshRight,
  Close,
  CircleClose,
  Back,
  Right,
} from "@element-plus/icons-vue";
import ScrollPane from "@/components/ScrollPane.vue";
import events from '@/utils/eventBus'
const route = useRoute();
const router = useRouter();
const tagsView = ref();
const left = ref<number>();
const top = ref<number>();
const visible = ref(false);
let selectedTag = reactive({} as any);
const visitedViews = ref<Array<RouteLocationNormalizedLoaded>>([]);

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener("click", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
  }
});

const isActive = (tag: any) => {
  return tag.fullPath === route.fullPath;
};
const isAffix = (tag: any) => {
  return tag.affix;
};

const isFirstView = () => {
  try {
    return (
      selectedTag.fullPath === visitedViews.value[0].fullPath
    );
  } catch (err) {
    return false;
  }
};
const isLastView = () => {
  try {
    return (
      selectedTag.fullPath ===
      visitedViews.value[visitedViews.value.length - 1]
    );
  } catch (err) {
    return false;
  }
};
// 选项卡选中样式
const activeStyle = (tag: any) => {
  if (!isActive(tag)) return {};
  return {
    "background-color": "#409EFF",
    "border-color": "#409EFF",
  };
};
// 跳转页面
const jumpMenu = (tag: any) => {
  let fullPath = tag.fullPath;
  if (fullPath.includes("/redirect")) return;
  router.push(fullPath);
};
events.once('closeSelectedTag', () => {
  closeSelectedTag(router.currentRoute)
})
// 关闭当前项
const closeSelectedTag = (tag: any) => {
  closeMenu();
  if (visitedViews.value.length <= 1) return;
  let preTag = getTagIndex(tag);
  visitedViews.value.splice(preTag, 1);
  jumpMenu(visitedViews.value[(preTag - 1 + visitedViews.value.length) % visitedViews.value.length]);
  notifyViewsTags([tag.fullPath])
};
const notifyViewsTags = (fullPaths:Array<string>|any) => {
  events.emit("onTagsViewUpdateRouterView", fullPaths)
}
const getTagIndex = (tag: any) => {
  return visitedViews.value.findIndex(item => item.fullPath === tag.fullPath);
}
// 打开下拉菜单
const openMenu = (tag: any, e: any) => {
  const menuMinWidth = 105;
  const offsetLeft = tagsView.value.getBoundingClientRect().left; // container margin left
  const offsetWidth = tagsView.value.offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const l = e.clientX - offsetLeft + 15; // 15: margin right
  if (l > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = l;
  }
  top.value = e.clientY - 60;
  visible.value = true;
  selectedTag = tag;
};
// 隐藏下拉项
const closeMenu = () => {
  visible.value = false;
};

// 滚动隐藏下拉菜单
const handleScroll = () => {
  closeMenu();
};

// 刷新
const refreshSelectedTag = (tag: any) => {
  events.emit("onTagsViewRefreshRouterView", tag.fullPath)
};
// 关闭其他项
const closeOthersTags = (tag: any) => {
  closeMenu();
  visitedViews.value = [tag];
  // 关闭项不是打开项，则跳转
  if (tag.fullPath != route.fullPath) {
    let fullPaths = visitedViews.value.filter((item, i) => item.fullPath != route.fullPath).map(item => item.fullPath)
    notifyViewsTags(fullPaths)
    jumpMenu(tag);
  }
};
// 关闭左边
const closeLeftTags = (tag: any) => {
  closeMenu();
  let index = getTagIndex(tag);
  if (index >= 0) {
    let fullPaths = visitedViews.value.filter((item, i) => i < index).map(item => item.fullPath)
    notifyViewsTags(fullPaths)
    visitedViews.value.splice(0, index)
  }
  // 关闭项不是打开项，则跳转
  if (tag.fullPath != route.fullPath) {
    jumpMenu(tag);
  }
};
// 关闭右边
const closeRightTags = (tag: any) => {
  closeMenu();
  let index = getTagIndex(tag);
  if (index >= 0) {
    let fullPaths = visitedViews.value.filter((item, i) => i > index ).map(item => item.fullPath)
    notifyViewsTags(fullPaths)
    visitedViews.value.splice(index + 1, visitedViews.value.length - 1 - index)
  }
  // 关闭项不是打开项，则跳转
  if (tag.fullPath != route.fullPath) {
    jumpMenu(tag);
  }
};
// 关闭所有
const closeAllTags = () => {
  closeMenu();
  visitedViews.value = []
};
visitedViews.value.push(router.currentRoute.value)
watch(
  () => router.currentRoute.value,
  (newVal) => {
    let index = visitedViews.value.findIndex(item => item.fullPath === newVal.fullPath)
    if (index == -1) {
      visitedViews.value.push(newVal)
    }
  }
)
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    :deep(.el-scrollbar__view) {
      display: flex;
    }

    .tags-view-item {
      display: flex;
      width: fit-content;
      align-items: center;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}

//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {

    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      margin-left: 2px;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }

    .el-icon-refresh {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      margin-left: 2px;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
