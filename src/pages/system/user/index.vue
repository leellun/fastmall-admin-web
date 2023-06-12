<template>
    <div class="main-container">
        <!--工具栏-->
        <el-form ref="ruleFormRef" :inline="true" :model="ruleForm">
            <el-form-item prop="blurry">
                <el-input v-model="ruleForm.blurry" placeholder="输入名称或者邮箱搜索">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="timeRangeRef" type="datetimerange" range-separator="To" start-placeholder="开始时间"
                    end-placeholder="结束时间" />
            </el-form-item>
            <el-form-item prop="enabled">
                <el-select v-model="ruleForm.enabled" style="width: 200px" placeholder="状态">
                    <el-option :value="1" label="启用"></el-option>
                    <el-option :value="0" label="禁用"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit">
                    搜索
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleResetSearch(ruleFormRef)">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button type="primary" danger style="margin-left:10px" :disabled="selectedRowKeys.length == 0"
                @click="deleteUsers">删除</el-button>
        </div>
        <el-table v-loading="loading" :data="data" border style="width: 99.9%;height: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="username" min-width="50" label="用户名" />
            <el-table-column prop="nickName" min-width="50" label="昵称" />
            <el-table-column prop="gender" min-width="50" label="性别">
                <template v-slot="{ row }">{{ row.gender === 1 ? '男' : '女' }}</template>
            </el-table-column>
            <el-table-column prop="phone" min-width="50" label="电话" />
            <el-table-column prop="email" min-width="50" label="邮箱" />
            <el-table-column prop="roleNames" min-width="50" label="角色">
                <template v-slot="{ row }">{{ getRoleNames(row.roleNames) }}</template>
            </el-table-column>
            <el-table-column prop="createTime" min-width="50" label="创建时间" />
            <el-table-column prop="lastLoginTime" min-width="50" label="最后一次登录时间" />
            <el-table-column prop="enabled" min-width="50" label="状态">
                <template v-slot="{ row }">{{ row.gender === 1 ? '启用' : '禁用' }}</template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="200">
                <template v-slot="{ row }">
                    <el-button link type="primary" @click="(e?: Event) => editUser(e, row.id)">编辑</el-button>
                    <el-switch v-model="row.enabled" active-color="#13ce66" :active-value="1" :inactive-value="0"
                        @change="handleEnableChange(row.id, row.enabled)" class="gap-left10" />
                    <el-popconfirm title="确定删除吗？" @confirm="deleteUser([row.id])">
                        <template #reference>
                            <el-button slot="reference" class="gap-left10" link type="primary">删除</el-button></template>
                    </el-popconfirm>
                    <el-popconfirm title="是否重置密码？" @confirm="resetPassword(row.id)">
                        <template #reference>
                            <el-button link type="primary" class="gap-left10">重置密码</el-button></template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="pagination" @current-change="handleCurrentChange"
            class="pagination-end" />
        <UserModal v-model:visible="userVisible" :id="userId" v-if="userVisible" @ok="handleOk" />
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { _getUsersPage, _deleteUser, _resetPass, _enableUser } from '@/api/system/userApi'
import type { UserSearch, UserItem } from '@/api/system/userApi'
import { ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import { formatDate } from '@/utils/DateUtil'
import UserModal from './drawer/UserModal.vue';

const timeRangeRef = ref<[Date, Date]>()
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<Partial<UserSearch>>({
    pageNo: 1,
    pageSize: 10,
    blurry: '',
})

const loading = ref(false)
const userId = ref<string>()
const selectedRowKeys = ref<UserItem[]>([]);
const userVisible = ref<boolean>(false);
const handleOk = () => {
    handleSubmit()
};
const pagination = ref<number>(0)
const handleSelectionChange = (val: UserItem[]) => {
    selectedRowKeys.value = val;
};
const getRoleNames = (roleNames: Array<string>) => {
    if (roleNames == null || roleNames == undefined) {
        return null;
    }
    return roleNames.join(',')
}
const data = ref<Array<UserItem | any>>([]);

const handleSubmit = (e?: Event) => {
    e?.preventDefault();
    ruleForm.pageNo = 1
    getUsersPage()
}
const getUsersPage = () => {
    if (timeRangeRef.value != null) {
        ruleForm.createTime = []
        ruleForm.createTime.push(formatDate(timeRangeRef.value[0], "yyyy-MM-dd 00:00:00"))
        ruleForm.createTime.push(formatDate(timeRangeRef.value[1], "yyyy-MM-dd 00:00:00"))
    } else {
        ruleForm.createTime = []
    }
    loading.value = true
    _getUsersPage(ruleForm as UserSearch).then(res => {
        pagination.value = res.data.pages
        data.value = res.data.list
        data.value.forEach(item => {
            item.key = item.id
        })
    }).finally(() => {
        loading.value = false
    })
}
const handleCurrentChange = (val: number) => {
    ruleForm.pageNo = val
    getUsersPage();
}
const handleResetSearch = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    timeRangeRef.value = undefined
    ruleForm.enabled = undefined
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    userId.value = undefined
    userVisible.value = true;
}
handleSubmit()
const resetPassword = (id: string) => {
    _resetPass(id)
}
const editUser = (e?: Event, id?: string) => {
    e?.preventDefault()
    userId.value = id
    userVisible.value = true;
}
const deleteUsers = () => {
    if (selectedRowKeys.value.length > 0) {
        ElMessageBox({
            title: "系统提示",
            message: "是否删除选中用户？",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
        }).then(() => {
            deleteUser(selectedRowKeys.value.map(item => item.id))
        });

    }
}
const deleteUser = (ids: string[]) => {
    _deleteUser(ids).then(res => {
        getUsersPage()
    })
}
const handleEnableChange = (id: string, enabled: number) => {
    _enableUser(id, enabled).then(res => {
        getUsersPage()
    })
}
</script>
  
<style lang="scss" scoped></style>
  