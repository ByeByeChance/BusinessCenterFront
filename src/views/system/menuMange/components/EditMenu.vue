<template>
  <BaseDialog
    v-model="dialogVisible"
    @confirm="handleConfirm"
    @close="dialogVisible = false"
    :title="props.title"
    :show-footer="props.title === '详情' ? false : true"
    width="50%"
  >
    <el-form
      ref="formRef"
      :model="props.rowData"
      label-suffix=" :"
      :rules="rules"
      label-width="auto"
      :disabled="props.title === '详情'"
    >
      <el-form-item label="上级菜单" prop="parentId">
        <el-tree-select
          v-model="props.rowData!.parentId"
          :data="menuList"
          check-strictly
          :default-expand-all="true"
          :render-after-expand="false"
          placeholder="无"
        >
        </el-tree-select>
      </el-form-item>
      <el-form-item label="菜单标题" prop="title">
        <el-input v-model="props.rowData!.title" placeholder="请填写菜单标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单name" prop="name">
        <el-input v-model="props.rowData!.name" placeholder="请填写菜单name" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单路径" prop="path">
        <el-input v-model="props.rowData!.path" placeholder="菜单路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input v-model="props.rowData!.component" placeholder="组件路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="重定向菜单路径" prop="redirect">
        <el-input v-model="props.rowData!.redirect" placeholder="请填写重定向菜单路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <SelectIcon v-model:icon-value="props.rowData!.icon" />
      </el-form-item>
      <el-form-item label="外链地址" prop="isLink">
        <el-input v-model="props.rowData!.isLink" placeholder="请填写外链地址" clearable></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否隐藏" prop="isHide">
            <el-switch v-model="props.rowData!.isHide" inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否全屏" prop="isFull">
            <el-switch v-model="props.rowData!.isFull" inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否缓存" prop="isKeepAlive">
            <el-switch v-model="props.rowData!.isKeepAlive" inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否固定" prop="isAffix">
            <el-switch v-model="props.rowData!.isAffix" inline-prompt active-text="是" inactive-text="否" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="菜单排序" prop="sort">
            <el-input-number v-model="props.rowData!.sort" :min="1" :max="100" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </BaseDialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import BaseDialog from '@/components/BaseDialog/index.vue';
import SelectIcon from '@/components/SelectIcon/index.vue';
import { Menu as ApiMenu } from '@/api/interface/menu';
import { ElMessage, FormInstance } from 'element-plus';
import { useAuthStore } from '@/stores/modules/auth';

interface Props {
  title: string;
  rowData: Partial<ApiMenu.MenuItem>;
  api?: (params: any, config: any) => Promise<any>;
  getTableList?: () => void;
}
const dialogVisible = ref(false);
const props = ref<Props>({
  title: '',
  rowData: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: Props) => {
  props.value = params;
  dialogVisible.value = true;
};

const authStore = useAuthStore();
type CommonTree = {
  label: string;
  value: number | null;
  children?: CommonTree[];
};
const transformMenuListToCommonTree = (initTree: Menu.MenuOptions[]): CommonTree[] => {
  const result: CommonTree[] = [];
  for (let i = 0; i < initTree.length; i++) {
    const currentItem = initTree[i];
    const item: CommonTree = {
      label: '',
      value: null,
      children: undefined
    };
    item.label = currentItem.meta?.title || '';
    item.value = currentItem.id;
    if (currentItem.children) {
      item.children = transformMenuListToCommonTree(currentItem.children!);
    }
    result.push(item);
  }
  return result;
};
const menuList: CommonTree[] = transformMenuListToCommonTree(authStore.authMenuListGet);

const formRef = ref<FormInstance>();
const rules = reactive({
  title: [{ required: true, message: '请填写菜单标题' }],
  name: [{ required: true, message: '请填写菜单name' }]
});

const handleConfirm = () => {
  formRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await props.value.api!(props.value.rowData, { loading: false });
      ElMessage.success({ message: `${props.value.title}菜单成功！` });
      props.value.getTableList!();
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

<style lang="scss" scoped></style>
