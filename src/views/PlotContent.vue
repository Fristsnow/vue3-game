<script setup>
import {onMounted, ref} from 'vue'
import PlotContent from "@/components/PlotContent.vue";

const plotList = ref([])

const getData = async () => {
  const aaa = [
    {
      name: '玩家',
      description: 'you good!',
      image: '',
      type: 1
    },
    {
      name: '商人',
      description: 'I have a ddv, do you want?',
      image: '',
      type: 2
    },
    {
      name: '玩家',
      description: 'no no，I no!',
      image: '',
      type: 1
    }
  ]
  plotList.value = aaa
}
onMounted(async () => {
  await getData()
})
</script>

<template>
  <PlotContent :plot-list="plotList"/>
</template>

<style scoped lang="scss">

</style>
