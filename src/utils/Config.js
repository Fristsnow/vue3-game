export const SIZE = 20;

// 碰撞监测
export const isCollidingRect = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
};

// 障碍物移动
export const updateElementPositions = (mapElements) => {
    for (const element of mapElements) {
        if (element.type === 'obstacle') {
            element.x += element.speed * element.direction;

            // 超出移动范围则反转方向
            if (element.x > element.startX + element.range || element.x < element.startX) {
                element.direction *= -1;
            }
        }
    }
};

// 实体与坐标碰撞检测
export const isCollidingCoordinate = (rect1, rect2) => {
    return !(rect1.x + rect1.width < rect2.x ||
        rect1.x > rect2.x + rect2.width ||
        rect1.y + rect1.height < rect2.y ||
        rect1.y > rect2.y + rect2.height);
}
// 辅助函数用于比较两个数组是否相等
export const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export const getLetterIndex = (letter) => {
    const arr = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ];

    // 将输入的字母转换为大写
    const upperCaseLetter = letter.toUpperCase();

    // 查找字母在数组中的索引
    const index = arr.indexOf(upperCaseLetter);

    // 检查是否找到了字母
    if (index === -1) {
        throw new Error("Invalid letter: must be a single uppercase letter");
    }

    return index + 1;
};

