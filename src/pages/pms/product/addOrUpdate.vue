<template>
    <div class="app-container">

        <el-card class="box-card">
            <h3>商品介绍</h3>
            <el-form ref="ruleFormRef" :rules="rules" :model="goodsForm" label-width="150px">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="goodsForm.name" />
                </el-form-item>
                <el-form-item label="市场售价" prop="counterPrice">
                    <el-input v-model="goodsForm.counterPrice" placeholder="0.00">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="是否新品" prop="isNew">
                    <el-radio-group v-model="goodsForm.isNew">
                        <el-radio :label="1">新品</el-radio>
                        <el-radio :label="0">非新品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否热卖" prop="isHot">
                    <el-radio-group v-model="goodsForm.isHot">
                        <el-radio :label="1">普通</el-radio>
                        <el-radio :label="0">热卖</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否在售" prop="isOnSale">
                    <el-radio-group v-model="goodsForm.isOnSale">
                        <el-radio :label="1">在售</el-radio>
                        <el-radio :label="0">未售</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="商品图片">
                    <el-upload :action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadPicUrl"
                        class="avatar-uploader" accept=".jpg,.jpeg,.png,.gif">
                        <img v-if="goodsForm.picUrl" :src="goodsForm.picUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                </el-form-item>

                <el-form-item label="宣传画廊">
                    <el-upload :action="uploadPath" :limit="5" :headers="headers" :on-exceed="uploadOverrun"
                        v-model:file-list="fileList" multiple accept=".jpg,.jpeg,.png,.gif" list-type="picture-card">
                        <i class="el-icon-plus" />
                    </el-upload>
                </el-form-item>

                <el-form-item label="商品单位">
                    <el-input v-model="goodsForm.unit" placeholder="件 / 个 / 盒" />
                </el-form-item>

                <el-form-item label="关键字">
                    <el-tag v-for="tag in keywords" :key="tag" closable type="success" @close="handleClose(tag)">
                        {{ tag }}
                    </el-tag>
                    <el-input v-if="newKeywordVisible" v-model="newKeyword" class="input-new-keyword"
                        @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" />
                    <el-button v-else class="button-new-keyword" type="primary" @click="showInput">+ 增加</el-button>
                </el-form-item>

                <el-form-item label="所属品牌商">
                    <el-select v-model="goodsForm.brandId" clearable filterable placeholder="请选择" no-match-text="请选择">
                        <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-cascader :options="categoryList" v-model="categorys" expand-trigger="hover" clearable
                        @change="handleCategoryChange" />
                </el-form-item>
                <el-form-item label="属性分组">
                    <el-select v-model="goodsForm.goodsGroupId" clearable filterable @change="" no-match-text="请选择">
                        <el-option v-for="item in attributeGroups" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>


                <el-form-item label="商品简介">
                    <el-input v-model="goodsForm.brief" />
                </el-form-item>

                <el-form-item label="商品详细介绍">
                    <tinymce style="width:100%;max-width: 1100px;" :height="300" v-model:value="goodsForm.detail"></tinymce>
                </el-form-item>
            </el-form>
        </el-card>
        <ProductSpecSelect v-model:value="goodsSaleAttrVos" v-model:goodsProducts="goodsProducts"
            :group-id="goodsForm.goodsGroupId" />
        <el-card class="box-card">
            <h3>商品参数</h3>
            <AttributesSelect v-model:value="goodsAttributes" :group-id="goodsForm.goodsGroupId"
                style="margin-top: 10px;" />
        </el-card>

        <div class="op-container">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handlePublish(ruleFormRef)">上架</el-button>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { _publishGoods, _listCatAndBrand, _deleteGoods, _detailGoods, _editGoods } from '@/api/pms/goodsApi'
import type { AttributeGroup } from '@/api/pms/productAttrGroupApi'
import { _getTotalAttrGroup } from '@/api/pms/productAttrGroupApi'
import { _createStorage, uploadPath } from '@/api/pms/storageApi'
//   import { _createStorage, uploadPath } from '@/api/pms/brand'
import type { Goods, GoodsAttributeValue, GoodsSaleAttrVo, GoodsProductVo } from '@/api/pms/goodsApi'
import { _getGroupBindAttribute } from '@/api/pms/productAttrApi'
import AttributesSelect from './components/AttributesSelect.vue'
import ProductSpecSelect from './components/ProductSpecSelect.vue'
import { ElMessage, FormInstance, UploadUserFile } from 'element-plus'
import events from '@/utils/eventBus'
import { useRouter } from 'vue-router'
import Tinymce from '@/components/Tinymce/index.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const router = useRouter();
const headers = computed(() => {
    return { Authorization: `Bearer ${userStore.token}` }
})
const goodsId = router.currentRoute.value.query.id

const brandList = ref<Array<any>>([])
const categorys = ref<Array<any>>([])

const attributeGroups = ref<Array<AttributeGroup>>([])
const newKeywordVisible = ref<boolean>(false)

const newKeyword = ref<string>('')
const keywords = ref<Array<string>>([])

const goodsForm = reactive<Partial<Goods>>({
    picUrl: '', gallery: [], isHot: 0, isNew: 1, isOnSale: 1, detail: '', categoryId: undefined
})
const goodsProducts = ref<Array<GoodsProductVo>>([])
const goodsSaleAttrVos = ref<Array<GoodsSaleAttrVo>>([])
const goodsAttributes = ref<Array<GoodsAttributeValue>>([])

const rules = reactive({
    goodsSn: [{ required: true, message: '商品编号不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
})
const ruleFormRef = ref<FormInstance>();
const categoryList = ref<Array<any>>([])
const fileList = ref<UploadUserFile[]>([])
_listCatAndBrand().then(res => {
    categoryList.value = res.data.categoryList
    brandList.value = res.data.brandList
})
watch(() => goodsForm.categoryId, (val) => {
    if (goodsForm.categoryId != undefined) {
        getAttrGroups(goodsForm.categoryId)
    } else {
        goodsForm.goodsGroupId = undefined
        attributeGroups.value = []
    }
})
const getAttrGroups = (val: any) => {
    _getTotalAttrGroup(val).then(res => {
        attributeGroups.value = res.data
    })
}

const handleCategoryChange = (value: any) => {
    goodsForm.categoryId = value[value.length - 1]
    goodsForm.goodsGroupId = undefined
}
const handleCancel = () => {
    gotoProductListPage()
}
const handlePublish = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            const finalGoods = {
                goods: goodsForm,
                goodsSaleAttrVos: goodsSaleAttrVos.value,
                products: goodsProducts.value,
                attributes: goodsAttributes.value
            }
            if (goodsId) {
                _editGoods(goodsId, finalGoods as any).then(res => {
                    gotoProductListPage()
                })
            } else {
                _publishGoods(finalGoods as any).then(res => {
                    gotoProductListPage()
                })
            }
        }
    })
}
const getGoodsDetail = (id: any) => {
    _detailGoods(id).then(res => {
        Object.assign(goodsForm, res.data.goods)
        goodsSaleAttrVos.value = res.data.goodsSaleAttrVos
        goodsAttributes.value = res.data.attributes
        goodsProducts.value = res.data.products
        categorys.value = res.data.categoryIds
        if (goodsForm.gallery) {
            goodsForm.gallery.forEach(item => {
                fileList.value.push({
                    name: item,
                    url: item
                } as any)
            })

        }
    })
}
const gotoProductListPage = () => {
    events.emit("closeSelectedTag")
    router.push({ name: 'product' })
}
const handleClose = (tag: any) => {
    keywords.value.splice(keywords.value.indexOf(tag), 1)
    goodsForm.keywords = keywords.value
}
const showInput = () => {
    newKeywordVisible.value = true
}
const handleInputConfirm = () => {
    const newKeywordStr = newKeyword.value
    if (newKeywordStr) {
        keywords.value.push(newKeywordStr)
        goodsForm.keywords = keywords.value
    }
    newKeywordVisible.value = false
    newKeyword.value = ''
}
const uploadOverrun = () => {
    ElMessage.error('上传文件个数超出限制!最多上传5张图片!')
}
const uploadPicUrl = (response: any) => {
    goodsForm.picUrl = response.data.url
}

if (goodsId) {
    getGoodsDetail(router.currentRoute.value.query.id)
}
</script>
<style lang="scss" scoped>
.el-card {
    margin-bottom: 10px;
}

.el-tag+.el-tag {
    margin-left: 10px;
}

.input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.avatar-uploader .el-upload {
    width: 145px;
    height: 145px;
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

.op-container {
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
}
</style>