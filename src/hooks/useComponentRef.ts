import { ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useComponentRef<T extends abstract new (...args: any) => any>(_component: T) {
  return ref<InstanceType<T>>();
}
