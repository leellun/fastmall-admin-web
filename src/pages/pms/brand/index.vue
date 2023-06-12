<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌商ID" />
            <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌商名称" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="data"  border fit highlight-current-row>

            <el-table-column align="center" label="品牌商ID" prop="id" />

            <el-table-column align="center" label="品牌商名称" prop="name" />

            <el-table-column align="center" property="picUrl" label="品牌商图片">
                <template v-slot="{ row }">
                    <el-image :src="thumbnail(row.picUrl)" :preview-src-list="[row.picUrl]"
                        style="width: 40px; height: 40px" />
                </template>
            </el-table-column>

            <el-table-column align="center" min-width="400px" label="介绍" prop="description" />

            <el-table-column align="center" label="底价" prop="floorPrice" />

            <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                <template v-slot="{ row }">
                    <el-button type="primary" @click="handleUpdate(row)">编辑</el-button>
                    <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />
        <BrandModal v-model:visible="modalVisible" :id="modalId" v-if="modalVisible" @ok="handleOk" />
    </div>
</template>
  
  
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { BrandSearch, Brand } from '@/api/pms/brandApi'
import { _listBrand, _createBrand, _updateBrand, _deleteBrand } from '@/api/pms/brandApi'
import BrandModal from './modals/BrandModal.vue';
import { thumbnail, toPreview } from '@/utils/index'
const data = ref<Array<Brand>>([]);
const total = ref<number>(0)
const listLoading = ref(false);
const modalVisible = ref<boolean>(false);
const modalId = ref<any>();
const listQuery = reactive<Partial<BrandSearch>>({
    pageNo: 1,
    pageSize: 20,
    id: undefined,
    name: undefined,
    order: 'create_time',
    desc: true
});
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
}
const getList = () => {
    listLoading.value = true
    _listBrand(listQuery as any)
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
    _deleteBrand(row.id)
        .then(res => {
            getList()
        })
}
getList()
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}

.avatar {
    width: 145px;
    height: 145px;
    display: block;
}
</style>