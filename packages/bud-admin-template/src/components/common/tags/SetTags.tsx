import { defineComponent, PropType, computed, ref, watch } from 'vue'
import { ITagName, ITagFromRpc } from '../../../models/tag'
import { message } from 'ant-design-vue'
export default defineComponent({
  props: {
    contentIds: {
      required: true,
      type: Array as PropType<Array<string>>,
    },
    isCollection: Boolean,
    defaultTags: Array as PropType<Array<ITagFromRpc>>,
    reGetData: Function as PropType<(checkedTag: Array<ITagName>) => void>,
    text: String,
    isBatch: Boolean,
  },
  setup(props) {},
})
