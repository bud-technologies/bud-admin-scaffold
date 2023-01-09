import ModalForm from '../../../modal/modalForm'
import { Space } from 'ant-design-vue'
import { defineComponent, ref, PropType, computed } from 'vue'
import { tableItemStore } from '../tablePageStore'
import { ModalSize } from '../../../modal/model'
import { FormInitType } from '../../../model'
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

    // if (!store) {
    //   return () => <div>Store Is Null</div>
    // }
    const addModalProps = computed(() => {
      return {
        btnType: 'add',
        btnText: store.titleBtn.add?.btnText,
        api: store.modal.addApi,
        beforeApi: store.modal.beforeAdd,
        afterApi: store.table.loadingMoreTable
          ? store.researchLoadingMoreTable
          : store.research,
        title: store.modal.titleStore.add,
        modalOpen: store.modal.modalOpen,
        modalClose: store.modal.modalClose,
        successText: '添加成功',
      }
    })

    const renderModal = () => (
      <ModalForm
        size={store?.modal.size || props.defaultModalSize}
        baseInfo={addModalProps.value}
        form={{
          ...store.form,
          formInit: (formData) => props.formInit('add', formData),
        }}
        v-slots={{ footer: (data: any) => slots.modalFooter?.(data) }}
      >
        {slots.form?.({ isCreate: true })}
      </ModalForm>
    )

    return () => (
      <div class={'title-section'}>
        <h1>{store?.title}</h1>
        <Space>
          {slots.titleOperation?.()}
          {store.titleBtn?.add && renderModal()}
        </Space>
      </div>
    )
  },
})
