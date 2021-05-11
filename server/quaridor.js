class Player{
    constructor(direction){
        this.block = 10;
        this.position = [direction*8, 4];
        this.moving_dir = (-1) ** direction;
    }

    move(direction){
        this.position[0] += direction[0];
        this.position[1] += direction[1];
    }

    does_have_block(){
        return self.block !== 0;
    }
}

class Board{
    SIZE = 9;
    HORIZONTAL = 0;
    VERTICAL = 1;

    constructor(){
        this.block_board = new Array(Board.SIZE -1);
        for(var i=0;i < Board.SIZE - 1;i++){
            this.block_board[i] = [[null]*(Board.SIZE - 1)];
        }
    }
}