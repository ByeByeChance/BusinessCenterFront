<template>
  <div class="card content-box">
    <el-upload
      ref="upload"
      class="upload-demo"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      :limit="1"
      :auto-upload="false"
      :on-change="onChange"
    >
      <template #trigger>
        <el-button type="primary">select file</el-button>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts" name="timingTask">
import { ref } from "vue";
import type { UploadInstance, UploadFile } from "element-plus";
import { useUpload } from "@/hooks/useUpload";

const upload = ref<UploadInstance>();

const { uploadFile } = useUpload();

const onChange = async (file: UploadFile) => {
  uploadFile(file.raw as File, 1, successCallback, errorCallback);
};

const successCallback = () => {
  console.log("success");
};
const errorCallback = () => {
  console.log("error");
};
</script>
