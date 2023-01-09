<template>
    <div>
        {{ param }}

        <!-- test -->
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
interface IProps {
    param: string
}

const props = defineProps<IProps>()

onMounted(() => {

    console.log(props);
})

</script>

<style scoped>

</style>