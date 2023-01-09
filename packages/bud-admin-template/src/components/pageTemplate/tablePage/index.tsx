import { render, watch, ref, onMounted, onBeforeUnmount } from 'vue'
import { defineComponent } from 'vue'
import Header from './components/header'
import { tableItemStore } from './tablePageStore'
import { FormInitType } from '../../model'
import Search from './components/search'
import BudTable from './components/table'
import SortTable from '@/components/sortTable'
import { Button } from 'ant-design-vue'
import { SwapOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  props: {
    tablePageName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // const store = TablePageStore().get(props.tablePageName)
    const store = tableItemStore()

    // if (!store) {
    //   return { store }
    // }

    const sortTableVisible = ref<boolean>(false)

    const formInit = (type: FormInitType, formData: Record<string, any>) => {
      if (typeof store?.modal.afterFormInit === 'function') {
        if (type === 'add' || type === 'edit' || type === 'batchEdit') {
          store.modal.afterFormInit(type, formData)
        }
      }
    }

    onMounted(() => {
      store?.getTableData()
    })

    watch(sortTableVisible, () => {
      if (store) {
        store.table.pagination.current = 1
        store.getTableData()
      }
    })

    const openSortTable = () => {
      sortTableVisible.value = true
    }
    onBeforeUnmount(() => {
      store.reInitStore()
    })

    return {
      sortTableVisible,
      store,
      formInit,
      openSortTable,
    }
  },
  render() {
    const { store, formInit, tablePageName, sortTableVisible, openSortTable } =
      this
    // if (!store) {
    //   return <>Store is nil</>
    // }

    const tableSlots = {
      ...this.$slots,
      tableHeaderRight: () => {
        return (
          <>
            {this.$slots.tableHeaderRight?.()}
            <Button onClick={openSortTable} icon={<SwapOutlined />}>
              项目排序
            </Button>
          </>
        )
      },
    }
    return (
      <>
        {sortTableVisible}
        <Header tablePageName={this.tablePageName} formInit={formInit}></Header>
        <Search tablePageName={tablePageName}></Search>
        <BudTable
          tablePageName={tablePageName}
          formInit={formInit}
          v-slots={tableSlots}
        ></BudTable>
        {/* <SortTable visible={sortTableVisible}></SortTable> */}
      </>
    )
  },
})
