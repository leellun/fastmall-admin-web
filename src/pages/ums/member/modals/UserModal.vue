<template>
    <!-- 用户编辑对话框 -->
    <el-dialog v-model="props.visible" title="用户编辑" :before-close="handleCancel">
        <el-form ref="ruleFormRef" :model="userDetail" status-icon label-position="left" label-width="100px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="userDetail.username" :disabled="true" />
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="userDetail.nickname" />
            </el-form-item>
            <el-form-item label="用户手机" prop="mobile">
                <el-input v-model="userDetail.mobile" />
            </el-form-item>
            <el-form-item label="用户性别" prop="gender">
                <el-select v-model="userDetail.gender" placeholder="请选择"><el-option v-for="(item, index) in genderDic"
                        :key="index" :label="item" :value="index" /></el-select>
            </el-form-item>
            <el-form-item label="用户等级" prop="userLevel">
                <el-select v-model="userDetail.userLevel" placeholder="请选择"><el-option v-for="(item, index) in levelDic"
                        :key="index" :label="item" :value="index" /></el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="userDetail.status" placeholder="请选择"><el-option v-for="(item, index) in statusDic"
                        :key="index" :label="item" :value="index" /></el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleOk(ruleFormRef)">确定</el-button>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { User } from '@/api/ums/userApi'
import { _userDetail, _updateUser } from '@/api/ums/userApi'
import { FormInstance } from 'element-plus'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: string
}>(), {
    visible: false
})
const userDetail = reactive<Partial<User>>({
    username: undefined,
    nickname: undefined,
    mobile: undefined,
    gender: undefined,
    userLevel: undefined,
});
const ruleFormRef = ref<FormInstance>();
const genderDic = ['未知', '男', '女']
const levelDic = ['普通用户', 'VIP用户', '高级VIP用户']
const statusDic = ['可用', '禁用', '注销']

_userDetail(props.id).then(res => {
    Object.assign(userDetail, res.data)
}).catch((e) => {
    handleCancel()
})
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.id) {
                _updateUser(userDetail as User).then(res => {
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
<style lang="scss" scoped></style>