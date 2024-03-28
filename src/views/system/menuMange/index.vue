<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="name"
      :indent="20"
      :columns="columns"
      :request-api="getMenuList"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openEditMenuDialog('新增')">新增菜单 </el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18" v-if="scope.row.meta.icon">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openEditMenuDialog('详情', scope.row)"></el-button>
        <el-button type="primary" link :icon="EditPen" @click="openEditMenuDialog('编辑', scope.row)"></el-button>
        <el-button type="danger" link :icon="Delete"></el-button>
      </template>
    </ProTable>
  </div>
  <EditMenu ref="editMenuRef" />
</template>

<script setup lang="ts" name="menuMange">
import { ref } from 'vue';
import { ColumnProps } from '@/components/ProTable/interface';
import { Delete, EditPen, CirclePlus, View } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import EditMenu from './components/EditMenu.vue';
import { getMenuList, addMenu, updateMenu } from '@/api/modules/menu';
import { Menu as MenuNew } from '@/api/interface/menu';

const proTable = ref();
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNumber: data.pageNumber,
    pageSize: data.pageSize
  };
};

// 表格配置项
const columns: ColumnProps[] = [
  { prop: 'meta.title', label: '菜单名称', align: 'left', search: { el: 'input' } },
  { prop: 'meta.icon', label: '菜单图标' },
  { prop: 'name', label: '菜单 name' },
  { prop: 'path', label: '菜单路径', width: 300, search: { el: 'input' } },
  { prop: 'component', label: '组件路径', width: 300 },
  { prop: 'operation', label: '操作', width: 150, fixed: 'right' }
];

const editMenuRef = ref<InstanceType<typeof EditMenu> | null>(null);
const openEditMenuDialog = (title: string, rowData: Partial<Menu.MenuOptions> = {}) => {
  const data: Partial<MenuNew.MenuItem> = {
    id: rowData.id,
    parentId: rowData.parentId,
    name: rowData.name,
    path: rowData.path,
    component: rowData.component as string,
    redirect: rowData.redirect,
    icon: rowData.meta?.icon,
    title: rowData.meta?.title,
    isLink: rowData.meta?.isLink,
    isHide: rowData.meta?.isHide,
    isFull: rowData.meta?.isFull,
    isAffix: rowData.meta?.isAffix,
    isKeepAlive: rowData.meta?.isKeepAlive,
    sort: rowData.meta?.sort
  };
  const params = {
    title,
    rowData: { ...data },
    api: title === '新增' ? addMenu : updateMenu,
    getTableList: proTable.value?.getTableList
  };
  editMenuRef.value?.acceptParams(params);
};
</script>
