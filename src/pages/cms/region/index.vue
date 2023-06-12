<template>
    <div class="app-container">
        <el-table v-loading="listLoading" :data="data" row-key="id"
            style="width: 100%;margin-bottom: 20px;" border="">
            <el-table-column label="区域名称" prop="name" />
            <el-table-column label="区域类型" prop="type">
                <template v-slot="{ row }">
                    {{ getType(row.type) }}
                </template>
            </el-table-column>
            <el-table-column label="区域编码" prop="code" />
        </el-table>

    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import type { RegionVO } from '@/api/cms/regionApi'
import { _listRegion } from '@/api/cms/regionApi'
const data = ref<Array<RegionVO>>([]);
const listLoading = ref(false);
const getType = (type: number) => {
    switch (type) {
        case 1: return '省';
        case 2: return '市';
        case 3: return '区';
    }
}
const getList = () => {
    listLoading.value = true
    _listRegion().then(res => {
        data.value = res.data
    }).finally(() => {
        listLoading.value = false
    })
}
getList()
</script>
  