import {SIZE} from "@/utils/Config.js";

export const fetchMapElements = async () => {
    try {
        const response = await fetch('./map/map.json');
        const data = await response.json();

        // 将地图数据转换为元素列表
        return convertMapDataToElements(data.map);
    } catch (error) {
        console.error('Error fetching map elements:', error);
    }
};

const convertMapDataToElements = (mapData) => {
    const elements = [];
    const tileSize = SIZE; // 假设每个瓦片的大小为 40x40 像素

    for (let y = 0; y < mapData.length; y++) {
        for (let x = 0; x < mapData[y].length; x++) {
            if (mapData[y][x] === "0") { // “0”表示地面
                elements.push({
                    id: `block-${x}-${y}`,
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    type: 'ground',
                    images: './img/Ground-top.jpg'
                });
            }
            if (mapData[y][x] === "1") { // “1”表示空地
                elements.push({
                    id: `block-${x}-${y}`,
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    type: 'space',
                    images: ''
                });
            }
            if (mapData[y][x] === "2") { // “2”表示障碍物
                elements.push({
                    id: `block-${x}-${y}`,
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    type: 'obstacle',
                    images: './img/Ground-top.jpg',
                    direction: 1, // 1 表示向右移动，-1 表示向左移动
                    speed: 2, // 移动速度
                    range: 3 * tileSize, // 移动范围（3格）
                    startX: x * tileSize // 初始位置
                });
            }
            if (mapData[y][x] === "3") { // “3”表示星星
                elements.push({
                    id: `block-${x}-${y}`,
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    type: 'star',
                    images: './img/Star.png'
                });
            }
        }
    }
    return elements;
};
