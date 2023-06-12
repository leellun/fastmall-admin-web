<template>
    <!-- 详情对话框 -->
    <el-dialog v-model="props.visible" title="售后详情" :before-close="handleCancel" width="800">
        <section ref="print">
            <el-form :data="aftersaleDetail" label-position="left">
                <el-form-item label="售后id">
                    <el-tag>{{ aftersaleDetail.id }}</el-tag>
                </el-form-item>
                <el-form-item label="售后编号">
                    <el-tag>{{ aftersaleDetail.aftersaleSn }}</el-tag>
                </el-form-item>
                <el-form-item label="订单号">
                    <el-tag>{{ aftersaleDetail.orderId }}</el-tag>
                </el-form-item>
                <el-form-item label="订单金额">
                    <el-tag>{{ aftersaleDetail.amount }}</el-tag>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-tag v-if="aftersaleDetail.status === 1">已申请,待审核</el-tag>
                    <el-tag v-if="aftersaleDetail.status === 2">审核通过,待退款</el-tag>
                    <el-tag v-if="aftersaleDetail.status === 3">退款成功</el-tag>
                    <el-tag v-if="aftersaleDetail.status === 4">审核不通过,已拒绝</el-tag>
                </el-form-item>
                <el-form-item label="订单用户id">
                    <el-tag>{{ aftersaleDetail.userId }}</el-tag>
                </el-form-item>
                <el-form-item label="售后类型">
                    <el-tag v-if="aftersaleDetail.type === 0">未收货退款</el-tag>
                    <el-tag v-if="aftersaleDetail.type === 1">不退货退款</el-tag>
                    <el-tag v-if="aftersaleDetail.type === 2">退货退款</el-tag>
                </el-form-item>
                <el-form-item label="退款原因">
                    <span>{{ aftersaleDetail.reason }}</span>
                </el-form-item>
                <el-form-item label="申请时间">
                    <span>{{ aftersaleDetail.addTime }}</span>
                </el-form-item>
                <el-form-item label="更新时间">
                    <span>{{ aftersaleDetail.updateTime }}</span>
                </el-form-item>
                <el-form-item label="处理时间">
                    <span>{{ aftersaleDetail.handleTime }}</span>
                </el-form-item>
                <el-form-item label="售后图片">
                    <el-table :data="aftersaleDetail.pictures" border fit highlight-current-row>
                        <el-table-column align="center" label="售后图片">
                            <template v-slot="{ row }">
                                <a :href="row" target="_blank">
                                    <img :src="row" width="40">
                                </a>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </section>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
        </span>
    </el-dialog>
</template>
<script setup lang="ts">
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    aftersaleDetail?: any
}>(), {
    visible: false
})
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
</script>
<style lang="scss" scoped></style>