import { defineComponent, PropType, computed } from 'vue'
import { ITagFromRpc } from '../../../models/tag'
import ShowTag from './showTag'
export default defineComponent({
  props: {
    tagNameList: Array as PropType<Array<ITagFromRpc>>,
  },
  setup(props) {
    const showTags = computed(() => {
      if (!props.tagNameList) {
        return []
      }
      if (props.tagNameList.length < 8) {
        return props.tagNameList
      } else {
        return props.tagNameList.slice(0, 7)
      }
    })
    return {
      showTags,
    }
  },
  render() {
    const { showTags } = this
    return (
      <>
        {showTags.map((item) => {
          return (
            <ShowTag key={item.tagId} name={item.tagName} num={4}></ShowTag>
          )
        })}
      </>
    )
  },
})
