<template>
    <el-dialog v-model="props.visible" :title="id ? '编辑菜单' : '新增菜单'" :before-close="handleClose">
        <el-form :model="form" ref="ruleFormRef" :rules="rules" label-width="80px">
            <el-form-item label="菜单标题">
                <el-input placeholder="请输入菜单标题" v-model="form.title" />
            </el-form-item>
            <el-form-item label="父菜单" :prop="pid">
                <el-tree-select v-model="form.pid" lazy :load="onLoadData" :props="treeProps" :check-strictly=true placeholder="请选择父菜单"
                    :cache-data="cacheData" >
                </el-tree-select>
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="form.menuSort" size="small" :min="0" :max="1000" />
            </el-form-item>
            <el-form-item label="菜单类型">
                <el-radio-group v-model="form.type" button-style="solid">
                    <el-radio-button :label="1">菜单</el-radio-button>
                    <el-radio-button :label="2">按钮</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.type === 1" label="地址类型">
                <el-select placeholder="请选择" v-model="form.target">
                    <el-option :key="0" :value="0" label="内部路由"></el-option>
                    <el-option :key="1" :value="1" label="内部外链"></el-option>
                    <el-option :key="2" :value="2" label="跳转外链"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="form.type === 1 && form.target === 0" label="组件名称">
                <el-input placeholder="请输入组件名称" v-model="form.name" />
            </el-form-item>
            <el-form-item v-if="form.type === 1 && form.target === 0" label="组件">
                <el-input placeholder="请输入组件" v-model="form.component" />
            </el-form-item>
            <el-form-item v-if="form.type === 1" label="地址">
                <el-input placeholder="请输入地址" v-model="form.path" />
            </el-form-item>
            <el-form-item v-if="form.type === 1" label="图标">
                <el-input placeholder="请输入图标" v-model="form.icon" />
            </el-form-item>
            <el-form-item v-if="form.type === 1 && form.target === 0" label="缓存">
                <el-select placeholder="请选择" v-model="form.keepAlive">
                    <el-option :key="1" :value="1" label="缓存"></el-option>
                    <el-option :key="0" :value="0" label="不缓存"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="form.type === 1" label="显示">
                <el-select placeholder="请选择" v-model="form.hidden">
                    <el-option :key="0" :value="0" label="显示"></el-option>
                    <el-option :key="1" :value="1" label="隐藏"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item v-if="form.type === 2" label="权限">
                <el-input placeholder="请输入权限" v-model="form.permission" />
            </el-form-item>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleOk(ruleFormRef)">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Menu } from '@/api/system/menuApi'
import { _addMenu, _getMenu, _updateMenu, _getSubMenus } from '@/api/system/menuApi'
import { ElMessage, FormInstance } from 'element-plus';
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: any,
    pid?: any,
    parentName?: string
}>(), {
    visible: false
})
const treeProps = {
    children: 'children',
    label: 'title',
    isLeaf: 'leaf'
}
const cacheData = ref<Array<any>>([])
const ruleFormRef = ref<FormInstance>();
const form = reactive<Partial<Menu | any>>({
    id: undefined,
    title: undefined,
    component: undefined,
    name: undefined,
    type: 1,
    menuSort: 0,
    target: 0,
    keepAlive: 1,
    hidden: 0,
    pid: undefined,
    icon: undefined,
    path: undefined,
    permission: undefined,
    parentName: undefined
})
if (props.pid != undefined) {
    form.pid = props.pid
    form.parentName = props.parentName
}
const rules = reactive({
    title: [{
        required: true,
        message: '必须输入菜单标题',
        trigger: "blur"
    }, {
        validator: (rule: any, value: string) => {
            const regex = /^([\u4e00-\u9fa5\u4e00-\u9fa5]{2,10})|(\S{1,15})$/
            if (regex.test(value)) {
                return Promise.resolve()
            } else {
                return Promise.reject()
            }
        },
        trigger: 'change'
    }],
    menuSort: [{
        required: true,
        message: '必须输入排序',
        trigger: "blur"
    }],
    type: [{
        required: true,
        message: '必须选择类型',
        trigger: "blur"
    }],
    target: [{
        required: true,
        message: '必须地址类型',
        trigger: "blur"
    }],
    name: [{
        required: true,
        message: '必须组件名称',
        trigger: "blur"
    }],
    component: [{
        required: true,
        message: '必须组件',
        trigger: "blur"
    }],
    keepAlive: [{
        required: true,
        message: '缓存选择',
        trigger: "blur"
    }],
    hidden: [{
        required: true,
        message: '缓存设置',
        trigger: "blur"
    }],
    permission: [{
        required: true,
        message: '权限设置',
        trigger: "blur"
    }],
})
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
    try {
        let res = await _getSubMenus(key);
        let result: Array<Menu> | Array<any> = res.data
        result.forEach(item => {
            item.leaf = item.subCount === 0
            item.value = item.id
        });
        return result;
    } finally {
    }
}
const handleOk = (formEl: FormInstance | undefined) => {
    let fields: Array<string> = ["title", "menuSort", "type"]
    if (form.type === 1) {
        fields.push(...["target"])
        if (form.target === 0) {
            if (form.path === undefined || form.path === null || form.path.trim() === '') {
                if (form.name === undefined || form.name === null || form.name.trim() === '' || form.component === undefined || form.component === null || form.component.trim() === '') {
                    ElMessage.error("组件名、组件或者地址必须选择其一")
                    return
                }
            }
            fields.push(...["keepAlive"])
        } else {
            if (form.path === undefined || form.path === null || form.path.trim() === '') {
                ElMessage.error("请输入地址")
                return;
            }
            fields.push(...["hidden"])
        }
    } else {
        if (form.pid === undefined || form.pid === 0) {
            ElMessage.error("请选择菜单")
            return;
        }
        fields.push(...["permission"])
    }
    if (!formEl) return;
    formEl.validate((valid, fields) => {
        if (valid) {
            if (props.id) {
                _updateMenu(form as Menu).then(res => {
                    emit("update:visible", false)
                    emit("ok", form.pid)
                })
            } else {
                _addMenu(form as Menu).then(res => {
                    emit("update:visible", false)
                    emit("ok", form.pid)
                })
            }
        }
    })
}
const handleClose = () => {
    emit("update:visible", false)
    emit("cancel")
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
const getMenu = (id: string) => {
    _getMenu(id).then(res => {
        let result: Menu | any = res.data
        Object.assign(form, result)
        if (result.pid != undefined) {
            cacheData.value.push({ value: result.pid, title: result.parentName })
        }
    })
}
if (props.id) {
    getMenu(props.id)
}
</script>
<style lang="scss" scoped></style>