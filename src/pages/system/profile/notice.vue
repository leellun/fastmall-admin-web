<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.title" clearable class="filter-item" style="width: 200px;" placeholder="请输入标题关键字" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <div class="operator-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleBatchRead">批量已读</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleBatchDelete">批量删除</el-button>
    </div>

    <el-tabs v-model="listQuery.type" @tab-click="handleFilter">
      <el-tab-pane label="未读通知" name="unread" />
      <el-tab-pane label="已读通知" name="read" />
      <el-tab-pane label="所有通知" name="all" />
    </el-tabs>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="data" fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />

      <el-table-column align="center" label="通知标题" prop="noticeTitle" />

      <el-table-column align="center" label="通知时间" prop="addTime" width="180" />

      <el-table-column align="center" label="通知状态" prop="readTime" width="120">
        <template v-slot="{ row }">
          <el-tag :type="row.readTime ? 'success' : 'error'">{{ row.readTime ? '已读' : '未读' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template v-slot="{ row }">
          <el-button type="primary" @click="handleRead(row)">阅读</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
      class="pagination-end" />

    <el-dialog :title="notice.title" :visible.sync="noticeVisible" center>
      <el-divider content-position="left">{{ notice.admin }} 于 {{ notice.time }} 通知如下内容：</el-divider>
      <div v-html="notice.content"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="afterRead">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { _listNotice, _catNotice, _bcatNotice, _rmNotice, _brmNotice } from '@/api/system/profileApi'
import _ from 'lodash'
import { ElMessage } from 'element-plus'
const total = ref<number>(0)
const listQuery = reactive<Partial<any>>({
  pageNo: 1,
  pageSize: 20,
  title: '',
  type: 'unread',
  order: 'create_time',
  desc: false
});
const multipleSelection = ref<Array<any>>([])
const listLoading = ref(false);
const data = ref<Array<any>>([]);
const notice = ref<any>({
  title: '',
  source: '',
  content: '',
  addTime: ''
})
const noticeVisible = ref<boolean>(false)
const handleCurrentChange = (val: number) => {
  listQuery.pageNo = val
  getList();
}
const getList = () => {
  listLoading.value = true
  _listNotice(listQuery)
    .then(res => {
      total.value = res.data.pages
      data.value = res.data.list
    }).finally(() => {
      listLoading.value = false
    })
}
const handleFilter = () => {
  listQuery.page = 1
  getList()
}

const handleDelete = (row: any) => {
  //删除通知成功
  _rmNotice(row)
    .then(res => {
      getList()
    })
}
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}
const handleBatchDelete = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.error('请选择至少一条记录')
    return
  }
  const ids = new Array<any>()
  _.forEach(multipleSelection.value, function (item) {
    ids.push(item.id)
  })
  //批量删除通知成功
  _brmNotice({ ids: ids })
    .then(res => {
      getList()
    })
}
const handleRead = (row: any) => {
  _catNotice(row)
    .then(res => {
      notice.value = res.data
      noticeVisible.value = true
    })
}
const afterRead = () => {
  noticeVisible.value = false
  getList()
}
const handleBatchRead = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.error('请选择至少一条记录')
    return
  }
  const ids = new Array<any>()
  _.forEach(multipleSelection.value, function (item) {
    ids.push(item.id)
  })
  _bcatNotice({ ids: ids })
    .then(response => {
      //批量设置通知已读成功
      getList()
    })
}
</script>
