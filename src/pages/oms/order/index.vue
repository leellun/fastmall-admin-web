<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" clearable class="filter-item" style="width: 160px;" placeholder="请输入用户昵称" />
      <el-input v-model="listQuery.consignee" clearable class="filter-item" style="width: 160px;"
        placeholder="请输入收货人名称" />
      <el-input v-model="listQuery.orderSn" clearable class="filter-item" style="width: 160px;" placeholder="请输入订单编号" />
      <el-date-picker style="margin-right:10px" class="filter-item" v-model="timeArray" type="datetimerange"
        value-format="YYYY-MM-DD HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
        :shortcuts="shortcuts" />
      <el-select v-model="listQuery.orderStatusArray" multiple style="width: 200px" class="filter-item"
        placeholder="请选择订单状态">
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="data" border fit highlight-current-row>

      <el-table-column type="expand">
        <template v-slot="{ row }">
          <div v-for="item in row.goodsVoList" :key="item.id" class="order-goods">
            <div class="picture">
              <img :src="item.picUrl" width="40">
            </div>
            <div class="name">
              商品名称：{{ item.goodsName }}
            </div>
            <div class="spec">
              规格：{{ item.specifications.join('-') }}
            </div>
            <div class="price">
              单价：{{ item.price }} 元
            </div>
            <div class="num">
              数量：{{ item.number }} 件
            </div>
            <div class="price">
              小计：{{ item.price * item.number }} 元
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="120" label="订单编号" prop="orderSn" />

      <el-table-column align="center" label="用户头像" width="80">
        <template v-slot="{ row }">
          <el-avatar :src="row.avatar" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="下单用户" prop="userName" />

      <el-table-column align="center" label="下单时间" prop="addTime" min-width="100">
        <template v-slot="{ row }">
          {{ (row.addTime || '').substring(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态" prop="orderStatus">
        <template v-slot="{ row }">
          <el-tag>{{ getStatus(row.orderStatus) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单金额" prop="orderPrice">
        <template v-slot="{ row }">
          {{ row.orderPrice }} 元
        </template>
      </el-table-column>

      <el-table-column align="center" label="实付金额" prop="actualPrice">
        <template v-slot="{ row }">
          {{ row.actualPrice }} 元
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付时间" prop="payTime" />

      <el-table-column align="center" label="收货人" prop="consignee">
        <template v-slot="{ row }">
          <span style="color:red; font-weight:bold;">{{ row.consignee }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收货电话" prop="mobile" min-width="100" />

      <el-table-column align="center" label="物流单号" prop="shipSn" />

      <el-table-column align="center" label="物流渠道" prop="shipChannel" />

      <el-table-column align="center" label="操作" width="250" class-name="oper">
        <template v-slot="{ row }">
          <el-button type="primary" @click="handleDetail(row)">详情</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
          <el-button type="warning" @click="handlePay(row)">收款</el-button>
          <el-button type="primary" @click="handleShip(row)">发货</el-button>
          <el-button type="danger" @click="handleRefund(row)">退款</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination key="order-list" background layout="prev, pager, next" :total="total"
      @current-change="handleCurrentChange" class="pagination-end" />
    <el-backtop />

    <OrderDetailModal v-model:visible="orderDetailVisible" :id="orderId" v-if="orderDetailVisible" />
    <OrderReceiptModal v-model:visible="orderReceiptVisible" :payOrder="payOrder" v-if="orderReceiptVisible"
      @ok="handleReceptOk" />
    <OrderRefundModal v-model:visible="orderRefundVisible" :refund="refund" v-if="orderRefundVisible"
      @ok="handleRefundOk" />
    <ShipModal v-model:visible="shipVisible" :ship="ship" v-if="shipVisible" @ok="handleShipOk" />

  </div>
</template>
  
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { OrderSearch, OrderVO } from '@/api/oms/orderApi'
import { _detailOrder, _listOrder, _listChannel, _refundOrder, _payOrder, _deleteOrder, _shipOrder } from '@/api/oms/orderApi'
import OrderDetailModal from './modals/OrderDetailModal.vue'
import OrderReceiptModal from './modals/OrderReceiptModal.vue'
import OrderRefundModal from './modals/OrderRefundModal.vue'
import ShipModal from './modals/ShipModal.vue'
import {formatDate} from '@/utils/DateUtil'

const data = ref<Array<OrderVO>>([])
const total = ref<number>(0)

const orderId = ref<any>()
const payOrder = ref<any>()
const refund = ref<any>()
const ship = ref<any>()
const orderDetailVisible = ref<boolean>(false)
const orderReceiptVisible = ref<boolean>(false)
const orderRefundVisible = ref<boolean>(false)
const shipVisible = ref<boolean>(false)

const timeArray = ref<Array<any>>([])

const listLoading = ref<boolean>(false)
const statusMap = {
  101: '未付款',
  102: '用户取消',
  103: '系统取消',
  201: '已付款',
  202: '申请退款',
  203: '已退款',
  301: '已发货',
  401: '用户收货',
  402: '系统收货'
}
const listQuery = reactive<Partial<OrderSearch>>({
  pageNo: 1,
  pageSize: 20,
  nickname: undefined,
  consignee: undefined,
  orderSn: undefined,
  start: undefined,
  end: undefined,
  orderStatusArray: [],
  order: 'create_time',
  desc: true
});
const shortcuts = [{
  text: '最近一周',
  value: () => {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    return [start, end]
  }
},{
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  }]
const handleFilter = () => {
  listQuery.pageNo = 1
  getList()
}
const getList = () => {
  listLoading.value = true
  if (timeArray && timeArray.value.length === 2) {
    listQuery.start = timeArray.value[0]
    listQuery.end = timeArray.value[1]
  } else {
    listQuery.start = undefined
    listQuery.end = undefined
  }
  _listOrder(listQuery as any).then(res => {
    // total.value = res.data.pages
    data.value = res.data.list
  }).finally(() => {
    listLoading.value = false
  })
}
const getStatus = (status: number) => {
  switch (status) {
    case 101: return '未付款';
    case 102: return '用户取消';
    case 103: return '系统取消';
    case 201: return '已付款';
    case 202: return '申请退款';
    case 203: return '已退款';
    case 301: return '已发货';
    case 401: return '用户收货';
    case 402: return '系统收货';
    default: return '';
  }
}
const handleCurrentChange = (val: number) => {
  listQuery.pageNo = val
  getList();
}
const handleDetail = (row: OrderVO) => {
  orderDetailVisible.value = true
  orderId.value = row.id
}
const handlePay = (row: OrderVO) => {
  payOrder.value = {
    orderId: row.id,
    orderSn: row.orderSn,
    oldMoney: row.actualPrice,
    newMoney: row.actualPrice,
    goodsList: row.goodsVoList
  }
  orderReceiptVisible.value = true
}
const handleDelete = (row: OrderVO) => {
  _deleteOrder(row.id).then(res => {
    getList()
  })
}
const handleShip = (row: OrderVO) => {
  shipVisible.value = true
  ship.value = {
    orderId: row.id,
    shipChannel: row.shipChannel,
    shipSn: row.shipSn
  }
}
const handleRefund = (row: OrderVO) => {
  orderRefundVisible.value = true
  refund.value = {
    orderId: row.id,
    refundMoney: row.actualPrice
  }
}
const handleReceptOk = () => {
  getList()
}
const handleRefundOk = () => {
  getList()
}
const handleShipOk = () => {
  getList()
}
getList()
</script>
<style lang="scss" scoped>
.filter-container {
  .filter-item {
    margin-right: 10px;
  }
}

.el-table--medium th,
.el-table--medium td {
  padding: 3px 0;
}

.el-input-number--medium {
  width: 100%;
}

.oper .el-button--mini {
  padding: 7px 4px;
  width: 40px;
  font-size: 10px;
  margin-left: 1px;
}

::v-deep .el-table__expanded-cell {
  padding: 6px 80px;
}

.order-goods {
  display: flex;
  justify-content: space-around;
  justify-items: center;
  align-items: center;
  padding: 6px 0;
}

.name {
  width: 400px;
}

.spec {
  width: 180px;
}

.price {
  width: 120px;
}

.num {
  width: 120px;
}
</style>