import {isCollidingRect} from "@/utils/Config.js";

class Bullet {
    // 更新子弹位置
    updateBullets = (bullets, id, mapElements) => {
        return bullets.filter(bullet => {
            bullet.x += bullet.dx;
            const container = document.querySelector(id);
            // 检查子弹是否超出边界
            if (bullet.x < 0 || bullet.x > container.offsetWidth) {
                return false; // 移除超出边界的子弹
            }
            // 碰撞检测
            for (const element of mapElements) {
                if (isCollidingRect(bullet, element)) {
                    return false; // 移除碰撞的子弹
                }
            }
            return true;
        });
    };

    shootBullet = (bullets, player) => {
        const bullet = {
            id: `bullet-${Date.now()}`,
            x: player.x + (player.color === 'blue' ? player.width : 0),
            y: player.y + player.height / 2 - 2.5,
            dx: player.color === 'blue' ? 10 : -10,
        };
        if (bullets.length <= 5) {
            bullets.push(bullet);
        }
    };
}

const bulletManger = new Bullet()
export default bulletManger
