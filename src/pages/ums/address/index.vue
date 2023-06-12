<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入用户ID" />
            <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入收货人名称" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="data"  border fit highlight-current-row>
            <el-table-column align="center" width="100px" label="地址ID" prop="id" sortable />

            <el-table-column align="center" min-width="100px" label="用户ID" prop="userId" />

            <el-table-column align="center" min-width="100px" label="收货人名称" prop="name" />

            <el-table-column align="center" min-width="100px" label="手机号码" prop="tel" />

            <el-table-column align="center" min-width="300px" label="区域地址">
                <template v-slot="{row}">
                    {{ row.province + row.city + row.county }}
                </template>
            </el-table-column>

            <el-table-column align="center" min-width="300px" label="详细地址" prop="addressDetail" />

            <el-table-column align="center" min-width="80px" label="默认" prop="isDefault">
                <template v-slot="{row}">
                    {{ row.isDefault ? '是' : '否' }}
                </template>
            </el-table-column>

        </el-table>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />

    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { AddressSearch,Address } from '@/api/ums/userApi'
import { _listAddress } from '@/api/ums/userApi'
const data = ref<Array<Address>>([]);
const total = ref<number>(0)
const listQuery = reactive<Partial<AddressSearch>>({
    pageNo: 1,
    order: 'create_time',
    userId: undefined,
    name: ''
});
const listLoading = ref(false);
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
}
const getList = () => {
    listLoading.value = true
    _listAddress(listQuery as any).then(res => {
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
  