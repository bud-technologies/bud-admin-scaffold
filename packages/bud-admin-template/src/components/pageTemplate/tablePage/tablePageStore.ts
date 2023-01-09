import { defineStore, type Store, type StoreDefinition } from 'pinia'
// import  { StoreDefinition, Store } from 'pinia';
import type { IState, IActions } from '../../model'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { IPagination } from '../../model'
export const mysqlMaxInt = 2147483647

export const emptyState: IState<any, any, any, any, any> = {
  title: '',
  titleBtn: {},
  // scroll: '',
  search: {
    queryForm: [],
    queryData: {},
    btnText: '',
    queryApi: undefined,
    queryParamsOutOfSearchForm: {},
  },
  form: {
    rules: {},
    formItems: [],
  },
  batchEdit: undefined,
  modal: {
    visible: false,
    title: '',
    titleStore: {
      add: '',
      edit: '',
    },
    loading: false,
  },
  table: {
    loading: false,
    columns: [],
    dataSource: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  },
}

export type TableStoreType<T, A, E, D, F extends string> = StoreDefinition<
  string,
  IState<T, A, E, D, F>,
  {},
  IActions
>

export type piniaStoreType = Store<
  string,
  {
    title: string
  },
  {},
  IActions
>
// const TableStoreMap = new Map()

export const tableItemStore = defineStore<
  string,
  IState<any, any, any, any, any>,
  {},
  IActions
>('tableTemplateStore', {
  state: () => emptyState,
  actions: {
    reInitStore() {
      this.title = ''
      this.titleBtn = {}
      this.search = {
        queryForm: [],
        queryData: {},
        queryApi: undefined,
        queryParamsOutOfSearchForm: {},
      }
      this.form = {
        rules: {},
        formItems: [],
      }
      this.modal = {
        visible: false,
        title: '',
        titleStore: {
          add: '',
          edit: '',
        },
        loading: false,
      }
      this.batchEdit = undefined
      this.table = {
        loading: false,
        columns: [],
        dataSource: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
      }
    },
    async research() {
      this.table.pagination.current = 1
      this.table.dataSource = []
      await this.getTableData()
    },
    async researchLoadingMoreTable() {
      this.table.pagination.current = 1
      this.search.queryData.cookie = ''
      this.table.pagination.total = 0
      this.table.dataSource = []
      this.table.pagination.current = 1

      this.getTableData()
    },
    setPagination(pagination: IPagination) {
      this.table.pagination = pagination
      console.log('this :=', this.table)

      console.log('this.table.pagination:=', this.table.pagination)
    },
    changeDataWithoutFetch(
      formData: Record<string, any>,
      operateType = 'edit',
      key = 'id'
    ) {
      if (operateType === 'delete') {
        const index = this.table.dataSource.findIndex(
          (item) => item[key] === formData[key]
        )
        if (index === -1) {
          message.error('未找到该条数据')
          return
        }
        return this.table.dataSource.splice(index, 1)
      }
      this.table.dataSource.forEach((item, index) => {
        if (item[key] === formData[key]) {
          this.table.dataSource[index] = { ...item, ...formData }
        }
      })
    },
    async getTableData() {
      if (typeof this.search.queryApi !== 'function') {
        console.error('queryApi is not a function')
        return
      }

      if (typeof this.search.beforeSearch === 'function') {
        const beforeSearchRes = this.search.beforeSearch(this.search.queryData)

        if (beforeSearchRes) {
          this.search.queryData = beforeSearchRes
        }
      }
      this.table.loading = true
      Object.keys(this.search.queryData).forEach((key) => {
        // 这里可以处理需要特殊处理的条件
        //  对时间选择器进行处理
        if (
          key.toLocaleLowerCase().includes('_autotransfertime') &&
          Array.isArray(this.search.queryData[key]) &&
          typeof this.search.queryData[key][0] === 'object'
        ) {
          this.search.queryData[key] = [
            this.search.queryData[key][0]
              ? Math.floor(
                  dayjs(this.search.queryData[key][0]).valueOf() / 1000
                )
              : 0,
            this.search.queryData[key][1]
              ? Math.floor(
                  dayjs(this.search.queryData[key][1]).valueOf() / 1000
                )
              : mysqlMaxInt,
          ]
        }
      })
      this.search.btnDisabled = true
      const [err, res] = await this.search.queryApi({
        ...this.search.queryData,
        current: this.table.pagination.current,
        pageSize: this.table.pagination.pageSize,
        ...this.search.queryParamsOutOfSearchForm,
      })
      this.search.btnDisabled = false
      this.table.loading = false
      if (err) {
        return
      }
      if (
        this.table.handleResData &&
        typeof this.table.handleResData === 'function'
      ) {
        res.data = this.table.handleResData(
          this.table.dataSource,
          res?.data || []
        )
      }

      if (this.table.loadingMoreTable) {
        this.table.dataSource = [...this.table.dataSource, ...res.data]
        this.table.pagination.total = this.table.pagination.total + res.total
        this.table.pagination.isEnd = res.isEnd
        this.search.queryData.cookie = res.cookie
        this.table.pagination.current = this.table.pagination.current + 1
      } else {
        this.table.dataSource = res?.data
        this.table.pagination.total = res?.total
      }
    },
  },
})

export const tablePageCommonStore = defineStore('tableCommonStore', () => {
  const usernameJumpUrlPrefix = ref<string>('')

  const getUsernameJumpUrlPrefix = () => {
    return usernameJumpUrlPrefix.value
  }
  const setUsernameJumpUrlPrefix = (url: string) => {
    usernameJumpUrlPrefix.value = url
  }
  return {
    getUsernameJumpUrlPrefix,
    setUsernameJumpUrlPrefix,
  }
})

// type TablePageStoreType = <T>() => {
//   set: <T, A, E, D, F extends string>(
//     pageName: string,
//     state: IState<T, A, E, D, F>
//   ) => Store<string, IState<T, A, E, D, F>, {}, IActions>
//   get: <T, A, E, D, F extends string>(
//     pageName: string
//   ) => Store<string, IState<T, A, E, D, F>, {}, IActions> | undefined
// }

// export const TablePageStore: TablePageStoreType = () => {
//   return {
//     set: <T, A, E, D, F extends string>(
//       pageName: string,
//       state: IState<T, A, E, D, F>
//     ) => {
//       TableStoreMap.set(pageName, tableItemStore(pageName, state))
//       return TableStoreMap.get(pageName)?.()
//     },
//     get: (pageName: string) => TableStoreMap.get(pageName)?.(),
//   }
// }

export const DefaultCover =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=='
