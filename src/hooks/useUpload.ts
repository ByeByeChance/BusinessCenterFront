// 参考文档 https://cn.vitejs.dev/guide/features#web-workers
import Worker from "@/utils/worker?worker";
import { uploadFile as uploadApi } from "@/api/modules/upload";
// import { useIndexDBStore } from '@/stores/modules/indexDB';
// import { ElMessage } from 'element-plus';

const MAX_SINGLE_FILE_SIZE = 20 * 1024 * 1024; // 100MB
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const THREAD_COUNT = navigator.hardwareConcurrency || 4;
const MAX_REQUEST_NUMBER = 6; // 最大并发数量

type chunkItemType = {
  start: number;
  end: number;
  index: number;
  hash: any;
  chunk: Blob;
};
type uploadChunkTaskType = {
  id: number;
  fileName: string;
  chunks: chunkItemType[];
  whileRequests: any[]; // 正在请求中的请求个数,目前是要永远都保存请求个数为6
  errorChunks: chunkItemType[]; // 上传失败的切片
};

export const useUpload = () => {
  const cutFile = async (file: File): Promise<chunkItemType[]> => {
    return new Promise(resolve => {
      const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
      const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT);
      const result: any = [];
      let finishCount = 0;
      for (let i = 0; i < THREAD_COUNT; i++) {
        const start = i * threadChunkCount;
        let end = (i + 1) * threadChunkCount;
        if (end > chunkCount) {
          end = chunkCount;
        }
        // 创建一个线程并分配任务
        const worker = new Worker();
        worker.postMessage({
          file,
          CHUNK_SIZE,
          startChunkIndex: start,
          endChunkIndex: end
        });
        worker.onmessage = event => {
          for (let j = start; j < end; j++) {
            result[j] = event.data[j - start];
          }
          worker.terminate(); // 关闭线程
          finishCount++;
          if (finishCount === THREAD_COUNT) {
            resolve(result);
          }
        };
      }
    });
  };

  const uploadFile = async (file: File, id: number, successCallback?: () => void, errorCallback?: () => void) => {
    if (file.size > MAX_SINGLE_FILE_SIZE) {
      createUploadChunkTask(file, id, successCallback, errorCallback);
    } else {
      const formData = new FormData();
      formData.append("chunk", file);
      formData.append("fileName", file.name);
      formData.append("isChunk", "false");
      formData.append("id", String(id));
      uploadApi(formData)
        .then(() => {
          successCallback && successCallback();
        })
        .catch(() => {
          errorCallback && errorCallback();
        });
    }
  };

  const createUploadChunkTask = async (file: File, id: number, successCallback?: () => void, errorCallback?: () => void) => {
    const chunks: chunkItemType[] = await cutFile(file);
    const uploadChunkTask: uploadChunkTaskType = {
      id,
      fileName: file.name,
      chunks,
      whileRequests: [],
      errorChunks: []
    };
    // saveUploadTask(id, uploadChunkTask);
    uploadChunk(id, uploadChunkTask, successCallback, errorCallback);
  };

  const uploadChunk = async (
    id: number,
    uploadChunkTask: uploadChunkTaskType,
    successCallback?: () => void,
    errorCallback?: () => void
  ) => {
    const { fileName, chunks, whileRequests, errorChunks } = uploadChunkTask;
    for (let i = 0, len = chunks.length; i < len; i++) {
      const formData = new FormData();
      formData.append("isChunk", "true");
      formData.append("fileName", fileName);
      formData.append("chunk", chunks[i].chunk);
      formData.append("chunkCount", String(len));
      formData.append("hashStr", String(chunks[i].hash));
      formData.append("chunkIndex", String(chunks[i].index));
      formData.append("id", String(id));
      const task = uploadApi(formData);
      task
        .catch(() => {
          errorChunks.push(chunks[i]);
          if (errorChunks.length > 3) {
            errorCallback && errorCallback();
            return;
          }
        })
        .finally(() => {
          const index = whileRequests.indexOf(task);
          whileRequests.splice(index, 1);
          uploadChunkTask.chunks = uploadChunkTask.chunks.filter(item => item.index !== chunks[i].index);
          if (uploadChunkTask.chunks.length === 0) {
            successCallback && successCallback();
          }
        });

      whileRequests.push({ task });

      if (whileRequests.length === MAX_REQUEST_NUMBER) {
        // 处理并发请求
        try {
          await Promise.all(whileRequests.map(item => item.task));
        } catch (error) {}
      }
    }
  };

  // const getUploadTask = async (id: number) => {
  //   const indexDBStore = useIndexDBStore();
  //   const uploadTask = await indexDBStore.getFilesDB(String(id));
  //   return uploadTask;
  // };

  // const saveUploadTask = async (id: number, uploadTask: uploadChunkTaskType) => {
  //   const indexDBStore = useIndexDBStore();
  //   await indexDBStore.setFilesDB(String(id), uploadTask);
  //   console.log(getUploadTask(id));
  // };

  return {
    cutFile,
    uploadFile
  };
};
