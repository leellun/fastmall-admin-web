<template>
    <el-dialog v-model="props.visible" title="添加货品">
        <el-form :model="productForm" status-icon label-position="left" label-width="100px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="货品规格列" prop="specifications">
                <el-tag v-for="tag in productForm.specifications" :key="tag" closable :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{ tag }}
                </el-tag>
                <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
                    @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
                    + 添加
                </el-button>
            </el-form-item>
            <el-form-item label="货品售价" prop="price">
                <el-input v-model="productForm.price" />
            </el-form-item>
            <el-form-item label="货品数量" prop="number">
                <el-input v-model="productForm.number" />
            </el-form-item>
            <el-form-item label="货品图片" prop="url">
                <el-upload :action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadProductUrl"
                    class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif">
                    <img v-if="productForm.url" :src="productForm.url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleOk()">确定</el-button>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive, computed,ref,nextTick } from 'vue'
import type { GoodsProduct } from '@/api/pms/goodsApi'
import { uploadPath } from '@/api/pms/storageApi'
import { useUserStore } from '@/store/user'
import { ElInput } from 'element-plus';
const userStore = useUserStore()
const emit = defineEmits(["update:visible", "ok", "cancel"])
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()
const props = withDefaults(defineProps<{
    visible: boolean,
    param?: GoodsProduct
}>(), {
    visible: false
})
const headers = computed(() => {
    return { Authorization: `Bearer ${userStore.token}` }
})
const productForm = reactive<Partial<GoodsProduct>>({
    id: 0, specifications: [], price: 0.00, number: 0, url: ''
});
if(props.param!=undefined){
    Object.assign(productForm,props.param)
}
const uploadProductUrl = (response: any) => {
    productForm.url = response.data.url
}
const handleClose = (tag: string) => {
    productForm!.specifications!.splice(productForm!.specifications!.indexOf(tag), 1)
}
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    productForm!.specifications!.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
const handleOk = () => {
    emit("update:visible", false)
    emit("ok", productForm as GoodsProduct)
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
</script>
<style lang="scss" scoped></style>