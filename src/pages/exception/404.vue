<template>
  <el-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <el-button type="primary" @click="toHome">
        返回首页
      </el-button>
    </template>
  </el-result>
</template>

<script setup lang="ts">
import { Router, useRouter } from "vue-router";
let router: Router = useRouter();
const toHome = () => {
  router.push({ path: "/" })
}
</script>