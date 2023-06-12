<template>
    <!-- 查询结果 -->
    <el-table v-loading="props.loading" :data="props.data" border fit highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
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
                <span v-else>列表选择</span>
            </template>
        </el-table-column>
    </el-table>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import type { ProductAttribute } from '@/api/pms/productAttrApi'
const props = withDefaults(defineProps<{
    loading: boolean,
    data: ProductAttribute[]
}>(), {
})
const emit = defineEmits(['onSelectAttr'])
const multipleSelection = ref<ProductAttribute[]>([])
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
const handleSelectionChange = (val: ProductAttribute[]) => {
    multipleSelection.value = val
    emit('onSelectAttr', val)
}
</script>
  