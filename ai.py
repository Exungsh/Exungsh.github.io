import random
import copy
from socket import getnameinfo
from turtle import done
from webbrowser import get

player_a = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
player_b = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]


# 检查游戏是否结束
def check(player):
    count = 0
    for i in player:
        for j in i:
            if j == 0:
                count += 1
    if count == 0:
        return True
    else:
        return False


# 判定能否消除对手数字
def judge(col, num, arch):
    for i in range(3):
        if arch[i][col] == num:
            arch[i][col] = 0
    return arch


# 打印对局情况
def print_board():
    print('------------')
    print('A:')
    for l in player_a:
        print(l)

    print('B:')
    for l in player_b:
        print(l)
    print('------------')


# 统计玩家分数 传入玩家列表 返回分数
def count(player):
    sum = 0
    count_dict = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
    for i in range(3):
        count_dict[int(player[int(i)][0])] += 1
    for key in count_dict.keys():
        sum += int(key) * count_dict[key] * count_dict[key]
    count_dict = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
    for i in range(3):
        count_dict[int(player[int(i)][1])] += 1
    for key in count_dict.keys():
        sum += int(key) * count_dict[key] * count_dict[key]
    count_dict = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
    for i in range(3):
        count_dict[int(player[int(i)][2])] += 1
    for key in count_dict.keys():
        sum += int(key) * count_dict[key] * count_dict[key]
    return sum


def play(player, name, arch):
    print('Now is ' + name + '\'s round')
    get_num = random.randint(1, 6)
    print('Your result is:' + str(get_num))
    while 1:
        pos = input('type the position you want:')
        pos = pos.split()
        if player[int(pos[0])][int(pos[1])] == 0:
            player[int(pos[0])][int(pos[1])] = get_num
            break
        else:
            print('There is already a number on that position!')
    judge(int(pos[1]), get_num, arch)
    return player


def computer(ai, player):
    print('Now is Computer\'s round')
    get_num = random.randint(1, 6)
    print('Computer result is:' + str(get_num))
    # =============================================================================
    copy_ai = copy.deepcopy(ai)  # 复制一份原表格
    copy_player = copy.deepcopy(player)
    col_cnt = [[0, 0, 0], [0, 0, 0], [0, 0, 0],
               [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]
    can_done = [0, 0, 0]
    # =============================================================================
    # 设置col_cnt\can_done
    for i in range(3):
        for j in range(3):
            col_cnt[copy_player[j][i]][i] += 1  # 玩家表格：值，第几列，个数++
            if copy_ai[i][j] == 0:
                can_done[j] += 1        # 计算当前状态ai每一列可以下多少子
    # =============================================================================
    if get_num >= 3:
        for j in range(3):
            # 如果某一列和get_num值（大于等于三）相同的>=2个，并且可以下，那就下
            if col_cnt[get_num][j] >= 2 and can_done[j] >= 1:
                for i in range(3):
                    if ai[i][j] == 0:
                        ai[i][j] = get_num
                        judge(j, get_num, player)
                        return ai
            # 如果get_num为4、5、6，如果对面可以有得消，并且可以下，那就下
            elif get_num >= 4 and col_cnt[get_num][j] >= 1 and can_done[j] >= 1:
                for i in range(3):
                    if ai[i][j] == 0:
                        ai[i][j] = get_num
                        judge(j, get_num, player)
                        return ai
            # 检查是否4、5、6双连及以上,3三连 and 是否可下，如果有空，则留空，在其他列贪心。
            elif col_cnt[4][j] >= 2 or col_cnt[5][j] >= 2 or col_cnt[6][j] >= 2 or col_cnt[3] == 3 \
                    and can_done[0] + can_done[1] + can_done[2] > can_done[j]:  # 上次编辑地
                max_point = -162  # 最离谱分差
                best_row = 0
                best_col = 0
                for row in range(3):
                    for col in range(3):
                        if col != j:
                            if ai[row][col] != 0:
                                continue
                            else:
                                copy_ai = copy.deepcopy(ai)  # 复制一份原表格
                                copy_player = copy.deepcopy(player)
                                copy_ai[row][col] = get_num
                                copy_player = judge(col, get_num, copy_player)
                                point = count(copy_ai)-count(copy_player)
                                if point > max_point:
                                    best_row = row
                                    best_col = col
                                    print(str(row)+' '+str(col)+' '+str(point))
                                    max_point = point
                ai[best_row][best_col] = get_num
                judge(best_col, get_num, player)
                return ai

            # 如果对面没有：(🔺🔺🔺检查🔺🔺🔺)
            else:
                max_point = -162  # 最离谱分差
                best_row = 0
                best_col = 0
                for row in range(3):
                    for col in range(3):
                        if ai[row][col] != 0:
                            continue
                        else:
                            copy_ai = copy.deepcopy(ai)  # 复制一份原表格
                            copy_player = copy.deepcopy(player)
                            copy_ai[row][col] = get_num
                            copy_player = judge(col, get_num, copy_player)
                            point = count(copy_ai)-count(copy_player)
                            if point > max_point:
                                best_row = row
                                best_col = col
                                print(str(row)+' '+str(col)+' '+str(point))
                                max_point = point
                ai[best_row][best_col] = get_num
                judge(best_col, get_num, player)
                return ai

    elif get_num < 3:
        jmax = 0
        done_max = 0
        # 选择空最多的落子
        for j in range(3):
            if can_done[j] > done_max:
                done_max = can_done[j]
                jmax = j
        for i in range(3):
            if ai[i][jmax] == 0:
                ai[i][jmax] = get_num
                judge(jmax, get_num, player)
                return ai

#
# print_board()
# while 1:
#     player_a = play(player_a, 'A', player_b)
#     print_board()
#     print('A\'s point:' + str(count(player_a)))
#     print('B\'s point:' + str(count(player_b)))
#     if check(player_a):
#         break
#     # player_b = play(player_b, 'B', player_a)
#     player_b = computer(player_b, player_a)
#     print_board()
#     print('A\'s point:' + str(count(player_a)))
#     print('B\'s point:' + str(count(player_b)))
#     if check(player_b):
#         break
# if count(player_a) > count(player_b):
#     print('A win!!')
# elif count(player_a) < count(player_b):
#     print('B win!!')
# else:
#     print('Draw!!')
# print('Game Over !!')