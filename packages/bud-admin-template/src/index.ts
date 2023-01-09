import { App } from 'vue'
import { AutoCreateTemplate, FormComp } from './components/index'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
export {
  tableItemStore,
  // TablePageStore,
  tablePageCommonStore,
  emptyState,
  FormComp,
  ModalForm,
  TablePage,
  BTag,
  defineFormItem,
} from './components/index'
export type {
  FormCompExpose,
  InputTemplateItem,
  IFormItem,
  PickFormItemName,
} from './components/index'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default {
  install(app: App) {
    app.component('AutoCreateTemplate', AutoCreateTemplate)
    app.component('FormComp', FormComp)
    app.component('ModalForm')
  },
}
