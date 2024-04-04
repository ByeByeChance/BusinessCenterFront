<template>
  <div class="card content-box">
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="用户列表"
        row-key="name"
        :indent="20"
        :columns="columns"
        :request-api="getUserList"
        :data-callback="dataCallback"
        @row-click="rowClick"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openEditUserDialog('新增')">新增用户</el-button>
        </template>
        <!-- 菜单操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openEditUserDialog('详情', scope.row)"></el-button>
          <el-button
            type="primary"
            link
            :icon="EditPen"
            v-if="scope.row.roleId !== 3"
            @click="openEditUserDialog('编辑', scope.row)"
          ></el-button>
          <el-button type="danger" link :icon="Delete" v-if="scope.row.roleId !== 3"></el-button>
        </template>
      </ProTable>
    </div>
    <template v-if="editUserDialogShow">
      <EditUser ref="editUserRef" @cancel="editUserDialogShow = false" />
    </template>
  </div>
</template>

<script setup lang="tsx" name="accountManage">
import { ref, nextTick } from 'vue';
import { ColumnProps } from '@/components/ProTable/interface';
import { Delete, EditPen, CirclePlus, View } from '@element-plus/icons-vue';
import ProTable from '@/components/ProTable/index.vue';
import EditUser from './components/EditUser.vue';
import { getUserList, addUser, updateUser, updateUserStatus } from '@/api/modules/user';
import { ResPage, User } from '@/api/interface';
import { userStatus, userRole } from '@/utils/dict';
import { TableColumnCtx } from 'element-plus';
import dayjs from 'dayjs';
import { useHandleData } from '@/hooks/useHandleData';

const proTable = ref();
const dataCallback = (data: ResPage<User.ResUserList>) => {
  return {
    list: data.list,
    total: data.total,
    pageNumber: data.pageNumber,
    pageSize: data.pageSize
  };
};

// 表格配置项
const columns: ColumnProps<User.ResUserList>[] = [
  { prop: 'username', label: '用户名', search: { el: 'input' } },
  {
    prop: 'roleId',
    label: '角色',
    enum: userRole,
    search: {
      el: 'select',
      props: { filterable: true, clearable: true, placeholder: '请选择用户角色' }
    }
  },
  { prop: 'email', label: '邮箱' },
  {
    prop: 'status',
    label: '状态',
    enum: userStatus,
    search: { el: 'select', props: { filterable: true, clearable: true, placeholder: '请选择用户状态' } },
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
    prop: 'lastLoginDate',
    label: '最后一次登录时间',
    width: 250,
    render: ({ row }) => (row.lastLoginDate ? dayjs(row.lastLoginDate).format('YYYY-MM-DD HH:mm:ss') : '--')
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 250,
    render: ({ row }) => (row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '--')
  },
  { prop: 'operation', label: '操作', width: 150, fixed: 'right' }
];

// 点击行
const rowClick = async (rowData: User.ResUserList, column: TableColumnCtx<User.ResUserList>) => {
  if (column.property === 'status') {
    useHandleData(updateUserStatus, { id: rowData.id, status: rowData.status === 1 ? 0 : 1 }, '切换用户状态').then(() => {
      proTable.value?.getTableList();
    });
  }
};

const editUserDialogShow = ref(false);
const editUserRef = ref<InstanceType<typeof EditUser> | null>(null);
const openEditUserDialog = (title: string, rowData: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    rowData: { ...rowData },
    api: title === '新增' ? addUser : updateUser,
    getTableList: proTable.value?.getTableList
  };
  editUserDialogShow.value = true;
  nextTick(() => {
    editUserRef.value?.acceptParams(params);
  });
};
</script>
