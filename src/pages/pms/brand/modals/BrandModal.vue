<template>
    <!-- 添加或修改对话框 -->
    <el-dialog v-model="props.visible" :title="id ? '编辑' : '新增'" :before-close="handleCancel">
        <el-form ref="ruleFormRef" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="品牌商名称" prop="name">
                <el-input v-model="dataForm.name" />
            </el-form-item>
            <el-form-item label="介绍" prop="description">
                <el-input v-model="dataForm.description" />
            </el-form-item>
            <el-form-item label="品牌商图片" prop="picUrl">
                <el-upload :headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadPicUrl"
                    class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif">
                    <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
            </el-form-item>
            <el-form-item label="底价" prop="floorPrice">
                <el-input v-model="dataForm.floorPrice" />
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
import type { Brand } from '@/api/pms/brandApi'
import { _getBrand, _createBrand, _updateBrand } from '@/api/pms/brandApi'
import { ElMessage, FormInstance } from 'element-plus';
import { useUserStore } from '@/store/user'
import { uploadPath } from '@/api/pms/storageApi'
const userStore = useUserStore()
const headers = computed(() => {
    return { Authorization: `Bearer ${userStore.token}` }
})
const emit = defineEmits(["update:visible", "ok", "cancel"])
const ruleFormRef = ref<FormInstance>();
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: string
}>(), {
    visible: false
})
const dataForm = reactive<Partial<Brand>>({
    id: undefined,
    name: '',
    description: '',
    floorPrice: undefined,
    picUrl: undefined
})
const rules = reactive({
    name: [
        { required: true, message: '品牌商名称不能为空', trigger: 'blur' }
    ]
})
const checkFileSize = (file: any) => {
    if (file.size > 1048576) {
        ElMessage.error(`${file.name}文件大于1024KB，请选择小于1024KB大小的图片`)
        return false
    }
    return true
}
const uploadPicUrl = (response: any) => {
    dataForm.picUrl = response.data.url
}
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.id) {
                _updateBrand(dataForm as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            } else {
                _createBrand(dataForm as any).then(res => {
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
    _getBrand(id).then(res => {
        let result = res.data
        Object.assign(dataForm, result)
    })
}
if (props.id) {
    dataForm.id = props.id
    get(props.id)
}
</script>
<style lang="scss" scoped></style>