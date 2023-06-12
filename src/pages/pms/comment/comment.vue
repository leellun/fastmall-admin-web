<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户ID" />
      <el-input v-model="listQuery.valueId" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品ID" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="data"  border fit highlight-current-row>

      <el-table-column align="center" label="用户ID" prop="userId" />

      <el-table-column align="center" label="商品ID" prop="valueId" />

      <el-table-column align="center" label="打分" prop="star" />

      <el-table-column align="center" label="评论内容" prop="content" />

      <el-table-column align="center" label="评论图片" prop="picUrls">
        <template v-slot="{row}">
          <el-image v-for="item in row.picUrls" :key="item" :src="item" :preview-src-list="row.picUrls"
            :lazy="true" style="width: 40px; height: 40px; margin-right: 5px;" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="时间" prop="addTime" />

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template v-slot="{row}">
          <el-button type="primary" @click="handleReply(row)">回复</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
      class="pagination-end" />

    <!-- 评论回复 -->
    <el-dialog :visible.sync="replyFormVisible" title="回复">
      <el-form ref="replyForm" :model="replyForm" status-icon label-position="left" label-width="100px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="回复内容" prop="content">
          <el-input v-model="replyForm.content" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replyFormVisible = false">取消</el-button>
        <el-button type="primary" @click="reply">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { CommentSearch,Comment } from '@/api/pms/commentApi'
import { _listComment, _deleteComment } from '@/api/pms/commentApi'
import type { OrderReplyDTO } from '@/api/oms/orderApi'
import { _replyComment } from '@/api/oms/orderApi'

const listQuery = reactive<Partial<CommentSearch>>({
  pageNo: 1,
  pageSize: 20,
  userId: undefined,
  valueId: undefined,
  order: 'create_time',
  desc: true
});
const replyForm = ref<OrderReplyDTO>({
  commentId: 0,
  content: ''
})
const replyFormVisible = ref(false);
const data = ref<Array<Comment>>([]);
const total = ref<number>(0)
const listLoading = ref(false);
const handleCurrentChange = (val: number) => {
  listQuery.pageNo = val
  getList();
}
const getList = () => {
  listLoading.value = true
  _listComment(listQuery as any).then(res => {
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

const handleReply = (row: any) => {
  replyForm.value = { commentId: row.id, content: '' }
  replyFormVisible.value = true
}
const reply = () => {
  _replyComment(replyForm.value).then(res => {
    replyFormVisible.value = false
  })
}
const handleDelete = (row: any) => {
  _deleteComment(row).then(res => {
    getList()
  })
}
getList()
</script>
