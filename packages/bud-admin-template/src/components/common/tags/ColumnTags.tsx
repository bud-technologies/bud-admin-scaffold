import { defineComponent, PropType } from 'vue'
import { ITagFromRpc, ITagName } from '../../../models/tag'
import CustomTagInColumns from './customTagInColumns'
import { tablePageCommonStore } from '../../pageTemplate/tablePage/tablePageStore'
export default defineComponent({
  props: {
    contentIds: {
      required: true,
      type: Array as PropType<Array<string>>,
    },
    tagNameList: Array<ITagFromRpc>,
    isCollection: Boolean,
    reGetData: Function as PropType<(checkedTag: Array<ITagName>) => void>,
    text: String,
  },
  setup() {},
  render() {
    const { contentIds, tagNameList, isCollection, reGetData, text } = this
    return (
      <div style="display: flex; flex-wrap: wrap; align-items: center">
        <CustomTagInColumns tagNameList={this.tagNameList} />
        {this.$slots.columnTagsOperation?.({
          contentIds,
          tagNameList,
          isCollection,
          reGetData,
          text,
        })}
      </div>
    )
  },
})
