<template>
    <el-dialog v-model="props.visible" title="密码修改" :before-close="handleCancel">
        <el-form :model="dataForm" ref="ruleFormRef" :rules="rules" label-width="80px">
            <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="dataForm.oldPassword" type="password" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="dataForm.newPassword" type="password" auto-complete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="newPassword2">
                <el-input v-model="dataForm.newPassword2" type="password" auto-complete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleOk(ruleFormRef)">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { _changePassword } from '@/api/system/profileApi'
import { FormInstance } from 'element-plus';
const emit = defineEmits(["update:visible", "ok", "cancel"])
const ruleFormRef = ref<FormInstance>();
const props = withDefaults(defineProps<{
    visible: boolean,
}>(), {
    visible: false
})
const dataForm = reactive<any>({
    oldPassword: '',
    newPassword: '',
    newPassword2: ''
})
const rules = reactive({
    oldPassword: [
        { required: true, message: '旧密码不能为空', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        {
            validator: (rule: any, value: any, callback: any) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    callback()
                }
            }, trigger: 'blur'
        }
    ],
    newPassword2: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        {
            validator: (rule: any, value: any, callback: any) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== dataForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }, trigger: 'blur'
        }
    ]
})
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            _changePassword(dataForm).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        }
    })
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
</script>
<style lang="scss" scoped></style>