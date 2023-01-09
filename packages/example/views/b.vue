<template>
  <h1>Page B</h1>
  <!-- <p>{{store?.title}}</p> -->
  <div>
    <ModalForm
      :base-info="createRecommendPropsBaseInfo"
      :form="{
        rules: rules,
        formItems: formItem,
      }"
    ></ModalForm>
    <!-- <FormComp ref="formRef"  :rules="rules" :form-items="formItem" :edit-data="editData"></FormComp> -->
    <!-- <button @click="submit">submit</button> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import { FormCompExpose } from '@bud/bud-admin-template/src/components/form/formComp';
import { FormCompExpose } from '@bud/bud-admin-template/dist/index';
// import {
//   emptyState,
//   FormComp,
//   PickFormItemName,
//   defineFormItem,
//   ModalForm,
// } from '@bud/bud-admin-template/src/index'
import {
  emptyState,
  FormComp,
  PickFormItemName,
  defineFormItem,
  ModalForm,
} from '@bud/bud-admin-template'

interface ITable {
  id: string
}

const state = emptyState

state.title = 'page B title'

const createRecommendPropsBaseInfo = {
  btnType: 'linkEdit',
  title: '内容推荐',
  btnText: '推荐',
  successText: '推荐成功',
  //   customSubmit: submitSingleRecommend,
}

// const store = new TablePageStore<ITable>('PageB', state).get()
const formRef = ref<FormCompExpose<PickFormItemName<typeof formItem>>>()

  
// type f = typeof formItem
    // <PickFormItemName<typeof formItem>>

const submit = () => {

  if (formRef.value && formRef.value.validForm) {
    formRef.value
      .validForm()
        ?.then(async (values) => {
      })
  }
  // formRef.value.
}

const rules = {
  demo: [
    {
      required: true,
      message: 'demo is nil',
    },
  ],
}

const editData = {}

const formItem = defineFormItem([
  {
    label: '每人赠送数量',
    name: 'giveNum',
    type: 'input',
    placeholder: `请输入大于等于`,
  },
  {
    label: '每人赠送数量',
    name: 'demo',
    type: 'inputNumber',
    placeholder: `请输入大于等于`,
  },
])

// const formItem : Readonly<Array<IFormItem>>  = [
// {
//         label: '每人赠送数量',
//         name: 'giveNum',
//         type: 'inputNumber',
//         placeholder: `请输入大于等于`,
//       },
// ] as const
// const formItem= [
// {
//         label: '每人赠送数量',
//         name: 'giveNum',
//         type: 'inputNumber',
//         placeholder: `请输入大于等于`,
//       },
// ] as const
</script>

<style scoped></style>
