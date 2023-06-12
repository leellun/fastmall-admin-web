<template>
    <div aria-label="A complete example of page header">
        <el-page-header @back="onBack">
            <template #content>
                <div class="flex items-center">
                    <span class="text-large font-600 mr-3"> 当前属性值列表 </span>
                </div>
            </template>
            <template #extra>
                <div class="flex items-center">
                    <el-button type="primary" class="ml-2" @click="handleAdd">添加</el-button>
                </div>
            </template>
        </el-page-header>
        <div class="main-container" style="margin-top: 20px;">
            <!-- 查询结果 -->
            <el-table v-loading="loading" :data="data" border fit highlight-current-row>

                <el-table-column align="center" label="属性名" prop="name" />
                <el-table-column align="center" label="属性值" prop="value" />
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

        </div>
        <AddValueModal :id="modalId" :attrId="props.attrId" :value="attrValue" v-model:visible="modalVisible"
            v-if="modalVisible" @ok="handleOk" />
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { GoodsValue, ValueSearchDto } from '@/api/pms/productValueApi'
import { _getProductValuePage, _deleteProductValue } from '@/api/pms/productValueApi'
import AddValueModal from './modals/AddValueModal.vue'
const props = withDefaults(defineProps<{
    attrId?: any,
    type?: any
}>(), {
})
const formRef = reactive<Partial<ValueSearchDto>>({
    pageNo: 1,
    pageSize: 10,
    goodsAttrId: 0
})
const emit = defineEmits(["onBack"])
const modalVisible = ref<boolean>(false)
const modalId = ref<string>()
const attrValue = ref<string>()
const loading = ref<boolean>(false)
const data = ref<Array<GoodsValue | any>>([]);
const pages = ref<number>(0)
formRef.goodsAttrId = props.attrId

const getPageLists = () => {
    loading.value = true
    _getProductValuePage(formRef as any).then(res => {
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
    attrValue.value = undefined
    modalVisible.value = true
}
const handleEditRecord = (record: GoodsValue, e?: Event) => {
    e?.preventDefault()
    modalId.value = record.id
    attrValue.value = record.value
    modalVisible.value = true
}
const handleDeleteRecord = (id: any) => {
    _deleteProductValue([id]).then(res => {
        getPageLists()
    })
}
const handleOk = () => {
    formRef.pageNo = 1
    getPageLists()
};
const onBack = () => {
    emit('onBack')
}
getPageLists()
</script>
  