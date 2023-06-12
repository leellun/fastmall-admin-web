<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.grouponRuleId" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入团购规则ID" />
            <el-button class="filter-item" type="primary"
                icon="el-icon-search" @click="handleFilter">查找</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="data" border fit highlight-current-row>

            <el-table-column type="expand">
                <template v-slot="{ row }">
                    <el-table :data="row.subGroupons" border style="width: 100%">
                        <el-table-column align="center" label="订单ID" prop="orderId" />
                        <el-table-column align="center" label="用户ID" prop="userId" />
                    </el-table>
                </template>
            </el-table-column>

            <el-table-column align="center" label="订单ID" prop="groupon.orderId" />

            <el-table-column align="center" label="用户ID" prop="groupon.userId" />

            <el-table-column align="center" label="参与人数" prop="subGroupons.length" />

            <el-table-column align="center" label="团购折扣" prop="rules.discount" />

            <el-table-column align="center" label="团购要求" prop="rules.discountMember" />

            <el-table-column align="center" property="iconUrl" label="分享图片">
                <template v-slot="{ row }">
                    <img :src="row.groupon.shareUrl" width="40">
                </template>
            </el-table-column>

            <el-table-column align="center" label="开始时间" prop="rules.createTime" />

            <el-table-column align="center" label="结束时间" prop="rules.expireTime" />
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />

        <el-backtop />
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { GrouponListItemVO,RecordSearch } from '@/api/sms/grouponApi'
import { _listRecord } from '@/api/sms/grouponApi'
const data = ref<Array<GrouponListItemVO>>([]);
const total = ref<number>(0)
const listQuery = reactive<Partial<RecordSearch>>({
    pageNo: 1,
    order: 'create_time',
    grouponRuleId: undefined,
});
const listLoading = ref(false);
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
}
const getList = () => {
    listLoading.value = true
    _listRecord(listQuery as any).then(res => {
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
<style>
.table-expand {
    font-size: 0;
}

.table-expand label {
    width: 100px;
    color: #99a9bf;
}

.table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
}

.gallery {
    width: 80px;
    margin-right: 10px;
}
</style>