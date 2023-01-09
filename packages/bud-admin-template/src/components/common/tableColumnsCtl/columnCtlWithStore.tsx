import { defineComponent, PropType, ref, onMounted } from 'vue'
import { columnPersistStore } from './store'
import { useVModel } from '@vueuse/core'
import ColumnCtl from './columnCtl'
export default defineComponent({
  props: {
    columns: {
      required: true,
      type: Array as PropType<Array<any>>,
    },
    filterColumns: {
      type: Array as PropType<Array<any>>,
    },
    pageName: {
      required: true,
      type: String,
    },
  },
  emits: ['update:filterColumns'],
  setup(props, { emit }) {
    const store = columnPersistStore()
    const columnsChecked = ref<Array<string>>([])

    const filterColumns = useVModel(props, 'filterColumns', emit)

    const onChangeFilterColumns = (fc: Array<any>, fcKeys: Array<string>) => {
      filterColumns.value = fc
      store.setColumnsChecked(props.pageName, fcKeys)
    }

    onMounted(() => {
      columnsChecked.value =
        store.getColumnsCheckedStore(props.pageName) ||
        props.columns.map((item) => {
          return item.key
        })
    })
    return {
      store,
      filterColumns,
      onChangeFilterColumns,
      columnsChecked,
    }
  },

  render() {
    const { columns, onChangeFilterColumns } = this
    return (
      <ColumnCtl
        columns={columns}
        onChangeFilterColumns={onChangeFilterColumns}
        v-model={[this.columnsChecked, 'columnsChecked']}
      />
    )
  },
})
