import { HttpApi } from '../model'

type formApiHook = (
  values: Record<string, string | number>
) => void | Record<string, string | number> | boolean

export type ModalButtonType =
  | 'add'
  | 'edit'
  | 'linkAdd'
  | 'linkEdit'
  | 'svgEdit'
  | 'svgSort'
  | string

export interface IBaseInfo<T> {
  btnText?: string
  btnType: ModalButtonType
  title?: string
  successText: string
  api?: HttpApi<T>
  customSubmit?: (
    formData: Record<string, string | number>,
    otherData?: Record<string, any>
  ) => Promise<boolean>
  hideDefaultFooter?: boolean
  beforeApi?: formApiHook
  afterApi?: formApiHook
  modalOpen?: () => void
  modalClose?: () => void
}

export type ModalSize = 'small' | 'middle' | 'big'

// interface IProps {
//   baseInfo: IBaseInfo
//   isBatchEdit?: boolean
//   size?: ModalSize
//   disabled?: boolean
//   dataForReq?: Record<string, any>
// }
