<template>
    <div class="app-container">

        <el-form ref="ruleFormRef" :rules="rules" :model="topic" status-icon label-position="left" label-width="100px"
            style="width: 800px; margin-left:50px;">
            <el-form-item label="专题标题" prop="title">
                <el-input v-model="topic.title" />
            </el-form-item>
            <el-form-item label="专题子标题" prop="subtitle">
                <el-input v-model="topic.subtitle" />
            </el-form-item>
            <el-form-item label="专题图片" prop="picUrl">
                <el-upload :headers="headers" :action="uploadPath" :show-file-list="false" :on-success="uploadPicUrl"
                    class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif">
                    <img v-if="topic.picUrl" :src="topic.picUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
            </el-form-item>
            <el-form-item label="专题内容" prop="content">
                <tinymce :width="595" :height="300" v-model:value="topic.content"></tinymce>
            </el-form-item>
            <el-form-item label="商品低价" prop="price">
                <el-input v-model="topic.price" />
            </el-form-item>
            <el-form-item label="阅读量" prop="readCount">
                <el-input v-model="topic.readCount" />
            </el-form-item>
            <el-form-item label="专题商品" prop="goods">
                <el-button style="float:right;" type="primary" @click="handleCreate()">创建商品</el-button>

                <!-- 查询结果 -->
                <el-table :data="goodsList" border fit highlight-current-row>

                    <el-table-column align="center" label="商品ID" prop="id" />
                    <el-table-column align="center" property="picUrl" label="图片">
                        <template v-slot="{ row }">
                            <img :src="row.picUrl" width="60">
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商品名称" prop="name" />
                    <el-table-column align="center" label="商品介绍" prop="brief" />
                    <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
                        <template v-slot="{ row }">
                            <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleConfirm(ruleFormRef)">确定</el-button>
        </div>

        <TopicGoodsModal v-model:visible="modalVisible" v-if="modalVisible" @ok="handleOk" />
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Topic } from '@/api/sms/topicApi'
import { _createTopic } from '@/api/sms/topicApi'
import { uploadPath } from '@/api/pms/storageApi'
import Tinymce from '@/components/Tinymce/index.vue'
import { FormInstance } from 'element-plus'
import TopicGoodsModal from './modals/TopicGoodsModal.vue'
import { useUserStore } from '@/store/user'
const ruleFormRef = ref<FormInstance>();
const userStore = useUserStore()
const router = useRouter();
const headers = computed(() => {
    return { Authorization: `Bearer ${userStore.token}` }
})

const goodsList = ref<Array<any>>([])
const topic = reactive<Partial<Topic>>({
    picUrl: undefined,
    goods: []
})
const modalVisible = ref(false);
const rules = reactive({
    title: [
        { required: true, message: '专题标题不能为空', trigger: 'blur' }
    ],
    subtitle: [
        { required: true, message: '专题子标题不能为空', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '专题内容不能为空', trigger: 'blur' }
    ],
    price: [
        { required: true, message: '专题低价不能为空', trigger: 'blur' }
    ]
})
const handleConfirm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            _createTopic(topic as any).then(res => {
                router.push({ name: 'topic' })
            })
        }
    })
}
const uploadPicUrl = (response: any) => {
    topic.picUrl = response.data.url
}
const handleCreate = () => {
    modalVisible.value = true
}
const handleOk = (selectedlist: Array<any>) => {
    const newGoodsIds = new Array<any>()
    const newGoodsList = new Array<any>()
    selectedlist.forEach(item => {
        const id = item.id
        let found = false
        topic.goods!.forEach(goodsId => {
            if (id === goodsId) {
                found = true
            }
        })
        if (!found) {
            newGoodsIds.push(id)
            newGoodsList.push(item)
        }
    })

    if (newGoodsIds.length > 0) {
        topic.goods = topic?.goods?.concat(newGoodsIds)
        goodsList.value = goodsList.value.concat(newGoodsList)
    }
}
const handleDelete = (row: any) => {
    for (var index = 0; index < topic.goods!.length; index++) {
        if (row.id === topic.goods![index]) {
            topic.goods!.splice(index, 1)
        }
    }
    for (var index2 = 0; index2 < goodsList.value.length; index2++) {
        if (row.id === goodsList.value[index2].id) {
            goodsList.value.splice(index2, 1)
        }
    }
}
const handleCancel = () => {
    router.push({ name: 'topic' })
}
</script>
<style>
.el-dialog {
    width: 800px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}

.avatar {
    width: 145px;
    height: 145px;
    display: block;
}
</style>
  