<template>
  <el-result status="500" title="500" sub-title="Sorry, the server is reporting an error.">
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
