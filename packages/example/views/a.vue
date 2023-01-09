<template>
  <h1>Page A</h1>
  <!-- <p>{{store?.title}}</p> -->
  <!-- <BTag color="grey">123</BTag> -->
<TablePageWebtool :page-name="pageName"></TablePageWebtool>
</template>

<script setup lang="ts">
import { emptyState } from '@bud/bud-admin-template'
import { onBeforeMount, ref, onMounted } from 'vue';
import axios from 'axios'
import TablePageWebtool from '../components/tablePageWebtool.vue'
// import { TablePageStore } from '../../bud-admin-template/src/components/pageTemplate/tablePage/tablePageStore';
import { BTag, TablePageStore } from '@bud/bud-admin-template'
import { stat } from 'fs';
const http = axios.create({})

const handleHttp = <
  T,
  U = Error & { rmsg: string; result: number; data: string }
>(
  promise: Promise<T>
): Promise<[U, undefined] | [null, T]> => {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => [err, undefined])
}

const api_add_studio_tab = (params: any) =>
  handleHttp(http.post('/studioTab/add', params))

interface ITable {
  id: string
}

const pageName = 'PageA'

const state = emptyState

const maxNum = 2000
const minNum = 2

const columns = [
  { title: '项目ID', dataIndex: 'contentId', key: 'contentId', width: 120 },
  {
    title: '项目名称',
    dataIndex: 'contentName',
    key: 'contentName',
    width: 120,
  },
  { title: '项目封面', dataIndex: 'cover', key: 'cover', width: 90 },
  { title: '模板', dataIndex: 'template', key: 'template', width: 90 },
  { title: '展示状态', dataIndex: 'isUse', key: 'isUse', width: 120 },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 120 },
  { title: 'APP版本', dataIndex: 'appVersion', key: 'appVersion', width: 120 },
  { title: '标签', key: 'tagsInfo', width: 120 },
  { title: '操作', key: 'operation', width: 120 },
]

const initTitle = () => {
  state.title = '金币赠送'
  state.titleBtn.add = {
    btnText: '赠送金币',
  }
}
const initSearch = () => {
  state.search.queryForm = [
    {
      type: 'input',
      name: 'contentId',
      placeholder: '请输入ID',
    },
  ]
}
const initTable = () => {
  state.table.operationBtn = ['delete','edit']
  // state.table.isHideOperation = (record) => record.isOperate === 1
  state.table.columns = columns
  state.table.dataSource = [
    {
      appVersion: '1.0.0;9.9.9',
      contentId: '1549004411283107840_1662550178_1',
      contentName: 'Bisitahin ang Rainbow Land',
      contentType: 0,
      cover:
        'https://image-cdn.joinbudapp.com/filters:quality(50)/UgcImage/1549004411283107840/24a18913-26cb-401a-bb12-94e20fdeff72cover.jpg',
      description:
        'Magtipon kasama ang mga kaibigan sa Rainbow Land, bihisan ang makulay na Gummy Bear airdrop at kumuha ng mga larawan nang ',
      id: 131,
      isUse: 1,
      lang: 'en',
      region: '',
      sort: 1,
      template: 2,
    },
  ]
  state.table.loadingMoreTable = true
  // state.table.operationBtn = ['delete', 'edit']
  // state.table.operationApi = {
  //   delete: api_del_studio_tab,
  //   edit: api_edit_studio_tab,
  // }
}
const showStatusList = [
  { label: '未上线', value: 0 },
  { label: '展示中', value: 1 },
]
const initForm = () => {
  state.form = {
    rules: {
      contentId: [
        { required: true, message: '项目ID不能为空', trigger: 'blur' },
      ],
      description: [
        { required: true, message: '描述不能为空', trigger: 'blur' },
      ],
      appVersion: [
        { required: true, message: '版本不能为空', trigger: 'blur' },
      ],
      sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
    },
    formItems: [
      {
        label: '项目ID',
        placeholder: '请输入项目ID',
        name: 'contentId',
        type: 'input',
        disabledEdit: true,
      },
      {
        label: '运营位标题',
        name: 'contentName',
        type: 'input',
        placeholder: '输入运营位标题',
      },

      {
        label: '描述',
        placeholder: '请输入描述',
        name: 'description',
        type: 'textarea',
      },

      {
        label: '排序',
        name: 'sort',
        type: 'inputNumber',
        placeholder: '请输入排序',
      },
      {
        label: 'APP版本',
        placeholder: '请输入项目ID',
        defaultVal: '1.23.0;9.9.9',
        name: 'appVersion',
        type: 'input',
      },
      {
        type: 'select',
        label: '展示状态',
        name: 'isOnline',
        selectOptions: showStatusList,
      },
      {
        type: "rangePicker",
        name: "showTime",
        label: "展示时间"
      },
    ],
  }
}

const initModal = () => {
  state.modal.addApi = api_add_studio_tab
  state.modal.titleStore = {
    add: '新建 Studio 内容配置',
  }
}

onBeforeMount(() => {
  initTitle()
  initSearch()
  initModal()
  initForm()
  initTable()
  const store = TablePageStore<ITable>().set(pageName, state)
  console.log(store);
  
    store.setPagination({...store.table.pagination, isEnd: 1})
  // console.log(store.get());
})


// const data: IAutoCreateItem = {
//     type: 'select',
//     selectOptions: ''
// }

const changeTitle = () => {
  // store?.changeTitle('change success')
}

const blur = () => {
  console.log('------')
}
</script>

<style scoped></style>
