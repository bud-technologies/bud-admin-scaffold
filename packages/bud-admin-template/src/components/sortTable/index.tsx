import { defineComponent, PropType, ref, watch } from 'vue'
import { HttpApi, ITableData } from '../model'
import {
  Sortable,
  Plugins,
  SortableEventNames,
  SortableStopEvent,
} from '@shopify/draggable'
import './index.css'
import { message, Spin, Button, Table } from 'ant-design-vue'
import SvgIcon from '@/components/common/SvgIcon'
export default defineComponent({
  props: {
    getTableDataApi: {
      required: true,
      type: Function as PropType<HttpApi<ITableData<any>>>,
    },
    getTableDataParams: {
      required: true,
      type: Object as PropType<Record<string, any>>,
    },
    beforeSetTableData: Function as PropType<
      (params: Array<any>) => Array<any>
    >,
    columns: {
      required: true,
      type: Array as PropType<Array<any>>,
    },
    sortDataApi: {
      required: true,
      type: Function as PropType<HttpApi<any>>,
    },
    visible: {
      required: true,
      type: Boolean,
    },
  },
  emits: ['update:visible'],
  setup(props, { emit, slots }) {
    const dataSource = ref<Array<any>>([])

    const isEnd = ref<boolean>(false)

    const loading = ref<boolean>(false)

    const current = ref<number>(1)

    const idList = ref<Array<number>>([])

    const sortTable = ref<Sortable<SortableEventNames>>()

    // const emits = defineEmits(['update:visible'])

    watch(
      () => props.visible,
      async (val) => {
        if (val) {
          idList.value = []
          dataSource.value = []
          await getData()
          initSort()
        } else {
          destroySortTable()
        }
      }
    )

    const sortConfirm = async () => {
      loading.value = true
      const [err, res] = await props.sortDataApi({
        ids: idList.value.join(','),
      })
      loading.value = false
      if (err) {
        err.data ? message.error(err.data) : message.error(err.rmsg)
        return
      }
      message.success('排序成功')
      emit('update:visible', false)
    }

    const getData = async () => {
      loading.value = true
      const [err, res] = await props.getTableDataApi({
        pageSize: 50,
        current: current.value,
        inUse: 99,
        ...props.getTableDataParams,
      })
      loading.value = false
      if (err) {
        err.data ? message.error(err.data) : message.error(err.rmsg)
        return
      }
      if (res.total <= current.value * 50) {
        isEnd.value = true
      }

      if (typeof props.beforeSetTableData === 'function') {
        res.data = props.beforeSetTableData(res.data)
      }

      if (Array.isArray(res.data)) {
        dataSource.value = [...dataSource.value, ...res.data]
        res.data.forEach((item) => {
          idList.value.push(item.id)
        })
      }
    }

    const loadingMore = async () => {
      current.value++
      getData()
    }

    const initSort = () => {
      const table = document.querySelector('#sort-table tbody') as HTMLElement
      if (!table) {
        message.error('table element 不存在')
        return
      }

      sortTable.value = new Sortable(table, {
        draggable: 'tr',
        sortAnimation: {
          duration: 300,
          easingFunction: 'ease-in-out',
        },
        plugins: [Plugins.SortAnimation], // Or [SortAnimation]
      })
      sortTable.value.on('sortable:stop', (e: SortableStopEvent) => {
        let { newIndex, oldIndex } = e
        if (newIndex > oldIndex) {
          idList.value = moveIdList(
            idList.value,
            oldIndex,
            newIndex,
            idList.value[oldIndex],
            'end'
          )
        } else if (newIndex < oldIndex) {
          idList.value = moveIdList(
            idList.value,
            newIndex,
            oldIndex,
            idList.value[oldIndex],
            'start'
          )
        }
      })
    }

    const moveIdList = (
      ids: Array<number>,
      start: number,
      end: number,
      insertId: number,
      insertPosition: 'start' | 'end'
    ): Array<number> => {
      if (insertPosition === 'end') {
        const frontArr = ids.slice(0, start)
        const midArr = ids.slice(start + 1, end + 1)
        const backArr = ids.slice(end + 1, ids.length)
        return [...frontArr, ...midArr, insertId, ...backArr]
      }

      if (insertPosition === 'start') {
        const frontArr = ids.slice(0, start)
        const midArr = ids.slice(start, end)
        const backArr = ids.slice(end + 1, ids.length)
        return [...frontArr, insertId, ...midArr, ...backArr]
      }
      return ids
    }

    const cancel = () => {
      emit('update:visible', false)
    }

    const destroySortTable = () => {
      sortTable.value?.destroy()
    }

    const tableBodyCell = ({
      column,
      record,
      text,
      value,
    }: {
      column: any
      record: any
      text: string
      value: string
    }) => {
      if (column.key === 'operation') {
        return <SvgIcon name="sort" size="18px" />
      }
      if (slots.bodyCellCustom) {
        return slots.bodyCellCustom({
          column,
          record,
          text,
          value,
        })
      }
      return value
    }
    return {
      loading,
      dataSource,
      visible: props.visible,
      columns: props.columns,
      isEnd,
      tableBodyCell,
      loadingMore,
      cancel,
      sortConfirm,
    }
  },
  render() {
    const {
      visible,
      loading,
      columns,
      dataSource,
      isEnd,
      loadingMore,
      sortConfirm,
      tableBodyCell,
      cancel,
    } = this

    const tableSlots: Record<string, any> = {
      bodyCell: (arg: any) => {
        return tableBodyCell(arg)
      },
    }
    if (!visible) {
      return <div></div>
    }
    return (
      <div class="sort-table">
        <Spin spinning={loading}>
          <div class="sort-table-header">
            <div class="sort-table-header-operation">
              <Button
                type="primary"
                size="small"
                style="margin-right: 10px"
                onClick={sortConfirm}
              >
                确认排序
              </Button>
              <Button size="small" onClick={cancel}>
                取消排序
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            id="sort-table"
            v-slots={tableSlots}
          ></Table>
          {isEnd || (
            <Button onClick={loadingMore} style="margin-top: 10px">
              加载更多
            </Button>
          )}
        </Spin>
      </div>
    )
  },
})
