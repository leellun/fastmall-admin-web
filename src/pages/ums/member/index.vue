<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;"
                placeholder="请输入用户名" />
            <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading" :data="data"  border fit highlight-current-row>
            <el-table-column align="center" width="100px" label="用户ID" prop="id" sortable />

            <el-table-column align="center" label="用户名" prop="username" />
            <el-table-column align="center" label="用户昵称" prop="nickname" />

            <el-table-column align="center" label="用户头像" width="80">
                <template v-slot="{ row }">
                    <el-avatar :src="row.avatar" />
                </template>
            </el-table-column>

            <el-table-column align="center" label="手机号码" prop="mobile" />

            <el-table-column align="center" label="性别" prop="gender">
                <template v-slot="{ row }">
                    <el-tag>{{ genderDic[row.gender] }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="生日" prop="birthday" />

            <el-table-column align="center" label="用户等级" prop="userLevel">
                <template v-slot="{ row }">
                    <el-tag>{{ levelDic[row.userLevel] }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="状态" prop="status">
                <template v-slot="{ row }">
                    <el-tag>{{ statusDic[row.status] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
                <template v-slot="{ row }">
                    <el-button type="primary"  @click="handleDetail(row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />
        <UserModal v-model:visible="modalVisible" v-if="modalVisible" :id="userId" @ok="handleOk" />
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { UserSearch, User } from '@/api/ums/userApi'
import { _userList } from '@/api/ums/userApi'
import UserModal from './modals/UserModal.vue';
const modalVisible = ref<boolean>(false);
const userId = ref<any>()
const genderDic = ['未知', '男', '女']
const levelDic = ['普通用户', 'VIP用户', '高级VIP用户']
const statusDic = ['可用', '禁用', '注销']
const listQuery = reactive<Partial<UserSearch>>({
    pageNo: 1,
    order: 'create_time',
    username: '',
    mobile: ''
});
const listLoading = ref(false);
const data = ref<Array<any>>([]);
const total = ref<number>(0)
const handleCurrentChange = (val: number) => {
    listQuery.pageNo = val
    getList();
}
const getList = () => {
    listLoading.value = true
    _userList(listQuery as any).then(res => {
        total.value = res.data.pages
        data.value = res.data.list
    }).finally(() => {
        listLoading.value = false
    })
}
const handleDetail = (row: User) => {
    userId.value = row.id
    modalVisible.value = true
}
const handleFilter = () => {
    listQuery.pageNo = 1
    getList()
}
const handleOk = () => {
    getList()
}
getList();
</script>
  