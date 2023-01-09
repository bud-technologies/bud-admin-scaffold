import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    username: {
      type: String,
      required: true,
    },
    prefixUrl: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const handleUserNameClick = (prefixUrl: string) => {
      const href = window.location.href
      const hash = window.location.hash
      //   window.open(
      //     `${href.slice(0, href.indexOf(hash))}#/userInfoQuery?username=${
      //       props.username
      //     }`
      //   )
      window.open(`${prefixUrl}${props.username}`)
    }
    return {
      handleUserNameClick,
    }
  },
  render() {
    return (
      <a-space>
        <a
          onClick={() => this.handleUserNameClick(this.prefixUrl)}
          class="core-user-link"
        >
          {this.username}
        </a>
      </a-space>
    )
  },
})
