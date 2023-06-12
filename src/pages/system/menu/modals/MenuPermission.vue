<template>
    <el-drawer :width="500" title="权限设置" placement="right" v-model="props.visible" :before-close="onClose" destroy-on-close>
        <template #footer>
            <div style="text-align:center;margin-bottom: 10px;">
                <el-button style="margin-right: 18px" @click="onClose">取消</el-button>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </div>
        </template>
        <div
            style="border-bottom: 1px solid #f0f0f0;background: #fafafa;transition: background 0.3s ease;margin-bottom: 10px;">
            <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange"
                style="margin-bottom:10px;margin-left:25px">
                全选
            </el-checkbox>
        </div>
        <el-tree ref="treeNodeRef" show-checkbox node-key="id" lazy :load="onLoadData" :default-expanded-keys="expandedKeys"
            :default-checked-keys="checkedKeys" :props="defaultProps" />
    </el-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Menu } from '@/api/system/menuApi'
import { _getSubMenus } from '@/api/system/menuApi'
import { _addMenuPermission, _getMenuPermission } from '@/api/system/roleApi'
import { ElTree } from 'element-plus'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    id: any,
    type?: number
}>(), {
    visible: false
})
const showTreeTip = ref(false)
const checkAll = ref(false)
const indeterminate = ref(false)
const expandedKeys = ref<string[]>();
const checkedKeys = ref<any[]>([]);
const treeData = ref<Array<any>>([])
const treeNodeRef = ref<InstanceType<typeof ElTree>>()
const onCheckAllChange = (e: any) => {
    if (checkAll.value) {
        checkedKeys.value = []
        treeData.value.forEach(item => {
            checkedKeys.value?.push(item)
        })
    } else {
        treeNodeRef.value!.setCheckedKeys([])
    }
};
const defaultProps = {
    children: 'children',
    label: 'title',
    isLeaf: 'leaf'
}
const onLoadData = async (node: any, resolve: any) => {
    if (node.level === 0) {
        let result = await getSubMenus('0')
        resolve(result)
    } else {
        let result = await getSubMenus(node.data.id)
        resolve(result)
    }
}
const getSubMenus = async (key: string) => {
    showTreeTip.value = true
    try {
        let res = await _getSubMenus(key);
        let result: Array<Menu> | Array<any> = res.data
        result.forEach(item => {
            item.leaf = item.subCount === 0
            treeData.value.push(item.id)
        });
        return result;
    } finally {
        showTreeTip.value = false
    }
}
const getMenuPermission = () => {
    _getMenuPermission(props.id).then(res => {
        checkedKeys.value = []
        checkedKeys.value.push(...res.data)
    })
}
getMenuPermission()
const onClose = () => {
    emit("update:visible", false)
};
const onSubmit = () => {
    let ids = treeNodeRef.value!.getCheckedNodes(false, false).map(item=>item.id)
    _addMenuPermission(props.id, ids).then(res => {
        emit("update:visible", false)
    })
};
</script>
<style lang="scss" scoped></style>