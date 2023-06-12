<template>
  <div class="app-container">

    <div class="table-layout">
      <el-row>
        <el-col :span="4" class="table-cell-title">名称</el-col>
        <el-col :span="4" class="table-cell-title">介绍名称</el-col>
        <el-col :span="4" class="table-cell-title">标签</el-col>
        <el-col :span="4" class="table-cell-title">优惠券类型</el-col>
        <el-col :span="4" class="table-cell-title">最低消费</el-col>
        <el-col :span="4" class="table-cell-title">优惠面值</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell">{{ coupon?.name }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon?.description }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon?.tag }}</el-col>
        <el-col :span="4" class="table-cell">{{ formatType(coupon?.type) }}</el-col>
        <el-col :span="4" class="table-cell">满{{ coupon?.min }}元可用</el-col>
        <el-col :span="4" class="table-cell">减免{{ coupon?.discount }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell-title">每人限额</el-col>
        <el-col :span="4" class="table-cell-title">当前状态</el-col>
        <el-col :span="4" class="table-cell-title">商品范围</el-col>
        <el-col :span="4" class="table-cell-title">有效期</el-col>
        <el-col :span="4" class="table-cell-title">优惠兑换码</el-col>
        <el-col :span="4" class="table-cell-title">发行数量</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell">{{ coupon?.limitCount }}</el-col>
        <el-col :span="4" class="table-cell">{{ formatStatus(coupon?.status) }}</el-col>
        <el-col :span="4" class="table-cell">{{ formatGoodsType(coupon?.goodsType) }}</el-col>
        <el-col :span="4" class="table-cell">{{ getTimeScope() }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon?.code }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon?.total === 0 ? "不限" : coupon?.total }}</el-col>
      </el-row>
    </div>

    <!-- 查询操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户ID" />
      <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item" placeholder="请选择使用状态">
        <el-option v-for="item in defaultUseStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="data" border fit highlight-current-row>

      <el-table-column align="center" label="用户优惠券ID" prop="id" sortable />

      <el-table-column align="center" label="用户ID" prop="userId" />

      <el-table-column align="center" label="领取时间" prop="addTime" />

      <el-table-column align="center" label="使用状态" prop="status">
        <template v-slot="{ row }">{{ formatUseStatus(row.status) }}</template>
      </el-table-column>

      <el-table-column align="center" label="订单ID" prop="orderId" />

      <el-table-column align="center" label="使用时间" prop="usedTime" />

    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
      class="pagination-end" />

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { CouponUserSearch, CouponUser, Coupon } from '@/api/sms/couponApi'
import { _listCouponUser,_getCoupon } from '@/api/sms/couponApi'
const router = useRouter()
const couponId = ref<any>()
couponId.value = router.currentRoute.value.query.id
const coupon = ref<Partial<Coupon>>({})

const data = ref<Array<CouponUser>>([]);
const total = ref<number>(0)
const listLoading = ref(false);
const listQuery = reactive<Partial<CouponUserSearch>>({
  pageNo: 1,
  pageSize: 20,
  couponId: 0,
  userId: undefined,
  status: undefined,
  order: 'create_time',
  desc: true
});
listQuery.couponId=couponId.value
const handleCurrentChange = (val: number) => {
  listQuery.pageNo = val
  getList();
}
const getList = () => {
  listLoading.value = true
  _listCouponUser(listQuery as any)
    .then(res => {
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

const defaultTypeOptions = [
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

const defaultUseStatusOptions = [
  {
    label: '未使用',
    value: 0
  },
  {
    label: '已使用',
    value: 1
  },
  {
    label: '已过期',
    value: 2
  },
  {
    label: '已下架',
    value: 3
  }
]
const formatType = (type: number | undefined) => {
  for (let i = 0; i < defaultTypeOptions.length; i++) {
    if (type === defaultTypeOptions[i].value) {
      return defaultTypeOptions[i].label
    }
  }
  return ''
}
const formatGoodsType = (goodsType: number | undefined) => {
  if (goodsType === 0) {
    return '全场通用'
  } else if (goodsType === 1) {
    return '指定分类'
  } else {
    return '指定商品'
  }
}
const formatStatus = (status: number | undefined) => {
  if (status === 0) {
    return '正常'
  } else if (status === 1) {
    return '已过期'
  } else {
    return '已下架'
  }
}
const formatUseStatus = (status: number | undefined) => {
  if (status === 0) {
    return '未使用'
  } else if (status === 1) {
    return '已使用'
  } else if (status === 3) {
    return '已过期'
  } else {
    return '已下架'
  }
}
const getTimeScope = () => {
  if (coupon.value?.timeType === 0) {
    return '领取' + coupon.value?.days + '天有效'
  } else if (coupon.value?.timeType === 1) {
    return '自' + coupon.value?.startTime + '至' + coupon.value?.endTime + '有效'
  } else {
    return '未知'
  }
}
getList()
if (couponId.value){
  _getCoupon(couponId.value).then(res=>{
    Object.assign(coupon.value,res.data)
  })
}
</script>
<style scoped>
.filter-container {
  margin-top: 20px;
}

.table-layout {
  margin-top: 20px;
  border-left: 1px solid #DCDFE6;
  border-top: 1px solid #DCDFE6;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
}

.table-cell-title {
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
  background: #F2F6FC;
  text-align: center;
  font-size: 14px;
  color: #303133;
}
</style>
