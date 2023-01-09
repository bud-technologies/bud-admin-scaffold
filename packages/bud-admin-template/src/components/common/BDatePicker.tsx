import { defineComponent, watch, ref } from 'vue'
import { DatePicker } from 'ant-design-vue'
import dayjs from 'dayjs'

export default defineComponent({
  props: {
    value: String,
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const value = ref<string>()

    const defaultValue = dayjs('00:00:00', 'HH:mm:ss')

    const range = (start: number, end: number) => {
      const result = []

      for (let i = start; i < end; i++) {
        result.push(i)
      }

      return result
    }
    const disabledDateTime = () => {
      return {
        disabledMinutes: () => range(0, 60).filter((num) => num % 5 !== 0),
        disabledSeconds: () => range(0, 60).splice(1, 60),
      }
    }
    watch(value, () => {
      emit('update:value', value.value)
    })
    return () => (
      <DatePicker
        v-model={[props.value, 'value']}
        format="YYYY/MM/DD HH:mm:ss"
        disabledTime={disabledDateTime}
        showTime={{ hideDisabledOptions: true, defaultValue }}
      />
    )
  },
})
