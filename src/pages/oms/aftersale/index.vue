<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.aftersaleSn" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入售后编号" />
            <el-input v-model="listQuery.orderId" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入订单ID" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </div>

        <div class="operator-container">
            <el-button class="filter-item" type="success" icon="el-icon-info" @click="handleBatchRecept">批量通过</el-button>
            <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleBatchReject">批量拒绝</el-button>
        </div>

        <el-tabs v-model="tab" @tab-click="handleClick">
            <el-tab-pane label="全部" name="all" />
            <el-tab-pane label="待审核" name="uncheck" />
            <el-tab-pane label="待退款" name="unrefund" />
        </el-tabs>

        <el-table v-loading="listLoading" :data="data" fit highlight-current-row @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />

            <el-table-column align="center" label="售后编号" prop="aftersaleSn" />
            <el-table-column align="center" label="订单ID" prop="orderId" />
            <el-table-column align="center" label="用户ID" prop="userId" />
            <el-table-column align="center" label="售后类型" prop="type">
                <template v-slot="row">
                    <el-tag :type="typeTag[row.type]">{{ typeDesc[row.type] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="退款原因" prop="reason" />
            <el-table-column align="center" label="退款价格" prop="amount" />
            <el-table-column align="center" label="申请时间" prop="addTime" />

            <el-table-column align="center" label="操作" min-width="120" class-name="small-padding fixed-width">
                <template v-slot="row">
                    <el-button type="primary" @click="handleRead(row)">详情</el-button>
                    <el-button v-if="row.status === 1" type="success" @click="handleRecept(row)">通过</el-button>
                    <el-button v-if="row.status === 1" type="danger" @click="handleReject(row)">拒绝</el-button>
                    <el-button v-if="row.status === 2" type="warning" @click="handleRefund(row)">退款</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />

        <el-backtop />
        <AfterSaleDetailModal v-model:visible="modalVisible" :aftersale-detail="aftersaleDetail" v-if="modalVisible" />
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { AftersaleSearch, Aftersale } from '@/api/oms/aftersaleApi'
import { _listAftersale, _receptAftersale, _batchReceptAftersale, _rejectAftersale, _batchRejectAftersale, _refundAftersale } from '@/api/oms/aftersaleApi'
import _ from 'lodash'
import { ElMessage } from 'element-plus'
import AfterSaleDetailModal from './modals/AfterSaleDetailModal.vue'

const multipleSelection = ref<Array<any>>([]);
const data = ref<Array<Aftersale>>([]);
const total = ref<number>(0)
const listLoading = ref(false);
const modalVisible = ref(false);
const aftersaleDetail = ref<any>();
const tab = ref<string>('all')
const typeTag = ['', 'success', 'warning']
const typeDesc = ['未收货退款', '不退货退款', '退货退款']
const listQuery = reactive<Partial<AftersaleSearch>>({
    pageNo: 1,
    pageSize: 20,
    aftersaleSn: undefined,
    orderId: undefined,
    status: undefined,
    order: 'create_time',
    desc: true
});
const getList = () => {
    listLoading.value = true
    _listAftersale(listQuery as any)
        .then(res => {
            total.value = res.data.pages
            data.value = res.data.list
        }).finally(() => {
            listLoading.value = false
        })
}
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
}
const handleFilter = () => {
    listQuery.pageNo = 1
    getList()
}
const handleSelectionChange = (val: Array<any>) => {
    multipleSelection.value = val
}
const handleClick = () => {
    if (tab.value === 'all') {
        listQuery.status = undefined
    } else if (tab.value === 'uncheck') {
        listQuery.status = 1
    } else if (tab.value === 'unrefund') {
        listQuery.status = 2
    }
    getList()
}
const handleRecept = (row: any) => {
    _receptAftersale(row)
        .then(res => {
            getList()
        })
}
const handleBatchRecept = () => {
    if (multipleSelection.value.length === 0) {
        ElMessage.error('请选择至少一条记录')
        return
    }
    const ids = new Array<any>()
    _.forEach(multipleSelection.value, function (item) {
        ids.push(item.id)
    })
    _batchReceptAftersale(ids)
        .then(res => {
            getList()
        })
}
const handleReject = (row: any) => {
    _rejectAftersale(row)
        .then(res => {
            getList()
        })
}
const handleBatchReject = () => {
    if (multipleSelection.value.length === 0) {
        ElMessage.error('请选择至少一条记录')
        return
    }
    const ids = new Array<any>()
    _.forEach(multipleSelection.value, function (item) {
        ids.push(item.id)
    })
    _batchRejectAftersale(ids)
        .then(res => {
            getList()
        })
}
const handleRefund = (row: any) => {
    _refundAftersale(row)
        .then(res => {
            getList()
        })
}
const handleRead = (row: any) => {
    aftersaleDetail.value = row;
    modalVisible.value = true
}
</script>
  