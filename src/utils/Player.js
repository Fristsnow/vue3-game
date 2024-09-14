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
}
