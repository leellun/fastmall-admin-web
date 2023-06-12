<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.goodsId" clearable class="filter-item" style="width: 160px;"
                placeholder="请输入商品ID" />
            <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 160px;"
                placeholder="请输入商品编号" />
            <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 160px;" placeholder="请输入商品名称" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="data" border fit highlight-current-row>
            <el-table-column type="expand">
                <template #default="props">
                    <el-form label-position="left" class="table-expand">
                        <el-form-item label="商品编号">
                            <span>{{ props.row.goodsSn }}</span>
                        </el-form-item>
                        <el-form-item label="宣传画廊">
                            <el-image v-for="pic in props.row.gallery" :key="pic" :src="pic" class="gallery"
                                :preview-src-list="props.row.gallery" style="width: 40px; height: 40px" :preview-teleported="true"/>
                        </el-form-item>
                        <el-form-item label="商品介绍">
                            <span>{{ props.row.brief }}</span>
                        </el-form-item>
                        <el-form-item label="商品单位">
                            <span>{{ props.row.unit }}</span>
                        </el-form-item>
                        <el-form-item label="关键字">
                            <span>{{ props.row.keywords }}</span>
                        </el-form-item>
                        <el-form-item label="类目ID">
                            <span>{{ props.row.categoryId }}</span>
                        </el-form-item>
                        <el-form-item label="品牌商ID">
                            <span>{{ props.row.brandId }}</span>
                        </el-form-item>

                    </el-form>
                </template>
            </el-table-column>

            <el-table-column align="center" label="商品ID" prop="id" />

            <el-table-column align="center" min-width="100" label="名称" prop="name" />

            <el-table-column align="center" property="iconUrl" label="图片">
                <template v-slot="{ row }">
                    <el-image style="width: 40px; height: 40px" :key="row.picUrl" :src="row.picUrl" :zoom-rate="1.2" class="gallery"
                        :preview-src-list="[row.picUrl]" fit="cover" :preview-teleported="true"/>
                </template>
            </el-table-column>

            <el-table-column align="center" property="iconUrl" label="分享图">
                <template v-slot="{ row }">
                    <img :src="row.shareUrl" width="40">
                </template>
            </el-table-column>

            <el-table-column align="center" label="详情" prop="detail">
                <template v-slot="{ row }">
                    <el-dialog :visible.sync="detailDialogVisible" title="商品详情">
                        <div class="goods-detail-box" v-html="goodsDetail" />
                    </el-dialog>
                    <el-button type="primary" @click="showDetail(row.detail)">查看</el-button>
                </template>
            </el-table-column>

            <el-table-column align="center" label="市场售价" prop="counterPrice" />

            <el-table-column align="center" label="当前价格" prop="retailPrice" />

            <el-table-column align="center" label="是否新品" prop="isNew">
                <template v-slot="{ row }">
                    <el-tag :type="row.isNew ? 'success' : 'danger'">{{ row.isNew ? '新品' : '非新品' }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="是否热品" prop="isHot">
                <template v-slot="{ row }">
                    <el-tag :type="row.isHot ? 'success' : 'danger'">{{ row.isHot ? '热品' : '非热品' }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="是否在售" prop="isOnSale">
                <template v-slot="{ row }">
                    <el-tag :type="row.isOnSale ? 'success' : 'danger'">{{ row.isOnSale ? '在售' : '未售'
                    }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
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
import { _listGoods, _deleteGoods } from '@/api/pms/goodsApi'
import type { GoodsSearch, Goods } from '@/api/pms/goodsApi'
import { ElMessageBox } from 'element-plus'
const router = useRouter()
const data = ref<Array<any>>([]);
const total = ref<number>(0)
const goodsDetail = ref<string>('')
const detailDialogVisible = ref<boolean>(false)
const listQuery = reactive<Partial<GoodsSearch>>({
    pageNo: 1,
    order: 'create_time',
    goodsId: undefined,
    goodsSn: undefined,
    name: undefined
});
const listLoading = ref(false);
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
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
const handleFilter = () => {
    listQuery.pageNo = 1
    getList()
}
const handleCreate = () => {
    router.push({ name: 'addProduct' })
}
const handleUpdate = (row: Goods) => {
    router.push({ name: 'updateProduct', query: { id: row.id } })
}
const showDetail = (detail: string) => {
    goodsDetail.value = detail
    detailDialogVisible.value = true
}
const handleDelete = (row: Goods) => {
    ElMessageBox.confirm(
        '确定删除?',
        '警告',
        { confirmButtonText: '确认', cancelButtonText: '取消', type: 'info', })
        .then(() => {
            _deleteGoods(row).then(response => {

                getList()
            })
        })
        .catch(() => {

        })
}
getList()
</script>
    
<style>
.table-expand {
    font-size: 0;
    padding-left: 60px;
}

.table-expand label {
    width: 100px;
    color: #99a9bf;
}

.table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
}

.gallery {
    width: 80px;
    margin-right: 10px;
}

.goods-detail-box img {
    width: 100%;
}
</style>