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
import {isCollidingRect, SIZE, updateElementPositions} from "@/utils/Config.js";
import {fetchMapElements} from "@/utils/MapUtils.js";
import {Player} from "@/utils/Player.js";
import {handleCollision} from "@/utils/Collision.js";
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

  starCount.value = handleStarCount(mapElements.value);

  console.log(starCount.value, 'star-count')
  // 启动游戏循环
  gameLoop();
};

const handleMouseDown = (event) => {
  if (event.button === 0) { // 左键
    bulletManger.shootBullet(bullets.value, player.value);
  }
};

const updatePlayerPosition = () => {
  const prevX = player.value.x;
  const prevY = player.value.y;

  // 重力作用
  player.value.dy += player.value.gravity;

  // 更新玩家位置
  player.value.x += player.value.dx;
  player.value.y += player.value.dy;

  // 边界检测
  const container = document.querySelector('.game-container');
  if (player.value.x < 0) player.value.x = 0;
  if (player.value.y < 0) player.value.y = 0;
  if (player.value.x + player.value.width > container.offsetWidth) {
    player.value.x = container.offsetWidth - player.value.width;
  }
  if (player.value.y + player.value.height > container.offsetHeight) {
    player.value.y = container.offsetHeight - player.value.height;
    player.value.isJumping = false;
  }

  // 碰撞检测
  for (const element of mapElements.value) {
    if (isCollidingRect(player.value, element)) {
      // 处理碰撞
      mapElements.value = handleCollision(player.value, element, mapElements.value, mapElementsXY.value, starCount);
    }
  }
};
const handleStarCount = (map) => {
  // 初始化计数器
  let count = 0;

// 遍历数组
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "3") {
        // 找到一个 '3'，计数器加一
        count++;
      }
    }
  }
  return count;
}
watch(mapElements, (newVal, oldVal) => {
  starCount.value = handleStarCount(mapElements.value)
})

const gameLoop = () => {
  updatePlayerPosition();
  updateElementPositions(mapElements.value)
  bulletManger.updateBullets(bullets.value, '.game-container', mapElements.value)
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
