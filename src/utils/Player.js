import {isCollidingRect} from "@/utils/Config.js";
import {handleCollision} from "@/utils/Collision.js";

export class Player {
    constructor(player) {
        this.player = player
    }

    handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowLeft':
            case 'a':
                this.player.dx = -this.player.speed;
                this.player.color = 'red'
                break;
            case 'ArrowRight':
            case 'd':
                this.player.dx = this.player.speed;
                this.player.color = 'blue'
                break;
            case ' ':
                if (!this.player.isJumping) {
                    this.player.dy = this.player.jumpStrength;
                    this.player.isJumping = true;
                }
                break;
        }
    };

    handleKeyUp = (event) => {
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'a':
            case 'd':
                this.player.dx = 0;
                break;
        }
    };
    updatePlayerPosition = (player,mapElements,mapElementsXY,starCount) => {
        const prevX = player.x;
        const prevY = player.y;

        // 重力作用
        player.dy += player.gravity;

        // 更新玩家位置
        player.x += player.dx;
        player.y += player.dy;

        // 边界检测
        const container = document.querySelector('.game-container');
        if (player.x < 0) player.x = 0;
        if (player.y < 0) player.y = 0;
        if (player.x + player.width > container.offsetWidth) {
            player.x = container.offsetWidth - player.width;
        }
        if (player.y + player.height > container.offsetHeight) {
            player.y = container.offsetHeight - player.height;
            player.isJumping = false;
        }

        // 碰撞检测
        for (const element of mapElements) {
            if (isCollidingRect(player, element)) {
                // 处理碰撞
                mapElements = handleCollision(player, element, mapElements, mapElementsXY, starCount);
            }
        }
    };
}
