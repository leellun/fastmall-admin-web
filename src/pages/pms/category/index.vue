<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="data"  border fit highlight-current-row
            row-key="id">

            <el-table-column align="center" label="类目ID" prop="id" />

            <el-table-column align="center" label="类目名" prop="name" />

            <el-table-column align="center" property="iconUrl" label="类目图标">
                <template v-slot="{ row }">
                    <img v-if="row.iconUrl" :src="row.iconUrl" width="40">
                </template>
            </el-table-column>

            <el-table-column align="center" property="picUrl" label="类目图片">
                <template v-slot="{ row }">
                    <el-image :src="thumbnail(row.picUrl)" :preview-src-list="[row.picUrl]"
                        style="width: 80px; height: 40px" :preview-teleported="true"/>
                </template>
            </el-table-column>

            <el-table-column align="center" label="关键字" prop="keywords" />

            <el-table-column align="center" min-width="100" label="简介" prop="desc" />

            <el-table-column align="center" label="级别" prop="level">
                <template v-slot="{ row }">
                    <el-tag :type="row.level === 'L1' ? 'success' : 'info'">{{ row.level === 'L1' ? '一级类目' : '二级类目'
                    }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                <template v-slot="{ row }">
                    <el-button type="primary" @click="handleUpdate(row)">编辑</el-button>
                    <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <CategoryModal v-model:visible="modalVisible" :id="modalId" v-if="modalVisible" @ok="handleOk" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { CategoryVO } from '@/api/pms/categoryApi'
import { _listCategory, _deleteCategory } from '@/api/pms/categoryApi'
import { thumbnail, toPreview } from '@/utils/index'
import CategoryModal from './modals/CategoryModal.vue'

const data = ref<Array<CategoryVO>>([]);
const listLoading = ref(false);
const modalVisible = ref<boolean>(false);
const modalId = ref<any>();
const getList = () => {
    listLoading.value = true
    _listCategory()
        .then(res => {
            data.value = res.data
        }).finally(() => {
            listLoading.value = false
        })
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
    _deleteCategory(row.id)
        .then(res => {
            getList()
        })
}

getList()
</script>
<style scoped>
</style>