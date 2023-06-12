<template>
    <div class="app-container">
  
      <!-- 查询和其他操作 -->
      <div class="filter-container">
        <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名"/>
        <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入反馈ID"/>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      </div>
  
      <!-- 查询结果 -->
      <el-table v-loading="listLoading" :data="data"  border fit highlight-current-row>
  
        <el-table-column align="center" label="反馈ID" prop="id"/>
  
        <el-table-column align="center" label="用户名" prop="username"/>
  
        <el-table-column align="center" label="手机号码" prop="mobile"/>
  
        <el-table-column align="center" label="反馈类型" prop="feedType"/>
  
        <el-table-column align="center" label="反馈内容" prop="content"/>
  
        <el-table-column align="center" label="反馈图片" prop="picUrls">
          <template v-slot="{row}">
            <el-image v-for="item in row.picUrls" :key="item" :src="item" :preview-src-list="row.picUrls" :lazy="true" style="width: 40px; height: 40px; margin-right: 5px;"/>
          </template>
        </el-table-column>
  
        <el-table-column align="center" label="时间" prop="createTime"/>
  
      </el-table>
  
      <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />
  
    </div>
  </template>
  <script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import type { FeedbackSearch,Feedback } from '@/api/ums/userApi'
  import { _listFeedback } from '@/api/ums/userApi'
  const data = ref<Array<Feedback>>([]);
  const total = ref<number>(0)
  const listQuery = reactive<Partial<FeedbackSearch>>({
      pageNo: 1,
      order: 'create_time',
      userId: undefined,
      username: ''
  });
  const listLoading = ref(false);
  const handleCurrentChange = (val: number) => {
      listQuery.pageNo = val
      getList();
  }
  const getList = () => {
      listLoading.value = true
      _listFeedback(listQuery as any).then(res => {
          total.value = res.data.pages
          data.value = res.data.list
      }).finally(() => {
          listLoading.value = false
      })
  }
  const handleFilter = () => {
      listQuery.pageNo = 1
      getList()
  }
  getList()
  </script>
  