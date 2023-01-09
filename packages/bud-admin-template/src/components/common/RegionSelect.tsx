import { TreeSelect, TreeSelectProps } from 'ant-design-vue'
import { defineComponent, ref, PropType } from 'vue'

export default defineComponent({
  props: {
    placeholder: String,
    treeDefaultExpandedKeys: [Array<String>, Array<Number>],
    showSearch: Boolean,
    multiple: Boolean,
    disabledSelectParentNode: Boolean,
    dropdownMatchSelectWidth: Boolean,
    treeData: Array as PropType<TreeSelectProps['treeData']>,
    width: String,
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const lang = ref<Array<string>>([])
    const withDefaultProps = withDefaults(props, {
      multiple: true,
      width: '228px',
      dropdownMatchSelectWidth: true,
      showSearch: true,
    })

    const change = (val: Array<string>) => {
      emit('update:value', lang.value)
    }

    return () => (
      <TreeSelect
        v-model={[lang.value, 'value']}
        showSearch={withDefaultProps.showSearch}
        class="region-select"
        style={withDefaultProps.width}
        dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
        placeholder={withDefaultProps.placeholder}
        showCheckedStrategy="SHOW_CHILD"
        allowClear={true}
        dropdownMatchSelectWidth={withDefaultProps.dropdownMatchSelectWidth}
        multiple={withDefaultProps.multiple}
        onChange={change}
        maxTagCount={1}
        treeData={withDefaultProps.treeData}
        treeCheckable={withDefaultProps.multiple}
        treeDefaultExpandedKeys={[1, 2]}
        treeNodeFilterProp="title"
      />
    )
  },
})
