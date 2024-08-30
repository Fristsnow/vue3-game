<template>
  <div class="game-container">
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
        }
    ">
    </div>
    <div class="player"
         :style="{ left: `${player.x}px`, top: `${player.y}px`, width: `${player.width}px`, height: `${player.height}px`, backgroundColor: player.color }">
    </div>
    <div class="game-container-footer">

    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {isCollidingRect, SIZE, updateElementPositions} from "@/utils/Config.js";
import {fetchMapElements} from "@/utils/MapUtils.js";
import {Player} from "@/utils/Player.js";

const player = ref({
  x: SIZE,
  y: SIZE * 33,
  width: SIZE,
  height: SIZE,
  speed: 5,
  dx: 0,
  dy: 0,
  gravity: 0.7,
  jumpStrength: -10,
  isJumping: false,
  color: 'blue'
});

const playerGame = new Player(player.value);

const mapElements = ref([]); // 存储地图元素

const initGame = async () => {
  // 初始化地图和玩家
  mapElements.value = await fetchMapElements(); // 从后端获取地图数据

  // 添加事件监听器
  window.addEventListener('keydown', playerGame.handleKeyDown);
  window.addEventListener('keyup', playerGame.handleKeyUp);

  // 启动游戏循环
  gameLoop();
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
      handleCollision(player.value, element);
    }
  }
};
const handleCollision = (player, element) => {
  if (element.type === 'obstacle') { // 障碍物
    const prevX = player.x - player.dx;
    const prevY = player.y - player.dy;

    // 判断碰撞方向
    if (prevX + player.width <= element.x) {
      console.log('从左边碰到障碍物');
      player.x = element.x - player.width; // 停止玩家的横向移动
    } else if (prevX >= element.x + element.width) {
      console.log('从右边碰到障碍物');
      player.x = element.x + element.width;
    } else if (prevY + player.height <= element.y) {
      console.log('从上边碰到障碍物');
      player.y = element.y - player.height;
      player.dy = 0; // 停止玩家的纵向移动
      player.isJumping = false; // 允许再次跳跃
    } else if (prevY >= element.y + element.height) {
      console.log('从下边碰到障碍物');
      player.y = element.y + element.height;
      player.dy = 0;
    }
  }
  // 碰撞类型：地面
  if (element.type === 'ground') {
    if (player.dy > 0 && player.y + player.height > element.y) {
      // 玩家从上方落到地面或障碍物
      player.y = element.y - player.height;  // 玩家停留在地面上
      player.dy = 0;  // 重置垂直速度
      player.isJumping = false;  // 重置跳跃状态
    } else if (player.dy < 0 && player.y < element.y + element.height) {
      // 玩家撞到障碍物的下方
      player.y = element.y + element.height;
      player.dy = 0;
    } else if (player.dx > 0 && player.x + player.width > element.x) {
      // 玩家从左侧撞到障碍物
      player.x = element.x - player.width;
      player.dx = 0;
    } else if (player.dx < 0 && player.x < element.x + element.width) {
      // 玩家从右侧撞到障碍物
      player.x = element.x + element.width;
      player.dx = 0;
    }
  }
  // 碰撞类型：星星（3）
  else if (element.type === 'star') {
    // 处理星星碰撞逻辑，例如增加得分或触发事件
    console.log('星星已收集！');
    alert('星星已收集！');
    // 移除星星
    mapElements.value = mapElements.value.filter(el => el.id !== element.id);
  }
};
const gameLoop = () => {
  updatePlayerPosition();
  updateElementPositions(mapElements.value)
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
  background: #000000;
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
  background-color: blue;
}
</style>
