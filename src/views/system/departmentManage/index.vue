<template>
  <div class="card content-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="部门列表"
        :indent="20"
        :columns="columns"
        :request-api="getDepartmentList"
        :data-callback="dataCallback"
        @row-click="rowClick"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openEditDialog('新增')">新增</el-button>
        </template>
        <!-- 菜单操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openEditDialog('详情', scope.row)"></el-button>
          <el-button type="primary" link :icon="EditPen" @click="openEditDialog('编辑', scope.row)"></el-button>
          <el-button type="danger" link :icon="Delete"></el-button>
        </template>
      </ProTable>
    </div>
    <template v-if="editDialogShow">
      <Edit ref="editRef" @cancel="editDialogShow = false" />
    </template>
  </div>
</template>

<script setup lang="tsx" name="departmentManage">
import { ref, nextTick } from 'vue';
import { ColumnProps } from '@/components/ProTable/interface';
import { Delete, EditPen, CirclePlus, View } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import Edit from './components/Edit.vue';
import { getDepartmentList, addDepartment, updateDepartment, updateDepartmentStatus } from '@/api/modules/department';
import { ResPage } from '@/api/interface';
import { Department } from '@/api/interface/department';
import { userStatus } from '@/utils/dict';
import { TableColumnCtx } from 'element-plus';
import dayjs from 'dayjs';
import { useHandleData } from '@/hooks/useHandleData';

const proTable = ref();
const dataCallback = (data: ResPage<Department.DepartmentItem>) => {
  return {
    list: data.list,
    total: data.total,
    pageNumber: data.pageNumber,
    pageSize: data.pageSize
  };
};

// 表格配置项
const columns: ColumnProps<Department.DepartmentItem>[] = [
  { prop: 'name', label: '部门名称', search: { el: 'input', props: { placeholder: '请输入部门名称' } } },
  { prop: 'directorNickname', label: '负责人', width: 150 },
  {
    prop: 'status',
    label: '状态',
    width: 150,
    enum: userStatus,
    search: { el: 'select', props: { filterable: true, clearable: true, placeholder: '请选择部门状态' } },
    render: scope => {
      return (
        <>
          {
            <el-switch
              v-model={scope.row.status}
              active-value={1}
              inactive-value={0}
              inline-prompt
              active-text='启用'
              inactive-text='禁用'
              before-change={() => {
                return false;
              }}
            />
          }
        </>
      );
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 200,
    render: ({ row }) => (row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '--')
  },
  { prop: 'operation', label: '操作', width: 150, fixed: 'right' }
];

// 点击行
const rowClick = async (rowData: Department.DepartmentItem, column: TableColumnCtx<Department.DepartmentItem>) => {
  if (column.property === 'status') {
    useHandleData(updateDepartmentStatus, { id: rowData.id, status: rowData.status === 1 ? 0 : 1 }, '切换部门状态').then(() => {
      proTable.value?.getTableList();
    });
  }
};

const editDialogShow = ref(false);
const editRef = ref<InstanceType<typeof Edit> | null>(null);
const openEditDialog = (title: string, rowData: Partial<Department.DepartmentItem> = {}) => {
  const params = {
    title,
    rowData: { ...rowData },
    tableData: proTable.value?.tableData,
    api: title === '新增' ? addDepartment : updateDepartment,
    getTableList: proTable.value?.getTableList
  };
  editDialogShow.value = true;
  nextTick(() => {
    editRef.value?.acceptParams(params);
  });
};
</script>
