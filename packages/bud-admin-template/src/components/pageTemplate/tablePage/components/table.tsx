import { defineComponent, PropType, computed, ref, watch } from 'vue'
import './table.css'
import {
  Dropdown,
  Popconfirm,
  Space,
  message,
  Button,
  Image,
  Table,
  TablePaginationConfig,
  Pagination,
} from 'ant-design-vue'
import { tableItemStore, tablePageCommonStore } from '../tablePageStore'
import ModalForm from '../../../modal/modalForm'
import { ModalSize } from '../../../modal/model'
import { FormInitType } from '../../../model'
import { DownOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { Key } from 'ant-design-vue/lib/_util/type'
import { SorterResult } from 'ant-design-vue/lib/table/interface'
import SvgIcon from '../../../../components/common/SvgIcon'
import ColumnCtlWithStore from '../../../../components/common/tableColumnsCtl/columnCtlWithStore'
import CopyTextComp from '@/components/common/CopyTextComp'
import { FullAppVersion } from '../../../../utils/const'
import UsernameComp from '@/components/common/UsernameComp'
import { handleTimestamp } from '../../../../utils/index'
import { ITagName } from '../../../../models/tag'
import ColumnTags from '@/components/common/tags/columnTags'

export default defineComponent({
  props: {
    tablePageName: {
      type: String,
      required: true,
    },
    defaultModalSize: {
      type: String as PropType<ModalSize>,
    },
    formInit: {
      type: Function as PropType<
        (formInitType: FormInitType, formData: any) => void
      >,
      required: true,
    },
  },
  setup(props, { slots }) {
    const store = tableItemStore()
    const commonStore = tablePageCommonStore()
    console.log(store)

    // if (!store) {
    //   return () => <div>Store Is Null</div>
    // }

    const hadSelected = ref<boolean>(false)
    const selectedRowKeys = ref<Array<Key>>([])
    const selectedRows = ref<Array<any>>([])

    const filterColumns = ref<Array<any>>(store.table.columns)
    const sortTableVisible = ref<boolean>(false)

    const tablePagination = ref({
      current: 1,
      pageSize: store.table.pagination.pageSize,
    })

    const checkBoxOptions = computed(() => {
      return store.table.columns.map((item) => {
        return {
          label: item.title,
          value: item.key,
        }
      })
    })

    const cleanHandler = () => {
      selectedRowKeys.value = []
      selectedRows.value = []
      hadSelected.value = false
    }
    const setSelectedRows = () => {
      selectedRowKeys.value = []
      selectedRows.value = []
      hadSelected.value = false
    }

    const tableSelectedChange = (
      _selectedRowKeys: Key[],
      _selectedRows: Array<any>
    ) => {
      selectedRowKeys.value = _selectedRowKeys
      selectedRows.value = _selectedRows
      hadSelected.value = _selectedRowKeys.length > 0
    }

    const tableChange = (
      { current, pageSize }: TablePaginationConfig,
      filters: any,
      { columnKey, field, order }: SorterResult<any>
    ) => {
      tablePagination.value.current = current || 0
      if (typeof pageSize === 'number') {
        tablePagination.value.pageSize = pageSize
      }

      if (typeof field === 'string') {
        store.search.queryParamsOutOfSearchForm.sortBy = {
          field,
          order,
        }
      } else if (store.search.queryParamsOutOfSearchForm.sort !== null) {
        store.search.queryParamsOutOfSearchForm.sortBy = null
      }
    }

    const changePagination = (page: number) => {
      store.table.pagination.current = page
      store.getTableData()
    }

    const loadingMorePage = async () => {
      const page = tablePagination.value.current
      await store.getTableData()
      tablePagination.value.current = page
    }

    const changeDataWithoutFetch = (formData: Record<string, any>) => {
      store.table.dataSource.forEach((item, index) => {
        if (item.id === formData.id) {
          store.table.dataSource[index] = { ...item, ...formData }
        }
      })
    }

    const afterBatchEditApi = () => {
      cleanHandler()
      store.table.loadingMoreTable
        ? store.researchLoadingMoreTable()
        : store.getTableData()
    }

    const editModalProps = computed(() => {
      return {
        btnType: 'svgEdit',
        api: store.modal.editApi,
        beforeApi: store.modal.beforeEdit,
        afterApi: store.table.loadingMoreTable
          ? changeDataWithoutFetch
          : store.getTableData,
        title: store.modal.titleStore.edit,
        modalOpen: store.modal.modalOpen,
        modalClose: store.modal.modalClose,
        successText: '编辑成功',
      }
    })

    const batchEditModalProps = computed(() => {
      return {
        btnType: 'linkEdit',
        api: store.batchEdit?.api,
        beforeApi: store.batchEdit?.before,
        afterApi: afterBatchEditApi,
        customSubmit: store.batchEdit?.customSubmit,
        title: store.batchEdit?.title || '',
        btnText: store.batchEdit?.btnText,
        modalOpen: store.batchEdit?.modalOpen,
        modalClose: store.batchEdit?.modalClose,
        successText: '编辑成功',
      }
    })

    const formInit = (
      type: 'add' | 'edit' | 'batchEdit',
      formData: Record<string, any>
    ) => {
      if (typeof store.modal.afterFormInit === 'function') {
        if (type === 'add' || type === 'edit' || type === 'batchEdit') {
          store.modal.afterFormInit(type, formData)
        }
      }
    }

    const handleAfterChangeTag = (
      column: any,
      record: any,
      checkedList: Array<ITagName>
    ) => {
      if (typeof column.tag?.afterChangeTags === 'function') {
        column.tag?.afterChangeTags(record, checkedList)
      } else if (store.table.loadingMoreTable) {
        store.researchLoadingMoreTable()
      } else {
        store.research()
      }
    }

    const batchEdit = () => {
      if (!store.batchEdit) {
        return
      }
      return (
        <ModalForm
          size={store.modal.size || props.defaultModalSize}
          baseInfo={batchEditModalProps.value}
          form={{
            ...store.batchEdit.form,
            formInit: (formData) => props.formInit('batchEdit', formData),
          }}
          isBatchEdit={true}
          disabled={hadSelected.value}
          dataForReq={{ ids: selectedRowKeys.value, rows: selectedRows.value }}
          v-slots={{ footer: (data: any) => slots.modalFooter?.(data) }}
        >
          {slots.form?.({ isCreate: false })}
        </ModalForm>
      )
    }

    const handleDelete = async (record: any) => {
      if (typeof store.table.operationApi?.delete !== 'function') {
        console.error('operationApi.delete is not a function')
        return
      }
      const [err, res] = await store.table.operationApi.delete({
        id: record.id,
      })
      if (err) {
        message.error(err.rmsg)
        return
      }
      message.success('删除成功')
      if (store.table.loadingMoreTable) {
        store.researchLoadingMoreTable()
      } else {
        if (store.table.dataSource.length === 1) {
          store.table.pagination.current--
        }
        store.getTableData()
      }
    }

    const batchDel = () => {
      if (!store.titleBtn.batchDel) {
        return
      }
      const confirm = async () => {
        if (Number(selectedRowKeys.value.length) < 1) {
          return
        }
        try {
          const res = await store.titleBtn.batchDel?.btnApi?.(
            selectedRowKeys.value
          )
          if (Array.isArray(res) && res[0]) {
            message.error('批量删除失败')
            return
          }
          cleanHandler()
          store.getTableData()
          message.success('批量删除成功！')
        } catch (error: any) {
          if (error.rmsg) {
            message.error(error.rmsg)
          }
        }
      }
      return (
        <Popconfirm
          title={`确定要批量删除当前所选[${selectedRowKeys.value.length}]条数据吗？`}
          okText="删除"
          cancelText={'取消'}
          onConfirm={confirm}
        >
          <a style={{ color: hadSelected.value ? 'grey' : 'red' }}>批量删除</a>
        </Popconfirm>
      )
    }

    const operationDropDownSlots = () => {
      return (
        <>
          {batchEdit()}
          {batchDel()}
          {slots.batchOperation?.({
            selectedRowKeys,
            selectedRows,
            cleanHandler,
            setSelectedRows,
            store,
          })}
        </>
      )
    }

    const tableHeader = () => {
      return (
        <div class={'table-header'}>
          <div>{slots.tableHeaderLeft?.()}</div>
          <div class={'table-header-right'}>
            <Space>
              <div>{slots.tableHeaderRight?.()}</div>
              {store.batchEdit && (
                <Dropdown overlay={operationDropDownSlots()}>
                  <Button>
                    批量操作<DownOutlined></DownOutlined>
                  </Button>
                </Dropdown>
              )}
              <ColumnCtlWithStore
                columns={store.table.columns}
                v-model={[filterColumns.value, 'filterColumns']}
                pageName={props.tablePageName}
              ></ColumnCtlWithStore>
            </Space>
          </div>
        </div>
      )
    }

    const renderOperation = (record: any) => {
      if (typeof store.table.isHideOperation === 'function') {
        if (store.table.isHideOperation(record)) {
          return <span></span>
        }
      }
      if (store.table.isHideOperation) {
        return <span></span>
      }
      return (
        <Space>
          {store.table.operationBtn?.find(
            (item: string) => item === 'edit'
          ) && (
            <ModalForm
              size={store.modal.size || props.defaultModalSize}
              baseInfo={editModalProps.value}
              form={{
                formInit: (formData) => formInit('edit', formData),
                editData: record,
                ...store.form,
              }}
            ></ModalForm>
          )}
          {store.table.operationBtn?.find(
            (item: string) => item === 'delete'
          ) && (
            <Popconfirm
              cancelText="取消"
              okText="确定"
              title="确认删除？"
              onConfirm={() => handleDelete(record)}
            >
              <SvgIcon name="ic-delete" title="删除" />
            </Popconfirm>
          )}
        </Space>
      )
    }

    const columnsTemplate = (text: string, record: any, column: any) => {
      const { isNotDefault, key } = column || { key: '' }
      if (isNotDefault) {
        return
      }
      if (key.toLowerCase().includes('id') || key === 'creator') {
        return <CopyTextComp text={text}></CopyTextComp>
      }

      if (key.toLowerCase().includes('cover') || key === 'pngUrl') {
        return <Image src={text} width={150}></Image>
      }
      if (key.toLowerCase().includes('time')) {
        return handleTimestamp(text)
      }

      if (key.toLowerCase().includes('tagsinfo')) {
        return (
          <ColumnTags
            reGetData={(checkedList: Array<any>) =>
              handleAfterChangeTag(column, record, checkedList)
            }
            contentIds={[record[column.tag?.idField]]}
            tagNameList={record[column.tag?.tagField]}
            v-slots={{ columnTagsOperation: slots.columnTagsOperation }}
          ></ColumnTags>
        )
      }

      const columnStore: Record<string, JSX.Element> = {
        appVersion: <span>{text === FullAppVersion ? '全版本' : text}</span>,
        username: (
          <UsernameComp
            username={text}
            prefixUrl={commonStore.getUsernameJumpUrlPrefix()}
          />
        ),
      }

      return columnStore[key]
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
        if (slots.tableOperation) {
          return <>{slots.tableOperation({ column, record })}</>
        } else {
          return renderOperation(record)
        }
      }
      const temp = columnsTemplate(text, record, column)
      if (temp) {
        return temp
      }
      return slots.tableBodyCell?.({
        column,
        record,
        text,
        value,
      })
    }

    watch(
      () => store.search.queryParamsOutOfSearchForm.sortBy,
      (newVal, oldVal) => {
        if (store.table.loadingMoreTable) {
          if (
            (!oldVal && newVal) ||
            (newVal &&
              oldVal &&
              (oldVal.order !== newVal.order || oldVal.field !== newVal.field))
          ) {
            store.researchLoadingMoreTable()
          }
        }
      }
    )

    watch(
      () => store.table.loading,
      () => {
        if (
          store.table.loading &&
          Array.isArray(selectedRows) &&
          selectedRows.length > 0
        ) {
          cleanHandler()
        }
      }
    )

    watch(
      () => store.table.pagination.isEnd,
      () => {
        console.log(
          'store.table.pagination.isEnd := ',
          store.table.pagination.isEnd
        )
      }
    )

    // onBeforeUnmount(() => {
    //   store.reInitStore()
    // })

    return {
      tableBodyCell,
      tableHeader,
      filterColumns,
      store,
      selectedRowKeys,
      tableSelectedChange,
      tableChange,
      tablePagination,
      changePagination,
      loadingMorePage,
    }
  },
  render() {
    const {
      tableBodyCell,
      tableHeader,
      filterColumns,
      store,
      selectedRowKeys,
      tableSelectedChange,
      tableChange,
      tablePagination,
      changePagination,
      loadingMorePage,
    } = this as any
    if (!store) {
      return <div>store is nil</div>
    }

    console.log(store.table.pagination.isEnd)

    const tableSlots: Record<string, any> = {
      bodyCell: (arg: any) => {
        return tableBodyCell(arg)
      },
    }

    return (
      <div class={'content-tab wrapper'}>
        {tableHeader()}
        <Table
          columns={filterColumns}
          dataSource={store.table.dataSource}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: tableSelectedChange,
          }}
          rowKey={store.table.rowKey || 'id'}
          onChange={tableChange as any}
          pagination={store.table.loadingMoreTable ? tablePagination : false}
          loading={store.table.loading}
          bordered={true}
          scroll={store.table.scroll || { x: 1500 }}
          v-slots={tableSlots}
        ></Table>
        {store.table.loadingMoreTable ? (
          <div class="moreBtn">
            <Button
              type="primary"
              ghost
              disabled={store.table.pagination.isEnd === 1}
              onClick={loadingMorePage}
            >
              更多页
            </Button>
          </div>
        ) : (
          <Pagination
            class="pagination-right"
            onChange={changePagination}
            current={store.table.pagination.current}
            total={store.table.pagination.total}
          ></Pagination>
        )}
      </div>
    )
  },
})
