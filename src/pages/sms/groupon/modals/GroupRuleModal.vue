<template>
    <!-- 添加或修改对话框 -->
    <el-dialog v-model="props.visible" :title="groupon ? '创建' : '编辑'" :before-close="handleCancel">
        <el-form ref="ruleFormRef" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="120px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="商品ID" prop="goodsId">
                <el-input v-model="dataForm.goodsId" />
            </el-form-item>
            <el-form-item label="团购折扣" prop="discount">
                <el-input v-model="dataForm.discount" />
            </el-form-item>
            <el-form-item label="团购人数要求" prop="discountMember">
                <el-input v-model="dataForm.discountMember" />
            </el-form-item>
            <el-form-item label="过期时间" prop="expireTime">
                <el-date-picker v-model="dataForm.expireTime" type="datetime" placeholder="选择日期"
                    value-format="YYYY-MM-DD HH:mm:ss" />
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
import type { GrouponRules } from '@/api/sms/grouponApi'
import { _publishGroupon, _editGroupon } from '@/api/sms/grouponApi'
import { FormInstance } from 'element-plus'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    groupon?: GrouponRules
}>(), {
    visible: false
})
const dataForm = reactive<Partial<GrouponRules>>({
    id: undefined,
    goodsId: undefined,
    discount: 0,
    discountMember: 0,
    expireTime: undefined
});
if (props.groupon) {
    Object.assign(dataForm, props.groupon)
}
const ruleFormRef = ref<FormInstance>();
const rules = reactive({
    goodsId: [{ required: true, message: '商品不能为空', trigger: 'blur' }],
    discount: [{ required: true, message: '团购折扣不能为空', trigger: 'blur' }],
    discountMember: [{ required: true, message: '团购人数不能为空', trigger: 'blur' }],
    expireTime: [{ required: true, message: '过期时间不能为空', trigger: 'blur' }]
})
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.groupon) {
                _editGroupon(dataForm as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            } else {
                _publishGroupon(dataForm as any).then(res => {
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