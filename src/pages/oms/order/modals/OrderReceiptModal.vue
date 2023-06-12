<template>
    <el-dialog v-model="props.visible" title="订单收款">
        <el-form ref="ruleFormRef" :model="payForm" status-icon label-position="left" label-width="100px">
            <div style="margin-bottom: 10px;">
                确认当前订单（订单编号 {{ props.payOrder.orderSn }} ) 已经完成线下收款 ？
            </div>
            <el-form-item label="订单金额" prop="oldMoney">
                <el-input-number v-model="props.payOrder.oldMoney" :controls="false" disabled />
            </el-form-item>
            <el-form-item label="付款金额" prop="newMoney">
                <el-input-number v-model="payForm.newMoney" :controls="false" />
            </el-form-item>
        </el-form>
        <el-table :data="props.payOrder.goodsList">
            <el-table-column property="goodsName" label="商品" />
            <el-table-column label="规格">
                <template v-slot="{ row }">
                    {{ row.specifications.join('-') }}
                </template>
            </el-table-column>
            <el-table-column property="onumber" width="100" label="下单数量" />
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleOk(ruleFormRef)">确定</el-button>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { OrderPayDTO } from '@/api/oms/orderApi'
import { _payOrder } from '@/api/oms/orderApi'
import { ElMessageBox, FormInstance } from 'element-plus'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    payOrder?: any
}>(), {
    visible: false
})
const payForm = reactive<OrderPayDTO>({
    orderId: undefined,
    newMoney: 0
});
payForm.orderId = props.payOrder.id
payForm.newMoney = props.payOrder.actualPrice

const ruleFormRef = ref<FormInstance>();

const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.payOrder.oldMoney !== payForm.newMoney) {
                const diff = payForm.newMoney - props.payOrder.oldMoney
                ElMessageBox.confirm(
                    '差额 ' + diff + '元， 是否确认提交',
                    '系统提示',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'info',
                    }
                )
                    .then(() => {
                        payOrder()
                    })
                    .catch(() => {

                    })
            } else {
                payOrder()
            }
        } else {
            console.log("error submit!", fields);
        }
    })
}
const payOrder = () => {
    _payOrder(payForm).then(res => {
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