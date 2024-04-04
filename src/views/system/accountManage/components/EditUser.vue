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
      class="edit-user-dialog-form"
      ref="formRef"
      :model="form"
      label-suffix=" :"
      :rules="rules"
      label-width="auto"
      :disabled="props.title === '详情'"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请填写用户名" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请填写用户名" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio v-for="(item, index) in sexType" :key="index" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" type="number" placeholder="请填写手机号码" clearable></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker v-model="form.birthday" type="date" placeholder="请选择生日" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请填写邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户角色" prop="roleId">
        <el-select v-model="form.roleId" placeholder="请选择用户角色">
          <el-option v-for="(item, index) in userRole" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="用户密码" prop="password" v-if="!form.id">
        <el-input v-model="form.password" type="password" show-password placeholder="请填写用户密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword" v-if="!form.id">
        <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请确认用户密码" clearable></el-input>
      </el-form-item>
    </el-form>
  </BaseDialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import BaseDialog from '@/components/BaseDialog/index.vue';
import { User } from '@/api/interface';
import { ElMessage, FormInstance } from 'element-plus';
import { userRole, sexType } from '@/utils/dict';

interface Props {
  title: string;
  rowData: Partial<User.ResUserList>;
  api?: (params: any, config: any) => Promise<any>;
  getTableList?: () => void;
}
const dialogVisible = ref(false);
const props = ref<Props>({
  title: '',
  rowData: {}
});

interface Form extends User.ReqUser {
  confirmPassword: string;
}

const form = reactive<Partial<Form>>({
  username: '',
  nickname: '',
  gender: 0,
  birthday: '',
  phone: undefined,
  email: '',
  password: '',
  confirmPassword: '',
  jobId: undefined,
  departmentId: undefined,
  roleId: 1,
  status: 1
});

// 接收父组件传过来的参数
const acceptParams = (params: Props) => {
  props.value = params;
  if (params.rowData?.id) {
    form.id = params.rowData.id;
    form.username = params.rowData.username;
    form.nickname = params.rowData.nickname;
    form.gender = params.rowData.gender;
    form.birthday = params.rowData.birthday;
    form.phone = params.rowData.phone;
    form.email = params.rowData.email;
    form.jobId = params.rowData.jobId;
    form.departmentId = params.rowData.departmentId;
    form.roleId = params.rowData.roleId;
    form.status = params.rowData.status;
  }
  dialogVisible.value = true;
};

const validatePassword = (rule: any, value: any, callback: any) => {
  if (form.id) {
    return callback();
  }
  if (value === '') {
    callback(new Error('请填写用户密码'));
  } else {
    callback();
  }
};
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (form.id) {
    return callback();
  }
  if (value === '') {
    callback(new Error('请确认密码'));
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
};
const formRef = ref<FormInstance>();
const rules = reactive({
  username: [{ required: true, message: '请填写用户名称' }],
  nickname: [{ required: true, message: '请填写用户姓名' }],
  password: [{ validator: validatePassword }],
  confirmPassword: [{ validator: validateConfirmPassword }]
});

const handleConfirm = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await props.value.api!(form, { loading: false });
      ElMessage.success({ message: `${props.value.title}用户成功！` });
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

const emits = defineEmits<{
  (e: 'cancel'): void;
}>();

defineExpose({
  acceptParams
});
</script>

<style lang="scss" scoped>
.edit-user-dialog-form {
  padding: 0 15px;
  :deep(.el-date-editor.el-input) {
    width: 100%;
  }
}
</style>
