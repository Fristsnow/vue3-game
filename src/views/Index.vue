<template>
  <div class="game-container" @mousedown="handleMouseDown">
    <div
        v-for="element in mapElements"
        :key="element.id"
        class="map-element"
        :style="{
          left: `${element.x}px`,
          top: `${element.y}px`,
          width: `${element.width}px`,
          height: `${element.height}px`,
          backgroundImage: `url('${element.images}')`
        }">
    </div>
    <div class="player"
         :style="{ left: `${player.x}px`, top: `${player.y}px`, width: `${player.width}px`, height: `${player.height}px`, backgroundColor: player.color }">
    </div>
    <div class="game-container-footer">
      <!-- TODO 底部技能栏 -->
    </div>
    <!-- 显示子弹 -->
    <div
        v-for="bullet in bullets"
        :key="bullet.id"
        class="bullet"
        :style="{ left: `${bullet.x}px`, top: `${bullet.y}px`, width: '5px', height: '5px' }">
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, onBeforeUnmount} from 'vue';
import {SIZE, updateElementPositions} from "@/utils/Config.js";
import {fetchMapElements} from "@/utils/MapUtils.js";
import {Player} from "@/utils/Player.js";
import bulletManger from "@/utils/Bullet.js";

const player = ref({
  x: SIZE,
  y: SIZE * 15,
  width: SIZE,
  height: SIZE,
  speed: 5,
  dx: 0,
  dy: 0,
  gravity: 0.5,
  jumpStrength: -10,
  isJumping: false,
  color: 'blue'
});
const bullets = ref([]); // 存储子弹列表

const starCount = ref(0)

const playerGame = new Player(player.value);

const mapElements = ref([]); // 存储地图元素

const mapElementsXY = ref([]);

const initGame = async () => {
  // 初始化地图和玩家
  mapElements.value = await fetchMapElements(); // 从后端获取地图数据
  // 添加事件监听器
  window.addEventListener('keydown', playerGame.handleKeyDown);
  window.addEventListener('keyup', playerGame.handleKeyUp);

  mapElementsXY.value = mapElements.value.map(element => [element.x / 20, element.y]);

  // 启动游戏循环
  gameLoop();
};

const handleMouseDown = (event) => {
  if (event.button === 0) { // 左键
    bulletManger.shootBullet(bullets.value, player.value);
  }
};

const gameLoop = () => {
  let obj = playerGame.updatePlayerPosition(
      player.value,
      mapElements.value,
      mapElementsXY.value,
      starCount.value
  )
  mapElements.value = obj.mapElements
  starCount.value = obj.starCount
  console.log(starCount.value,'star-countsssss')
  updateElementPositions(mapElements.value);
  bullets.value = bulletManger.updateBullets(bullets.value, '.game-container', mapElements.value)
  requestAnimationFrame(gameLoop);
};

onMounted(async () => {
  await initGame();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', playerGame.handleKeyDown);
  window.removeEventListener('keyup', playerGame.handleKeyUp);
});
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100vw; /* 设置游戏容器的宽度 */
  height: 100vh; /* 设置游戏容器的高度 */
  margin: auto;
  background: #ffffff;
  border: 1px solid #000;
  overflow: hidden;
}

.map-element {
  background-size: cover; /* 确保图片能够覆盖整个元素 */
  background-repeat: no-repeat;
  position: absolute;
}

.player {
  position: absolute;
  background-color: aqua;
}

.bullet {
  position: absolute;
  background-color: red;
}
</style>
