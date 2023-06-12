<template>
    <div class="main-container" v-if="!attrValuePageVisible">
        <!-- 查询和其他操作 -->
        <div class="table-operator" style="border-top: 5px">
            <el-select v-model="formRef.type" placeholder="请选择">
                <el-option :key="0" :value="0" label="规格" />
                <el-option :key="1" :value="1" label="参数" />
            </el-select>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleAdd">添加</el-button>
        </div>
        <!-- 查询结果 -->
        <el-table v-loading="loading" :data="data" border fit highlight-current-row>

            <el-table-column align="center" label="属性名" prop="name" />
            <el-table-column align="center" label="选择类型" prop="selectType">
                <template v-slot="{ row }">
                    {{ selectTypeStr(row) }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="分类筛选样式" prop="filterType">
                <template v-slot="{ row }">
                    {{ row.filterType === 1 ? '多选' : '普通' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="检索类型" prop="searchType">
                <template v-slot="{ row }">
                    {{ searchTypeStr(row) }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="支持手动新增" prop="handAddStatus">
                <template v-slot="{ row }">
                    {{ row.handAddStatus === 1 ? '支持' : '不支持' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="属性的类型" prop="type">
                <template v-slot="{ row }">
                    {{ row.type === 0 ? '规格' : '参数' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否有图片" prop="hasPic">
                <template v-slot="{ row }">
                    {{ row.hasPic === 1 ? '有' : '无' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="录入方式" prop="inputType">
                <template v-slot="{ row }">
                    <span v-if="row.inputType === 0">手工录入</span>
                    <el-button v-else slot="reference"  link type="primary"
                        @click="handleAttrList(row.id)">列表选择</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
                <template v-slot="{ row }">
                    <el-button type="primary" @click="handleEditRecord(row)">编辑</el-button>

                    <el-popconfirm title="确定删除吗？" @confirm="handleDeleteRecord(row.id)">
                        <template #reference>
                            <el-button slot="reference" class="gap-left10" link type="primary">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :page-count="pages" @current-change="handleCurrentChange"
            class="pagination-end" />
        <el-backtop />

        <AndOrUpdateAttr :id="modalId" v-model:visible="modalVisible" v-if="modalVisible" @ok="handleOk" />
    </div>
    <AttrValue :attrId="modalId" v-else @onBack="onBack"/>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import type { ProductAttribute, ProductAttributeSearchDto } from '@/api/pms/productAttrApi'
import { _getProductAttrPage, _deleteProductAttr } from '@/api/pms/productAttrApi'
import AndOrUpdateAttr from './modals/AndOrUpdateAttr.vue'
import AttrValue from './AttrValue.vue'
const modalVisible = ref<boolean>(false)
const attrValuePageVisible = ref<boolean>(false)
const modalId = ref<any>()
const attrName = ref<string>()
const data = ref<Array<ProductAttribute | any>>([]);
const pages = ref<number>(0)
const formRef = reactive<Partial<ProductAttributeSearchDto>>({
    pageNo: 1,
    pageSize: 10,
    type: 0
})
const loading = ref<boolean>(false)

const searchTypeStr = (record: ProductAttribute) => {
    switch (record.searchType) {
        case 0: return '不需要进行检索'
        case 1: return '关键字检索'
        case 2: return '范围检索'
        default: return '';
    }
}
const selectTypeStr = (record: ProductAttribute) => {
    switch (record.selectType) {
        case 0: return '唯一'
        case 1: return '单选'
        case 2: return '多选'
        default: return '';
    }
}
const getPageLists = () => {
    loading.value = true
    _getProductAttrPage(formRef as any).then(res => {
        pages.value = res.data.pages
        data.value = res.data.list
    }).finally(() => {
        loading.value = false
    })
}
const handleCurrentChange = (val: number) => {
    formRef.pageNo = val
    getPageLists();
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    modalId.value = undefined
    attrName.value = undefined
    modalVisible.value = true
}
const handleEditRecord = (record: ProductAttribute, e?: Event) => {
    e?.preventDefault()
    modalId.value = record.id
    attrName.value = record.name
    modalVisible.value = true
}
const handleDeleteRecord = (id: any) => {
    _deleteProductAttr([id]).then(res => {
        getPageLists()
    })
}
const handleAttrList = (id: any) => {
    modalId.value = id
    attrValuePageVisible.value = true
}
const handleFilter = () => {
    formRef.pageNo = 1
    getPageLists()
};
const handleOk = () => {
    formRef.pageNo = 1
    getPageLists()
};
const onBack = () => {
    attrValuePageVisible.value = false
}
formRef.pageNo = 1
getPageLists()
</script>
<style lang="scss" scoped></style>