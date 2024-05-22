import { useMagicKeys, whenever } from '@vueuse/core';

export function useKeyboardEvent(keysMap: Record<string, Function>) {
  const magicKeys = useMagicKeys();
  Object.keys(keysMap).forEach(key => {
    whenever(magicKeys[key], () => keysMap[key]());
  });
}
