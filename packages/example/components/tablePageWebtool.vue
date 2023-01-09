<template>
<TablePage :table-page-name="pageName">
    <template #tableBodyCell="{column}">
      <template v-if="column.key === 'contentId'">
        contentId
      </template>
    </template>
    <template #tableHeaderRight>
     test
    </template>
    </TablePage>
</template>

<script setup lang="ts">
import { TablePage } from '@bud/bud-admin-template';
import TestData from './TestData.vue';
interface IProps {
    pageName: string
}
const props = defineProps<IProps>()

</script>

<style scoped>

</style>