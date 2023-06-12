<template>
  <div class="app-container">
    <el-form ref="ruleFormRef" :rules="rules" :model="dataForm" status-icon label-width="300px">
      <el-form-item label="运费满减所需最低消费" prop="mall_express_freight_min">
        <el-input v-model="dataForm.mall_express_freight_min" />
      </el-form-item>
      <el-form-item label="运费满减不足所需运费" prop="mall_express_freight_value">
        <el-input v-model="dataForm.mall_express_freight_value" />
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="update(ruleFormRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Config } from '@/api/config/configApi'
import { _listExpress, _updateExpress } from '@/api/config/configApi'
import { FormInstance } from 'element-plus';

const dataForm = reactive<any>({
  mall_express_freight_min: 0,
  mall_express_freight_value: 0
})
const ruleFormRef = ref<FormInstance>();
const rules = reactive({
  mall_express_freight_min: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mall_express_freight_value: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ]
})
const listConfig = () => {
  _listExpress().then(res => {
    res.data.forEach(item => {
      if (dataForm.hasOwnProperty(item.keyName)) {
        dataForm[item.keyName] = item.keyValue
      }
    })
  })
}
const cancel = () => {
  listConfig()
}
const update = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      let configs = new Array<Config>()
      Object.keys(dataForm).forEach(key => {
        configs.push({
          keyName: key,
          keyValue: dataForm[key]
        } as any)
      })
      _updateExpress(configs)
    } else {
      console.log("error submit!", fields);
    }
  })
}
listConfig()
</script>
