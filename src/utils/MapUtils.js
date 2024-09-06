import {SIZE} from "@/utils/Config.js";

export const fetchMapElements = async () => {
    try {
        const response = await fetch('./map/export-map-test1.json');
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
    const addElement = (x, y, elementConfig) => {
        elements.push({
            id: `block-${x}-${y}`,
            x: x * tileSize,
            y: y * tileSize,
            width: tileSize,
            height: tileSize,
            ...elementConfig
        });
    }

    if (!Array.isArray(mapData) || mapData.length === 0) {
        throw new Error('Invalid mapData');
    }

    for (let y = 0; y < mapData.length; y++) {
        const row = mapData[y];
        if (!Array.isArray(row)) {
            throw new Error('Invalid row in mapData');
        }
        for (let x = 0; x < row.length; x++) {
            switch (mapData[y][x]) {
                case "0": // “0”表示地面
                    addElement(x, y, {type: 'ground', images: './img/Ground-top.jpg'});
                    break;
                case "1": // “1”表示空地
                    addElement(x, y, {type: 'space', images: ''});
                    break;
                case "2": // “2”表示障碍物
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
