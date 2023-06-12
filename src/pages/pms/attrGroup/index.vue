<template>
    <div class="main-container" v-if="!attrPageVisible">
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <el-button class="filter-item" type="primary" @click="handleAdd">添加</el-button>
        </div>
        <!-- 查询结果 -->
        <el-table v-loading="loading" :data="data" border fit highlight-current-row>

            <el-table-column align="center" label="属性分组" prop="name" />
            <el-table-column align="center" label="属性数量" prop="attributeCount" />
            <el-table-column align="center" label="参数数量" prop="paramCount" />
            <el-table-column align="center" label="设置" prop="setting">
                <template v-slot="{ row }">
                    <el-button slot="reference" class="gap-left10" link type="primary"
                        @click="getAttrList(row)">属性列表</el-button>
                    <el-button slot="reference" class="gap-left10" link type="primary"
                        @click="getParamList(row)">参数列表</el-button>
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

        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />
        <el-backtop />

        <AddOrUpdateProductAttrCate :id="modalId" :name="attrName" v-model:visible="modalVisible" v-if="modalVisible" @ok="handleOk" />
    </div>
    <ProductAttr v-else :groupId="modalId" :type="groupType" @onBack="onBack"/>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { PageSearch } from '@/api/types'
import { _getPageAttrGroup, _createProductAttrGroup, _deleteProductAttrGroup, _updateProductAttrGroup } from '@/api/pms/productAttrGroupApi'
import type { AttributeGroup } from '@/api/pms/productAttrGroupApi'
import AddOrUpdateProductAttrCate from './modals/AddOrUpdateProductAttrCate.vue'
import ProductAttr from './productAttr.vue'
const attrPageVisible = ref<boolean>(false)
const modalVisible = ref<boolean>(false)
const modalId = ref<string>()
const groupType = ref<number>()
const attrName = ref<string>()
const data = ref<Array<AttributeGroup | any>>([]);
const total = ref<number>(0)
const formRef = reactive<Partial<PageSearch>>({})
const loading = ref<boolean>(false)
const router = useRouter()
const getPageLists = () => {
    loading.value = true
    _getPageAttrGroup(formRef as PageSearch).then(res => {
        total.value = res.data.pages
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
const handleEditRecord = (record: AttributeGroup, e?: Event) => {
    e?.preventDefault()
    modalId.value = record.id
    attrName.value = record.name
    modalVisible.value = true
}
const getAttrList = (record: AttributeGroup) => {
    groupType.value=0
    modalId.value = record.id
    attrPageVisible.value = true
    // router.push({ name: 'productAttr', query: { cid: row.id, cname: row.name, type: 0 } })

}
const getParamList = (record: AttributeGroup) => {
    groupType.value=1
    modalId.value = record.id
    attrPageVisible.value = true
    // router.push({ name: 'productParam', query: { cid: row.id, cname: row.name, type: 1 } })

}
const handleDeleteRecord = (id: string) => {
    _deleteProductAttrGroup(id).then(res => {
        getPageLists()
    })
}
const handleOk = () => {
    formRef.pageNo = 1
    getPageLists()
};
const onBack = () => {
    attrPageVisible.value = false
}
formRef.pageNo = 1
getPageLists()
</script>
<style lang="scss" scoped></style>