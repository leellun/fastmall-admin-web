<template>
    <!-- 添加或修改对话框 -->
    <el-dialog v-model="props.visible" :title="id ? '编辑' : '新增'" :before-close="handleCancel">
        <el-form ref="ruleFormRef" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="类目名称" prop="name">
                <el-input v-model="dataForm.name" />
            </el-form-item>
            <el-form-item label="关键字" prop="keywords">
                <el-input v-model="dataForm.keywords" />
            </el-form-item>
            <el-form-item label="级别" prop="level">
                <el-select v-model="dataForm.level" @change="onLevelChange">
                    <el-option label="一级类目" value="L1" />
                    <el-option label="二级类目" value="L2" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="dataForm.level === 'L2'" label="父类目" prop="pid">
                <el-select v-model="dataForm.pid">
                    <el-option v-for="item in catL1" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="类目图标" prop="iconUrl">
                <el-upload :headers="headers" :action="uploadPath" :show-file-list="false" :before-upload="checkFileSize" :on-success="uploadIconUrl"
                    class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif">
                    <img v-if="dataForm.iconUrl" :src="dataForm.iconUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
            </el-form-item>
            <el-form-item label="类目图片" prop="picUrl">
                <el-upload :headers="headers" :action="uploadPath" :show-file-list="false" :before-upload="checkFileSize" :on-success="uploadPicUrl"
                    class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif">
                    <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
            </el-form-item>
            <el-form-item label="类目简介" prop="description">
                <el-input v-model="dataForm.description" />
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
import { _listCatL1, _createCategory, _updateCategory, _getCategory } from '@/api/pms/categoryApi'
import type { Category } from '@/api/pms/categoryApi'
import { uploadPath } from '@/api/pms/storageApi'
import { ElMessage, FormInstance } from 'element-plus';
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
const headers = computed(() => {
    return { Authorization: `Bearer ${userStore.token}` }
})
const emit = defineEmits(["update:visible", "ok", "cancel"])
const ruleFormRef = ref<FormInstance>();
const catL1 = ref<Array<Category>>([])
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: string
}>(), {
    visible: false
})
const dataForm = reactive<Partial<Category>>({
    id: undefined,
    name: '',
    keywords: undefined,
    level: 'L1',
    pid: undefined,
    description: '',
    iconUrl: '',
    picUrl: ''
})
const rules = reactive({
    name: [{ required: true, message: '类目名不能为空', trigger: 'blur' }]
})
const onLevelChange = (value: any) => {
    if (value === 'L1') {
        dataForm.pid = 0
    }
}
const uploadIconUrl = (response: any) => {
    dataForm.iconUrl = response.data.url
}
const uploadPicUrl = (response: any) => {
    dataForm.picUrl = response.data.url
}
const checkFileSize = (file: any) => {
    if (file.size > 1048576*4) {
        ElMessage.error(`${file.name}文件大于4096KB，请选择小于1024KB大小的图片`)
        return false
    }
    return true
}
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.id) {
                _updateCategory(dataForm as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            } else {
                _createCategory(dataForm as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            }
        }
    })
}
const getCatL1 = () => {
    _listCatL1().then(res => {
        catL1.value = res.data
    })
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
const get = (id: string) => {
    _getCategory(id).then(res => {
        let result = res.data
        Object.assign(dataForm, result)
    })
}
if (props.id) {
    get(props.id)
}
getCatL1()
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