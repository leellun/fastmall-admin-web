<template>
    <div>
        <el-card class="box-card">
            <h3>商品规格</h3>
            <el-tabs type="border-card" v-model="tabPosition" style="margin-top: 10px;">
                <el-tab-pane name="bind" label="已选择列表">
                    <el-form v-for="filterItem in filterData" label-width="80px">
                        <el-form-item :label="filterItem.name + '：'">
                            <el-checkbox-group v-model="filterItem.goodsSpecs">
                                <el-checkbox v-for="item in filterItem.values" :label="item">{{ item.value }}</el-checkbox>
                            </el-checkbox-group>
                            <div style="flex-grow:1;justify-content:flex-end">
                                <el-button type="danger" @click="handleAttributeDelete(filterItem)"
                                    style="float:right">删除</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-form>
                                <el-form-item v-for="item in filterItem.goodsSpecs" :label="item.value"
                                    style="margin-top: 10px;">
                                    <SingleUpload v-model:value="item.picUrl" upload-class="sale-attr-upload" />
                                </el-form-item>
                            </el-form>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSyncSku">同步SKU</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- <el-table :data="filterData">
                        <el-table-column prop="name" label="规格名" />
                        <el-table-column prop="value" label="可选值">
                            <template v-slot="{ row }">
                                <el-input v-model="row.value" placeholder="请输入" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="value" label="规格图片">
                            <template v-slot="{ row }">
                                <SingleUpload v-model:value="item.picUrl" upload-class="sale-attr-upload"
                                    v-for="item in props.value" />
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
                            <template v-slot="{ row }">
                                <el-button type="danger" @click="handleAttributeDelete(row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table> -->
                </el-tab-pane>
                <el-tab-pane name="unbind" label="可选择列表">
                    <el-table :data="waitFilterData">
                        <el-table-column align="center" label="属性名" prop="name" />
                        <el-table-column align="center" label="选择类型" prop="selectType">
                            <template v-slot="{ row }">
                                {{ selectTypeStr(row) }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="分类筛选样式" prop="filterType">
                            <template v-slot="{ row }">
                                {{ row.filterType === 1 ? '多选' : '普通' }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="检索类型" prop="searchType">
                            <template v-slot="{ row }">
                                {{ searchTypeStr(row) }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="支持手动新增" prop="handAddStatus">
                            <template v-slot="{ row }">
                                {{ row.handAddStatus === 1 ? '支持' : '不支持' }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="属性的类型" prop="type">
                            <template v-slot="{ row }">
                                {{ row.type === 0 ? '规格' : '参数' }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="是否有图片" prop="hasPic">
                            <template v-slot="{ row }">
                                {{ row.hasPic === 1 ? '有' : '无' }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="录入方式" prop="inputType">
                            <template v-slot="{ row }">
                                <span v-if="row.inputType === 0">手工录入</span>
                                <span v-else>列表选择</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
                            <template v-slot="{ row }">
                                <el-button type="danger" @click="handleAttributeAdd(row)">添加</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-card class="box-card">
            <h3>商品库存</h3>
            <el-table :data="goodsProducts" v-if="props.value.length > 0">
                <el-table-column property="goodsProductSpecRelations" v-for="(saleAttr, i) in props.value"
                    :label="saleAttr.name">
                    <template v-slot="{ row }">
                        {{ row.goodsProductSpecRelations[i].value }}
                    </template>
                </el-table-column>
                <el-table-column property="price" width="100" label="货品售价" />
                <el-table-column property="number" width="100" label="货品数量" />
                <el-table-column property="url" width="100" label="货品图片">
                    <template v-slot="{ row }">
                        <SingleUpload v-model:value="row.url" upload-class="sale-attr-upload" />
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
                    <template v-slot="{ row }">
                        <el-button type="primary" @click="handleProductDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
    </div>
</template>
  
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { GoodsSaleAttrVo, GoodsProductVo, GoodsSpecification } from '@/api/pms/goodsApi'
import type { ProductAttrWithValue } from '@/api/pms/productAttrApi'
import { _getBindWithValue } from '@/api/pms/productAttrApi'
import SingleUpload from '@/components/upload/SingleUpload.vue'
const emit = defineEmits(["update:value", "update:goodsProducts"])
const props = withDefaults(defineProps<{
    groupId: any,
    value: Array<GoodsSaleAttrVo>,
    goodsProducts: Array<GoodsProductVo>
}>(), {
})

const loading = ref<boolean>(false)
const data = ref<Array<ProductAttrWithValue>>([]);
const tabPosition = ref<string>('bind')
const filterComputedData = ref<any>([])

watch(() => props.groupId, (val: any) => {
    if (val == undefined || val === '') {
        data.value = []
    } else {
        getLists();
    }
})
const filterData = computed<Array<any>>(() => {
    let items = new Array<any>()
    for (let vo of props.value) {
        let saleAttr = data.value.find(item => item.id == vo.goodsAttrId)
        let values = new Array<any>()
        if (saleAttr != undefined) {
            for (let value of saleAttr.values) {
                let spec = (vo.goodsSpecs == undefined || vo.goodsSpecs == null) ? undefined : vo.goodsSpecs.find(item => item.goodsValueId == value.id);
                if (spec != undefined) {
                    values.push(spec)
                } else {
                    values.push({
                        saleAttrId: vo.id,
                        goodsAttrId: saleAttr.id,
                        goodsValueId: value.id,
                        name: vo.name,
                        value: value.value,
                        picUrl: undefined
                    })

                }
            }
            items.push({
                values,
                ...vo
            })
        }
    }
    filterComputedData.value = items
    return filterComputedData.value;
})
const waitFilterData = computed(() => {
    if (props.value == undefined || props.value == null) return data.value;
    return data.value.filter(item => props.value.findIndex(selectItem => selectItem.name == item.name) == -1)
})
const searchTypeStr = (record: ProductAttrWithValue) => {
    switch (record.searchType) {
        case 0: return '不需要进行检索'
        case 1: return '关键字检索'
        case 2: return '范围检索'
        default: return '';
    }
}
const selectTypeStr = (record: ProductAttrWithValue) => {
    switch (record.selectType) {
        case 0: return '唯一'
        case 1: return '单选'
        case 2: return '多选'
        default: return '';
    }
}
const getLists = () => {
    loading.value = true
    _getBindWithValue(props.groupId, 0).then(res => {
        data.value = res.data
    }).finally(() => {
        loading.value = false
    })
}
const handleAttributeDelete = (row: any) => {
    const selectAttrs = props.value
    const index = selectAttrs.indexOf(row)
    selectAttrs.splice(index, 1)
}
const handleProductDelete = (row: any) => {
    const goodsProducts = props.goodsProducts
    const index = goodsProducts.indexOf(row)
    goodsProducts.splice(index, 1)
}
const handleAttributeAdd = (row: ProductAttrWithValue) => {
    const selectAttrs = props.value
    selectAttrs.push({
        goodsAttrId: row.id,
        name: row.name
    } as any)
    emit('update:value', selectAttrs)
}
const handleSyncSku = () => {
    if (props.value.length == 0) return;
    var oldGoodsProducts = props.goodsProducts;
    let goodsProducts = new Array<GoodsProductVo>()
    createProductVos(props.value, oldGoodsProducts, 0, [], goodsProducts)
    emit('update:goodsProducts', goodsProducts)
}
const createProductVos = (saleAttrVos: Array<GoodsSaleAttrVo>, cacheGoodsProducts: Array<GoodsProductVo>, i: number, goodsSpecs: Array<GoodsSpecification>, goodsProducts: Array<GoodsProductVo>) => {
    let saleAttrVo = saleAttrVos[i];
    if (i < saleAttrVos.length - 1) {
        for (let specification of saleAttrVo.goodsSpecs) {
            createProductVos(saleAttrVos, cacheGoodsProducts, i + 1, [...goodsSpecs, specification], goodsProducts)
        }
    } else {
        let product = getProductVo(saleAttrVo.goodsSpecs, cacheGoodsProducts)
        if (product == null) {
            product = {
                goodsProductSpecRelations: getGoodsProductSpecRelations(goodsSpecs),
                price: undefined,
                number: undefined,
                url: undefined,
            } as any
        }
        goodsProducts.push(product as any)
    }
}
//从缓存中获取product
const getProductVo = (goodsSpecs: Array<GoodsSpecification>, cacheGoodsProducts: Array<GoodsProductVo>) => {
    if (goodsSpecs.length != cacheGoodsProducts[0].goodsProductSpecRelations.length) return null
    for (let i = 0; i < goodsSpecs.length; i++) {
        let tempProducts = []
        let goodsSpec = goodsSpecs[i];
        for (let cacheGoodsProduct of cacheGoodsProducts) {
            let relation = cacheGoodsProduct.goodsProductSpecRelations[i];
            if (goodsSpec.goodsAttrId === relation.goodsAttrId && goodsSpec.goodsValueId === relation.goodsValueId) {
                relation.name = goodsSpec.name
                relation.value = goodsSpec.value
                tempProducts.push(cacheGoodsProduct)
            }
        }
        cacheGoodsProducts = tempProducts
    }
    if (cacheGoodsProducts.length > 0) {
        return cacheGoodsProducts[0]
    }
    return null;
}
const getGoodsProductSpecRelations = (goodsSpecs: Array<GoodsSpecification>) => {
    let goodsProductSpecRelations = new Array<any>()
    for (let i = 0; i < goodsSpecs.length; i++) {
        let goodsSpec = goodsSpecs[i]
        goodsProductSpecRelations.push({
            specId: goodsSpec.id,
            goodsAttrId: goodsSpec.goodsAttrId,
            goodsValueId: goodsSpec.goodsValueId,
            itemSort: i,
            name: goodsSpec.name,
            value: goodsSpec.value
        })
    }
    return goodsProductSpecRelations;
}
</script>
<style lang="scss" >
.sale-attr-upload .el-upload {
    width: 100px;
    height: 100px;

    .avatar-uploader-icon {
        width: 100px;
        height: 100px;
    }
}
</style>
  