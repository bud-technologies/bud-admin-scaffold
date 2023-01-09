import { defineComponent, PropType, onMounted, ref, computed, watch } from 'vue'
import './Btag.css'
export default defineComponent({
  props: {
    color: {
      type: String,
      required: true,
    },
    backGroundColor: String,
    type: String as PropType<'line' | 'full'>,
    size: String as PropType<'normal' | 'small'>,
  },
  setup(props) {
    const isFull = computed(() => {
      return props.type === 'full'
    })

    const backGroundColor = ref('')
    const color = ref('')

    const lineStyleStore: any = {
      green: {
        color: '#1BC875',
        backGroundColor: 'rgba(27,200,117,0.3000)',
      },
      orange: {
        color: '#FF9255',
        backGroundColor: 'rgba(255,146,85,0.3000)',
      },
      pink: {
        color: '#F276AA',
        backGroundColor: 'rgba(242,118,170,0.3000)',
      },
      blue: {
        color: '#6398FF',
        backGroundColor: 'rgba(99,152,255,0.3000)',
      },
      cyan: {
        color: '#3AC2E0',
        backGroundColor: 'rgba(58,194,224,0.3000)',
      },
      grey: {
        color: '#646464',
        backGroundColor: '#B9B9B9',
      },
    }
    const fullStyleStore: any = {
      green: {
        color: '#1BC875',
        backGroundColor: 'rgba(27,200,117,0.3000)',
      },
      orange: {
        color: '#FF9255',
        backGroundColor: 'rgba(255,146,85,0.3000)',
      },
      pink: {
        color: '#F276AA',
        backGroundColor: 'rgba(242,118,170,0.3000)',
      },
      blue: {
        color: '#6398FF',
        backGroundColor: 'rgba(99,152,255,0.3000)',
      },
      cyan: {
        color: '#3AC2E0',
        backGroundColor: 'rgba(58,194,224,0.3000)',
      },
      purple: {
        color: '#6424D0',
        backGroundColor: '#F6F1FE',
      },
    }

    onMounted(() => {
      setColor()
    })

    const setColor = () => {
      let colorStore = fullStyleStore
      if (!isFull.value) {
        colorStore = lineStyleStore
      }
      if (colorStore[props.color]) {
        color.value = colorStore[props.color].color
        backGroundColor.value = colorStore[props.color].backGroundColor
      } else {
        color.value = props.color
        backGroundColor.value = props.backGroundColor || props.color
      }
    }

    watch(
      () => props.color,
      () => {
        setColor()
      }
    )
    const tagStyle = computed(() => {
      const style = {
        color: color.value,
        border: '',
        'backGround-color': '',
      }
      isFull.value
        ? (style['backGround-color'] = backGroundColor.value + '')
        : (style.border = `1px solid ${backGroundColor.value}`)
      return style
    })
    return {
      isFull,
      tagStyle,
      // size
    }
  },
  render() {
    return (
      <span
        class={{
          'full-tag': this.isFull,
          'line-tag': !this.isFull,
          'tag-small-size': this.size === 'small',
        }}
        style={this.tagStyle}
      >
        {this.$slots.default?.()}
      </span>
    )
  },
})
