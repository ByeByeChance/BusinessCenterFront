<template>
  <BaseDialog
    v-model="dialogVisible"
    @confirm="handleConfirm"
    @close="cancel()"
    :title="props.title"
    :show-footer="props.title === '详情' ? false : true"
    width="35%"
  >
    <el-form
      class="edit-dialog-form"
      ref="formRef"
      :model="form"
      label-suffix=" :"
      :rules="rules"
      label-width="auto"
      :disabled="props.title === '详情'"
    >
      <el-form-item label="上级部门" prop="roleId">
        <el-select v-model="form.parentId" placeholder="请选择上级部门">
          <el-option v-for="(item, index) in props.tableData" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写部门名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="1" :max="100" />
      </el-form-item>
      <el-form-item label="负责人" prop="directorUserId">
        <el-select v-model="form.directorUserId" placeholder="请选择部门负责人">
          <el-option v-for="(item, index) in userList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门状态" prop="status">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
  </BaseDialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import BaseDialog from '@/components/BaseDialog/index.vue';
import { Department, ResPage, User } from '@/api/interface';
import { ElMessage, FormInstance } from 'element-plus';
import { getUserList } from '@/api/modules/user';

interface Props {
  title: string;
  rowData: Partial<Department.DepartmentItem>;
  tableData: Department.DepartmentItem[];
  api?: (params: any, config: any) => Promise<any>;
  getTableList?: () => void;
}
const dialogVisible = ref(false);
const props = ref<Props>({
  title: '',
  rowData: {},
  tableData: []
});

const form = reactive<Partial<Department.DepartmentItem>>({
  id: undefined, // 部门id
  parentId: undefined, // 上级id
  name: undefined, // 部门名称
  status: undefined, // 部门状态：1是正常,0是禁用
  sort: undefined, // 排序
  directorUserId: undefined, // 负责人
  directorNickname: undefined // 负责人姓名
});

// 接收父组件传过来的参数
const acceptParams = (params: Props) => {
  props.value = params;
  if (params.rowData?.id) {
    form.id = params.rowData.id;
    form.parentId = params.rowData.parentId;
    form.name = params.rowData.name;
    form.status = params.rowData.status;
    form.sort = params.rowData.sort;
    form.directorUserId = params.rowData.directorUserId;
    form.directorNickname = params.rowData.directorNickname;
  }
  _getUserList();
  dialogVisible.value = true;
};

const formRef = ref<FormInstance>();
const rules = reactive({
  name: [{ required: true, message: '请填写部门名称' }]
});

const handleConfirm = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      form.directorNickname = userList.value.find(item => item.value === form.directorUserId)?.label;
      await props.value.api!(form, { loading: false });
      ElMessage.success({ message: `${props.value.title}部门成功！` });
      props.value.getTableList!();
      cancel();
    } catch (error) {
      console.log(error);
    }
  });
};

const cancel = () => {
  dialogVisible.value = false;
  setTimeout(() => {
    emits('cancel');
  }, 100);
};

const userList = ref<User.ResUserList[]>([]);
const _getUserList = () => {
  getUserList({ page: 1, size: 1000 }).then((res: ResPage<User.ResUserList>) => {
    userList.value = res.data?.list?.map(item => ({ label: item.nickname, value: item.id })) || [];
  });
};

const emits = defineEmits<{
  (e: 'cancel'): void;
}>();

defineExpose({
  acceptParams
});
</script>

<style lang="scss" scoped>
.edit-dialog-form {
  padding: 0 15px;
  :deep(.el-date-editor.el-input) {
    width: 100%;
  }
}
</style>
