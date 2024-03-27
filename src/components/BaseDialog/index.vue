<template>
  <el-dialog
    class="base-dialog"
    :class="{ fullscreen: isFullscreen }"
    v-bind="attrs"
    v-model="dialogShow"
    :append-to-body="dialogProps.appendToBody"
    :destroy-on-close="dialogProps.destroyOnClose"
    :draggable="dialogProps.draggable"
    :width="dialogProps.width"
    :open-delay="50"
    @close="handleClose"
    :show-close="false"
  >
    <template #header="{ close }">
      <div class="base-dialog-header flx-justify-between">
        <div class="base-dialog-header-title">{{ dialogProps.title }}</div>
        <div class="base-dialog-header-operation flx-center">
          <div :class="['fullscreen', isFullscreen ? 'fullscreen-reduce' : 'fullscreen-amplify']" @click="toggleFullscreen"></div>
          <el-button :icon="CloseBold" @click="close" link></el-button>
        </div>
      </div>
    </template>
    <slot></slot>
    <template #footer v-if="dialogProps.showFooter">
      <div class="base-dialog-footer">
        <el-button @click="handleClose">{{ dialogProps.cancelText }}</el-button>
        <el-button v-if="showConfirmBtn" @click="handleConfirm" type="primary">{{ dialogProps.confirmText }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, useAttrs } from "vue";
import { CloseBold } from "@element-plus/icons-vue";

const attrs = useAttrs();

interface IDialogProps {
  visible?: boolean;
  title?: string;
  draggable?: boolean;
  width?: string | number;
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  appendToBody?: boolean;
  destroyOnClose?: boolean;
  showConfirmBtn?: boolean;
}

const dialogProps = withDefaults(defineProps<IDialogProps>(), {
  visible: false,
  title: "",
  draggable: true,
  width: "50%",
  showFooter: true,
  confirmText: "确认",
  cancelText: "取消",
  appendToBody: true,
  destroyOnClose: true,
  showConfirmBtn: true
});

const isFullscreen = ref(false);
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

const dialogShow = computed({
  get: () => dialogProps.visible,
  set: val => {
    if (val === false) {
      setTimeout(() => {
        isFullscreen.value = false;
      }, 1000);
    }
    emits("update:visible", val);
  }
});

const emits = defineEmits<{
  (e: "update:visible", status: boolean): void;
  (e: "close"): void;
  (e: "confirm"): void;
}>();

const handleClose = () => {
  emits("close");
};
const handleConfirm = () => {
  emits("confirm");
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
