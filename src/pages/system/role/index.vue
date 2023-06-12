<template>
    <div class="main-container">
        <!--工具栏-->
        <el-form :inline="true" :model="formRef" ref="ruleFormRef">
            <el-form-item prop="name">
                <el-input v-model="formRef.name" placeholder="输入名称">
                </el-input>
            </el-form-item>
            <el-form-item prop="enabled">
                <el-select v-model="formRef.enabled" style="width: 200px" placeholder="状态">
                    <el-option :key="1" :value="1" label="启用"></el-option>
                    <el-option :key="0" :value="0" label="禁用"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch" >
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
            <el-button type="primary" @click="handleAdd" >新增</el-button>
            <el-button type="primary" danger style="margin-left:10px" :disabled="selectedRowKeys.length == 0"
                @click="handleDeleteSelected" >删除</el-button>
        </div>
        <el-table v-loading="loading" :data="data" border style="width: 99.9%;height: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" min-width="50" label="角色名" />
            <el-table-column prop="enabled" min-width="50" label="状态">
                <template v-slot="{ row }">{{ row.gender === 1 ? '启用' : '禁用' }}</template>
            </el-table-column>
            <el-table-column prop="createTime" min-width="50" label="创建日期" />
            <el-table-column label="操作" fixed="right" width="200">
                <template v-slot="{ row }">
                    <el-button link type="primary" @click="(e?: Event) => handleEditRecord(e, row.id)">编辑</el-button>
                    <el-switch v-model="row.enabled" active-color="#13ce66" :active-value="1" :inactive-value="0"
                        @change="handleEnableChange(row, row.enabled)" class="gap-left10" />
                    <el-popconfirm title="确定删除吗？" @confirm="handleDeleteRecord([row.id])">
                        <template #reference>
                            <el-button slot="reference" class="gap-left10" link type="primary">删除</el-button></template>
                    </el-popconfirm>
                    <el-button link type="primary" class="gap-left10"
                        @click="(e?: Event) => handlePermission(e, row.id)">权限设置</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="pagination" @current-change="handleCurrentChange"
            class="pagination-end" />
        <RoleModal v-model:visible="modalVisible" :id="roleId" v-if="modalVisible" @ok="handleOk" />
        <MenuPermission v-model:visible="permissionModalVisible" :id="(roleId as string)" v-if="permissionModalVisible"
            @ok="handleOk" />
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import type { RoleSearch, Role } from '@/api/system/roleApi'
import { _getRolesPage, _deleteRole, _enableRole } from '@/api/system/roleApi'
import RoleModal from './modals/RoleModal.vue';
import MenuPermission from '@/pages/system/menu/modals/MenuPermission.vue';
import { ElMessageBox, FormInstance } from 'element-plus';
const roleId = ref<string>()
const modalVisible = ref<boolean>(false)
const permissionModalVisible = ref<boolean>(false)
const selectedRowKeys = ref<Role[]>([]);
const data = ref<Array<Role | any>>([]);
const pagination = ref<number>(0)
const ruleFormRef = ref<FormInstance>();
const formRef = reactive<Partial<RoleSearch>>({
    pageNo: 1,
    pageSize: 10,
    name: undefined,
    enabled: undefined
})
const loading = ref<boolean>(false)
const handleSelectionChange = (keys: Role[]) => {
    selectedRowKeys.value = keys;
};
const handleSearch = () => {
    formRef.pageNo = 1
    getPageRoles()
}
const getPageRoles = () => {
    loading.value = true
    _getRolesPage(formRef as RoleSearch).then(res => {
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
    formRef.pageNo = val
    getPageRoles();
}
const handleResetSearch = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    roleId.value = undefined
    modalVisible.value = true;
}
const handleDeleteSelected = (e?: Event) => {
    e?.preventDefault()
    if (selectedRowKeys.value.length > 0) {
        ElMessageBox.confirm(
            '是否删除选中角色？',
            '系统提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'info',
            }
        )
            .then(() => {
                handleDeleteRecord(selectedRowKeys.value.map(item => item.id))
            })
            .catch(() => {

            })
    }
}
const handlePermission = (e?: Event, id?: string) => {
    e?.preventDefault()
    roleId.value = id
    permissionModalVisible.value = true;
}
const handleEditRecord = (e?: Event, id?: string) => {
    e?.preventDefault()
    roleId.value = id
    modalVisible.value = true;
}
const handleDeleteRecord = (ids: string[]) => {
    _deleteRole(ids).then(res => {
        getPageRoles()
    })
}
const handleOk = () => {
    handleSearch()
};
const handleEnableChange = (record: Role, enabled: number) => {
    record.enabled = enabled
    _enableRole(record.id, enabled).then(res => {
        getPageRoles()
    })
}
handleSearch()
</script>
<style lang="scss" scoped></style>