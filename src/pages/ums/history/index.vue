<template>
    <div class="app-container calendar-list-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入用户ID" />
            <el-input v-model="listQuery.keyword" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入搜索历史关键字" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="data"  border fit highlight-current-row>
            <el-table-column align="center" width="100px" label="搜索ID" prop="id" sortable />

            <el-table-column align="center" min-width="100px" label="用户ID" prop="userId" />

            <el-table-column align="center" min-width="100px" label="关键字" prop="keyword" />

            <el-table-column align="center" min-width="100px" label="添加时间" prop="createTime" />
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />

    </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { HistorySearch,SearchHistory } from '@/api/ums/userApi'
import { _listHistory } from '@/api/ums/userApi'
const data = ref<Array<SearchHistory>>([]);
const total = ref<number>(0)
const listQuery = reactive<Partial<HistorySearch>>({
    pageNo: 1,
    order: 'create_time',
    userId: undefined,
    keyword: undefined
});
const listLoading = ref(false);
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
}
const getList = () => {
    listLoading.value = true
    _listHistory(listQuery as any).then(res => {
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