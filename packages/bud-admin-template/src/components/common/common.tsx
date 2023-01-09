import { FormItem } from 'ant-design-vue'
import { AutoCreateTemplate } from '../index'
import { IFormItem } from '../model'

export const inputCompChange = () => {}

// export const TemplateFormItem = (
//   item: IFormItem<string>,
//   formData: Record<string, any>
// ) => {
//   return (
//     <FormItem key={item.name} name={item.name} label={item.label}>
//       <AutoCreateTemplate
//         onUpdateValue={(value) => (formData.value[item.name] = value)}
//         v-model={[formData.value[item.name], 'value']}
//         blur={blur}
//         change={change}
//         {...(item as any)}
//       />
//     </FormItem>
//   )
// }
