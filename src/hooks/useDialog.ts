import { ref } from 'vue';

export default function useDialog(closeDialogCallback?: (params?: any) => void, openDialogCallback?: () => void) {
  const visible = ref(false);
  const loading = ref(false);
  const openDialog = () => {
    visible.value = true;
    openDialogCallback && openDialogCallback();
  };
  const closeDialog = (params?: any) => {
    visible.value = false;
    closeDialogCallback && closeDialogCallback(params);
  };
  const openLoading = () => (loading.value = true);
  const closeLoading = () => (loading.value = false);
  return {
    visible,
    loading,
    openDialog,
    closeDialog,
    openLoading,
    closeLoading
  };
}
