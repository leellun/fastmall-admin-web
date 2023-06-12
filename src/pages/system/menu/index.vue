<template>
    <div class="main-container">
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button type="primary" danger style="margin-left:10px" :disabled="selectedRowKeys.length == 0"
                @click="handleDeleteSelected">删除</el-button>
        </div>
        <el-table ref="tableRef" :data="data" style="width: 100%" row-key="id" border lazy :load="load"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="title" min-width="50" label="菜单名" />
            <el-table-column prop="name" min-width="50" label="组件">
                <template v-slot="{ row }"><template v-if="row.name != null && row.name != ''">
                        组件名： {{ row.name }} <br />
                    </template>
                    <template v-if="row.component != null && row.component != ''">
                        组件： {{ row.component }} <br />
                    </template>
                    <template v-if="row.path != null && row.path != ''">
                        地址： {{ row.path }}
                    </template></template>
            </el-table-column>
            <el-table-column prop="menuSort" min-width="50" label="排序">
                <template v-slot="{ row }">
                    <el-input-number v-model="row.menuSort" :min="0" :max="1000"
                        @change="(value: number, oldValue: number) => handleMenuSort(row, value)" />
                </template>
            </el-table-column>
            <el-table-column prop="icon" min-width="50" label="图标"> </el-table-column>
            <el-table-column prop="permission" min-width="50" label="权限"> </el-table-column>
            <el-table-column prop="keepAlive" min-width="50" label="缓存"> <template v-slot="{ row }">
                    {{ row.keepAlive === 1 ? '缓存' : '不缓存' }}
                </template></el-table-column>
            <el-table-column prop="hidden" min-width="50" label="隐藏"> <template v-slot="{ row }">
                    {{ row.hidden === 1 ? '隐藏' : '显示' }}
                </template></el-table-column>
            <el-table-column prop="createTime" min-width="50" label="创建日期"> </el-table-column>
            <el-table-column label="操作" fixed="right" width="200">
                <template v-slot="{ row }">
                    <el-button link type="primary" @click="(e?: Event) => handleEditRecord(row.id, e)">编辑</el-button>
                    <el-switch v-model="row.enabled" active-color="#13ce66" :active-value="1" :inactive-value="0"
                        @change="handleEnableChange(row, row.enabled)" class="gap-left10" />
                    <el-popconfirm title="确定删除吗？" @confirm="handleDeleteRecord(row)">
                        <template #reference>
                            <el-button slot="reference" class="gap-left10" link type="primary">删除</el-button></template>
                    </el-popconfirm>
                    <el-button link type="primary" class="gap-left10" @click="handleAppendChildMenu(row)">追加</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
            class="pagination-end" />
        <MenuModal v-model:visible="modalVisible" :id="menuId" :pid="menuPid" :parentName="menuParentName"
            v-if="modalVisible" @ok="handleOk" />
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import type { MenuSearch, Menu } from '@/api/system/menuApi'
import { _getPageMenus, _getSubMenus, _deleteMenu, _updateMenuSort, _enableMenu } from '@/api/system/menuApi'
import MenuModal from './modals/MenuModal.vue';
import { ElMessageBox } from 'element-plus';
const menuId = ref<string>()
const menuPid = ref<string>()
const menuParentName = ref<string>()
const modalVisible = ref<boolean>(false)
const selectedRowKeys = ref<Menu[]>([]);
const data = ref<Array<Menu | any>>([]);
const total = ref<number>(0)
const formRef = reactive<Partial<MenuSearch>>({
    pageSize: 10,
    pageNo: 1
})
const tableRef = ref();
const loading = ref<boolean>(false)
const handleSelectionChange = (val: Menu[]) => {
    selectedRowKeys.value = val;
};
const handleSearch = () => {
    formRef.pageNo = 1
    getPageMenus()
}
const maps = new Map()
const getPageMenus = () => {
    loading.value = true
    _getPageMenus(formRef as MenuSearch).then(res => {
        total.value = res.data.pages
        data.value = res.data.list
        data.value.forEach(item => {
            item.key = item.id
            if (item.subCount > 0) {
                item.children = []
            }
            item.hasChildren = item.subCount > 0
        })
        if (maps.get(0) != undefined) {
            const { tree, treeNode, resolve } = maps.get(0);
            resolve(data)
        }
    }).finally(() => {
        loading.value = false
    })
}
//子菜单
const getSubMenus = async (row: Menu) => {
    let res = await _getSubMenus(row.id);
    let result = res.data as Array<Menu> | Array<any>
    result.forEach(item => {
        item.key = item.id
        if (item.subCount > 0) {
            item.children = []
        }
        item.hasChildren = item.subCount > 0
    })
    return result;
}
const handleCurrentChange = (val: number) => {
    formRef.pageNo = val
    getPageMenus();
}
const load = async (
    row: Menu,
    treeNode: unknown,
    resolve: (date: Menu[]) => void
) => {
    maps.set((row === undefined || row === null) ? 0 : row.id, { row, treeNode, resolve })
    let result = await getSubMenus(row);
    row.children = result
    resolve(result)
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    menuId.value = undefined
    menuPid.value = undefined
    menuParentName.value = undefined
    modalVisible.value = true;
}
const handleDeleteSelected = (e?: Event) => {
    e?.preventDefault()
    if (selectedRowKeys.value.length > 0) {
        ElMessageBox.confirm(
            '是否删除选中菜单？',
            '系统提示',
            { confirmButtonText: '确认', cancelButtonText: '取消', type: 'info', })
            .then(() => {
                handleDeleteRecord(selectedRowKeys.value.map(item => item.id))
            })
            .catch(() => {

            })
    }
}
const handleEditRecord = (id?: string, e?: Event) => {
    e?.preventDefault()
    menuId.value = id
    menuPid.value = undefined
    menuParentName.value = undefined
    modalVisible.value = true;
}
const handleAppendChildMenu = (record: Menu, e?: Event) => {
    e?.preventDefault()
    menuId.value = undefined
    menuPid.value = record.id
    menuParentName.value = record.title
    modalVisible.value = true

}
const handleDeleteRecord = (ids: string[] | Menu) => {
    let arr: Array<string> = []
    if (ids instanceof Array) {
        arr.push(...ids)
    } else {
        arr.push(ids.id)
    }
    _deleteMenu(arr).then(res => {
        if (!(ids instanceof Array)) {
            let pid = ids.pid
            if (pid == undefined || pid === null || pid === '0') {
                Object.keys(tableRef.value.store.states.treeData.value).forEach(key => {
                    if (tableRef.value.store.states.treeData.value[key].loaded === true) {
                        tableRef.value.store.states.treeData.value[key].loaded = false
                        tableRef.value.store.states.treeData.value[key].children = []
                        tableRef.value.store.states.treeData.value[key].expanded = false
                        delete tableRef.value.store.states.treeData.value[key]['display']
                    }
                    delete (tableRef.value.store.states.treeData.value[key])
                })
                data.value = []
                handleSearch()
            } else {
                refreshParentMenu(pid, false)
            }
        } else {
            getPageMenus()
        }
    })
}
const handleOk = (pid: string) => {
    if (pid === undefined || pid === null || pid === '0') {
        handleSearch()
    } else {
        refreshParentMenu(pid, true)
    }
};
const refreshParentMenu = async (pid: string, add: boolean) => {
    let menu = findMenu(pid, data.value)
    if (add) {
        if (menu.subCount === 0) {
            menu.subCount = 1
        }
    } else {
        menu.subCount -= 1
    }

    if (menu.subCount > 0) {
        menu.children = await getSubMenus(menu)
    } else {
        menu.children = []
    }
    const { tree, treeNode, resolve } = maps.get(pid);
    resolve(menu.children)
}
const handleEnableChange = (record: Menu, enabled: number) => {
    let prevEnabled = record.enabled
    record.enabled = enabled
    _enableMenu(record.id, enabled).catch(err => {
        record.enabled = prevEnabled
    })
}
const findMenu = (id: string, menus: Array<any>) => {
    for (let menu of menus) {
        if (menu.id === id) {
            return menu
        } else if (menu.children && menu.children.length > 0) {
            let n: any = findMenu(id, menu.children)
            if (n != null) {
                return n
            }
        }
    }
    return null
}
let sortTimeOut: any = {};
const handleMenuSort = (menu: Menu, value: number) => {
    menu.menuSort = value
    if (sortTimeOut[menu.id] !== undefined) {
        clearTimeout(sortTimeOut[menu.id])
    }
    sortTimeOut[menu.id] = setTimeout(() => {
        _updateMenuSort(menu.id, value).then(res => {
            refreshGroupMenuSort(menu.id, data.value)
        })
    }, 1000)
}
const refreshGroupMenuSort = (id: string, menus: Array<Menu>) => {
    var result = false
    for (let menu of menus) {
        if (id === menu.id) {
            result = true
            break
        }
        if (menu.children && menu.children.length > 0) {
            refreshGroupMenuSort(id, menu.children)
        }
    }
    if (result) {
        menus.sort((a, b) => a.menuSort - b.menuSort)
    }
}
handleSearch()
</script>
<style lang="scss" scoped></style>