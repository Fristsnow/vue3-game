export class Player{
    constructor(player) {
        this.player = player
    }
    handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                this.player.dx = -this.player.speed;
                break;
            case 'ArrowRight':
                this.player.dx = this.player.speed;
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
                this.player.dx = 0;
                break;
        }
    };
}
