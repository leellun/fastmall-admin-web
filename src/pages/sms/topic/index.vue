<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.title" clearable class="filter-item" style="width: 200px;" placeholder="请输入专题标题" />
            <el-input v-model="listQuery.subtitle" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入专题子标题" />
            <el-select v-model="listQuery.order" class="filter-item" placeholder="请选择排序字段">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </div>

        <div class="operator-container">
            <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
            <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleBatchDelete">批量删除</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="data" border fit highlight-current-row
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />

            <el-table-column align="center" label="专题标题" prop="title" />

            <el-table-column align="center" label="专题子标题" min-width="200" prop="subtitle" />

            <el-table-column align="center" property="picUrl" label="图片">
                <template v-slot="{ row }">
                    <el-image :src="thumbnail(row.picUrl)" :preview-src-list="toPreview(row, row.picUrl)"
                        style="width: 40px; height: 40px" />
                </template>
            </el-table-column>

            <el-table-column align="center" label="专题详情" prop="content">
                <template v-slot="{ row }">
                    <el-dialog :visible.sync="contentDialogVisible" title="专题详情">
                        <div v-html="contentDetail" />
                    </el-dialog>
                    <el-button type="primary" @click="showContent(row.content)">查看</el-button>
                </template>
            </el-table-column>

            <el-table-column align="center" label="底价" prop="price" />

            <el-table-column align="center" label="阅读数量" prop="readCount" />

            <el-table-column align="center" label="操作" min-width="100" class-name="small-padding fixed-width">
                <template v-slot="{ row }">
                    <el-button type="primary" @click="handleUpdate(row)">编辑</el-button>
                    <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />
        <el-backtop />
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { Topic, TopicSearch } from '@/api/sms/topicApi'
import { _listTopic, _deleteTopic, _batchDeleteTopic } from '@/api/sms/topicApi'
import _ from 'lodash'
import { thumbnail, toPreview } from '@/utils/index'
import { ElMessage } from 'element-plus'
const router = useRouter()
const listQuery = reactive<Partial<TopicSearch>>({
    pageNo: 1,
    order: 'create_time',
    title: undefined,
    subtitle: undefined,
    desc: true
});
const data = ref<Array<Topic>>([]);
const multipleSelection = ref<Array<any>>([]);
const total = ref<number>(0)
const modalVisible = ref(false);
const listLoading = ref(false);
const contentDetail = ref<string>('')
const contentDialogVisible = ref<boolean>(false)
const options = [{ value: 'id', label: '按序号排序' }, { value: 'create_time', label: '按时间排序' }, { value: 'price', label: '按价格排序' }]
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
}
const getList = () => {
    listLoading.value = true
    _listTopic(listQuery as any).then(res => {
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
const handleDelete = (row: Topic) => {
    _deleteTopic(row.id).then(res => {
        getList()
    })
}
const handleCreate = () => {
    router.push({ name: 'addTopic' })
}
const handleUpdate = (row: Topic) => {
    router.push({ name: 'updateTopic', query: { id: row.id } })
}
const handleSelectionChange = (val: any) => {
    multipleSelection.value = val
}
const showContent = (content: string) => {
    contentDetail.value = content
    contentDialogVisible.value = true
}
const handleBatchDelete = () => {
    if (multipleSelection.value.length === 0) {
        ElMessage.error('请选择至少一条记录')
        return
    }
    const ids = new Array<any>()
    _.forEach(multipleSelection.value, function (item) {
        ids.push(item.id)
    })
    _batchDeleteTopic(ids)
        .then(res => {
            getList()
        })
}
</script>
<style>
.el-dialog {
    width: 800px;
}

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