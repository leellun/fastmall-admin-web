<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.goodsId" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入商品编号" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="data" border fit highlight-current-row>
            <el-table-column align="center" label="团购规则ID" prop="id" />

            <el-table-column align="center" label="商品ID" prop="goodsId" />

            <el-table-column align="center" min-width="100" label="名称" prop="goodsName" />

            <el-table-column align="center" property="picUrl" label="图片">
                <template v-slot="{ row }">
                    <img :src="row.picUrl" width="40">
                </template>
            </el-table-column>

            <el-table-column align="center" label="团购优惠" prop="discount" />

            <el-table-column align="center" label="团购要求" prop="discountMember" />

            <el-table-column align="center" label="状态" prop="status">
                <template v-slot="{ row }">
                    <el-tag :type="row.status === 0 ? 'success' : 'error'">{{ statusMap[row.status] }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="结束时间" prop="expireTime" />

            <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                <template v-slot="{ row }">
                    <el-button type="primary" @click="handleUpdate(row)">编辑</el-button>
                    <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />
        <el-backtop />
        <GroupRuleModal v-model:visible="modalVisible" :groupon="groupon" v-if="modalVisible" @ok="handleOk" />
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { GrouponRules } from '@/api/sms/grouponApi'
import { _listGroupon, _publishGroupon, _deleteGroupon, _editGroupon } from '@/api/sms/grouponApi'
import GroupRuleModal from './modals/GroupRuleModal.vue';

const data = ref<Array<GrouponRules>>([]);
const total = ref<number>(0)
const statusMap = [
    '正常',
    '到期下线',
    '提前下线'
]
const listQuery = reactive<Partial<any>>({
    pageNo: 1,
    order: 'create_time',
    goodsId: undefined,
    desc: true
});
const modalVisible = ref(false);
const groupon = ref<GrouponRules>();
const listLoading = ref(false);
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
}
const getList = () => {
    listLoading.value = true
    _listGroupon(listQuery as any).then(res => {
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
const handleDelete = (row: GrouponRules) => {
    _deleteGroupon(row.id).then(res => {
        getList()
    })
}
const handleCreate = () => {
    modalVisible.value = true
    groupon.value = undefined
}
const handleUpdate = (row: GrouponRules) => {
    modalVisible.value = true
    groupon.value = row
}
const handleOk = () => {
    getList()
}
getList()
</script>
  