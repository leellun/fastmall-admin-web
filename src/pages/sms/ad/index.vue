<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入广告标题" />
            <el-input v-model="listQuery.content" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入广告内容" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="data" border fit highlight-current-row>

            <el-table-column align="center" label="广告ID" prop="id" sortable />

            <el-table-column align="center" label="广告标题" prop="name" />

            <el-table-column align="center" label="广告内容" prop="content" />

            <el-table-column align="center" label="广告图片" prop="url">
                <template v-slot="{ row }">
                    <el-image :src="thumbnail(row.url)" :preview-src-list="[row.url]" :preview-teleported="true"
                        style="width: 80px; height: 40px" />
                </template>
            </el-table-column>

            <el-table-column align="center" label="广告位置" prop="position" />

            <el-table-column align="center" label="活动链接" prop="link" />

            <el-table-column align="center" label="是否启用" prop="enabled">
                <template v-slot="{ row }">
                    <el-tag :type="row.enabled ? 'success' : 'error'">{{ row.enabled ? '启用' : '不启用' }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                <template v-slot="{ row }">
                    <el-button type="primary" @click="handleUpdate(row)">编辑</el-button>
                    <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />
        <AdModal v-model:visible="modalVisible" :id="modalId" v-if="modalVisible" @ok="handleOk" />
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { AdSearch,Ad } from '@/api/sms/adApi'
import { _listAd, _createAd, _updateAd, _deleteAd } from '@/api/sms/adApi'
import { thumbnail, toPreview } from '@/utils/index'
import AdModal from './modals/AdModal.vue'
const data = ref<Array<Ad>>([]);
const total = ref<number>(0)
const listLoading = ref(false);
const modalVisible = ref<boolean>(false);
const modalId = ref<any>();
const listQuery = reactive<Partial<AdSearch>>({
    pageNo: 1,
    pageSize: 20,
    name: undefined,
    content: undefined,
    order: 'create_time',
    desc: true
});
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
}
const getList = () => {
    listLoading.value = true
    _listAd(listQuery as any)
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
    _deleteAd(row.id)
        .then(res => {
            getList()
        })
}
getList()
</script>
<style lang="scss" scoped>

</style>