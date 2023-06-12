<template>
    <el-dialog v-model="props.visible" :rules="rules" :title="props.id ? '修改' : '添加'" :before-close="handleCancel">
        <el-form ref="ruleFormRef" :model="formRef" status-icon label-position="left" label-width="100px">
            <el-form-item label="属性值" prop="value">
                <el-input v-model="formRef.value" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleOk(ruleFormRef)">确定</el-button>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { GoodsValue } from '@/api/pms/productValueApi'
import { _createProductValue, _updateProductValue } from '@/api/pms/productValueApi'
import { FormInstance } from 'element-plus'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    attrId: any,
    id?: any,
    value?: string
}>(), {
    visible: false
})
const formRef = reactive<Partial<GoodsValue>>({
    value: ''
});
formRef.id = props.id
formRef.value = props.value
formRef.goodsAttrId = props.attrId
const rules = reactive({
    value: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }],
})
const ruleFormRef = ref<FormInstance>();
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.id) {
                _updateProductValue(formRef.id, formRef as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            } else {
                _createProductValue(formRef as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            }

        } else {
            console.log("error submit!", fields);
        }
    })
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
</script>
<style lang="scss" scoped></style>