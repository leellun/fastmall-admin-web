<template>
    <!-- 添加或修改对话框 -->
    <el-dialog v-model="props.visible" :title="'添加商品'" :before-close="handleCancel">
        <div class="search">
            <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入商品编号" />
            <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-table v-loading="listLoading" :data="data" border fit highlight-current-row
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column align="center" label="商品ID" prop="id" />
                <el-table-column align="center" property="picUrl" label="图片">
                    <template v-slot="{ row }">
                        <img :src="row.picUrl" width="40">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品名称" prop="name" />
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
                class="pagination-end" />

        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleOk()">确定</el-button>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { GoodsSearch, Goods } from '@/api/pms/goodsApi'
import { _listGoods } from '@/api/pms/goodsApi'
import { ElMessage, FormInstance } from 'element-plus'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean
}>(), {
    visible: false
})
const data = ref<Array<Goods>>([]);
const selectedlist = ref<Array<any>>([]);
const total = ref<number>(0)
const listLoading = ref(false);
const listQuery = reactive<Partial<GoodsSearch>>({
    pageNo: 1,
    order: 'create_time',
    goodsId: undefined,
    desc: true
});
const handleFilter = () => {
    listQuery.pageNo = 1
    getList()
}
const getList = () => {
    listLoading.value = true
    _listGoods(listQuery as any).then(res => {
        total.value = res.data.pages
        data.value = res.data.list
    }).finally(() => {
        listLoading.value = false
    })
}
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
}
const handleSelectionChange = (val: Array<any>) => {
    selectedlist.value = val
}

const handleOk = () => {
    if (selectedlist.value.length > 0) {
        emit("update:visible", false)
        emit("ok", selectedlist.value)
    } else {
        ElMessage.info("请选择商品")
    }
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
</script>
<style lang="scss" scoped></style>