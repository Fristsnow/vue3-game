<template>
  <div>
    <div id="toolbar">
      <button :class="{ selected: currentTool === 'ground' }" @click="selectTool('ground')">地面</button>
      <button :class="{ selected: currentTool === 'remove' }" @click="selectTool('remove')">移除</button>
      <button :class="{ selected: currentTool === 'obstacle' }" @click="selectTool('obstacle')">障碍物</button>
      <button :class="{ selected: currentTool === 'star' }" @click="selectTool('star')">星星</button>
      <button :class="{ selected: currentTool === 'wall' }" @click="selectTool('wall')">墙</button>
    </div>
    <div ref="gameContainer" class="game-container" @mousedown="handleClickOrDrag" @mousemove="dragElement" @mouseup="endDrag">
      <!-- 地图元素将在这里动态生成 -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { SIZE } from '@/utils/Config.js';

const gameContainer = ref(null);
const currentTool = ref(null);
const elements = ref([]);
const mapData = ref([]);
const isDragging = ref(false);
const dragStartPos = ref(null);
const dragPath = ref([]);

const selectTool = (tool) => {
  currentTool.value = tool;
};

const fetchMapElements = async () => {
  try {
    const response = await fetch('./map/map.json');
    const data = await response.json();
    mapData.value = data.map;
    elements.value = convertMapDataToElements(data.map);
    renderMap(elements.value);
  } catch (error) {
    console.error('Error fetching map elements:', error);
  }
};

const convertMapDataToElements = (mapData) => {
  const elements = [];
  const tileSize = SIZE; // 假设每个瓦片的大小为 40x40 像素
  const addElement = (x, y, elementConfig) => {
    elements.push({
      id: `block-${x}-${y}`,
      x: x * tileSize,
      y: y * tileSize,
      width: tileSize,
      height: tileSize,
      ...elementConfig
    });
  };

  if (!Array.isArray(mapData) || mapData.length === 0) {
    throw new Error('Invalid mapData');
  }

  for (let y = 0; y < mapData.length; y++) {
    const row = mapData[y];
    if (!Array.isArray(row)) {
      throw new Error('Invalid row in mapData');
    }
    for (let x = 0; x < row.length; x++) {
      switch (row[x]) {
        case "0": // “0”表示地面
          addElement(x, y, {type: 'ground', images: './img/Ground-top.jpg'});
          break;
        case "1": // “1”表示空地
          addElement(x, y, {type: 'space', images: ''});
          break;
        case "2": // “2”表示障碍物
          addElement(x, y, {type: 'obstacle', images: './img/Ground-top.jpg', direction: 1, speed: 2, range: 3 * tileSize, startX: x * tileSize});
          break;
        case "3": // “3”表示星星
          addElement(x, y, {type: 'star', images: './img/Star.png'});
          break;
        case "4": // “4”表示墙
          addElement(x, y, {type: 'wall', images: './img/Ground-top.jpg'});
          break;
      }
    }
  }
  return elements;
};

const placeElement = (x, y, elementType) => {
  // 检查当前位置是否为空地
  if (elementType === 'remove') {
    if (mapData.value[y][x] !== '1') {
      mapData.value[y][x] = '1'; // 设置为空地
      removeElement(x, y);
    }
  } else {
    if (mapData.value[y][x] !== '1') {
      return;
    }

    // 更新地图数据
    mapData.value[y][x] = elementType;

    // 更新 elements 数组
    const elementConfig = getElementTypeConfig(elementType);
    addElement(x, y, elementConfig);
  }

  // 重新渲染地图
  renderMap(elements.value);
};

const getElementTypeConfig = (type) => {
  switch (type) {
    case 'ground': return {type: 'ground', images: './img/Ground-top.jpg'};
    case 'space': return {type: 'space', images: ''};
    case 'obstacle': return {type: 'obstacle', images: './img/Ground-top.jpg', direction: 1, speed: 2, range: 3 * SIZE, startX: x * SIZE};
    case 'star': return {type: 'star', images: './img/Star.png'};
    case 'wall': return {type: 'wall', images: './img/Ground-top.jpg'};
    default: return {};
  }
};

const addElement = (x, y, elementConfig) => {
  elements.value.push({
    id: `block-${x}-${y}`,
    x: x * SIZE,
    y: y * SIZE,
    width: SIZE,
    height: SIZE,
    ...elementConfig
  });
};

const removeElement = (x, y) => {
  elements.value = elements.value.filter(element => {
    const blockX = Math.floor(element.x / SIZE);
    const blockY = Math.floor(element.y / SIZE);
    return !(blockX === x && blockY === y);
  });
};

const renderMap = (elements) => {
  const container = gameContainer.value;
  container.innerHTML = ''; // 清空容器

  elements.forEach(element => {
    const div = document.createElement('div');
    div.style.left = `${element.x}px`;
    div.style.top = `${element.y}px`;
    div.style.width = `${element.width}px`;
    div.style.height = `${element.height}px`;
    div.style.position = 'absolute';
    div.style.backgroundSize = 'cover';
    div.style.backgroundRepeat = 'no-repeat';

    if (element.images) {
      div.style.backgroundImage = `url(${element.images})`;
    }

    container.appendChild(div);
  });
};
const placeOnClick = (event) => {
  const rect = gameContainer.value.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / SIZE);
  const y = Math.floor((event.clientY - rect.top) / SIZE);

  if (x >= 0 && y >= 0 && x < mapData.value[0].length && y < mapData.value.length) {
    // if (currentTool.value && mapData.value[y][x] === '1') {
      placeElement(x, y, currentTool.value);
    // }
  }
};
const handleClickOrDrag = (event) => {
  if (event.shiftKey && currentTool.value) {
    isDragging.value = true;
    const rect = gameContainer.value.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / SIZE);
    const y = Math.floor((event.clientY - rect.top) / SIZE);

    if (x >= 0 && y >= 0 && x < mapData.value[0].length && y < mapData.value.length) {
      dragStartPos.value = { x, y };
      placeElement(x, y, currentTool.value);
    }
  }
  placeOnClick(event)
};

const dragElement = (event) => {
  if (isDragging.value && dragStartPos.value) {
    const rect = gameContainer.value.getBoundingClientRect();
    const newX = Math.floor((event.clientX - rect.left) / SIZE);
    const newY = Math.floor((event.clientY - rect.top) / SIZE);

    if (newX >= 0 && newY >= 0 && newX < mapData.value[0].length && newY < mapData.value.length) {
      const oldX = dragStartPos.value.x;
      const oldY = dragStartPos.value.y;

      // 计算路径上的所有格子
      const path = calculatePath(oldX, oldY, newX, newY);

      // 放置路径上的所有元素
      path.forEach(([pathX, pathY]) => {
        if (mapData.value[pathY][pathX] === '1') { // 空地
          placeElement(pathX, pathY, currentTool.value);
        }
      });

      // 更新起始位置
      dragStartPos.value = { x: newX, y: newY };
    }
  }
};

const calculatePath = (x1, y1, x2, y2) => {
  const path = [];
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    path.push([x1, y1]);
    if (x1 === x2 && y1 === y2) {
      break;
    }
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }

  return path;
};

const endDrag = () => {
  isDragging.value = false;
  dragStartPos.value = null;
  dragPath.value = [];
};

onMounted(() => {
  fetchMapElements();

  const container = gameContainer.value;
  container.addEventListener('mousedown', startDrag);
  container.addEventListener('mousemove', dragElement);
  container.addEventListener('mouseup', endDrag);
});
</script>

<style scoped>
#toolbar button {
  margin: 5px;
  padding: 5px 10px;
}

#toolbar button.selected {
  background-color: #007bff;
  color: white;
}

.game-container {
  position: relative;
  width: 100vw; /* 设置游戏容器的宽度 */
  height: 100vh; /* 设置游戏容器的高度 */
  margin: auto;
  border: 1px solid #ccc;
  background: #ffffff;
  overflow: hidden;
}
</style>
