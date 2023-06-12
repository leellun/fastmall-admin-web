<template>
    <el-dialog v-model="props.visible" title="设置规格" :before-close="handleCancel">
        <el-form ref="ruleFormRef" :model="specForm" status-icon label-position="left" label-width="100px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="规格名" prop="specification">
                <el-input v-model="specForm.specification" />
            </el-form-item>
            <el-form-item label="规格值" prop="value">
                <el-input v-model="specForm.value" />
            </el-form-item>
            <el-form-item label="规格图片" prop="picUrl">
                <el-upload :action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadSpecPicUrl"
                    class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif">
                    <img v-if="specForm.picUrl" :src="specForm.picUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleOk(ruleFormRef)">确定</el-button>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive,computed } from 'vue'
import type { GoodsSpecification } from '@/api/pms/goodsApi'
import { uploadPath } from '@/api/pms/storageApi'
import { FormInstance } from 'element-plus'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: string
}>(), {
    visible: false
})
const headers = computed(() => {
  return { Authorization: `Bearer ${userStore.token}` }
})
const specForm = reactive<Partial<GoodsSpecification>>({
    specification: '', value: '', picUrl: ''
});
const ruleFormRef = ref<FormInstance>();
const uploadSpecPicUrl = (response: any) => {
    specForm.picUrl = response.data.url
}
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            emit("update:visible", false)
            emit("ok", specForm as GoodsSpecification)
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