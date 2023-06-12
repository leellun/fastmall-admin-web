<template>
    <!-- 添加或修改对话框 -->
    <el-dialog v-model="props.visible" :title="id ? '编辑属性分组' : '新增属性分组'" :before-close="handleCancel" style="width:600px">
        <el-form ref="ruleFormRef" :rules="rules" :model="form" status-icon label-position="left" label-width="100px">
            <el-form-item label="名称" prop="name" >
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="商品分类">
                <el-cascader :options="categoryList" v-model="categorys" expand-trigger="hover" clearable style="width:100%"
                    @change="handleCategoryChange" />
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
import { _createProductAttrGroup, _updateProductAttrGroup, _getProductAttrGroup } from '@/api/pms/productAttrGroupApi'
import { _listCats } from '@/api/pms/categoryApi'
import { FormInstance } from 'element-plus'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const ruleFormRef = ref<FormInstance>();
const categoryList = ref<Array<any>>([])
const categorys = ref<Array<any>>([])
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: any,
    name?: string
}>(), {
    visible: false
})
const rules = reactive({
    name: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }]
})
const form = reactive<any>({
    id: undefined,
    name: undefined,
    categoryId: undefined
})
const handleCategoryChange = (value: any) => {
    form.categoryId = value[value.length - 1]
}
form.id = props.id
form.name = props.name
if (props.id != undefined) {
    _getProductAttrGroup(props.id).then(res => {
        form.name = res.data.goodsGroup.name
        form.categoryId = res.data.goodsGroup.categoryId
        categorys.value = res.data.categoryIds
    })
}
_listCats().then(res => {
    categoryList.value = res.data
})
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.id) {
                _updateProductAttrGroup(form).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            } else {
                _createProductAttrGroup(form).then(res => {
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
</script>
<style lang="scss" scoped></style>