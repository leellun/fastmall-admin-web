<template>
    <!-- 添加或修改对话框 -->
    <el-dialog v-model="props.visible" :title="id ? '编辑' : '新增'" :before-close="handleCancel">
        <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="问题" prop="question">
                <el-input v-model="dataForm.question" />
            </el-form-item>
            <el-form-item label="回复" prop="answer">
                <el-input v-model="dataForm.answer" :rows="8" type="textarea" placeholder="请输入内容" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button @click="handleOk(ruleFormRef)">确定</el-button>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Issue } from '@/api/cms/issueApi'
import { _createIssue, _updateIssue, _getIssue } from '@/api/cms/issueApi'
import { FormInstance } from 'element-plus';
const emit = defineEmits(["update:visible", "ok", "cancel"])
const ruleFormRef = ref<FormInstance>();
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: string
}>(), {
    visible: false
})
const dataForm = reactive<Partial<Issue>>({
    id: undefined,
    question: '',
    answer: ''
})
const rules = reactive({
    question: [{ required: true, message: '问题不能为空', trigger: 'blur' }],
    answer: [{ required: true, message: '回复不能为空', trigger: 'blur' }]
})
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.id) {
                _updateIssue(dataForm as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            } else {
                _createIssue(dataForm as any).then(res => {
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
const get = (id: string) => {
    _getIssue(id).then(res => {
        let result = res.data
        Object.assign(dataForm, result)
    })
}
if (props.id) {
    get(props.id)
}
</script>
<style lang="scss" scoped></style>