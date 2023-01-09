import { defineComponent } from 'vue'
import { message, Tooltip } from 'ant-design-vue'
import { CopyOutlined } from '@ant-design/icons-vue'
import './CopyTextComp.css'
export default defineComponent({
  props: {
    text: String,
    hideCopyBtn: Boolean,
  },
  setup(props) {
    const canUseClipboard = navigator.clipboard && props.text

    const copyText = () => {
      if (!props.text) {
        return
      }
      navigator.clipboard
        .writeText(props.text)
        .then(() => {
          message.success('已复制到剪切板')
        })
        .catch((err) => {
          message.error('未能成功复制')
        })
    }

    return { canUseClipboard, copyText }
  },
  render() {
    const { canUseClipboard, text, hideCopyBtn, copyText } = this

    return (
      <>
        {canUseClipboard ? (
          <div style="display: flex; align-items: center">
            <Tooltip title={text}>
              <p class={'needEclipseText'}>{text}</p>
            </Tooltip>
            {hideCopyBtn !== true && (
              <Tooltip title={'点击复制'}>
                <CopyOutlined onClick={copyText} style="color: #6c57ff" />
              </Tooltip>
            )}
          </div>
        ) : (
          <p>{text}</p>
        )}
        {/* <Tooltip title={'点击复制'}>
          <CopyOutlined onClick={copyText} style="color: #6c57ff" />
        </Tooltip> */}
      </>
    )
  },
})
