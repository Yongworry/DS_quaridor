from copy import deepcopy


class Player:
    def __init__(self, direction):
        assert direction in (0, 1)
        self.block = 10
        self.position = [direction * 8, 4]
        self.moving_dir = (-1) ** direction

    def move(self, direction):
        self.position[0] += direction[0]
        self.position[1] += direction[1]

    def does_have_block(self):
        return self.block != 0


class Board:
    SIZE = 9
    HORIZONTAL = 0
    VERTICAL = 1

    def __init__(self):
        self.block_board = [[None] * (Board.SIZE - 1) for i in range(Board.SIZE - 1)]
        self.players = [Player(0), Player(1)]

    def is_finished(self):
        return self.players[0].position[0] == 8 or self.players[1].position[1] == 0

    def put_block_inst(self, pos, orientation):
        if self.block_board[pos[0]][pos[1]] is not None:
            pass
        if pos[orientation] < Board.SIZE - 2 and self.block_board[pos[0] + (orientation + 1) % 2][pos[1] + orientation % 2] == orientation:
            pass
        if pos[orientation] > 1 and self.block_board[pos[0] - (orientation + 1) % 2][pos[1] - orientation % 2] == orientation:
            pass
        self.block_board[pos[0]][pos[1]] = orientation

    def _can_reach(self, player, position, orientation):
        inst_board = deepcopy(self)
        inst_board.put_block_inst(position, orientation)
        pos = inst_board.players[player].position
        visited = [pos]
        to_visit = [pos]
        while len(to_visit) > 0:
            pos = to_visit.pop()
            dirs = inst_board.possible_direction_at(pos)
            for direction in dirs:
                next_pos = [pos[0] + direction[0], pos[1] + direction[1]]
                if next_pos not in visited:
                    visited.append(next_pos)
                    to_visit.append(next_pos)
        for i in range(9):
            if [8 - player * 8, i] in visited:
                return True
        return False

    def _can_put_block_at(self, pos, orientation):
        if self.block_board[pos[0]][pos[1]] is not None:
            return False
        if pos[orientation] < Board.SIZE - 2 and self.block_board[pos[0] + (orientation + 1) % 2][pos[1] + orientation % 2] == orientation:
            return False
        if pos[orientation] > 1 and self.block_board[pos[0] - (orientation + 1) % 2][pos[1] - orientation % 2] == orientation:
            return False
        if (not self._can_reach(0, pos, orientation)) or (not self._can_reach(1, pos, orientation)):
            return False
        return True

    def put_block(self, pos, orientation):
        if self._can_put_block_at(pos, orientation):
            self.block_board[pos[0]][pos[1]] = orientation
            return True
        else:
            print("You cannot put it here")
            return False

    def move(self, player, direction):
        if direction in self.possible_moves(player):
            self.players[player].move(direction)
            return True
        else:
            print("You cannot move to here")
            return False

    def possible_moves(self, player):
        assert player in (0, 1)
        pos = self.players[player].position
        moves = self.possible_direction_at(pos)
        if [pos[0] + self.players[player].moving_dir, pos[1]] == self.players[1 - player].position:
            if (self.players[player].moving_dir, 0) in moves:
                moves.remove((self.players[player].moving_dir, 0))
                if player == 0:
                    flag = True
                    if pos[0] < Board.SIZE - 2 and pos[1] < Board.SIZE - 1 and self.block_board[pos[0] + 1][pos[1]] == Board.HORIZONTAL:
                        flag = False
                    if pos[0] < Board.SIZE - 2 and pos[1] > 0 and self.block_board[pos[0] + 1][pos[1] - 1] == Board.HORIZONTAL:
                        flag = False
                    if flag:
                        moves.append((2, 0))
                    else:
                        flag = True
                        if pos[0] < Board.SIZE - 1 and pos[1] < Board.SIZE - 1 and self.block_board[pos[0]][pos[1]] == Board.VERTICAL:
                            flag = False
                        if pos[0] < Board.SIZE - 2 and pos[1] < Board.SIZE - 1 and self.block_board[pos[0] + 1][pos[1]] == Board.VERTICAL:
                            flag = False
                        if flag:
                            moves.append((1, 1))
                        flag = True
                        if pos[0] < Board.SIZE - 1 and pos[1] > 0 and self.block_board[pos[0]][pos[1] - 1] == Board.VERTICAL:
                            flag = False
                        if pos[0] < Board.SIZE - 2 and pos[1] > 0 and self.block_board[pos[0] + 1][pos[1] - 1] == Board.VERTICAL:
                            flag = False
                        if flag:
                            moves.append((1, -1))
                else:
                    flag = True
                    if pos[0] > 1 and pos[1] < Board.SIZE - 1 and self.block_board[pos[0] - 2][pos[1]] == Board.HORIZONTAL:
                        flag = False
                    if pos[0] > 1 and pos[1] > 0 and self.block_board[pos[0] - 2][pos[1] - 1] == Board.HORIZONTAL:
                        flag = False
                    if flag:
                        moves.append((-2, 0))
                    else:
                        flag = True
                        if pos[0] > 1 and pos[1] < Board.SIZE - 1 and self.block_board[pos[0] - 2][pos[1]] == Board.VERTICAL:
                            flag = False
                        if pos[0] > 0 and pos[1] < Board.SIZE - 1 and self.block_board[pos[0] - 1][pos[1]] == Board.VERTICAL:
                            flag = False
                        if flag:
                            moves.append((-1, 1))
                        flag = True
                        if pos[0] > 1 and pos[1] > 0 and self.block_board[pos[0] - 2][pos[1] - 1] == Board.VERTICAL:
                            flag = False
                        if pos[0] > 0 and pos[1] > 0 and self.block_board[pos[0] - 1][pos[1] - 1] == Board.VERTICAL:
                            flag = False
                        if flag:
                            moves.append((-1, -1))
        return moves

    def possible_direction_at(self, position):
        dirs = []
        [x, y] = position
        if x >= 1:
            flag = True
            if y < Board.SIZE - 1 and self.block_board[x - 1][y] == Board.HORIZONTAL:
                flag = False
            if y > 0 and self.block_board[x - 1][y - 1] == Board.HORIZONTAL:
                flag = False
            if flag:
                dirs.append((-1, 0))
        if x < Board.SIZE - 1:
            flag = True
            if y < Board.SIZE - 1 and self.block_board[x][y] == Board.HORIZONTAL:
                flag = False
            if y > 0 and self.block_board[x][y - 1] == Board.HORIZONTAL:
                flag = False
            if flag:
                dirs.append((1, 0))
        if y >= 1:
            flag = True
            if x < Board.SIZE - 1 and self.block_board[x][y - 1] == Board.VERTICAL:
                flag = False
            if x > 0 and self.block_board[x - 1][y - 1] == Board.VERTICAL:
                flag = False
            if flag:
                dirs.append((0, -1))
        if y < Board.SIZE - 1:
            flag = True
            if x < Board.SIZE - 1 and self.block_board[x][y] == Board.VERTICAL:
                flag = False
            if x > 0 and self.block_board[x - 1][y] == Board.VERTICAL:
                flag = False
            if flag:
                dirs.append((0, 1))
        return dirs

    def show(self):
        boarder = " ╷╶└╵│┌├╴┘─┴┐┤┬┼"
        strings = [["*", " "] * (Board.SIZE - 1) + ["*"] if i % 2 == 0 else [" "] * (2 * Board.SIZE - 1) for i in range(2 * Board.SIZE - 1)]
        strings[self.players[0].position[0] * 2][self.players[0].position[1] * 2] = "1"
        strings[self.players[1].position[0] * 2][self.players[1].position[1] * 2] = "2"
        for i in range(2 * Board.SIZE - 1):
            for j in range(2 * Board.SIZE - 1):
                x = i // 2
                y = j // 2
                boarder_shape = 0
                if i % 2 == 1 and j % 2 == 1:
                    if self.block_board[x][y] == Board.HORIZONTAL:
                        boarder_shape += 10
                    if self.block_board[x][y] == Board.VERTICAL:
                        boarder_shape += 5
                    if x + 1 < Board.SIZE - 1 and self.block_board[x + 1][y] == Board.VERTICAL:
                        boarder_shape += 4
                    if x - 1 >= 0 and self.block_board[x - 1][y] == Board.VERTICAL:
                        boarder_shape += 1
                    if y + 1 < Board.SIZE - 1 and self.block_board[x][y + 1] == Board.HORIZONTAL:
                        boarder_shape += 2
                    if y - 1 >= 0 and self.block_board[x][y - 1] == Board.HORIZONTAL:
                        boarder_shape += 8
                    strings[i][j] = boarder[boarder_shape]
                elif i % 2 == 1:
                    if x < Board.SIZE - 1 and y < Board.SIZE - 1 and self.block_board[x][y] == Board.HORIZONTAL:
                        boarder_shape += 10
                    if x < Board.SIZE - 1 and y > 0 and self.block_board[x][y - 1] == Board.HORIZONTAL:
                        boarder_shape += 10
                    strings[i][j] = boarder[boarder_shape]
                elif j % 2 == 1:
                    if x < Board.SIZE - 1 and y < Board.SIZE - 1 and self.block_board[x][y] == Board.VERTICAL:
                        boarder_shape += 5
                    if x > 0 and y < Board.SIZE - 1 and self.block_board[x - 1][y] == Board.VERTICAL:
                        boarder_shape += 5
                    strings[i][j] = boarder[boarder_shape]
        for i in range(2 * Board.SIZE - 1):
            for j in range(2 * Board.SIZE - 1):
                q = "  "
                if strings[i][j] in "╶└┌├─┴┬┼" and strings[i][j] in "╶└┌├╴┘─┴┐┤┬┼":
                    q = "──"
                print(strings[i][j], end=q)
            print()

    def game(self):
        print("move dx dy or block x y orientation")
        print("ex) move 0 1 / block 3 7 1")
        current_player = 0
        while not self.is_finished():
            self.show()
            print()
            while True:
                print('Player ', end='')
                print(current_player + 1, end='')
                string = input("\'s turn : ")
                l = string.split(" ")
                if len(l) == 3:
                    flag = self.move(current_player, (int(l[1]), int(l[2])))
                    if flag:
                        break
                    else:
                        continue
                elif len(l) == 4:
                    if self.players[current_player].does_have_block():
                        flag = self.put_block((int(l[1]), int(l[2])), int(l[3]))
                        if flag:
                            self.players[current_player].block -= 1
                            break
                    else:
                        print("No blocks")
            current_player = 1 - current_player
            print()
            print()
        print()
        print("Player ", end='')
        print(2 - current_player, end='')
        print(' win')



b = Board()
b.game()