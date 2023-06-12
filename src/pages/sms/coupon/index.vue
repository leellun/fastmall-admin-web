<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入优惠券标题" />
      <el-select v-model="listQuery.type" clearable style="width: 200px" class="filter-item" placeholder="请选择优惠券类型">
        <el-option v-for="type1 in typeOptions" :key="type1.value" :label="type1.label" :value="type1.value"></el-option>
      </el-select>
      <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item" placeholder="请选择优惠券状态">
        <el-option v-for="type1 in statusOptions" :key="type1.value" :label="type1.label" :value="type1.value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="data"  border fit highlight-current-row>

      <el-table-column align="center" label="优惠券ID" prop="id" sortable />

      <el-table-column align="center" label="优惠券名称" prop="name" />

      <el-table-column align="center" label="介绍" prop="description" />

      <el-table-column align="center" label="标签" prop="tag" />

      <el-table-column align="center" label="最低消费" prop="min">
        <template v-slot="{ row }">满{{ row.min }}元可用</template>
      </el-table-column>

      <el-table-column align="center" label="满减金额" prop="discount">
        <template v-slot="{ row }">减免{{ row.discount }}元</template>
      </el-table-column>

      <el-table-column align="center" label="每人限领" prop="limitCount">
        <template v-slot="{ row }">{{ row.limitCount != 0 ? row.limitCount : "不限" }}</template>
      </el-table-column>

      <el-table-column align="center" label="商品使用范围" prop="goodsType">
        <template v-slot="{ row }">{{ formatGoodsType(row.goodsType) }}</template>
      </el-table-column>

      <el-table-column align="center" label="优惠券类型" prop="type">
        <template v-slot="{ row }">{{ formatType(row.type) }}</template>
      </el-table-column>

      <el-table-column align="center" label="优惠券数量" prop="total">
        <template v-slot="{ row }">{{ row.total != 0 ? row.total : "不限" }}</template>
      </el-table-column>

      <el-table-column align="center" label="状态" prop="status">
        <template v-slot="{ row }">{{ formatStatus(row.status) }}</template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template v-slot="{ row }">
          <el-button type="primary" @click="handleDetail(row)">详情</el-button>
          <el-button type="info" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
      class="pagination-end" />
    <CouponModal v-model:visible="modalVisible" v-if="modalVisible" :id="modalId" @ok="handleOk" />
    <!-- 添加或修改对话框 -->

  </div>
</template>
  
  
  
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { CouponSearch,Coupon } from '@/api/sms/couponApi'
import { _listCoupon, _createCoupon, _updateCoupon, _deleteCoupon } from '@/api/sms/couponApi'
import CouponModal from './modals/CouponModal.vue'

const router = useRouter()
const modalVisible = ref<boolean>(false)
const modalId = ref<any>()
const listLoading = ref<boolean>(false)
const data = ref<Array<Coupon>>([]);
const total = ref<number>(0)
const typeOptions = [
  {
    label: '通用领券',
    value: 0
  },
  {
    label: '注册赠券',
    value: 1
  },
  {
    label: '兑换码',
    value: 2
  }
]
const statusOptions = [
  {
    label: '正常',
    value: 0
  },
  {
    label: '已过期',
    value: 1
  },
  {
    label: '已下架',
    value: 2
  }
]
const listQuery = reactive<Partial<CouponSearch>>({
  pageNo: 1,
  pageSize: 20,
  name: undefined,
  type: undefined,
  status: undefined,
  order: 'create_time',
  desc: false
})
const formatType = (type: number) => {
  for (let i = 0; i < typeOptions.length; i++) {
    if (type === typeOptions[i].value) {
      return typeOptions[i].label
    }
  }
  return ''
}
const formatGoodsType = (goodsType: number) => {
  if (goodsType === 0) {
    return '全场通用'
  } else if (goodsType === 1) {
    return '指定分类'
  } else {
    return '指定商品'
  }
}
const formatStatus = (status: number) => {
  if (status === 0) {
    return '正常'
  } else if (status === 1) {
    return '已过期'
  } else {
    return '已下架'
  }
}
const getList = () => {
  listLoading.value = true
  _listCoupon(listQuery as any)
    .then(res => {
      total.value = res.data.pages
      data.value = res.data.list
    }).finally(() => {
      listLoading.value = false
    })
}

const handleDelete = (row: any) => {
  _deleteCoupon(row.id)
    .then(res => {
      getList()
    })
}
const handleDetail = (row: any) => {
  router.push({ name: 'couponDetail', query: { id: row.id } })
}
const handleCurrentChange = (val: number) => {
  listQuery.pageNo = val
  getList();
}
const handleOk = () => {
  getList()
}
const handleCreate = () => {
  modalVisible.value = true
  modalId.value = undefined
}
const handleUpdate = (row: any) => {
  modalVisible.value = true
  modalId.value = row.id
}
const handleFilter = () => {
  listQuery.pageNo = 1
  getList()
}
getList()
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>