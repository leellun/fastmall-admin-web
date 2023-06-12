<template>
    <!-- 添加或修改对话框 -->
    <el-dialog v-model="props.visible" :title="id ? '编辑' : '新增'" :before-close="handleCancel">
        <el-form ref="ruleFormRef" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="关键词" prop="keyword">
                <el-input v-model="dataForm.keyword" />
            </el-form-item>
            <el-form-item label="跳转链接" prop="url">
                <el-input v-model="dataForm.url" />
            </el-form-item>
            <el-form-item label="是否推荐" prop="isHot">
                <el-select v-model="dataForm.isHot" placeholder="请选择">
                    <el-option :value="1" label="推荐" />
                    <el-option :value="0" label="普通" />
                </el-select>
            </el-form-item>
            <el-form-item label="是否默认" prop="isDefault">
                <el-select v-model="dataForm.isDefault" placeholder="请选择">
                    <el-option :value="1" label="默认" />
                    <el-option :value="0" label="非默认" />
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button @click="handleOk(ruleFormRef)">确定</el-button>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import type { Keyword } from '@/api/cms/keywordApi'
import { _createKeyword, _updateKeyword, _getKeyword } from '@/api/cms/keywordApi'
import { FormInstance } from 'element-plus';
const emit = defineEmits(["update:visible", "ok", "cancel"])
const ruleFormRef = ref<FormInstance>();
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: string
}>(), {
    visible: false
})
const dataForm = reactive<Partial<Keyword>>({
    id: undefined,
    keyword: undefined,
    url: undefined,
    isHot: 0,
    isDefault: 0,
})
const rules = reactive({
    keyword: [{ required: true, message: '关键词不能为空', trigger: 'blur' }]
})
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.id) {
                _updateKeyword(dataForm as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            } else {
                _createKeyword(dataForm as any).then(res => {
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
    _getKeyword(id).then(res => {
        let result = res.data
        Object.assign(dataForm, result)
    })
}
if (props.id) {
    get(props.id)
}
</script>
<style lang="scss" scoped></style>