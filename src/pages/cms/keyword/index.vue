<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;" placeholder="请输入关键字" />
      <el-input v-model="listQuery.url" clearable class="filter-item" style="width: 200px;" placeholder="请输入跳转链接" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="data" border fit highlight-current-row>

      <el-table-column align="center" width="150px" label="关键词ID" prop="id" sortable />

      <el-table-column align="center" min-width="100px" label="关键词" prop="keyword" />

      <el-table-column align="center" min-width="300px" label="跳转链接" prop="url" />

      <el-table-column align="center" min-width="100px" label="是否推荐" prop="isHot">
        <template v-slot="{ row }">
          <el-tag :type="row.isHot === 1 ? 'success' : 'error'">{{ row.isHot === 1 ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="是否默认" prop="isDefault">
        <template v-slot="{ row }">
          <el-tag :type="row.isDefault === 1 ? 'success' : 'error'">{{ row.isDefault === 1 ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template v-slot="{ row }">
          <el-button type="primary" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
      class="pagination-end" />
    <keyword-modal v-model:visible="modalVisible" :id="modalId" v-if="modalVisible" @ok="handleOk" />
  </div>
</template>
  
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { KeywordSearch } from '@/api/cms/keywordApi'
import { _listKeyword, _createKeyword, _updateKeyword, _deleteKeyword } from '@/api/cms/keywordApi'
import KeywordModal from './modals/KeywordModal.vue';
const data = ref<Array<any>>([]);
const total = ref<number>(0)
const listLoading = ref(false);
const modalVisible = ref<boolean>(false);
const modalId = ref<any>();
const listQuery = reactive<Partial<KeywordSearch>>({
  pageNo: 1,
  pageSize: 20,
  keyword: undefined,
  url: undefined,
  order: 'create_time',
  desc: true
});
const handleCurrentChange = (val: number) => {
  listQuery.pageNo = val
  getList();
}
const getList = () => {
  listLoading.value = true
  _listKeyword(listQuery as any)
    .then(res => {
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
const handleOk = () => {
  getList()
}
const handleCreate = () => {
  modalId.value = undefined
  modalVisible.value = true
}
const handleUpdate = (row: any) => {
  modalId.value = row.id
  modalVisible.value = true
}
const handleDelete = (row: any) => {
  _deleteKeyword(row.id)
    .then(res => {
      getList()
    })
}
</script>
  