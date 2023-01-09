import { defineStore } from 'pinia'
import { ref } from 'vue'

export const columnPersistStore = defineStore(
  'tableColumnCtl',
  () => {
    const columnsCheckedStore = ref<Record<string, Array<string>>>({})

    const setColumnsChecked = (key: string, val: Array<string>) => {
      columnsCheckedStore.value[key] = val
    }
    const getColumnsCheckedStore = (key: string) => {
      return columnsCheckedStore.value[key]
    }

    return {
      columnsCheckedStore,
      setColumnsChecked,
      getColumnsCheckedStore,
    }
  },
  {
    persist: true,
  }
)
