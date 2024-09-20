<template>
  <div>
    <div id="toolbar">
      <button :class="{ selected: currentTool === MComment.DI_MI_AN }" @click="selectTool(MComment.DI_MI_AN)">地面
      </button>
      <button :class="{ selected: currentTool === 'remove' }" @click="selectTool('remove')">移除</button>
      <button :class="{ selected: currentTool === MComment.ZHANG_AI_WU }" @click="selectTool(MComment.ZHANG_AI_WU)">
        障碍物
      </button>
      <button :class="{ selected: currentTool === MComment.STAR }" @click="selectTool(MComment.STAR)">星星</button>
      <button :class="{ selected: currentTool === MComment.WALL }" @click="selectTool(MComment.WALL)">墙</button>
      <button :class="{ selected: currentTool === MComment.M_KING }" @click="selectTool(MComment.M_KING)">M国王</button>
      <button @click="exportMap">导出地图</button>
    </div>
    <div ref="gameContainer" class="game-container" @mousedown="handleClickOrDrag" @mousemove="dragElement"
         @mouseup="endDrag">
      <!-- 地图元素将在这里动态生成 -->
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {SIZE} from '@/utils/Config.js';
import {MComment} from "@/utils/Comment.js";

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
    const response = await fetch('./map/m/map-test1.json');
    const data = await response.json();
    mapData.value = data.map;
    elements.value = convertMapDataToElements(data.map);
    renderMap(elements.value);
  } catch (error) {
    console.error('Error fetching map elements:', error);
  }
};
// 添加导出地图的方法
const exportMap = () => {
  // 创建Blob对象存储JSON数据
  const mapDataBlob = new Blob([JSON.stringify({map: mapData.value})], {type: 'application/json'});

  // 创建一个临时的URL表示这个Blob对象
  const url = URL.createObjectURL(mapDataBlob);

  // 创建隐藏的可下载链接
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'map.json'; // 自定义下载文件名

  // 触发点击下载
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // 清理临时创建的对象URL
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
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
        case MComment.DI_MI_AN:
          addElement(x, y, {type: MComment.DI_MI_AN, images: './img/Ground-top.jpg'});
          break;
        case MComment.KONG_DI:
          addElement(x, y, {type: MComment.KONG_DI, images: ''});
          break;
        case MComment.ZHANG_AI_WU:
          addElement(x, y, {
            type: MComment.ZHANG_AI_WU,
            images: './img/Ground-top.jpg',
            direction: 1,
            speed: 2,
            range: 3 * tileSize,
            startX: x * tileSize
          });
          break;
        case MComment.STAR:
          addElement(x, y, {type: MComment.STAR, images: './img/Star.png'});
          break;
        case MComment.WALL:
          addElement(x, y, {type: MComment.WALL, images: './img/Ground-top.jpg'});
          break;
        case MComment.M_KING:
          addElement(x, y, {type: MComment.M_KING, images: './img/m/m-king.png'})
          break;
      }
    }
  }
  return elements;
};

const placeElement = (x, y, elementType) => {
  // 检查当前位置是否为空地
  console.log(elementType, 'lll')

  if (elementType === 'remove') {
    if (mapData.value[y][x] !== MComment.KONG_DI) {
      mapData.value[y][x] = MComment.KONG_DI;
      removeElement(x, y);
    }
  } else {
    // if (mapData.value[y][x] !== MComment.KONG_DI) {
    //   return;
    // }

    // 更新地图数据
    // mapData.value[y][x] = elementType;
    let value;
    switch (elementType) {
      case MComment.STAR:
        value = MComment.STAR;
        break;
      case MComment.DI_MI_AN:
        value = MComment.DI_MI_AN;
        break;
      case MComment.ZHANG_AI_WU:
        value = MComment.ZHANG_AI_WU;
        break;
      case MComment.WALL:
        value = MComment.WALL;
        break;
      case MComment.M_KING:
        value = MComment.M_KING;
        break;
      default:
        value = MComment.KONG_DI; // 空地
    }

    mapData.value[y][x] = value;

    // 更新 elements 数组
    const elementConfig = getElementTypeConfig(x, elementType);
    addElement(x, y, elementConfig);
  }

  // 重新渲染地图
  renderMap(elements.value);
};

const getElementTypeConfig = (x, type) => {
  switch (type) {
    case MComment.DI_MI_AN:
      return {type: MComment.DI_MI_AN, images: './img/Ground-top.jpg'};
    case MComment.KONG_DI:
      return {type: MComment.KONG_DI, images: ''};
    case MComment.ZHANG_AI_WU:
      return {
        type: MComment.ZHANG_AI_WU,
        images: './img/Ground-top.jpg',
        direction: 1,
        speed: 2,
        range: 3 * SIZE,
        startX: x * SIZE
      };
    case MComment.STAR:
      return {type: MComment.STAR, images: './img/Star.png'};
    case MComment.WALL:
      return {type: MComment.WALL, images: './img/Ground-top.jpg'};
    case MComment.M_KING:
      return {type: MComment.M_KING, images: './img/m/m-king.png'}
    default:
      return {};
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
    placeElement(x, y, currentTool.value);
    // console.log(currentTool.value,'kkk')
  }
};
const handleClickOrDrag = (event) => {
  if (event.shiftKey && currentTool.value) {
    isDragging.value = true;
    const rect = gameContainer.value.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / SIZE);
    const y = Math.floor((event.clientY - rect.top) / SIZE);

    if (x >= 0 && y >= 0 && x < mapData.value[0].length && y < mapData.value.length) {
      dragStartPos.value = {x, y};
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
        if (mapData.value[pathY][pathX] === MComment.KONG_DI) { // 空地
          placeElement(pathX, pathY, currentTool.value);
        }
      });

      // 更新起始位置
      dragStartPos.value = {x: newX, y: newY};
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
  container.addEventListener('mousedown', handleClickOrDrag);
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
