<template>
  <div class="app-container">
    <el-form ref="ruleFormRef" :rules="rules" :model="dataForm" status-icon label-width="300px">
      <el-form-item label="用户下单后超时" prop="mall_order_unpaid">
        <el-input v-model="dataForm.mall_order_unpaid" class="input-width">
          <template slot="append">分钟</template>
        </el-input>
        <span class="info">用户未付款，则订单自动取消</span>
      </el-form-item>
      <el-form-item label="订单发货后超期" prop="mall_order_unconfirm">
        <el-input v-model="dataForm.mall_order_unconfirm" class="input-width">
          <template slot="append"> 天</template>
        </el-input>
        <span class="info">未确认收货，则订单自动确认收货</span>
      </el-form-item>
      <el-form-item label="确认收货后超期" prop="mall_order_comment">
        <el-input v-model="dataForm.mall_order_comment" class="input-width">
          <template slot="append">天</template>
        </el-input>
        <span class="info">未评价商品，则取消评价资格</span>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="update(ruleFormRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Config } from '@/api/config/configApi'
import { _listOrder, _updateOrder } from '@/api/config/configApi'
import { FormInstance } from 'element-plus';

const dataForm = reactive<any>({
  mall_order_unpaid: 0,
  mall_order_unconfirm: 0,
  mall_order_comment: 0
})
const ruleFormRef = ref<FormInstance>();
const rules = reactive({
  mall_order_unpaid: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mall_order_unconfirm: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mall_order_comment: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ]
})
const listConfig = () => {
  _listOrder().then(res => {
    res.data.forEach(item => {
      if (dataForm.hasOwnProperty(item.keyName)) {
        dataForm[item.keyName] = item.keyValue
      }
    })
  })
}

const cancel = () => {
  listConfig()
}
const update = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      let configs = new Array<Config>()
      Object.keys(dataForm).forEach(key => {
        configs.push({
          keyName: key,
          keyValue: dataForm[key]
        } as any)
      })
      _updateOrder(configs)
    } else {
      console.log("error submit!", fields);
    }
  })
}
listConfig()
</script>
<style lang="scss" scoped>
.input-width {
  width: 50%;
}

.info {
  margin-left: 15px;
}
</style>
