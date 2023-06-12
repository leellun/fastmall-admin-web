<template>
  <div class="app-container">
    <el-form ref="ruleFormRef" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px"
      style="width: 400px; margin-left:50px;">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="dataForm.oldPassword" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="dataForm.newPassword" type="password" auto-complete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="newPassword2">
        <el-input v-model="dataForm.newPassword2" type="password" auto-complete="off" />
      </el-form-item>
    </el-form>
    <div style="margin-left:100px;">
      <el-button @click="cancel(ruleFormRef)">取消</el-button>
      <el-button type="primary" @click="change(ruleFormRef)">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { _changePassword } from '@/api/system/profileApi'
import { FormInstance } from 'element-plus';
const dataForm = reactive<any>({
  oldPassword: '',
  newPassword: '',
  newPassword2: ''
})
const ruleFormRef = ref<FormInstance>();
const rules = reactive({
  oldPassword: [
    { required: true, message: '旧密码不能为空', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }, trigger: 'blur'
    }
  ],
  newPassword2: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== dataForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }, trigger: 'blur'
    }
  ]
})
const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  Object.assign(dataForm, {
    oldPassword: '',
    newPassword: '',
    newPassword2: ''
  })
  formEl.clearValidate()
}
const change = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      _changePassword(dataForm).then(res => {
        formEl.clearValidate()
      })
    }
  })
}
</script>
