<template>
    <el-tabs type="border-card" v-model="tabPosition">
        <el-tab-pane name="bind" label="已选择列表">
            <el-table :data="props.value">
                <el-table-column prop="name" label="商品参数名称" />
                <el-table-column prop="value" label="商品参数值">
                    <template v-slot="{ row }">
                        <el-input v-model="row.value" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
                    <template v-slot="{ row }">
                        <el-button type="danger" @click="handleAttributeDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane name="unbind" label="可选择列表">
            <el-table :data="filterData">
                <el-table-column prop="name" label="商品参数名称" />
                <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
                    <template v-slot="{ row }">
                        <el-button type="danger" @click="handleAttributeAdd(row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
</template>
  
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { GoodsAttributeValue } from '@/api/pms/goodsApi'
import type { ProductAttribute, ProductAttributeSearchDto } from '@/api/pms/productAttrApi'
import { _bindAttrs, _unbindAttrs } from '@/api/pms/productAttrGroupApi'
import { _getGroupBindAttribute } from '@/api/pms/productAttrApi'
const emit = defineEmits(["update:value"])
const props = withDefaults(defineProps<{
    groupId: any,
    value: Array<GoodsAttributeValue>
}>(), {
})

const loading = ref<boolean>(false)
const data = ref<Array<ProductAttribute | any>>([]);
const tabPosition = ref<string>('bind')


watch(() => props.groupId, (val: any) => {
    if (val == undefined || val === '') {
        data.value = []
    } else {
        getLists();
    }
})
const filterData = computed(() => {
    return data.value.filter(item => props.value.findIndex(selectItem => selectItem.name == item.name) == -1)
})
const getLists = () => {
    loading.value = true
    _getGroupBindAttribute(props.groupId, 1).then(res => {
        data.value = res.data
    }).finally(() => {
        loading.value = false
    })
}
const handleAttributeDelete = (row: any) => {
    const selectAttrs = props.value
    const index = selectAttrs.indexOf(row)
    selectAttrs.splice(index, 1)
}
const handleAttributeAdd = (row: ProductAttribute) => {
    const selectAttrs = props.value
    selectAttrs.push({
        goodsAttrId: row.id,
        name: row.name
    } as any)
    emit('update:value', selectAttrs)
}
</script>
  