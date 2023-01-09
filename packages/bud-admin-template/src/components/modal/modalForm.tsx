import { Button, message, Modal } from 'ant-design-vue'
import { computed, defineComponent, ref, PropType, watch, reactive } from 'vue'
import { IBaseInfo, ModalSize, ModalButtonType } from './model'
import { PlusOutlined } from '@ant-design/icons-vue'
import SvgIcon from '../common/SvgIcon'
import FormComp from '../form/formComp'
import { FormCompExpose } from '../form/formComp'
import { IFormProps } from '../model'

const modalSizeStore = {
  small: '532px',
  middle: '700px',
  big: '810px',
}

type OpenModalType = 'add' | 'edit' | 'sort'

export default defineComponent({
  props: {
    baseInfo: {
      type: Object as PropType<IBaseInfo<any>>,
      required: true,
    },
    form: {
      required: true,
      type: Object as PropType<IFormProps<string>>,
    },
    disabled: Boolean,
    isBatchEdit: Boolean,
    size: String as PropType<ModalSize>,
    dataForReq: Object as PropType<Record<string, any>>,
  },
  emits: ['openModal'],
  setup(props, { emit }) {
    const state = reactive({
      visible: false,
      loading: false,
    })

    const openModal = (type: OpenModalType) => {
      console.log('openModal', type)

      if (props.disabled) {
        return
      }
      emit('openModal', type)
      state.visible = true
    }

    const handleCancel = () => {
      state.visible = false
    }

    const modalWith = computed(() => {
      return modalSizeStore[props.size || 'middle']
    })

    watch(
      () => state.visible,
      () => {
        if (state.visible) {
          if (typeof props.baseInfo.modalOpen === 'function') {
            props.baseInfo.modalOpen()
          }
        } else {
          if (typeof props.baseInfo.modalClose === 'function') {
            props.baseInfo.modalClose()
          }
        }
      }
    )

    const formRef = ref<FormCompExpose<string>>()

    const onSave = () => {
      if (
        props.baseInfo.api === undefined &&
        props.baseInfo.customSubmit === undefined
      ) {
        return true
      }
      const { validForm } = formRef.value || {}
      if (validForm && typeof validForm === 'function') {
        validForm().then(async (values: any) => {
          execSave(values)
        })
        return
      }
      execSave()
    }

    const execSave = async (values: any = {}) => {
      const { baseInfo } = props

      if (typeof baseInfo.customSubmit === 'function') {
        state.loading = true
        const flag = await baseInfo.customSubmit(values, props.dataForReq)
        state.loading = false
        if (flag) {
          state.visible = false
        }
      } else {
        if (props.dataForReq) {
          values = { ...values, ...props.dataForReq }
        }

        const { beforeApi, api, afterApi } = baseInfo

        if (typeof api !== 'function') {
          console.error('api is not a function')
          return
        }

        if (typeof beforeApi === 'function') {
          const beforeRes = beforeApi(values)
          if (beforeRes === false) {
            return
          }
          if (beforeRes instanceof Object) {
            values = { ...values, ...beforeRes }
          }
        }

        state.loading = true
        const [err, res] = await api({ ...values })
        state.loading = false
        if (err) {
          return
        }
        message.success(baseInfo.successText)
        state.visible = false
        if (typeof afterApi === 'function') {
          afterApi(values)
        }
      }
    }

    const NormalButton = (openType: OpenModalType) => {
      return (
        <Button
          disabled={props.disabled}
          // style="min-width: 120px;margin-left: 10px;font-size: 12px;
          //   font-weight: 500;
          //   "
          style={{
            minWidth: 120,
            marginLeft: 10,
            fontSize: 12,
            fontWeight: 500,
          }}
          class="ant-btn-normal"
          icon={<PlusOutlined />}
          onClick={() => openModal(openType)}
        >
          {props.baseInfo.btnText}
        </Button>
      )
    }

    const LinkButton = (openType: OpenModalType) => {
      return (
        <a
          style={{ color: props.disabled ? 'grey' : '' }}
          onClick={() => openModal(openType)}
        >
          {props.baseInfo.btnText}
        </a>
      )
    }

    const SvgEditButton = (
      <SvgIcon name="ic-edit" onClick={() => openModal('edit')} title="编辑" />
    )

    const SvgSortButton = (
      <SvgIcon name="ic-swap" onClick={() => openModal('sort')} title="排序" />
    )

    const ButtonStore: Record<ModalButtonType, JSX.Element> = {
      add: NormalButton('add'),
      edit: NormalButton('edit'),
      linkAdd: LinkButton('add'),
      linkEdit: LinkButton('edit'),
      svgEdit: SvgEditButton,
      svgSort: SvgSortButton,
    }

    return { ButtonStore, SvgSortButton, state, formRef, handleCancel, onSave }
  },
  render() {
    const {
      ButtonStore,
      baseInfo,
      state,
      form,
      formRef,
      onSave,
      handleCancel,
    } = this

    const footer = () => (
      <>
        {this.$slots.footer?.(formRef?.validForm)}
        {!baseInfo.hideDefaultFooter && (
          <>
            <Button
              class="ant-modal-cancel-btn"
              key="back"
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={onSave}
              loading={state.loading}
            >
              确定
            </Button>
          </>
        )}
      </>
    )

    const slots = {
      footer: footer,
    }

    return (
      <>
        {ButtonStore[baseInfo.btnType]}
        <Modal
          destroyOnClose
          centered
          v-model={[state.visible, 'visible']}
          v-slots={slots}
        >
          <h2 style="margin-top: 20px; margin-bottom: 40px; color: #435160">
            {baseInfo.title}
          </h2>
          <FormComp {...form} ref="formRef">
            {/* {this.$slots.default?.()} */}
          </FormComp>
        </Modal>
      </>
    )
  },
})
