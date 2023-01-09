import {
  defineComponent,
  watch,
  onBeforeMount,
  ref,
  onMounted,
  computed,
} from 'vue'
import { FormProps, RuleObject } from 'ant-design-vue/lib/form'
import { IFormItem, defineFormItem, ValueChangeType, BlurType } from '../model'
import dayjs from 'dayjs'
import { InputNumber, SelectProps } from 'ant-design-vue'
import { Form, FormItem } from 'ant-design-vue'
import { PropType } from 'vue'
import AutoCreateTemplate from '../inputTemplate/inputTemplate'
import { FormExpose } from 'ant-design-vue/lib/form/Form'
type RelateFunc = (
  params: any
) => Promise<string | Record<string, string> | undefined>

export type FormCompExpose<T extends string> = {
  validForm: () => Promise<Record<T, any>>
  formData: Record<T, any>
  resetFormData: () => void
  formItems: IFormItem<unknown>[]
}
// export default defineComponent({
//   setup(){},
// })

export default defineComponent({
  props: {
    editData: {
      type: Object as PropType<Record<string, any>>,
    },
    rules: {
      type: Object as PropType<{
        [k: string]: RuleObject | RuleObject[]
      }>,
      required: true,
    },
    formItems: {
      type: Array as PropType<Array<IFormItem<any>>>,
      required: true,
    },
    antFormProps: Object as PropType<any>,
    formInit: Function,
  },
  setup(props, { expose }) {
    // const t = defineFormItem(props.formItems)
    const formData = ref<Record<string, any>>({})

    const relateDataObj = ref<
      Record<string, { getDataFunc: RelateFunc; needSetFieldName: string }>
    >({})

    const loadingStore = ref<Record<string, boolean>>({})

    const formDataSpecialDefaultVal: Record<string, any> = {
      rangePicker: [],
      inputNumber: 1,
    }

    onBeforeMount(() => {
      props.formItems.forEach((formItem) => {
        if (formItem.relateInfo) {
          const { relateField, getDataFunc } = formItem.relateInfo

          if (Array.isArray(relateField)) {
            relateField.forEach((relateFieldItem) => {
              setRelateMap(relateFieldItem, getDataFunc, formItem)
            })
          } else {
            setRelateMap(relateField, getDataFunc, formItem)
          }
          loadingStore.value[formItem.name] = false
        }
      })
    })

    onMounted(() => {
      initFormData()
      props.formInit && props.formInit(formData.value)
      // emit('formInit', formData.value)
    })

    const setRelateMap = (
      name: string,
      getDataFunc: RelateFunc,
      formItem: IFormItem<string>
    ) => {
      relateDataObj.value[name] = {
        getDataFunc,
        needSetFieldName: formItem.name,
      }
    }

    const resetFormData = () => {
      props.formItems.forEach((item) => {
        if (item.defaultVal !== undefined) {
          formData.value[item.name] = item.defaultVal
        } else {
          const val = formDataSpecialDefaultVal[item.type]
          val !== undefined
            ? (formData.value[item.name] = val)
            : (formData.value[item.name] = '')
        }
      })
    }

    const setLangRegion = () => {
      props.formItems.forEach((item) => {
        if (item.name === 'langRegion') {
          formData.value[item.name] = item.defaultVal
        }
      })
    }

    const initFormData = () => {
      if (props.editData) {
        const { editData, formItems } = props
        Object.keys(editData).forEach((key) => {
          if (key.endsWith('Time')) {
            formData.value[key] = dayjs(editData[key] * 1000)
          } else {
            formData.value[key] = editData[key]
          }
          // for (let i = 0; i < formItems.length; i++) {
          //   const item = formItems[i];
          //   if ((item.name === key) && item.type === 'rangePicker') {
          //     formData.value[key] =
          //   }
          // }
        })
        setLangRegion()
      } else {
        resetFormData()
      }
    }

    const havingImg = computed(() => {
      return props.formItems.find((item) => item.type === 'img')
    })

    watch(
      () => props.editData,
      () => {
        initFormData()
      }
    )

    const blur = ({ name, type }: { name: string; type: BlurType }) => {
      switch (type) {
        case 'input' || 'inputNumber':
          inputBlur(name)
          break
      }
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
      switch (type) {
        case 'select' || 'regionSelect':
          selectChange(
            name,
            value,
            (props.formItems.find((item) => item.name === name) as SelectProps)
              ?.onChange
          )
          inputBlur(name)
          break
      }
    }

    const selectChange = (
      name: any,
      value: any,
      cb?: (name: string, value: any, formData: any) => void
    ) => {
      formData.value[name] = value
      if (typeof cb === 'function') {
        cb(name, value, formData.value)
      }
    }

    const callRelateFunc = async (formItemName: string) => {
      let relateData = relateDataObj.value[formItemName]

      if (!relateData) {
        return
      }

      loadingStore.value[relateData.needSetFieldName] = true

      const res = await relateData.getDataFunc(formData.value)
      if (res instanceof Object) {
        Object.keys(res).forEach((key) => {
          formData.value[key] = res[key]
        })
      } else {
        formData.value[relateData.needSetFieldName] = res
      }
      loadingStore.value[relateData.needSetFieldName] = false
    }

    const inputBlur = async (formItemName: string) => {
      await callRelateFunc(formItemName)
    }

    const formRef = ref<FormExpose>()

    const validForm: <T extends string>() => Promise<Record<T, any>> = () => {
      if (!formRef.value) {
        return Promise.reject('form ref is undefined')
      }
      return formRef.value.validateFields().then(() => {
        return formData.value
      })
    }

    // const changeValue = (item: IFormItem<string>, value: any) => {
    //   if (item.type === 'inputNumber') {
    //     formData.value[item.name] = value
    //   }
    // }

    const autoFormItem = (item: IFormItem<string>) => {
      return (
        <FormItem key={item.name} name={item.name} label={item.label}>
          <AutoCreateTemplate
            onUpdateValue={(value) => {
              formData.value[item.name] = value
            }}
            value={formData.value[item.name]}
            onBlur={blur}
            onChange={change}
            type={item.type}
            otherProps={item}
            // {...(item as any)}
          />
        </FormItem>
      )
    }

    const renderDefaultForm = () => {
      return (
        <>
          <div>
            {props.formItems.map((item) => {
              return <div>{autoFormItem(item)}</div>
            })}
          </div>
          {havingImg.value && autoFormItem(havingImg.value)}
        </>
      )
    }

    expose({
      formItems: props.formItems,
      validForm,
      formData: formData.value,
      resetFormData,
    } as FormCompExpose<string>)

    return {
      formRef,
      validForm,
      formData,
      havingImg,
      renderDefaultForm,
    }
  },
  render() {
    return (
      <Form
        rules={this.rules}
        model={this.formData}
        style={
          this.havingImg && 'display: flex; justify-content: space-between'
        }
        labelCol={this.antFormProps?.labelCol || { span: 9 }}
        wrapperCol={this.antFormProps?.wrapperCol || { span: 18 }}
        ref="formRef"
        {...(this.antFormProps || {})}
      >
        {this.renderDefaultForm()}
        {this.$slots.default && this.$slots.default()}
      </Form>
    )
  },
})
