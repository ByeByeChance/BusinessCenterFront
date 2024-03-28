import SparkMD5 from 'spark-md5';

export function createChunk(file: File, index: number, chunkSize: number) {
  return new Promise(resolve => {
    const start = index * chunkSize;
    const end = start + chunkSize;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    const chunk = file.slice(start, end);
    fileReader.onload = e => {
      spark.append(e.target!.result);
      resolve({
        index,
        chunk,
        start,
        end,
        hash: spark.end(),
        fileName: file.name
      });
    };
    fileReader.readAsArrayBuffer(chunk);
  });
}
