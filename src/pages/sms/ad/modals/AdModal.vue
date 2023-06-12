<template>
    <!-- 添加或修改对话框 -->
    <el-dialog v-model="props.visible" :title="id ? '编辑' : '新增'" :before-close="handleCancel">
        <el-form ref="ruleFormRef" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="广告标题" prop="name">
                <el-input v-model="dataForm.name" />
            </el-form-item>
            <el-form-item label="广告内容" prop="content">
                <el-input v-model="dataForm.content" />
            </el-form-item>
            <el-form-item label="广告图片" prop="url">
                <el-upload :headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadUrl"
                    :before-upload="checkFileSize" class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif">
                    <img v-if="dataForm.url" :src="dataForm.url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1024kb</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="广告位置" prop="position">
                <el-select v-model="dataForm.position" placeholder="请选择">
                    <el-option :value="1" label="首页" />
                </el-select>
            </el-form-item>
            <el-form-item label="活动链接" prop="link">
                <el-input v-model="dataForm.link" />
            </el-form-item>
            <el-form-item label="是否启用" prop="enabled">
                <el-select v-model="dataForm.enabled" placeholder="请选择">
                    <el-option :value="1" label="启用" />
                    <el-option :value="0" label="不启用" />
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
import type { Ad } from '@/api/sms/adApi'
import { _getAd, _createAd, _updateAd } from '@/api/sms/adApi'
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
const dataForm = reactive<Partial<Ad>>({
    id: undefined,
    name: undefined,
    content: undefined,
    url: undefined,
    link: undefined,
    position: 1,
    enabled: 1
})
const rules = reactive({
    name: [
        { required: true, message: '广告标题不能为空', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '广告内容不能为空', trigger: 'blur' }
    ],
    url: [{ required: true, message: '广告链接不能为空', trigger: 'blur' }]
})
const checkFileSize = (file: any) => {
    if (file.size > 1048576) {
        ElMessage.error(`${file.name}文件大于1024KB，请选择小于1024KB大小的图片`)
        return false
    }
    return true
}
const uploadUrl = (response: any) => {
    dataForm.url = response.data.url
}
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.id) {
                _updateAd(dataForm as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            } else {
                _createAd(dataForm as any).then(res => {
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
    _getAd(id).then(res => {
        let result = res.data
        Object.assign(dataForm, result)
    })
}
if (props.id) {
    get(props.id)
}
</script>
<style lang="scss">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}

.avatar {
    width: 145px;
    height: 145px;
    display: block;
}
</style>