// 碰撞检测
import {isCollidingCoordinate, SIZE} from "@/utils/Config.js";
import {MComment} from "@/utils/Comment.js";

export const handleCollision = (player, element, mapElements, mapElementsXY, starCount) => {
    const prevX = player.x - player.dx;
    const prevY = player.y - player.dy;

    const isNeighborOfSameType = (neighborX, neighborY) => {
        return mapElements.some(el =>
                el.x === element.x && (
                    (el.y === neighborY && el.y === element.y - element.height) || // 检查上方
                    (el.y === neighborY && el.y === element.y + element.height)    // 检查下方
                ) && el.type === element.type
        );
    };

    handleCollisionEvent(element, mapElementsXY)

    if (element.type === MComment.ZHANG_AI_WU) {
        if (prevX + player.width <= element.x) {
            // 从左边碰到障碍物
            if (!isNeighborOfSameType(element.x - element.width, element.y)) {
                player.x = element.x - player.width;
                player.dx = 0;
            }
        } else if (prevX >= element.x + element.width) {
            // 从右边碰到障碍物
            if (!isNeighborOfSameType(element.x + element.width, element.y)) {
                player.x = element.x + element.width;
                player.dx = 0;
            }
        } else if (prevY + player.height <= element.y) {
            // 从上边碰到障碍物
            if (!isNeighborOfSameType(element.x, element.y - element.height)) {
                player.y = element.y - player.height;
                player.dy = 0;
                player.isJumping = false;
            }
        } else if (prevY >= element.y + element.height) {
            // 从下边碰到障碍物
            if (!isNeighborOfSameType(element.x, element.y + element.height)) {
                player.y = element.y + element.height;
                player.dy = 0;
            }
        }
    }

    if (element.type === MComment.WALL) {
        if (prevX + player.width <= element.x) {
            // 从左边碰到墙
            player.x = element.x - player.width;
            player.dx = 0;
        } else if (prevX >= element.x + element.width) {
            // 从右边碰到墙
            player.x = element.x + element.width;
            player.dx = 0;
        } else if (player.dy < 0 && player.y < element.y + element.height) {
            // 玩家撞到障碍物的下方
            player.y = element.y + element.height;
            player.dy = 0;
        } else if (player.dy > 0 && player.y + player.height > element.y) {
            player.x = element.x - player.width;
            player.dx = 0;
        }
    }

    // 地面碰撞处理逻辑保持不变
    if (element.type === MComment.DI_MI_AN) {
        if (player.dy > 0 && player.y + player.height > element.y) {
            if (!isNeighborOfSameType(element.x - element.width, element.y)) {
                // 玩家从上方落到地面障碍物
                player.y = element.y - player.height;  // 玩家停留在地面上
                player.dy = 0;  // 重置垂直速度
                player.isJumping = false;  // 重置跳跃状态
            }
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
    if (element.type === MComment.STAR) {
        if (starCount >= 2) {
            alert("游戏结束，请重新开始！")
        }
        // 处理星星碰撞逻辑，例如增加得分或触发事件
        console.log('星星已收集！');
        // 移除星星
        mapElements = mapElements.filter(el => el.id !== element.id)
        starCount = starCount + 1
        return {
            'mapElements': mapElements,
            'starCount': starCount,
        };
    }
    return {
        'mapElements': mapElements,
        'starCount': starCount,
    };
};

// 触发自定义事件
const handleCollisionEvent = (element, mapElementsXY) => {

    const elementRect = {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height
    };

    if (mapElementsXY[elementRect.x, elementRect.y] === mapElementsXY[7 * SIZE, 13 * SIZE]) {
        console.log('恭喜你，发现一个彩蛋！');
    }

}
