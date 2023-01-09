import InputTemplate from '../../../inputTemplate/inputTemplate'
import { defineComponent, ref, watch, computed } from 'vue'
import { tableItemStore } from '../tablePageStore'
import { ValueChangeType } from '../../../model'
import { Button, SelectProps } from 'ant-design-vue'
import { debounce } from '../../../../utils/index'
export default defineComponent({
  props: {
    tablePageName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = tableItemStore()
    // if (!store) {
    //   return () => <div>Store Is Null</div>
    // }

    const query = ref<Record<string, any>>({})

    const search = async () => {
      store.search.queryData = { ...query.value }
      store.research()
    }

    const change = ({
      name,
      type,
      value,
    }: {
      name: string
      type: ValueChangeType
      value: any
    }) => {
      const form = store.search.queryForm || []
      switch (type) {
        case 'select':
          selectChange(
            name,
            value,
            (form.find((item) => item.name === name) as SelectProps)?.onChange
          )
          break
      }
    }

    const selectChange = (
      name: any,
      value: any,
      cb?: (
        name: string | number,
        value: any,
        formData: Record<string, any>
      ) => void
    ) => {
      if (typeof cb === 'function') {
        cb(name, value, store.search.queryData)
      }
    }

    const disabled = computed(() => {
      return store.search.btnDisabled
    })

    watch(
      query,
      () => {
        if (store.search.isHideSearchBtn) {
          debounce(search, 500)
        }
      },
      { deep: true }
    )
    const renderInputTemplate = () => {
      return (
        <>
          {store.search.queryForm.map((item) => {
            return (
              <div class={'query-item'}>
                {item.label && <label>{item.label}</label>}
                <InputTemplate
                  width="200px"
                  v-model={[query.value[item.name], 'value']}
                  onChange={change}
                  otherProps={item}
                  {...(item as any)}
                ></InputTemplate>
              </div>
            )
          })}
        </>
      )
    }
    return () => (
      <div class={'search-section'}>
        {renderInputTemplate()}
        {!store.search.isHideSearchBtn && (
          <Button disabled={disabled.value} type="primary" onClick={search}>
            {store.search.btnText || '搜索'}
          </Button>
        )}
      </div>
    )
  },
})
