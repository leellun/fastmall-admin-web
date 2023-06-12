<template>
    <el-dialog v-model="props.visible" :title="title">
        <el-table v-loading="loading" :data="data" border fit highlight-current-row
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column align="center" label="属性名" prop="name" />
            <el-table-column align="center" label="属性值的录入方式" prop="inputType">
                <template v-slot="{ row }">
                    {{ row.inputType === 1 ? '从列表中选取' : '手工录入' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="属性值" prop="inputList" />
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleOk()">确定</el-button>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { ProductAttribute } from '@/api/pms/productAttrApi'
import { _getGroupBindAttribute } from '@/api/pms/productAttrApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const loading = ref<boolean>(false)
const props = withDefaults(defineProps<{
    visible: boolean,
    gid: string,
    type: number,
    title: string
}>(), {
    visible: false
})
const selectedRowKeys = ref<ProductAttribute[]>([]);
//商品属性
const data = ref<Array<ProductAttribute>>([])
const handleSelectionChange = (keys: ProductAttribute[]) => {
    selectedRowKeys.value = keys;
};
const getProductAttrList = (gid: string, type: number) => {
    loading.value = true
    _getGroupBindAttribute(gid, type).then(res => {
        data.value = res.data
    }).finally(() => {
        loading.value = false
    })
}
const handleOk = () => {
    emit("update:visible", false)
    emit("ok", selectedRowKeys.value)
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
getProductAttrList(props.gid, props.type)
</script>
<style lang="scss" scoped></style>