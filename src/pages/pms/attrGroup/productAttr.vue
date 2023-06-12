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
                    <el-button type="primary" class="ml-2" @click="handleAdd">{{ buttonTxt }}</el-button>
                </div>
            </template>
        </el-page-header>
        <div class="main-container" style="margin-top: 20px;">
            <el-tabs type="border-card" v-model="tabPosition">
                <el-tab-pane name="bind" label="已绑定列表">
                    <ProductAttrTable :loading="loading" :data="data" @onSelectAttr="onSelectAttr" />
                </el-tab-pane>
                <el-tab-pane name="unbind" label="未绑定列表">
                    <ProductAttrTable :loading="loading" :data="data" @onSelectAttr="onSelectAttr" />
                    <el-pagination background layout="prev, pager, next" :page-count="pages"
                        @current-change="handleCurrentChange" class="pagination-end" />
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-backtop />
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { ProductAttribute, ProductAttributeSearchDto } from '@/api/pms/productAttrApi'
import { _bindAttrs, _unbindAttrs } from '@/api/pms/productAttrGroupApi'
import { _getGroupBindAttribute, _getGroupUnBindAttribute } from '@/api/pms/productAttrApi'
import ProductAttrTable from './components/ProductAttrTable.vue'
import { ElMessage } from 'element-plus'
const props = withDefaults(defineProps<{
    groupId: any,
    type: any
}>(), {
})
const formRef = reactive<Partial<ProductAttributeSearchDto>>({
    pageNo: 1,
    pageSize: 10
})
formRef.type = props.type
const emit = defineEmits(["onBack"])
const loading = ref<boolean>(false)
const data = ref<Array<ProductAttribute | any>>([]);
const selectAttrs = ref<Array<ProductAttribute>>([]);
const pages = ref<number>(0)
const tabPosition = ref<string>('')
const buttonTxt = ref<string>('解绑')
watch(() => tabPosition.value, (val: string) => {
    if (val === 'bind') {
        buttonTxt.value = '解绑'
        getGroupBindAttribute();
    } else if (val === 'unbind') {
        buttonTxt.value = '绑定'
        formRef.pageNo = 1
        getPageLists();
    } else {
        data.value = []
    }
})
tabPosition.value = 'bind'
const getPageLists = () => {
    loading.value = true
    _getGroupUnBindAttribute(props.groupId, formRef as any).then(res => {
        pages.value = res.data.pages
        data.value = res.data.list
    }).finally(() => {
        loading.value = false
    })
}
const getGroupBindAttribute = () => {
    loading.value = true
    _getGroupBindAttribute(props.groupId, props.type).then(res => {
        data.value = res.data
    }).finally(() => {
        loading.value = false
    })
}
const handleCurrentChange = (val: number) => {
    formRef.pageNo = val
    getPageLists();
}
const onSelectAttr = (attrs: Array<ProductAttribute>) => {
    selectAttrs.value = attrs;
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    if (selectAttrs.value.length == 0) {
        ElMessage.warning("请选择");
        return;
    }
    const data = selectAttrs.value.map(item => item.id)
    if (tabPosition.value === 'bind') {
        _unbindAttrs(props.groupId, data).then(_ => {
            getGroupBindAttribute()
        })
    } else if (tabPosition.value === 'unbind') {
        _bindAttrs(props.groupId, data).then(_ => {
            getPageLists();
        })
    }
}
const onBack = () => {
    emit('onBack')
}
</script>
  