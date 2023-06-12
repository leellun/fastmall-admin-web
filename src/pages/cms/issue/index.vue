<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.question" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入问题" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="data"  border fit highlight-current-row>
            <el-table-column align="center" width="100px" label="问题ID" prop="id" sortable />

            <el-table-column align="center" min-width="200px" label="问题内容" prop="question" />

            <el-table-column align="center" min-width="400px" label="问题回复" prop="answer" />

            <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
                <template v-slot="{ row }">
                    <el-button type="primary" @click="handleUpdate(row)">编辑</el-button>
                    <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />
        <IssueModal v-model:visible="modalVisible" :id="modalId" v-if="modalVisible" @ok="handleOk" />


    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Issue, IssueSearch } from '@/api/cms/issueApi'
import { _listIssue, _deleteIssue } from '@/api/cms/issueApi'
const data = ref<Array<Issue>>([]);
const total = ref<number>(0)
const listLoading = ref(false);
const modalVisible = ref<boolean>(false);
const modalId = ref<any>();
const listQuery = reactive<Partial<IssueSearch>>({
    pageNo: 1,
    pageSize: 20,
    question: undefined,
    order: 'create_time',
    desc: true
});
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
}
const getList = () => {
    listLoading.value = true
    _listIssue(listQuery as any)
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
    _deleteIssue(row.id)
        .then(res => {
            getList()
        })
}
</script>
  