import { Tooltip } from 'ant-design-vue'
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    title: String,
    color: {
      type: String,
      default: '#333',
    },
    size: {
      type: String,
      default: '24px',
    },
    havingHover: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: true,
    },
    onClick: Function,
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)

    const iconHover = computed(() => (props.havingHover ? 'icon-hover' : ''))

    const svgComp = () => (
      <div class={['icon', iconHover.value]}>
        <svg
          aria-hidden="true"
          style={{ width: props.size, height: props.size }}
          class="icon-svg"
        >
          <use fill={props.color} href={symbolId.value} />
        </svg>
      </div>
    )
    // console.log(props.onClick)

    return () => (
      <div
        style="display: inline-block"
        onClick={() => props.onClick && props.onClick()}
      >
        {props.title ? (
          <Tooltip title={props.title}>{svgComp()}</Tooltip>
        ) : (
          svgComp()
        )}
      </div>
    )
  },
})
