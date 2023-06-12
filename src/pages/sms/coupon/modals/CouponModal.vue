<template>
    <!-- 用户编辑对话框 -->
    <el-dialog v-model="props.visible" :title="id ? '编辑' : '新增'" :before-close="handleCancel">
        <el-form ref="ruleFormRef" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="优惠券名称" prop="name">
                <el-input v-model="dataForm.name" />
            </el-form-item>
            <el-form-item label="介绍" prop="description">
                <el-input v-model="dataForm.description" />
            </el-form-item>
            <el-form-item label="标签" prop="tag">
                <el-input v-model="dataForm.tag" />
            </el-form-item>
            <el-form-item label="最低消费" prop="min">
                <el-input v-model="dataForm.min">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="满减金额" prop="discount">
                <el-input v-model="dataForm.discount">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="每人限领" prop="limitCount">
                <el-input v-model="dataForm.limitCount">
                    <template slot="append">张</template>
                </el-input>
            </el-form-item>
            <el-form-item label="分发类型" prop="type">
                <el-select v-model="dataForm.type">
                    <el-option v-for="type1 in typeOptions" :key="type1.value" :label="type1.label"
                        :value="type1.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="优惠券数量" prop="total">
                <el-input v-model="dataForm.total">
                    <template slot="append">张</template>
                </el-input>
            </el-form-item>
            <el-form-item label="有效期">
                <el-radio-group v-model="dataForm.timeType">
                    <el-radio-button :label="0">领券相对天数</el-radio-button>
                    <el-radio-button :label="1">指定绝对时间</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-show="dataForm.timeType === 0">
                <el-input v-model="dataForm.days">
                    <template slot="append">天</template>
                </el-input>
            </el-form-item>
            <el-form-item v-show="dataForm.timeType === 1">
                <el-col :span="11">
                    <el-date-picker v-model="dataForm.startTime" type="datetime" placeholder="选择日期"
                        value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" />
                </el-col>
                <el-col :span="2" class="line">至</el-col>
                <el-col :span="11">
                    <el-date-picker v-model="dataForm.endTime" type="datetime" placeholder="选择日期"
                        value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" />
                </el-col>
            </el-form-item>
            <el-form-item label="商品限制范围">
                <el-radio-group v-model="dataForm.goodsType">
                    <el-radio-button :label="0">全场通用</el-radio-button>
                    <el-radio-button :label="1">指定分类</el-radio-button>
                    <el-radio-button :label="2">指定商品</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-show="dataForm.goodsType === 1">
                <el-cascader v-model="selectGoodsCategory" clearable placeholder="请选择分类名称"
                    :options="goodsCategoryOptions" />
                <el-button @click="handleAddGoodsCategory()">添加</el-button>
                <el-table ref="goodsCateRelationTable" :data="couponCategoryList" style="width: 100%;margin-top: 20px"
                    border>
                    <el-table-column label="分类名称" align="center">
                        <template v-slot="{ row }">{{ row.parentCategoryName }}>{{ row.goodsCategoryName }}</template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                        <template v-slot="{ index, row }">
                            <el-button type="text" @click="handleDeleteGoodsCategory(index, row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item v-show="dataForm.goodsType === 2">
                <el-select v-model="selectGoods" filterable remote reserve-keyword placeholder="商品名称/商品货号">
                    <el-option v-for="item in goodsOptions" :key="item.goodsId" :label="item.goodsName"
                        :value="item.goodsId">
                        <span style="float: left">{{ item.goodsName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">NO.{{ item.goodsSn }}</span>
                    </el-option>
                </el-select>
                <el-button @click="handleAddGoods()">添加</el-button>
                <el-table ref="goodsRelationTable" :data="couponGoodsList" style="width: 100%;margin-top: 20px" border>
                    <el-table-column label="商品名称" align="center">
                        <template v-slot="{row}">{{ row.goodsName }}</template>
                    </el-table-column>
                    <el-table-column label="商品编号" align="center" width="80">
                        <template v-slot="{row}">{{ row.goodsSn }}</template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="60">
                        <template v-slot="{index,row}">
                            <el-button type="text" @click="handleDeleteGoods(index, row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
import type { Coupon } from '@/api/sms/couponApi'
import { _getCoupon,_updateCoupon,_createCoupon } from '@/api/sms/couponApi'
import { _listCategory } from '@/api/pms/categoryApi'
import { _listGoods } from '@/api/pms/goodsApi'
import { ElMessage, FormInstance } from 'element-plus'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: string
}>(), {
    visible: false
})
const selectGoodsCategory = ref<Array<any>>([])
const goodsCategoryOptions = ref<Array<any>>([])

const couponCategoryList = ref<Array<any>>([])

const selectGoods = ref<Array<any>>([])
const goodsOptions = ref<Array<any>>([])

const couponGoodsList = ref<Array<any>>([])

const ruleFormRef = ref<FormInstance>()
const typeOptions = [
    {
        label: '通用领券',
        value: 0
    },
    {
        label: '注册赠券',
        value: 1
    },
    {
        label: '兑换码',
        value: 2
    }
]
const dataForm = reactive<Partial<Coupon>>({
    id: undefined,
    name: undefined,
    description: undefined,
    tag: undefined,
    total: 0,
    discount: 0,
    min: 0,
    limitCount: 1,
    type: 0,
    status: 0,
    goodsType: 0,
    goodsValue: [],
    timeType: 0,
    days: 0,
    startTime: undefined,
    endTime: undefined
})
const rules = reactive({
    name: [
        { required: true, message: '优惠券标题不能为空', trigger: 'blur' }
    ]
})
const handleAddGoodsCategory = () => {
    if (selectGoodsCategory.value === null || selectGoodsCategory.value.length === 0) {
        ElMessage.warning('请先选择商品分类')
        return
    }
    couponCategoryList.value.push(getGoodsCategoryByIds(selectGoodsCategory.value))
    selectGoodsCategory.value = []
}
const getGoodsCategoryByIds = (ids: Array<any>) => {
    let name
    let parentName
    for (let i = 0; i < goodsCategoryOptions.value.length; i++) {
        if (goodsCategoryOptions.value[i].value === ids[0]) {
            parentName = goodsCategoryOptions.value[i].label
            for (let j = 0; j < goodsCategoryOptions.value[i].children.length; j++) {
                if (goodsCategoryOptions.value[i].children[j].value === ids[1]) {
                    name = goodsCategoryOptions.value[i].children[j].label
                }
            }
        }
    }
    return { goodsCategoryId: ids[1], goodsCategoryName: name, parentCategoryName: parentName }
}
const handleDeleteGoodsCategory = (index: number, row: any) => {
    couponCategoryList.value.splice(index, 1)
}
const handleAddGoods = () => {
    if (selectGoods.value === undefined || selectGoods.value.length == 0) {
        ElMessage.warning('请先选择商品')
        return
    }
    couponGoodsList.value.push(getGoodsById(selectGoods.value))
    selectGoods.value = []
}
const handleDeleteGoods = (index: number, row: any) => {
    couponGoodsList.value.splice(index, 1)
}
const getGoodsById = (id: any) => {
    for (let i = 0; i < goodsOptions.value.length; i++) {
        if (id === goodsOptions.value[i].goodsId) {
            return goodsOptions.value[i]
        }
    }
    return null
}
const getCategoryList = () => {
  _listCategory().then(res => {
    const list = res.data
    goodsCategoryOptions.value = []
    for (let i = 0; i < list.length; i++) {
      const children = []
      if (list[i].children != null && list[i].children.length > 0) {
        for (let j = 0; j < list[i].children.length; j++) {
          children.push({ label: list[i].children[j].name, value: list[i].children[j].id })
        }
      }
      goodsCategoryOptions.value.push({ label: list[i].name, value: list[i].id, children: children })
    }
  })
}
const getGoodsList = () => {
  _listGoods({ limit: 0 } as any).then(res => {
    const goodsList = res.data.list
    goodsOptions.value = []
    for (let i = 0; i < goodsList.length; i++) {
      const item = goodsList[i]
      goodsOptions.value.push({ goodsId: item.id, goodsName: item.name, goodsSn: item.goodsSn })
    }
  }).catch(() => {
    goodsOptions.value = []
  })
}
const handleOk = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.id) {
                _updateCoupon(dataForm as any).then(res => {
                    emit("update:visible", false)
                    emit("ok")
                })
            }else{
                _createCoupon(dataForm as any).then(res => {
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
getCategoryList()
getGoodsList()
if(props.id){
    _getCoupon(props.id).then(res=>{
        Object.assign(dataForm,res.data)
    })
}
</script>
<style lang="scss" scoped></style>