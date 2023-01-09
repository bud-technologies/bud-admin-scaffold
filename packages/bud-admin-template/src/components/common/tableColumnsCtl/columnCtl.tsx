import { defineComponent, PropType, ref, computed, onMounted, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import { Checkbox, CheckboxGroup, Divider, Dropdown } from 'ant-design-vue'
import { SettingOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  props: {
    columns: {
      required: true,
      type: Array as PropType<Array<any>>,
    },
    columnsChecked: {
      type: Array as PropType<Array<string>>,
    },
  },
  emits: ['update:columnsChecked', 'changeFilterColumns'],
  setup(props, { emit }) {
    const columnsChecked = useVModel(props, 'columnsChecked', emit)
    const columnCtlVisible = ref<boolean>(false)
    const checkAll = ref<boolean>(false)
    const indeterminate = ref<boolean>(true)

    const checkBoxOptions = computed(() => {
      return props.columns.map((item) => {
        return {
          label: item.title,
          value: item.key,
        }
      })
    })

    const onCheckAllChange = (e: any) => {
      if (e.target.checked) {
        columnsChecked.value = props.columns.map((item) => {
          return item.key
        })
      } else {
        columnsChecked.value = []
      }
      indeterminate.value = false
    }

    watch(columnsChecked, (val) => {
      const filterChecked = props.columns.filter((item) =>
        val?.includes(item.key)
      )

      emit('changeFilterColumns', filterChecked, val)

      const checkedLength = filterChecked.length

      if (checkedLength === props.columns.length) {
        checkAll.value = true
        indeterminate.value = false
      } else if (checkedLength < props.columns.length && checkedLength > 0) {
        indeterminate.value = true
      } else {
        indeterminate.value = false
        checkAll.value = false
      }
    })
    return {
      checkAll,
      indeterminate,
      columnCtlVisible,
      columnsChecked,
      checkBoxOptions,
      onCheckAllChange,
    }
  },
  render() {
    const { checkAll, indeterminate, checkBoxOptions, onCheckAllChange } = this

    const settingDPOverlay = () => {
      return (
        <div class={'column-check-group'}>
          <div>
            <Checkbox
              checked={checkAll}
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
            >
              全选
            </Checkbox>
            <Divider style={{ margin: '10px 0' }}></Divider>
            <CheckboxGroup
              v-model={[this.columnsChecked, 'value']}
              name="checkboxgroup"
            >
              <div class={'colum-check-group-item'}>
                {checkBoxOptions.map((item: any) => {
                  return (
                    <div key={item.value}>
                      <Checkbox v-model={[item.value, 'value']}>
                        {item.label}
                      </Checkbox>
                    </div>
                  )
                })}
              </div>
            </CheckboxGroup>
          </div>
        </div>
      )
    }
    return (
      <Dropdown
        v-model={[this.columnCtlVisible, 'visible']}
        overlay={settingDPOverlay()}
      >
        <SettingOutlined
          onClick={() => {
            return
          }}
        />
      </Dropdown>
    )
  },
})
