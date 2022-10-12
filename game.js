//骰子点数
NUM = 0;
//存储棋盘
player_a = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
player_b = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
//标记当前是谁的回合
A_round = 1;
B_round = 0;
//A、B分数
apoint = 0;
bpoint = 0;
//是否放置过了
place = 0;
//是否可以扔骰子
throw_chance = 1;
//选择的位置
var A_choose_x = 0;
var A_choose_y = 0;
var B_choose_x = 0;
var B_choose_y = 0;

//在window中打印游戏结果
function end_game() {
    openDialog();
    if (apoint > bpoint) {
        x = document.getElementById("result");
        x.innerHTML = "A Win!!";
    } else if (apoint < bpoint) {
        x = document.getElementById("result");
        x.innerHTML = "B Win!!";
    } else {
        x = document.getElementById("result");
        x.innerHTML = "Draw!!";
    }
}
//传入棋盘名，返回1说明棋盘已满，游戏结束
function check(player) {
    var count = 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (player[i][j] == 0)
                count += 1;
        }
    }
    if (count == 0) {
        return 1;
    } else {
        return 0;
    }
}
//输入列、对手棋盘名，消除对手该列所有和骰子值相同的数
function judge(col, arch) {
    for (var i = 0; i < 3; i++) {
        if (arch[i][col] == NUM) {
            arch[i][col] = 0;
        }
    }
}
//传入棋盘名，返回当前棋盘总分
function count(player) {
    sum = 0;
    count_dict = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    for (var i = 0; i < 3; i++) {
        count_dict[player[i][0]] += 1;
    }
    for (num in count_dict) {
        sum += num * count_dict[num] * count_dict[num];
    }
    count_dict = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    for (var i = 0; i < 3; i++) {
        count_dict[player[i][1]] += 1;
    }
    for (num in count_dict) {
        sum += num * count_dict[num] * count_dict[num];
    }
    count_dict = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    for (var i = 0; i < 3; i++) {
        count_dict[player[i][2]] += 1;
    }
    for (num in count_dict) {
        sum += num * count_dict[num] * count_dict[num];
    }
    return sum;
}
//将A、B的分数写入point_board
function update_point() {
    apoint = count(player_a);
    bpoint = count(player_b);
    x = document.getElementById("ap");
    x.innerHTML = apoint;
    x = document.getElementById("bp");
    x.innerHTML = bpoint;
}
//玩家A操作函数
function put_num_A(name, row, col) {
    if (place == 0) {
        x = document.getElementById("window");
        x.innerHTML = "再下就不礼貌了！！";
    } else {
        if (A_round != 1) {
            x = document.getElementById("window");
            x.innerHTML = "不能下在对手棋盘！！";
        } else {
            x = document.getElementById(name);
            if (x.innerHTML != 0) {
                x = document.getElementById("window");
                x.innerHTML = "不能下在这里！！";
            } else {
                restore_color(B_choose_x, B_choose_y, 'B');
                place = 0;
                x = document.getElementById(name);
                x.innerHTML = NUM;
                player_a[row][col] = NUM;
                A_choose_x = row;
                A_choose_y = col;
                set_color(A_choose_x, A_choose_y, 'A');
                judge(col, player_b);
                update_point();
                print_board();
                A_round = 0;
                B_round = 1;
                x = document.getElementById("window");
                x.innerHTML = "现在是B的回合";
                x = document.getElementById("who_A");
                x.innerHTML = '';
                x.style.backgroundColor = "rgba(255, 255, 255, 0)";
                x = document.getElementById("who_B");
                x.innerHTML = 'B';
                x.style.backgroundColor = "#3f72af";
                throw_chance = 1;
                if (check(player_a)) {
                    end_game();
                }
            }

        }
    }
}
//顽疾B操作函数
function put_num_B(name, row, col) {
    if (place == 0) {
        x = document.getElementById("window");
        x.innerHTML = "再下就不礼貌了！！";
    } else {
        if (B_round != 1) {
            x = document.getElementById("window");
            x.innerHTML = "不能下在对手棋盘！！";
        } else {
            x = document.getElementById(name);
            if (x.innerHTML != 0) {
                x = document.getElementById("window");
                x.innerHTML = "不能下在这里！！";
            } else {
                restore_color(A_choose_x, A_choose_y, 'A');
                place = 0;
                x = document.getElementById(name);
                x.innerHTML = NUM;
                player_b[row][col] = NUM;
                B_choose_x = row;
                B_choose_y = col;
                set_color(B_choose_x, B_choose_y, 'B');
                judge(col, player_a);
                update_point();
                print_board();
                place = 0;
                A_round = 1;
                B_round = 0;
                x = document.getElementById("window");
                x.innerHTML = "现在是A的回合";
                x = document.getElementById("who_B");
                x.innerHTML = '';
                x.style.backgroundColor = "rgba(255, 255, 255, 0)";
                x = document.getElementById("who_A");
                x.innerHTML = 'A';
                x.style.backgroundColor = "#3f72af";
                throw_chance = 1;
                if (check(player_b)) {
                    end_game()
                }
            }
        }
    }
}
//根据player_a,player_b更新棋盘
function print_board() {
    x = document.getElementById("A_1");
    x.innerHTML = player_a[0][0];
    x = document.getElementById("A_2");
    x.innerHTML = player_a[0][1];
    x = document.getElementById("A_3");
    x.innerHTML = player_a[0][2];
    x = document.getElementById("A_4");
    x.innerHTML = player_a[1][0];
    x = document.getElementById("A_5");
    x.innerHTML = player_a[1][1];
    x = document.getElementById("A_6");
    x.innerHTML = player_a[1][2];
    x = document.getElementById("A_7");
    x.innerHTML = player_a[2][0];
    x = document.getElementById("A_8");
    x.innerHTML = player_a[2][1];
    x = document.getElementById("A_9");
    x.innerHTML = player_a[2][2];
    x = document.getElementById("B_1");
    x.innerHTML = player_b[0][0];
    x = document.getElementById("B_2");
    x.innerHTML = player_b[0][1];
    x = document.getElementById("B_3");
    x.innerHTML = player_b[0][2];
    x = document.getElementById("B_4");
    x.innerHTML = player_b[1][0];
    x = document.getElementById("B_5");
    x.innerHTML = player_b[1][1];
    x = document.getElementById("B_6");
    x.innerHTML = player_b[1][2];
    x = document.getElementById("B_7");
    x.innerHTML = player_b[2][0];
    x = document.getElementById("B_8");
    x.innerHTML = player_b[2][1];
    x = document.getElementById("B_9");
    x.innerHTML = player_b[2][2];
}
//恢复初始值，重新开始
function restart() {
    player_a = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    player_b = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    A_round = 1;
    B_round = 0;
    apoint = 0;
    bpoint = 0;
    place = 0;
    throw_chance = 1;
    x = document.getElementById("who_B");
    x.innerHTML = '';
    x.style.backgroundColor = "rgba(255, 255, 255, 0)";
    x = document.getElementById("who_A");
    x.innerHTML = 'A';
    x.style.backgroundColor = "#3f72af";
    x = document.getElementById("window");
    x.innerHTML = "现在是A的回合";
    update_point();
    print_board();
    restore_color(A_choose_x, A_choose_y, 'A');
    restore_color(B_choose_x, B_choose_y, 'B');
}
function set_color(row, col, name) {
    var id = row * 3 + col + 1;
    id = id.toString();
    x = document.getElementById(name + "_" + id);
    x.style.backgroundColor = "#112d4e";
    x.style.color = "#88a4d6";
}
function restore_color(row, col, name) {
    var id = row * 3 + col + 1;
    id = id.toString();
    x = document.getElementById(name + "_" + id);
    x.style.backgroundColor = "#88a4d6";
    x.style.color = "#112d4e";
}
function openDialog() {
    document.getElementById('light').style.display = 'block';
}
function closeDialog() {
    document.getElementById('light').style.display = 'none';
}
