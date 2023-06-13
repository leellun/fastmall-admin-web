<template>
    <div class="list-adapt-container">
        <el-upload class="upload-btn" :action="uploadPath" name="files" multiple :headers="headers" :show-file-list="false"
            :on-success="uploadSuccess" :on-exceed="onHandleExceed" :on-error="onHandleUploadError" :limit="props.limit">
            <el-button size="small" type="primary">上传附件</el-button>
        </el-upload>

        <el-card shadow="hover">
            <div v-if="data.length > 0">
                <el-row :gutter="15">
                    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb15" v-for="(v, k) in data" :key="k">
                        <el-card :body-style="{ padding: '0px' }">
                            <img :src="v.url" fit="fill" class="image">
                            <div style="padding: 14px;">
                                <span>{{ v.name }}</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <el-empty v-else description="暂无数据"></el-empty>
            <template v-if="data.length > 0">
                <el-pagination background layout="prev, pager, next" :page-size="pages"
                    @current-change="handleCurrentChange" />
            </template>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { _listStorage, uploadPath } from '@/api/pms/storageApi'
import type { StorageSearch, Storage } from '@/api/pms/storageApi'
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user'
const userStore = useUserStore()

const headers = computed(() => {
    return { Authorization: `Bearer ${userStore.token}` }
})
var props = withDefaults(defineProps<{
    limit: number
}>(), { limit: 1 })
var pageSearch = reactive<Partial<StorageSearch>>({
    pageNo: 1,
    pageSize: 10
})
var data = ref<Array<Storage>>([])
var pageNum = ref<number>(0)
var pages = ref<number>(0)

const uploadSuccess = (res: any) => {
    if (res.code == 200) {
        initTableData();
    } else {
        ElMessage.error(res.message);
    }
}

const onHandleExceed = () => {
    ElMessage.error("上传文件数量不能超过 " + props.limit + " 个!");
}
// 上传失败
const onHandleUploadError = () => {
    ElMessage.error("上传失败");
}
const handleCurrentChange = (val: number) => {
    pageSearch.pageNo = val
    initTableData();
}
const initTableData = () => {
    _listStorage(pageSearch as any).then((res) => {
        pageNum.value = res.data.pageNum
        data.value = res.data.list
        pages.value = res.data.pages
    });
}
initTableData();
</script>

<style scoped lang="scss">
.upload-btn {
    padding-bottom: 10px;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: 100%;
    height: 200px;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>
