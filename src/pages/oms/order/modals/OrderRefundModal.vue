<template>
  <!-- 退款对话框 -->
  <el-dialog v-model="props.visible" title="退款" :before-close="handleCancel">
    <el-form ref="refundForm" :model="refundForm" status-icon label-position="left" label-width="100px"
      style="width: 400px; margin-left:50px;">
      <el-form-item label="退款金额" prop="refundMoney">
        <el-input v-model="refundForm.refundMoney" :disabled="true" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="confirmRefund">确定</el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import type { OrderRefundDTO } from '@/api/oms/orderApi';
import { _refundOrder } from '@/api/oms/orderApi';
import { reactive } from 'vue';
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
  visible: boolean,
  refund?: any
}>(), {
  visible: false
})
const refundForm = reactive<Partial<OrderRefundDTO>>({
  orderId: undefined,
  refundMoney: undefined
})
Object.assign(refundForm,props.refund)
const confirmRefund = () => {
  _refundOrder(refundForm as any).then(res => {
    emit("update:visible", false)
    emit("ok")
  })
}
const handleCancel = () => {
  emit("update:visible", false)
  emit("cancel")
}
</script>
<style lang="scss" scoped></style>