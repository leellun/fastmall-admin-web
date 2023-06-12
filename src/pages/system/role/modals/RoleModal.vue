<template>
    <el-dialog v-model="props.visible" :title="id ? '编辑角色' : '新增角色'" :before-close="handleCancel">
        <el-form :model="form" ref="ruleFormRef" :rules="rules">
            <el-form-item label="角色" prop="name">
                <el-input placeholder="请输入角色名称" v-model="form.name" />
            </el-form-item>
            <el-form-item label="编码" prop="code">
                <el-input placeholder="请输入角色编码" v-model="form.code" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="form.description" :autosize="{ minRows: 4, maxRows: 4 }" type="textarea"
                    placeholder="请输入描述" />
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
import type { Role } from '@/api/system/roleApi'
import { _addRole, _getRole, _updateRole } from '@/api/system/roleApi'
import { FormInstance } from 'element-plus';
const emit = defineEmits(["update:visible", "ok", "cancel"])
const ruleFormRef = ref<FormInstance>();
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: string
}>(), {
    visible: false
})
const form = reactive<Partial<Role>>({
    id: undefined,
    name: undefined,
    code: undefined,
    description: undefined
})
const rules = reactive({
    name: [{
        required: true,
        message: '必须输入角色',
        trigger: "blur"
    }, {
        validator: (rule: any, value: string) => {
            const regex = /^([\u4e00-\u9fa5\u4e00-\u9fa5]{2,10})|(\S{1,15})$/
            if (regex.test(value)) {
                return Promise.resolve()
            } else {
                return Promise.reject()
            }
        },
        trigger: 'change'
    }],
    code: [{
        required: true,
        message: '必须输入编码',
        trigger: "blur"
    }],
})
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.id) {
                _updateRole(form as Role).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            } else {
                _addRole(form as Role).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            }
        }
    })
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
const getRole = (id: string) => {
    _getRole(id).then(res => {
        let result = res.data
        form.id = result.id
        form.name = result.name
        form.code = result.code
        form.description = result.description
    })
}
if (props.id) {
    getRole(props.id)
}
</script>
<style lang="scss" scoped></style>