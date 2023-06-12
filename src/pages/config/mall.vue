<template>
  <div class="app-container">
    <el-form ref="ruleFormRef" :rules="rules" :model="dataForm" status-icon label-width="300px">
      <el-form-item label="商场名称" prop="mall_mall_name">
        <el-input v-model="dataForm.mall_mall_name" />
      </el-form-item>
      <el-form-item label="商场地址" prop="mall_mall_address">
        <el-input v-model="dataForm.mall_mall_address" />
      </el-form-item>
      <el-form-item label="地理坐标">
        <el-col :span="11">
          <el-input v-model="dataForm.mall_mall_longitude" placeholder="经度" />
        </el-col>
        <el-col :span="2" style="text-align: center;">-</el-col>
        <el-col :span="11">
          <el-input v-model="dataForm.mall_mall_latitude" placeholder="纬度" />
        </el-col>
      </el-form-item>
      <el-form-item label="联系电话" prop="mall_mall_phone">
        <el-input v-model="dataForm.mall_mall_phone" />
      </el-form-item>
      <el-form-item label="联系QQ" prop="mall_mall_qq">
        <el-input v-model="dataForm.mall_mall_qq" />
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
import { _listMall, _updateMall } from '@/api/config/configApi'
import { FormInstance } from 'element-plus';

const dataForm = reactive<any>({
  mall_mall_name: '',
  mall_mall_address: '',
  mall_mall_phone: '',
  mall_mall_qq: '',
  mall_mall_longitude: '',
  mall_mall_latitude: ''
})
const ruleFormRef = ref<FormInstance>();
const rules = reactive({
  mall_mall_name: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mall_mall_address: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mall_mall_phone: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mall_mall_qq: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ]
})
const listConfig = () => {
  _listMall().then(res => {
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
      _updateMall(configs)
    } else {
      console.log("error submit!", fields);
    }
  })
}
listConfig()
</script>
