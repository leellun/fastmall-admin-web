<template>
  <div class="app-container">
    <el-form ref="ruleFormRef" :rules="rules" :model="dataForm" status-icon label-width="300px">
      <el-tabs tab-position="left">
        <el-tab-pane label="首页配置">
          <el-form-item label="新品首发栏目商品显示数量" prop="mall_wx_index_new">
            <el-input v-model="dataForm.mall_wx_index_new" />
          </el-form-item>
          <el-form-item label="人气推荐栏目商品显示数量" prop="mall_wx_index_hot">
            <el-input v-model="dataForm.mall_wx_index_hot" />
          </el-form-item>
          <el-form-item label="品牌制造商直供栏目品牌商显示数量" prop="mall_wx_index_brand">
            <el-input v-model="dataForm.mall_wx_index_brand" />
          </el-form-item>
          <el-form-item label="专题精选栏目显示数量" prop="mall_wx_index_topic">
            <el-input v-model="dataForm.mall_wx_index_topic" />
          </el-form-item>
          <el-form-item label="分类栏目显示数量" prop="mall_wx_catlog_list">
            <el-input v-model="dataForm.mall_wx_catlog_list" />
          </el-form-item>
          <el-form-item label="分类栏目商品显示数量" prop="mall_wx_catlog_goods">
            <el-input v-model="dataForm.mall_wx_catlog_goods" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="其他配置">
          <el-form-item label="商品分享功能" prop="mall_wx_share">
            <el-switch v-model="dataForm.mall_wx_share" />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
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
import { _listWx, _updateWx } from '@/api/config/configApi'
import { FormInstance } from 'element-plus';

const dataForm = reactive<any>({
  mall_wx_index_new: 0,
  mall_wx_index_hot: 0,
  mall_wx_index_brand: 0,
  mall_wx_index_topic: 0,
  mall_wx_catlog_list: 0,
  mall_wx_catlog_goods: 0,
  mall_wx_share: false
})
const ruleFormRef = ref<FormInstance>();
const rules = reactive({
  mall_wx_index_new: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mall_wx_index_hot: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mall_wx_index_brand: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mall_wx_index_topic: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mall_wx_catlog_list: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  mall_wx_catlog_goods: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ]
})
const listConfig = () => {
  _listWx().then(res => {
    res.data.forEach(item => {
      if (dataForm.hasOwnProperty(item.keyName)) {
        if (item.keyName === 'mall_wx_share') {
          dataForm[item.keyName] = item.keyValue === 'true'
        } else {
          dataForm[item.keyName] = item.keyValue
        }
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
      _updateWx(configs)
    } else {
      console.log("error submit!", fields);
    }
  })
}
listConfig()
</script>
