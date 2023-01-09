import { defineComponent, ref, computed, watch, PropType } from 'vue'
import type { InputTemplateItem } from '../model'
import {
  Input,
  DatePicker,
  Textarea,
  InputNumber,
  Select,
  Image,
  RangePicker,
} from 'ant-design-vue'
import type {
  InputProps,
  SelectProps,
  InputNumberProps,
  ImageProps,
  TimeRangePickerProps,
} from 'ant-design-vue'
import BDatePicker from '../common/BDatePicker'
import RegionSelect from '../common/RegionSelect'
import { DefaultCover } from '../pageTemplate/tablePage/tablePageStore'
import { RangePickerProps } from 'ant-design-vue/lib/date-picker'
import { RangePickerTimeProps } from 'ant-design-vue/lib/vc-picker/RangePicker'

type Any = any

const AnyConstruct: Any = {}

export default defineComponent({
  props: {
    type: {
      type: String as PropType<InputTemplateItem['type']>,
      required: true,
    },
    width: String,
    disabled: Boolean,
    placeholder: String,
    value: AnyConstruct as PropType<string | boolean | Array<any> | number>,
    name: String,
    otherProps: Object as PropType<Record<string, any>>,
    testProps: String,
  },
  emits: ['blur', 'change', 'updateValue'],
  setup(props, { emit }) {
    const startTime = ref<string>()
    const endTime = ref<string>()
    const value = ref<number | string | Record<any, any> | boolean>()

    const options = computed(() => {
      let propCopy: any = props.otherProps

      console.log('propCopy.selectOptions := ', propCopy.selectOptions)

      if (typeof propCopy.selectOptions === 'function') {
        return propCopy.selectOptions()
      }
      return propCopy.selectOptions
    })

    const BInput = () => {
      const inputProps = (props.otherProps as InputProps) || {}
      return (
        <Input
          style={{ width: props.width || '100%' }}
          disabled={inputProps.disabled}
          v-models={[
            [value.value, 'value'],
            [inputProps.disabled, 'disabled'],
          ]}
          allowClear={true}
          placeholder={inputProps.placeholder}
          {...(props as InputProps)}
          onBlur={inputBlur}
        ></Input>
      )
    }

    const BTextArea = () => {
      const textAreaProps = (props.otherProps as InputProps) || {}
      return (
        <Textarea
          style={{ width: props.width }}
          allowClear={true}
          v-model={[value.value, 'value']}
          onBlur={inputBlur}
          {...textAreaProps}
        ></Textarea>
      )
    }
    const BInputNumber = () => {
      const inputNumberProps = (props.otherProps as InputNumberProps) || {}
      return (
        <InputNumber
          v-model={[value.value, 'value']}
          onBlur={inputBlur}
          {...inputNumberProps}
        ></InputNumber>
      )
    }
    const BSelect = () => {
      const selectProps = (props.otherProps as any) || {}
      return (
        <Select
          allowClear={selectProps.allowClear}
          mode={selectProps.mode}
          style="min-width: 200px"
          v-model={[value.value, 'value']}
          options={options.value}
          onChange={change}
          {...selectProps}
        ></Select>
      )
    }
    const BImg = () => {
      const imgProps = (props.otherProps as ImageProps) || {}
      return (
        <Image
          height="158"
          width="158"
          fallback={DefaultCover}
          src={(value.value as string) || DefaultCover}
          {...imgProps}
        ></Image>
      )
    }
    const BText = () => {
      const textProps = (props.otherProps as any) || {}
      return (
        <div>
          {props.value ? (
            <p style="margin-bottom: 0px">{value.value}</p>
          ) : (
            <i style="color: rgba(0, 0, 0, 0.45)">{textProps.placeholder}</i>
          )}
        </div>
      )
    }

    const BRangePicker = () => {
      const rangePickerProps = (props.otherProps as any) || {}
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DatePicker
            class={'single-data-picker'}
            placeholder="开始时间"
            format="YYYY/MM/DD HH:mm:ss"
            v-model={[startTime.value, 'value']}
            showTime={true}
            onChange={change}
          ></DatePicker>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '10px',
              margin: '0 2px',
            }}
          >
            <div style={{ width: '15px', border: '1px solid #e7e7e7' }}></div>
          </div>
          <DatePicker
            class={'single-data-picker'}
            placeholder="结束时间"
            format="YYYY/MM/DD HH:mm:ss"
            v-model={[endTime.value, 'value']}
            showTime={true}
            onChange={change}
          ></DatePicker>
        </div>
      )
    }
    const BRangePickerForm = () => {
      const rangePickerProps = (props.otherProps as any) || {}

      return (
        <RangePicker
          v-model={[value.value, 'value']}
          onChange={change}
          {...rangePickerProps}
        ></RangePicker>
      )
    }

    const BRegionTree = () => {
      const regionTreeProps = (props.otherProps as any) || {}

      return (
        <RegionSelect
          v-model={[value.value, 'value']}
          {...(regionTreeProps as any)}
        />
      )
    }

    const inputBlur = () => {
      emit('blur', {
        type: props.type,
        name: props.name,
        value: value.value,
      })
    }
    const change = () => {
      emit('change', {
        type: props.type,
        name: props.name,
        value: value.value,
      })
    }

    const compStore = {
      input: <BInput />,
      textarea: <BTextArea />,
      inputNumber: <BInputNumber />,
      select: <BSelect />,
      text: <BText />,
      checkBox: <BText />,
      datePicker: <BDatePicker v-model={[value.value, 'value']} />,
      rangePicker: <BRangePicker />,
      regionSelect: <BRegionTree />,
      rangePickerForm: <BRangePickerForm />,
      img: <BImg />,
    }

    const renderComp = () => {
      return compStore[props.type]
    }

    watch(
      () => props.value,
      () => {
        value.value = props.value
      }
    )

    watch(value, () => {
      console.log('value.value :=', value.value)

      emit('updateValue', value.value)
    })

    watch(startTime, () => {
      emit('updateValue', [startTime.value, endTime.value])
    })
    watch(endTime, () => {
      emit('updateValue', [startTime.value, endTime.value])
    })

    return { renderComp }
  },
  render() {
    return <div style={{ color: 'red' }}>{this.renderComp()}</div>
  },
})
