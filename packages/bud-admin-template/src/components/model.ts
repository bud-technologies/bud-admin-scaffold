import { ModalSize } from './modal/model'
import type {
  TreeSelectProps,
  InputProps,
  InputNumberProps,
  SelectProps,
  TextAreaProps,
  CheckboxProps,
} from 'ant-design-vue'
import { RangePickerBaseProps } from 'ant-design-vue/lib/date-picker/generatePicker'
import { Dayjs } from 'dayjs'

export type InputTemplate =
  | 'input'
  | 'inputNumber'
  | 'select'
  | 'datePicker'
  | 'text'
  | 'rangePicker'
  | 'img'
  | 'textarea'
  | 'cropperImg'
  | 'checkbox'
  | 'sevenDatePicker'
  | 'rangeDatePicker'
  | 'regionSelect'

export interface InputType extends InputProps {
  type: 'input'
}
interface InputNumber extends InputNumberProps {
  type: 'inputNumber'
}
export interface SelectType extends SelectProps {
  type: 'select'
  selectOptions?:
    | Array<{ label: string; value: string | number }>
    | (() => Array<{ label: string; value: string | number }>)
}
interface DatePicker {
  type: 'datePicker'
}
interface Text {
  type: 'text'
  value?: string
  placeholder?: string
}
interface RangePicker {
  type: 'rangePicker'
}
interface RangePickerForm extends RangePickerBaseProps<Dayjs> {
  type: 'rangePicker'
}
interface RegionSelect extends TreeSelectProps {
  type: 'regionSelect'
}
interface TextArea extends TextAreaProps {
  type: 'textarea'
}
interface CheckBox extends CheckboxProps {
  type: 'checkBox'
}
interface Img {
  type: 'img'
}

type CommonProperties = {
  name: string
  width?: string
  value?: string | number | boolean | Record<string, any> | Array<string>
}

export type InputTemplateItem = CommonProperties &
  (
    | InputType
    | SelectType
    | InputNumber
    | Text
    | TextArea
    | CheckBox
    | RangePicker
    | DatePicker
    | RegionSelect
    | RangePickerForm
    | Img
  )

export declare type HttpApi<T> = (params: any) => Promise<
  | [null, T]
  | [
      {
        rmsg: string
        data: undefined | string
      },
      undefined
    ]
>

export interface ITableData<T> {
  data: Array<T>
  total: number
  page?: number
  isEnd?: number
  cookie?: string
  current?: number
}

export declare type HttpTableApi<T> = (params: any) => Promise<
  | [null, ITableData<T>]
  | [
      {
        rmsg: string
        data: undefined | string
      },
      undefined
    ]
>

export interface IRelateInfo {
  relateField: string | Array<string>
  getDataFunc: (
    params: any
  ) => Promise<string | Record<string, any> | undefined>
}

export type IFormItem<T> = {
  name: T
  label: string
  sourceImg?: string
  hideWhenEdit?: boolean
  disabledEdit?: boolean
  uploadApi?: (data: FormData) => Promise<string>
  relateInfo?: IRelateInfo
  hide?: boolean
  defaultVal?: any
} & InputTemplateItem

export interface IFormProps<T extends string> {
  formItems: Array<IFormItem<T>>
  formInit?: (data: any) => void
  rules: Record<T, Array<any>>
  img?: IRelateInfo
  editData?: any
}

export interface ITitleBtnDetail {
  btnText?: string
  btnApi?: (params: any) => any
}

export interface IRelateInfo {
  relateField: string | Array<string>
  getDataFunc: (
    params: any
  ) => Promise<string | Record<string, any> | undefined>
}

export interface ISortOperation extends ITitleBtnDetail {
  needSortData?: Array<{ id?: number; name?: string }>
  type?: 'modal' | 'table'
}
export interface ITagOperation extends ITitleBtnDetail {
  afterTagNeedReq?: boolean
  afterChangeTags?: () => void
}

export interface ITitleBtn {
  add?: ITitleBtnDetail
  sort?: ISortOperation
  batchDel?: ITitleBtnDetail
  batchEdit?: ITitleBtnDetail
  batchTagContent?: ITagOperation
  batchTagUser?: ITagOperation
}

export type IQueryFormItem = {
  name: string
  label?: string
  mode?: string
  dateLimitNum?: number
  defaultVal?: any
} & InputTemplateItem

export interface ISearch<T, F extends string> {
  queryForm: Array<IQueryFormItem>
  queryData: Record<F, any>
  btnDisabled?: boolean
  btnText?: string
  searchAfterChangeRegion?: boolean
  queryParamsOutOfSearchForm: Record<string, any>
  isHideSearchBtn?: boolean
  queryApi?: HttpTableApi<T>
  beforeSearch?: (queryData: Record<F, any>) => Record<F, any> | void
}

export interface IModal<AddRes, EditRes> {
  visible: boolean
  title: string
  titleStore: {
    add?: string
    edit?: string
  }
  loading: boolean
  size?: ModalSize
  modalOpen?: () => void
  modalClose?: () => void
  afterFormInit?: (
    type: 'edit' | 'add' | 'batchEdit',
    formData: Record<string, any>
  ) => void
  addApi?: HttpApi<AddRes>
  editApi?: HttpApi<EditRes>
  beforeAdd?: (
    values: Record<string, string | number>
  ) => void | Record<string, string | number> | boolean
  beforeEdit?: (
    values: Record<string, string | number>
  ) => void | Record<string, string | number> | boolean
}

export interface Scroll {
  x?: number
  y?: number
}

export interface IPagination {
  current: number
  pageSize: number
  total: number
  isEnd?: number // 用在长列表，即一般是请求端上后端算法数据用到
}

export interface ITable<EditRes, DeleteRes> {
  columns: Array<any>
  dataSource: Array<any>
  operationBtn?: Array<'delete' | 'edit'>
  loading: boolean
  rowKey?: string
  scroll?: Scroll
  loadingMoreTable?: boolean
  handleResData?: (dataSource: Array<any>, resArr: Array<any>) => Array<any>
  isHideOperation?: boolean | ((params: any) => boolean)
  operationApi?: {
    delete?: HttpApi<DeleteRes>
    edit?: HttpApi<EditRes>
  }
  pagination: IPagination
}

export interface IState<
  TableData,
  AddRes,
  EditRes,
  DeleteRes,
  SearchFormKeys extends string
> {
  title: string
  titleBtn: ITitleBtn
  search: ISearch<TableData, SearchFormKeys>
  batchEdit?: {
    title: string
    api?: HttpApi<any>
    form: IFormProps<string>
    btnText: string
    customSubmit?: (
      formData: Record<string, string | number>,
      otherData?: any
    ) => Promise<boolean>
    before?: (
      values: Record<string, string | number>
    ) => void | Record<string, string | number> | boolean
    modalOpen?: () => void
    modalClose?: () => void
  }
  form: IFormProps<string>
  modal: IModal<AddRes, EditRes>
  table: ITable<EditRes, DeleteRes>
}

export interface IActions {
  research: () => Promise<void>
  getTableData: () => void
  reInitStore: () => void
  researchLoadingMoreTable: () => void
  setPagination: (p: IPagination) => void
  changeDataWithoutFetch: (
    formData: Record<string, any>,
    operateType?: 'edit' | 'delete',
    key?: string
  ) => Array<Record<string, any>> | void
}
export function defineFormItem<T extends string>(
  formItems: Array<IFormItem<T>>
) {
  return formItems
}

export type BlurType = 'input' | 'inputNumber'
export type ValueChangeType = 'select' | 'regionSelect'
export type FormInitType = 'add' | 'edit' | 'batchEdit'

export type PickFormItemName<T extends Array<IFormItem<string>>> =
  T[number]['name']
