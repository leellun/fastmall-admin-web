<template>
  <!-- 订单详情对话框 -->
  <el-dialog v-model="props.visible" title="订单详情" width="800">
    <section ref="print">
      <el-form :data="orderDetail" label-position="left">
        <el-form-item label="订单编号">
          <span>{{ orderDetail!.order!.orderSn }}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-tag>{{ getStatus(orderDetail!.order!.orderStatus) }}</el-tag>
        </el-form-item>
        <el-form-item label="订单用户">
          <span>{{ orderDetail!.user!.nickname }}</span>
        </el-form-item>
        <el-form-item label="用户留言">
          <span>{{ orderDetail!.order!.message }}</span>
        </el-form-item>
        <el-form-item label="收货信息">
          <span>（收货人）{{ orderDetail?.order?.consignee }}</span>
          <span>（手机号）{{ orderDetail?.order?.mobile }}</span>
          <span>（地址）{{ orderDetail?.order?.address }}</span>
        </el-form-item>
        <el-form-item label="商品信息">
          <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
            <el-table-column align="center" label="商品名称" prop="goodsName" />
            <el-table-column align="center" label="商品编号" prop="goodsSn" />
            <el-table-column align="center" label="货品规格" prop="specifications" />
            <el-table-column align="center" label="货品价格" prop="price" />
            <el-table-column align="center" label="货品数量" prop="number" />
            <el-table-column align="center" label="货品图片" prop="picUrl">
              <template v-slot="{ row }">
                <img :src="row.picUrl" width="40">
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="费用信息">
          <span>
            (实际费用){{ orderDetail?.order?.actualPrice }}元 =
            (商品总价){{ orderDetail?.order?.goodsPrice }}元 +
            (快递费用){{ orderDetail?.order?.freightPrice }}元 -
            (优惠减免){{ orderDetail?.order?.couponPrice }}元 -
            (积分减免){{ orderDetail?.order?.integralPrice }}元
          </span>
        </el-form-item>
        <el-form-item label="支付信息">
          <span>（支付渠道）微信支付</span>
          <span>（支付时间）{{ orderDetail?.order?.payTime }}</span>
        </el-form-item>
        <el-form-item label="快递信息">
          <span>（快递公司）{{ orderDetail?.order?.shipChannel }}</span>
          <span>（快递单号）{{ orderDetail?.order?.shipSn }}</span>
          <span>（发货时间）{{ orderDetail?.order?.shipTime }}</span>
        </el-form-item>
        <el-form-item label="退款信息">
          <span>（退款金额）{{ orderDetail?.order?.refundAmount }}元</span>
          <span>（退款类型）{{ orderDetail?.order?.refundType }}</span>
          <span>（退款备注）{{ orderDetail?.order?.refundContent }}</span>
          <span>（退款时间）{{ orderDetail?.order?.refundTime }}</span>
        </el-form-item>
        <el-form-item label="收货信息">
          <span>（确认收货时间）{{ orderDetail?.order?.confirmTime }}</span>
        </el-form-item>
      </el-form>
    </section>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleOk()">打印</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { _detailOrder} from '@/api/oms/orderApi'
import type { OrderDetailVO } from '@/api/oms/orderApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
  visible: boolean,
  id: any
}>(), {
  visible: false
})
const orderDetail = reactive<Partial<OrderDetailVO>>({
})
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
_detailOrder(props.id).then(res => {
  Object.assign(orderDetail, res.data)
})

const handleOk = () => {
}
const handleCancel = () => {
  emit("update:visible", false)
  emit("cancel")
}
</script>
<style lang="scss" scoped></style>