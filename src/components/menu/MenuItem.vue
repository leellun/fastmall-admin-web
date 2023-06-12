<template>
  <el-sub-menu :index="item.path" v-if="item.children && item.children.length">
    <template #title>
      <el-icon>
        <SvgIcon :name="item.meta.icon" v-if="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </template>
    <menu-item v-for="child in item.children" :key="child.name" :item="child"></menu-item>
  </el-sub-menu>
  <el-menu-item :index="item.path" v-else-if="!item.meta.hidden">
    <SvgIcon :name="item.meta.icon" v-if="item.meta.icon" />
    <template #title>{{ item.meta.title }}</template>
  </el-menu-item>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon/index.vue'
// 给props指定默认值
const props = defineProps<{
  item: any
}>()
</script>

<style lang="" scoped></style>
