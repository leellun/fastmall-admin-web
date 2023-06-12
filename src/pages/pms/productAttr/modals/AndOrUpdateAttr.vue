<template>
    <el-dialog v-model="props.visible" :title="id ? '编辑属性' : '新增属性'" :before-close="handleCancel">
        <el-form ref="ruleFormRef" :rules="rules" :model="form" label-width="150px">
            <el-form-item label="属性名称:" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="分类筛选样式:" prop="filterType">
                <el-radio-group v-model="form.filterType">
                    <el-radio :label="0">普通</el-radio>
                    <el-radio :label="1">多选</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="能否进行检索:" prop="searchType">
                <el-radio-group v-model="form.searchType">
                    <el-radio :label="0">不需要检索</el-radio>
                    <el-radio :label="1">关键字检索</el-radio>
                    <el-radio :label="2">范围检索</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="商品属性关联:" prop="relatedStatus">
                <el-radio-group v-model="form.relatedStatus">
                    <el-radio :label="0">是</el-radio>
                    <el-radio :label="1">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="属性是否可选:" prop="selectType">
                <el-radio-group v-model="form.selectType">
                    <el-radio :label="0">唯一</el-radio>
                    <el-radio :label="1">单选</el-radio>
                    <el-radio :label="2">复选</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="属性值的录入方式:" prop="inputType">
                <el-radio-group v-model="form.inputType">
                    <el-radio :label="0">手工录入</el-radio>
                    <el-radio :label="1">从列表中选择</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="属性值可选值列表:" v-if="form.inputType === 1">
                <el-input v-model="inputListFormat" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }"/>
            </el-form-item> -->
            <el-form-item label="是否支持手动新增:" prop="handAddStatus">
                <el-radio-group v-model="form.handAddStatus">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序属性:" prop="attrSort">
                <el-radio-group v-model="form.attrSort">
                    <el-input v-model="form.attrSort" />
                </el-radio-group>
            </el-form-item>
            <el-form-item style="text-align:center">
                <el-button type="primary" @click="onSubmit(ruleFormRef)">提交</el-button>
                <el-button v-if="id === undefined" @click="resetForm" style="margin-left:15px">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { _getPageAttrGroup } from '@/api/pms/productAttrGroupApi'
import { _createProductAttr, _getProductAttr, _updateProductAttr } from '@/api/pms/productAttrApi'
import type { ProductAttributeDto } from '@/api/pms/productAttrApi'
import type { AttributeGroup } from '@/api/pms/productAttrGroupApi'
import { cloneDeep } from "lodash";
import { FormInstance } from 'element-plus'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const ruleFormRef = ref<FormInstance>();
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: any,
    type?: any
}>(), {
    visible: false
})
const form = reactive<ProductAttributeDto>({
    filterType: 0,
    handAddStatus: 0,
    inputList: '',
    inputType: 0,
    name: '',
    relatedStatus: 0,
    searchType: 0,
    selectType: 0,
    attrSort: 0,
    type: 0
})
const inputListFormat = ref<string>('')
const productAttrCateList = ref<Array<AttributeGroup>>([])
const defaultProductAttr = cloneDeep(form);
const rules = reactive({
    name: [
        { required: true, message: '请输入属性名称', trigger: 'blur' },
        { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
    ]
})
const id = props.id
const resetProductAttr = () => {
    Object.assign(form, defaultProductAttr);
    form.type = props.type as number;
}
if (id != undefined) {
    _getProductAttr(id).then(res => {
        Object.assign(form, res.data);
        inputListFormat.value = form.inputList.replace(/,/g, '\n');
    });
} else {
    resetProductAttr()
}
watch(() => inputListFormat.value, (val) => {
    let newVal = val.replace(/\n/g, ',')
    form.inputList = newVal
})
const getCateList = () => {
    let listQuery = { pageNo: 1, pageSize: 100 };
    _getPageAttrGroup(listQuery as any).then(res => {
        productAttrCateList.value = res.data.list;
    });
}
getCateList()
const onSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (id != undefined) {
                _updateProductAttr(id, form as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                });
            } else {
                _createProductAttr(form as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                });
            }
        }
    })
}
const resetForm = () => {
    resetProductAttr();
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
</script>

<style scoped></style>
