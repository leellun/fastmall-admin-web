<template>
    <!-- 发货对话框 -->
    <el-dialog v-model="props.visible" title="发货" :before-close="handleCancel">
        <el-form :model="shipForm" status-icon label-position="left" label-width="100px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="快递公司" prop="shipChannel">
                <el-select v-model="shipForm.shipChannel" placeholder="请选择">
                    <el-option v-for="item in channels" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
            </el-form-item>
            <el-form-item label="快递编号" prop="shipSn">
                <el-input v-model="shipForm.shipSn" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="confirmShip()">确定</el-button>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { OrderShipDTO } from '@/api/oms/orderApi'
import { _listChannel, _shipOrder } from '@/api/oms/orderApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    ship?: any
}>(), {
    visible: false
})
const channels = ref<Array<any>>([])
const shipForm = reactive<Partial<OrderShipDTO>>({
    orderId: undefined,
    shipChannel: undefined,
    shipSn: undefined
})
Object.assign(shipForm,props.ship)
const getChannel = () => {
    _listChannel(shipForm.orderId).then(res => {
        channels.value = res.data
    })
}
const confirmShip = () => {
    _shipOrder(shipForm as any).then(res => {
        emit("update:visible", false)
        emit("ok")
    })
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
getChannel()
</script>
<style lang="scss" scoped></style>