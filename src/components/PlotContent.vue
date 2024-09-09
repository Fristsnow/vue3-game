<script setup>
import {ref, defineProps, watch, onBeforeUnmount} from 'vue'

const props = defineProps({
  plotList: {
    type: Array,
    default: () => []
  },
})

const plotIndexContent = ref('')
const plotIndex = ref(1)
const plotFlag = ref(true)
const plotIndexType = ref(false)

let intervalId

const handlePlotClick = async (index) => {
  if (plotFlag.value && index >= 0 && index < props.plotList.length) {
    plotIndexContent.value = props.plotList[index]
    plotIndexType.value = props.plotList[index].type === 1
    plotIndex.value++
    if (plotIndex.value > props.plotList.length - 1) {
      plotFlag.value = false
      clearInterval(intervalId)
    }
  }
}

const visible = ref(true)

const handleVisible = () => {
  intervalId = setInterval(() => {
    visible.value = !visible.value
  }, 500)
}

const init = () => {
  if (props.plotList.length > 0) {
    plotIndexContent.value = props.plotList[0];
    plotIndexType.value = props.plotList[0].type === 1;
    handleVisible();
  }
};

// 使用 watch 监听 plotList 的变化，当 plotList 有数据时再初始化
watch(
    () => props.plotList,
    (newPlotList) => {
      if (newPlotList.length > 0) {
        init()
      }
    },
    {immediate: true} // 立即执行一次
)

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div class="plot-main">
    <div class="plot-main-footer" @click="handlePlotClick(plotIndex)">
      <span :class="{'plot-main-right': !plotIndexType}">{{ plotIndexContent.name }}</span>
      <p :class="{'plot-main-right-content': !plotIndexType}">{{ plotIndexContent.description }}</p>
      <div class="plot-main-footer-icon" v-if="plotFlag" v-show="visible">
        <svg t="1725846959404" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="4425" width="20" height="20">
          <path
              d="M585.995 812.21l374.428-451.807a80.228 80.228 0 0 0 9.35-90.112c-15.672-29.206-48.04-47.682-83.434-47.682H137.572c-35.395 0-67.717 18.476-83.434 47.727-15.716 29.206-12.02 64.111 9.439 90.067L437.96 812.21c17.586 21.237 44.967 33.703 73.995 33.703 29.029 0 56.41-12.466 73.996-33.703z"
              p-id="4426"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.plot-main {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .plot-main-footer {
    position: absolute;
    z-index: 1000;
    border: 1px solid #000000;
    padding: 20px;
    width: 1200px;
    height: 100px;
    bottom: 20px;

    .plot-main-right {
      position: absolute;
      right: 10px;
    }

    .plot-main-right-content {
      margin-top: 20px;
    }

    span {
      width: 30px;
      height: 30px;
    }

    p {
      width: 80%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .plot-main-footer-icon {
      position: absolute;
      left: calc(50% - 20px);
      bottom: 2px;
    }

  }

}

</style>

