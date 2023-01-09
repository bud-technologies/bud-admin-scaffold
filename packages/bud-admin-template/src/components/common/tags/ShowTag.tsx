import { Tooltip } from 'ant-design-vue'
import { defineComponent } from 'vue'
import BTag from './BTag'
import './ShowTag.css'
export default defineComponent({
  props: {
    name: {
      required: true,
      type: String,
    },
    num: {
      required: true,
      type: Number,
    },
  },
  setup(props) {},
  render() {
    const { name, num } = this
    return (
      <div>
        {name.length > num ? (
          <Tooltip title={name}>
            <BTag class={'tag-item'} size="small" color="grey">
              {name.slice(0, num)}...
            </BTag>
          </Tooltip>
        ) : (
          <BTag class="tag-item" size="small" color="grey">
            {name}
          </BTag>
        )}
      </div>
    )
  },
})
