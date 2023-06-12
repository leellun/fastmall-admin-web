<template>
  <el-breadcrumb separator="/">
    <transition-group name="breadcrumb" mode="out-in">
      <el-breadcrumb-item v-for="(item, index) in matched" :key="item.meta.title">
        <template v-if="index === matched.length - 1">{{ item.meta.title }}</template>
        <template v-else>
          <router-link :to="{name:item.name}">{{ item.meta.title }}</router-link>
        </template>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();
const matched = computed(() => {
  let m = router.currentRoute.value.matched
  if (m.length > 1) {
    if (m[0].name === m[m.length - 1].name) {
      m.splice(m.length - 1, 1)
    }
  }
  return m;
});
</script>

<style lang="scss" scoped>
/* Breadcrumb 面包屑过渡动画
------------------------------- */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.3s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
