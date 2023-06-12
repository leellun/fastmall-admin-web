<template>
  <el-dialog v-model="props.visible" :title="id ? '编辑用户' : '新增用户'" :before-close="handleCancel">
    <el-form :model="form" ref="ruleFormRef" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入登录名称" :readOnly="!!id" v-model="form.username" suffix="初始密码：123456" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input placeholder="请输入真实姓名" v-model="form.realName" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input placeholder="请输入用户昵称" v-model="form.nickName" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input placeholder="请输入手机号码" v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input placeholder="请输入邮箱" v-model="form.email" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select placeholder="请选择" v-model="form.gender">
          <el-option :key="1" label="男" :value="1" />
          <el-option :key="0" label="女" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="form.roleIds" multiple placeholder="请选择">
          <el-option v-for="(item, index) in roleList" :key="index" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleOk(ruleFormRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { UserRequest } from '@/api/system/userApi'
import { _addUser, _getUser, _updateUser } from '@/api/system/userApi'
import type { Role } from '@/api/system/roleApi'
import { _getAllRoles } from '@/api/system/roleApi'
import { ref, reactive } from 'vue'
import { FormInstance } from 'element-plus'
const props = withDefaults(defineProps<{
  visible: boolean,
  id?: string
}>(), {
  visible: false
})
const form = reactive<Partial<UserRequest>>({
  username: undefined,
  realName: undefined,
  nickName: undefined,
  phone: undefined,
  email: undefined,
  gender: undefined,
  roleIds: []
})
const roleList = ref<Array<Role>>([])
const emit = defineEmits(["update:visible", "ok", "cancel"])
const ruleFormRef = ref<FormInstance>();
const rules = reactive({
  username: [
    {
      required: true,
      message: "必须输入账号",
      trigger: "blur"
    }, {
      validator: (rule: any, value: string) => {
        const regex = /^(1[34578]\d{9})|([a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]{2,3}){1,2})|([a-zA-Z0-9_-]{4,16})$/
        if (regex.test(value)) {
          return Promise.resolve()
        } else {
          return Promise.reject()
        }
      },
      trigger: 'change'
    }
  ],
  realName: [{
    required: true,
    message: '必须输入真实姓名',
    trigger: "blur"
  }, {
    validator: (rule: any, value: string) => {
      const regex = /^[\u4e00-\u9fa5\u4e00-\u9fa5]{2,10}$/
      if (regex.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject()
      }
    },
    trigger: 'change'
  }],
  nickName: [{
    required: true,
    message: '必须输入昵称',
    validateTrigger: "blur"
  }, {
    validator: (rule: any, value: string) => {
      const regex = /^([\u4e00-\u9fa5\u4e00-\u9fa5]{2,10})|(\S{1,15})$/
      if (regex.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject()
      }
    },
    trigger: 'change'
  }],
  phone: [{
    validator: (rule: any, value: string) => {
      if (value === undefined || value === '' || value === null) {
        return Promise.resolve()
      }
      const regex = /^\d{11}$/
      if (regex.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject()
      }
    },
    trigger: 'change'
  }],
  email: [{
    validator: (rule: any, value: string) => {
      if (value === undefined || value === '' || value === null) {
        return Promise.resolve()
      }
      const regex = /^([a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject()
      }
    },
    trigger: 'change'
  }],
  gender: [{
    required: true,
    message: '必须选择性别',
    trigger: "blur"
  }],
  roleIds: [{
    required: true,
    message: '必须选择角色',
    trigger: "blur"
  }],
})
const getUser = () => {
  _getUser(props.id as string).then(res => {
    Object.assign(form, res.data)
    form.id = props.id
  })
}
if (props.id) {
  getUser()
}
const getAllRoles = () => {
  _getAllRoles().then(res => {
    roleList.value.push(...res.data)
  })
}
getAllRoles()
const handleOk = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      if (props.id) {
        _updateUser(form as UserRequest).then(res => {
          emit("update:visible", false)
          emit("ok")
        })
      } else {
        _addUser(form as UserRequest).then(res => {
          emit("update:visible", false)
          emit("ok")
        })
      }
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

<style scoped lang="scss"></style>