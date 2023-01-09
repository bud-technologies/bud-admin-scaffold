export { default as AutoCreateTemplate } from './inputTemplate/inputTemplate'
export { default as FormComp } from './form/formComp'
export type { FormCompExpose } from './form/formComp'
export { default as ModalForm } from './modal/modalForm'
export { default as TablePage } from './pageTemplate/tablePage'
export { default as ColumnCtlWithStore } from './common/tableColumnsCtl/columnCtlWithStore'
export { default as BTag } from './common/tags/BTag'
export type { InputTemplateItem, IFormItem, PickFormItemName } from './model'
export type { ITagFromRpc, ITagName } from '../models/tag'
export { defineFormItem } from './model'
export {
  tableItemStore,
  // TablePageStore,
  tablePageCommonStore,
  emptyState,
} from './pageTemplate/tablePage/tablePageStore'

// export default {}

// export const AutoCreateTemplate
