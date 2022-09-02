const { takeRightWhile, times } = require("lodash");
const lodash = require("lodash");

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    
    if (a.length <= b.length){
        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }   return true;
    }   else{
        for (var i = 0; i < b.length; ++i) {
            if (a[i] !== b[i]) return false;
        }   return true;
    }
}

function indexOf(a, b){
    for (var i = 0; i <b.length; i++){
        if (arraysEqual(a, b[i])){
            return i;
        }  
    }   return -1;
}

function pop(L, index){
    var newL = new Array();
    for (var i = 0; i < L.length; i++){
        if (i !== index){
            newL.push(L[i]);
        }
    }   return newL;
}

function ainb(a, b){
    for (var i=0; i<b.length; i++){
        if (arraysEqual(a, b[i])){
            return true;
        }
    }   return false;
}


class Player{
    constructor(direction, id){
        this.block = 10;
        this.position = [direction*8, 4];
        this.moving_dir = (-1) ** direction;
    }

    move(direction){
        this.position[0] += direction[0];
        this.position[1] += direction[1];
    }

    does_have_block(){
        return this.block !== 0;
    }
}

class Board{
    constructor(){
        this.SIZE = 9;
        this.HORIZONTAL = 0;
        this.VERTICAL = 1;
        
        this.block_board = new Array(this.SIZE -1);
        for (var i=0;i < this.SIZE - 1;i++){
            this.block_board[i] = new Array(this.SIZE - 1);
        }

        this.players = [new Player(0),new Player(1)];
        this.current_player = 0
    }

    is_finished(){
        return this.players[0].position[0] === 8 || this.players[1].position[0] == 0;
    }

    put_block_inst(pos, orientation){
        if (this.block_board[pos[0]][pos[1]] !== null){
            //pass
        }
        if (pos[orientation] < this.SIZE -2 && this.block_board[pos[0]+ (orientation+1)%2][pos[1]+orientation%2]===orientation){
            //pass
        }
        if (pos[orientation >1] && this.block_board[pos[0]-(orientation+1)%2][pos[1]-orientation%2] === orientation){
            //pass
        } else {
            this.block_board[pos[0]][pos[1]] = orientation;
        }
    }

    can_reach(player, pos, orientation){
        var inst_board = lodash.cloneDeep(this);
        inst_board.put_block_inst(pos, orientation);

        var player_pos = inst_board.players[player].position;
        var visited = [player_pos];
        var to_visit = [player_pos];
        while (to_visit.length>0){
            player_pos = to_visit.pop();
            var dirs = inst_board.possible_direction_at(player_pos);
            for (var i = 0; i < dirs.length; i++){
                var next_pos = [parseInt(player_pos[0])+parseInt(dirs[i][0]), parseInt(player_pos[1])+parseInt(dirs[i][1])];                
                if (! ainb(next_pos, visited)){
                    visited.push(next_pos);
                    to_visit.push(next_pos);
                }
            }
        }

        for (var i=0; i<9; i++){
            if (ainb([8-player*8, i], visited)){
                return true;
            }
        }
        return false;
    }

    can_put_block_at(pos, orientation){
        if(this.block_board[pos[0]][pos[1]] != null){
            return false;
        }   if (pos[1 - orientation] < this.SIZE -2 && this.block_board[pos[0]+orientation][pos[1]+1-orientation] === orientation){
            return false;
        }   if (pos[1 - orientation] > 1 && this.block_board[pos[0]-orientation][pos[1]-1+orientation] === orientation){
            return false;
        }   if((! this.can_reach(0, pos, orientation)) || (!this.can_reach(1, pos, orientation))){
            return false;
        }   return true;
    }

    put_block(pos, orientation){
        if(this.can_put_block_at(pos, orientation)){
            this.block_board[pos[0]][pos[1]] = orientation;
            return true;
        } else{
            //alert("You cannot put it here");
            return false;
        }
    }
   
    
    move(player, direction){
        if(ainb(direction, this.possible_moves(player))){
            this.players[player].move(direction);
            return true;
        }   else{
            //alert("You cannot move to here");
            return false;
        }
    }

    possible_moves(player){
        console.assert(player in [0,1]);
        const pos = this.players[player].position;
        const opp_pos = this.players[1-player].position;
        var moves = this.possible_direction_at(pos);
        var direction = [opp_pos[0] - pos[0], opp_pos[1] - pos[1]];
        if(ainb(direction, moves)){
            var dirindex = indexOf(direction, moves);
            moves = pop(moves, dirindex);
            var zero = direction.indexOf(0);
            var nonzero = 1 - zero;
            if((this.SIZE - Math.abs(direction[0]) > opp_pos[0]) && (opp_pos[0] >= Math.abs(direction[0])) && (this.SIZE - Math.abs(direction[1]) > opp_pos[1]) && (opp_pos[1] >= Math.abs(direction[1]))){
                const to_check = [opp_pos[0] - 0.5 + 0.5*direction[0], opp_pos[1] - 0.5 + 0.5*direction[1]];
                if(this.block_board[Math.round(to_check[0] + 0.5*direction[1])][Math.round(to_check[1] + 0.5*direction[0])] !== nonzero && this.block_board[Math.round(to_check[0] - 0.5*direction[1])][Math.round(to_check[1] - 0.5*direction[0])] !== nonzero){
                    moves.push([direction[0]*2, direction[1]*2]);
                }   else{
                    if(this.block_board[Math.round(to_check[0] + 0.5*direction[1])][Math.round(to_check[1] + 0.5*direction[0])] !== zero && this.block_board[Math.round(to_check[0] + 0.5*direction[1]) - direction[0]][Math.round(to_check[1] + 0.5*direction[0]) - direction[1]] !== zero){
                        moves.push([direction[nonzero], direction[nonzero]]);
                    }   if(this.block_board[Math.round(to_check[0] - 0.5*direction[1])][Math.round(to_check[1] - 0.5*direction[0])] !== zero && this.block_board[Math.round(to_check[0] - 0.5*direction[1]) - direction[0]][Math.round(to_check[1] - 0.5*direction[0]) - direction[1]] !== zero){
                        moves.push([((-1)**nonzero) * direction[nonzero], ((-1)**zero) * direction[nonzero]]);
                    }
                }
            }
        }
        return moves;
    }

    possible_direction_at(position){
        var dirs = new Array();
        const x = parseInt(position[0]);
        const y = parseInt(position[1]);
        if (x >= 1){
            var flag = true;
            if ((y < this.SIZE -1) && (this.block_board[x-1][y] === this.HORIZONTAL)){
                flag = false;
            }   if((y > 0) && (this.block_board[x-1][y-1] === this.HORIZONTAL)){
                flag = false;
            }   if(flag){
                dirs.push([-1,0]);
            }
        }   if (x < this.SIZE - 1){
                var flag = true;
                if ((y < this.SIZE - 1) && (this.block_board[x][y] === this.HORIZONTAL)){
                    flag = false;
                }   if ((y > 0) && (this.block_board[x][y-1] === this.HORIZONTAL)){
                    flag = false;
                }   if (flag){
                    dirs.push([1,0]);
                }
        }   if (y >= 1){
                var flag = true;
                if ((x < this.SIZE - 1) && (this.block_board[x][y-1] === this.VERTICAL)){
                    flag = false;
                }   if (x > 0 && this.block_board[x-1][y-1] === this.VERTICAL){
                    flag = false;
                }   if (flag){
                    dirs.push([0,-1]);
                }
        }   if (y < this.SIZE - 1){
                var flag = true;
                if (x < this.SIZE - 1 && this.block_board[x][y] === this.VERTICAL){
                    flag = false;
                }   if (x > 0 && this.block_board[x-1][y] === this.VERTICAL){
                    flag = false;
                }   if (flag){
                    dirs.push([0,1]);
                }
        }
        return dirs;
    }

    show(){
        return this.block_board;
    }

    turn(player, para){
        var flag = false;
        while (true){
            if(para.length === 2){
                flag = this.move(player, [para[0], para[1]]);
                if (flag){
                    break;
                }   else{
                    console.log("invalid move!!");
                    return false;
                }
            }   else if (para.length === 3){
                if (this.players[player].does_have_block()){
                    flag = this.put_block([para[0], para[1]], para[2]);
                    if (flag){
                        this.players[player].block -= 1;
                        break;
                    }   else if (!flag){
                        console.log("invalid position!!");
                        return false;
                    }
                }   else{
                    console.log("No blocks");
                    return false;
                }
            }
        };
        if(this.is_finished()){
            return true;
        }
        this.current_player = 1 - this.current_player;
    }
}    


module.exports = {Board, Player, ainb, arraysEqual};