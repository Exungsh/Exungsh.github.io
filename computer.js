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
        x.innerHTML = "You Win!!";
    } else if (apoint < bpoint) {
        x = document.getElementById("result");
        x.innerHTML = "Computer Win!!";
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
        x.innerHTML = "还没扔骰子！！";
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
                //调整参数
                A_round = 0;
                B_round = 1;
                x = document.getElementById("window");
                x.innerHTML = "现在是电脑的回合";
                x = document.getElementById("who_A");
                x.innerHTML = '';
                x.style.backgroundColor = "rgba(255, 255, 255, 0)";
                x = document.getElementById("who_B");
                x.innerHTML = 'C';
                x.style.backgroundColor = "#3f72af";
                throw_chance = 1;
                if (check(player_a)) {
                    end_game();
                }
                else {
                    throw_chance = 0;
                    NUM = Math.floor(Math.random() * 6) + 1;
                    myDice.roll(NUM);
                    setTimeout("computer(player_b, player_a)", 2500);
                }

            }
        }
    }
}

function computer(ai, player) {
    place = 1;
    var col_cnt = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    var can_done = [0, 0, 0];
    var copy_player = JSON.parse(JSON.stringify(player));
    var copy_ai = JSON.parse(JSON.stringify(ai));
    restore_color(A_choose_x, A_choose_y, 'A');
    //====================================================
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            col_cnt[copy_player[j][i]][i] += 1;
            if (copy_ai[i][j] == 0) {
                can_done[j] += 1;
            }
        }
    }
    //=====================================================
    // NUM讨论囊括到括号内

    for (var j = 0; j < 3; j++) {
        if (NUM >= 3 && col_cnt[NUM][j] >= 2 && can_done[j] >= 1) {
            for (var i = 0; i < 3; i++) {
                if (ai[i][j] == 0) {
                    B_choose_x = i;
                    B_choose_y = j;
                    ai[i][j] = NUM;
                    judge(j, player);
                    break;
                }
            }
            break;
        } else if (NUM >= 4 && col_cnt[NUM][j] >= 1 && can_done[j] >= 1) {
            for (var i = 0; i < 3; i++) {
                if (ai[i][j] == 0) {
                    B_choose_x = i;
                    B_choose_y = j;
                    ai[i][j] = NUM;
                    judge(j, player);
                    break;
                }
            }
            break;
        } else if (NUM >= 3 && (col_cnt[4][j] >= 2 || col_cnt[5][j] >= 2 || col_cnt[6][j] >= 2 || col_cnt[3] == 3) && can_done[0] + can_done[1] + can_done[2] > can_done[j]) {
            var max_point = -162;
            var best_row = 0;
            var best_col = 0;
            for (var row = 0; row < 3; row++) {
                for (var col = 0; col < 3; col++) {
                    if (col != j) {
                        if (ai[row][col] != 0) {
                            continue;
                        } else {
                            var copy_player = JSON.parse(JSON.stringify(player));
                            var copy_ai = JSON.parse(JSON.stringify(ai));
                            copy_ai[row][col] = NUM;
                            judge(col, copy_player);
                            point = count(copy_ai) - count(copy_player);
                            if (point > max_point) {
                                best_row = row;
                                best_col = col;
                                max_point = point;
                            }
                        }
                    }
                }
            }
            B_choose_x = best_row;
            B_choose_y = best_col;
            ai[best_row][best_col] = NUM;
            judge(best_col, player);
            break;
        }

        //================================================================================================================
        else if (NUM < 3 && (col_cnt[4][j] >= 2 || col_cnt[5][j] >= 2 || col_cnt[6][j] >= 2 || col_cnt[3] == 3) && can_done[0] + can_done[1] + can_done[2] > can_done[j]) {
            avoid_j = j;
            var colmax = 0;
            var done_max = 0;
            for (var col = 0; col < 3; col++) {
                if (col != avoid_j) {
                    if (can_done[col] > done_max) {
                        done_max = can_done[col];
                        colmax = col;
                    }
                }
            }
            for (var i = 0; i < 3; i++) {
                if (ai[i][colmax] == 0) {
                    B_choose_x = i;
                    B_choose_y = colmax;
                    ai[i][colmax] = NUM;
                    judge(colmax, player);
                    break;
                }
            }
            break;
        }
        //============
        else if (NUM == 1 && col_cnt[1][j] >= 2 && can_done[0] + can_done[1] + can_done[2] > can_done[j]) {
            avoid_j = j;
            var colmax = 0;
            var done_max = 0;
            for (var col = 0; col < 3; col++) {
                if (col != avoid_j) {
                    if (can_done[col] > done_max) {
                        done_max = can_done[col];
                        colmax = col;
                    }
                }
            }
            for (var i = 0; i < 3; i++) {
                if (ai[i][colmax] == 0) {
                    B_choose_x = i;
                    B_choose_y = colmax;
                    ai[i][colmax] = NUM;
                    judge(colmax, player);
                    break;
                }
            }
            break;
        }
        //====
        else if (NUM == 2 && (col_cnt[2][j] == 2 || col_cnt[2][j] == 1) && can_done[0] + can_done[1] + can_done[2] > can_done[j]) {
            avoid_j = j;
            var colmax = 0;
            var done_max = 0;
            for (var col = 0; col < 3; col++) {
                if (col != avoid_j) {
                    if (can_done[col] > done_max) {
                        done_max = can_done[col];
                        colmax = col;
                    }
                }
            }
            for (var i = 0; i < 3; i++) {
                if (ai[i][colmax] == 0) {
                    B_choose_x = i;
                    B_choose_y = colmax;
                    ai[i][colmax] = NUM;
                    judge(colmax, player);
                    break;
                }
            }
            break;
        }
        //====
        else if (NUM < 3 && j == 2) {
            var colmax = 0;
            var done_max = 0;
            for (var col = 0; col < 3; col++) {
                if (can_done[col] > done_max) {
                    done_max = can_done[col];
                    colmax = col;
                }
            }
            for (var i = 0; i < 3; i++) {
                if (ai[i][colmax] == 0) {
                    B_choose_x = i;
                    B_choose_y = colmax;
                    ai[i][colmax] = NUM;
                    judge(colmax, player);
                    break;
                }
            }
            break;
        }
        //================================================================================================================col_cnt[5][j]
        else if (NUM >= 3 && j == 2) {
            var max_point = -162;
            var best_row = 0;
            var best_col = 0;
            for (var row = 0; row < 3; row++) {
                for (var col = 0; col < 3; col++) {
                    if (ai[row][col] != 0) {
                        continue;
                    } else {
                        var copy_player = JSON.parse(JSON.stringify(player));
                        var copy_ai = JSON.parse(JSON.stringify(ai));
                        copy_ai[row][col] = NUM;
                        judge(col, copy_player);
                        point = count(copy_ai) - count(copy_player);
                        if (point > max_point) {
                            best_row = row;
                            best_col = col;
                            max_point = point;
                        }
                    }
                }
            }
            B_choose_x = best_row;
            B_choose_y = best_col;
            ai[best_row][best_col] = NUM;
            judge(best_col, player);
            break;
        }
    }
    set_color(B_choose_x, B_choose_y, 'B');
    update_point();
    print_board();
    place = 0;
    A_round = 1;
    B_round = 0;
    x = document.getElementById("window");
    x.innerHTML = "现在是你的回合";
    x = document.getElementById("who_B");
    x.innerHTML = '';
    x.style.backgroundColor = "rgba(255, 255, 255, 0)";
    x = document.getElementById("who_A");
    x.innerHTML = 'P';
    x.style.backgroundColor = "#3f72af";
    throw_chance = 1;
    if (check(player_b)) {
        end_game();
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
    x.innerHTML = 'P';
    x.style.backgroundColor = "#3f72af";
    x = document.getElementById("window");
    x.innerHTML = "现在是你的回合";
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

//骰子代码
/*!
 * author:jieyou
 * contacts:baidu hi->youyo1122
 * see https://github.com/jieyou/dice
 */
; (function (window, document, parseInt) {

    // 初始化时各个面的rotate角度 // 初始状态下，2面向用户
    var diceStart = [
        null
        , { x: 90, y: 0, z: 0 } // rotateX,rotateY,rotate
        , { x: 0, y: 0, z: 0 }
        , { x: 0, y: 90, z: 0 }
        , { x: 0, y: 180, z: 0 }
        , { x: 0, y: -90, z: 0 }
        , { x: -90, y: 0, z: 180 }
    ]

    // 6个结果对应的，需要将wrapper rotate的角度
    var diceResult = [
        null
        , { x: 270, y: 0, z: 0 } // roll出1
        , { x: 0, y: 0, z: 0 } // roll出2 // 初始状态下，2面向用户
        , { x: 0, y: 270, z: 0 } // roll出3
        , { x: 180, y: 0, z: 180 }
        , { x: 0, y: 90, z: 0 }
        , { x: 90, y: 0, z: 180 }
    ]

    // 色子面共同和动画效果无关的css
    var faceStyle = {
        'position': 'absolute'
        , 'border': '5px solid #fff'
        //,'borderRadius':'5px' // todo：圆角大小可配 // done
        , 'backgroundColor': '#fff'
        , 'fontSize': '0'
        , 'textAlign': 'center'
    }

    function callType(obj) {
        return Object.prototype.toString.call(obj)
    }

    var isArray = Array.isArray || function (arr) {
        return callType(arr) === '[object Array]'
    }

    var forEach = Array.prototype.forEach || function (callback) {
        var i = 0
            , t = this
            , len = t.length
        for (; i < len; i++) {
            callback.call(t[i], t[i], i)
        }
    }

    // 各色子面单独html
    var faceHtml = {
        tpl: '<div class="dice_circle" style="#{margin};#{border};left:#{left}%;top:#{top}%;width:0;height:0;position:absolute;"></div>'
        , position: [
            null
            , [[50, 50]]
            , [[50, 30], [50, 70]]
            , [[28, 72], [50, 50], [72, 28]]
            , [[30, 30], [30, 70], [70, 30], [70, 70]]
            , [[28, 28], [28, 72], [50, 50], [72, 28], [72, 72]]
            , [[28, 22.5], [28, 50], [28, 77.5], [72, 22.5], [72, 50], [72, 77.5]]
        ]
        , html: [null]
    }
        ; (function (faceHtml) {
            forEach.call(faceHtml.position, function (e, i) {
                var html = []
                if (e) {
                    forEach.call(e, function (e_, i_) {
                        html.push(faceHtml.tpl.replace('#{left}', e_[0]).replace('#{top}', e_[1]))
                    })
                    faceHtml.html[i] = html.join('')
                }
            })
            delete faceHtml.tpl
            delete faceHtml.position
        })(faceHtml)

    function emptyFn() { }

    function on(dom, event, func) {
        if (dom.addEventListener) {
            dom.addEventListener(event, func, false)
        } else {
            dom.attachEvent('on' + event, func)
        }
    }

    function off(dom, event, func) {
        if (dom.removeEventListener) {
            dom.removeEventListener(event, func, false)
        } else {
            dom.detachEvent('on' + event, func)
        }
    }

    function getRightJsStyleName(cssKey, prefixWord) {
        if (prefixWord) {
            return prefixWord + cssKey[0].toUpperCase() + cssKey.substr(1)
        }
        return cssKey
    }

    // 检测是否支持 `transform-style:preserve-3d`
    var supportPreserve3d = (function () {
        // 安卓3.0以下（不含）通过此方法无法检测（即使在不支持的情况下，使用getComputedStyle或直接div.style[styleName]还是会返回'preserve-3d'），这里写搓一点
        // IE均不支持，但IE9无法通过此法来检测，这里写搓一点
        // 后来发现UC也有问题，这里写搓一点
        // 后来发现遨游也有问题，这里写搓一点
        // 已经在zhihu发帖准备解决这个问题：
        var isAndroid = navigator.userAgent.match(/(Android);?[\s\/]+([\d.]+)?/)
            , version
            , isAndorid3Below = false
            , isIE = /MSIE/i.test(navigator.userAgent)
            , isUC = /UCBrowser/i.test(navigator.userAgent)
            , isMaxthon = /Maxthon/i.test(navigator.userAgent)
            , div = document.createElement('DIV')
        if (isAndroid) {
            version = parseFloat(isAndroid[2])
            isAndorid3Below = !isNaN(version) && version < 3
        }
        return function (prefixWord) {
            var styleName
            if (isAndorid3Below || isIE || isUC || isMaxthon) {
                return false
            }
            styleName = getRightJsStyleName('transformStyle', prefixWord)
            div.style[styleName] = 'preserve-3d'
            return !!div.style[styleName].length
        }
    })()

    // 确定制造商前缀及支持preserve-3d情况，不光是有前缀，同时支持3d动画时prefix才不为null
    var prefix
    var prefixWord
        ; (function (style, string) {
            if (typeof style.webkitTransform === string && supportPreserve3d('webkit')) {
                prefix = '-webkit-'
                prefixWord = 'webkit'
            } else if (typeof style.MozTransform === string && supportPreserve3d('Moz')) {
                prefix = '-moz-'
                prefixWord = 'Moz'
            } else if (typeof style.msTransform === string && supportPreserve3d('ms')) { // IE10及以下 都不支持 所需关键属性 `transform-style:preserve-3d` 故暂时不兼容IE
                prefix = '-ms-'
                prefixWord = 'ms'
            } else if (typeof style.transform === string && supportPreserve3d('')) {
                prefix = prefixWord = ''
            } else {
                prefix = prefixWord = null
            }
            // 调试不支持的情况的代码，将prefix、prefixWord写死为null
            // prefix = prefixWord = null
        })(document.body.style, 'string')

    // console.log(prefix)

    // 标准化和降级兼容原生的requestAnimationFrame
    // 安卓4.4以下（不含）不支持requestAnimationFrame
    var requestAnimationFrame_ = window.requestAnimationFrame
        || window[getRightJsStyleName('requestAnimationFrame', prefixWord)]
        || function (callback) {
            return setTimeout(callback, 17)
        }
    // 调试setTimeout
    // var requestAnimationFrame_ =function(callback){
    // 	return setTimeout(callback,17)
    // }

    var cancelAnimationFrame_ = window.cancelAnimationFrame
        || window[getRightJsStyleName('cancelAnimationFrame', prefixWord)]
        || clearTimeout
    // 调试clearTimeout
    // var cancelAnimationFrame_ = clearTimeout

    // 在参数数组中获取一个随机数
    function random(arr) {
        var len = arr.length
        // if(isArray(arr)){ // 注释掉判断是否为一个数组的部分，在入口函数中已经确保了
        // 	len = arr.length
        if (len === 1) {
            return arr[0]
        }
        return arr[Math.floor(Math.random() * len)]
        // }else{
        // 	return arr
        // }
    }

    // 赋予css
    function css(domOrCssStr, oneKeyOrKeyValueObject, oneValue) {
        var key
        // if(arguments.length === 1){ // 已经不存在需要拼装的css文本了，暂时注释掉
        // 	key = document.createElement('STYLE')
        // 	key.innerHTML = domOrCssStr
        // 	document.getElementsByTagName('HEAD')[0].appendChild(key)
        // }
        if (arguments.length === 3) {
            domOrCssStr.style[oneKeyOrKeyValueObject] = oneValue
        } else {
            for (key in oneKeyOrKeyValueObject) {
                if (oneKeyOrKeyValueObject.hasOwnProperty(key)) {
                    domOrCssStr.style[key] = oneKeyOrKeyValueObject[key]
                }
            }
        }
    }

    function keepAnimation(dice) {
        // 目前firefox 30 在第二次roll的时候keepAnimation阶段显示不正常或没有动作，暂时没有办法修复
        dice.dtime = new Date().getTime() - dice.stime
        if (dice.dtime > dice.keepAnimationTime) {
            dice._onKeepAnimationEnd()
            endAnimation(dice)
            return
        }
        if (prefix !== null) {
            dice.rafId = requestAnimationFrame_(function () { // 最开始进来的时候也考虑requestAnimationFrame_ 提高性能
                keepAnimation(dice)
            })
            // var a = 'rotateZ(' + dice.zAngle + 'deg) rotateX(' + dice.xAngle + 'deg) rotateY(' + dice.yAngle +'deg)'
            // (prefix==='-moz-'?'':prefix)+'transform'
            css(dice.wrapper, getRightJsStyleName('transform', prefixWord), 'rotate(' + dice.zAngle + 'deg) rotateX(' + dice.xAngle + 'deg) rotateY(' + dice.yAngle + 'deg)')
            // todo:可以顺时针转或逆时针，也就是angle既可以+10，也可以-10
            dice.curRollIsRotateX ? dice.yAngle = 0 : dice.xAngle = 0
            dice.zAngle = dice.zAngle > 360 ? dice.zAngle - 360 : dice.zAngle + 10
            // x与y任意旋转一个即可，随机一下
            dice.curRollIsRotateX ?
                (dice.xAngle = dice.xAngle > 360 ? dice.xAngle - 360 : dice.xAngle + 10) :
                (dice.yAngle = dice.yAngle > 360 ? dice.yAngle - 360 : dice.yAngle + 10)
        }
    }

    function endAnimation(dice) {
        var val
        cancelAnimationFrame_(dice.rafId)
        dice.rafId = null
        dice.dtime = 0
        val = diceResult[dice.result]
        // off first
        on(dice.wrapper, getRightJsStyleName('transitionEnd', prefixWord), dice._onEndAnimationEnd)
        on(dice.wrapper, getRightJsStyleName('transitionEnd', prefixWord), dice._onRollEnd)
        css(dice.wrapper, getRightJsStyleName('transition', prefixWord), prefix + 'transform ' + (dice.endAnimationTime / 1000) + 's ease-out')
        css(dice.wrapper, getRightJsStyleName('transform', prefixWord), 'rotate(' + val.z + 'deg) rotateX(' + val.x + 'deg) rotateY(' + val.y + 'deg)')
        // dice.onEndAnimationEnd.call(dice,dice.result) // 更多的参数待定
    }

    function noAnimation(dice) {
        var circles
        forEach.call([1, 2, 3, 4, 5, 6], function (e) {
            var face = dice['face' + e]
            if (e === dice.result) {
                circles = face.getElementsByTagName('DIV') // IE8-  不支持getElementsByClassname，好在除此之外没有别的元素了
                forEach.call(circles, function (c) {
                    c.style.display = 'none'
                })
                face.style.zIndex = '2000'
            } else {
                face.style.zIndex = '1000'
            }
        })
        setTimeout(function () {
            forEach.call(circles, function (c) {
                c.style.display = 'block'
            })
            dice._onNoAnimationEnd()
            dice._onRollEnd()
        }, 200) // todo:时间可配
    }

    function Dice(container, formattedConfig) {
        var t = this
        forEach.call(['edgeLength', 'radius', 'hasShadow', 'shadowTop', 'keepAnimationTime', 'endAnimationTime'], function (e, i) {
            t[e] = formattedConfig[e]
        })
        t._onKeepAnimationEnd = function () {
            formattedConfig.onKeepAnimationEnd.call(t, t.result)
        }
        t._onEndAnimationEnd = function () {
            formattedConfig.onEndAnimationEnd.call(t, t.result)
        }
        t._onNoAnimationEnd = function () {
            formattedConfig.onNoAnimationEnd.call(t, t.result)
        }
        t._onRollEnd = function () {
            formattedConfig.onRollEnd.call(t, t.result)
        }
        // t.translateZ // 默认与棱长一致
        // 下面是static
        t.zAngle = 0 // x轴rotate初始状态
        t.yAngle = 0
        t.xAngle = 0
        t.rafId = null // requestAnimationFrame 返回的id
        t.stime = 0
        t.dtime = 0

        // 底部阴影
        if (t.hasShadow) {
            t.shadow = document.createElement('DIV')
            css(t.shadow, {
                'position': 'absolute'
                , 'left': '50%'
                , 'top': t.shadowTop + '%'
                , 'height': '0'
                , 'width': t.edgeLength * 4 / 10 + 'px'
                // ,'boxShadow': '0 0 '+t.edgeLength+'px '+t.edgeLength*35/100+'px rgba(0, 0, 0, 0.7)'
                , 'marginLeft': '-' + t.edgeLength * 2 / 10 + 'px'
            })
            // firefox 30 不认识 -moz-box-shadow，但认识box-shadow
            css(t.shadow, prefixWord === 'Moz' ? 'boxShadow' : getRightJsStyleName('boxShadow', prefixWord), '0 0 ' + t.edgeLength + 'px ' + t.edgeLength * 35 / 100 + 'px rgba(0, 0, 0, 0.7)')
            t.shadow.className = 'dice_shadow'
            container.appendChild(t.shadow)
        }

        forEach.call(['wrapper', 'face1', 'face2', 'face3', 'face4', 'face5', 'face6'], function (e, i) {
            t[e] = document.createElement('DIV')
            if (e === 'wrapper') {
                // t[e].style.a
                css(t[e], {
                    'position': 'absolute'
                    , 'height': t.edgeLength + 'px'
                    , 'width': t.edgeLength + 'px'
                    , 'top': '50%'
                    , 'left': '50%'
                    , 'marginLeft': '-' + (t.edgeLength / 2) + 'px'
                    , 'marginTop': '-' + (t.edgeLength / 2) + 'px'
                })
                if (prefix !== null) {
                    css(t[e], getRightJsStyleName('transformStyle', prefixWord), 'preserve-3d')
                    // css(t[e],getRightJsStyleName('transform',prefixWord),'translateX(0px)')
                    css(t[e], getRightJsStyleName('transformOrigin', prefixWord), '50% 50%')
                    // css(t[e],getRightJsStyleName('transition',prefix+'transform 0s ease-in-out')
                }
                t[e].className = 'dice_wrapper'
            } else {
                css(t[e], faceStyle)
                css(t[e], {
                    'height': (t.edgeLength - 10) + 'px' // 10为每个面的圆角，如果圆角也要自适应棱长，则这个10的数字也要更改为计算出来的
                    , 'width': (t.edgeLength - 10) + 'px'
                    // ,'lineHeight':(t.edgeLength-10)+'px'
                    , 'borderRadius': t.radius + 'px'
                })
                // css(t[e],getRightJsStyleName('backfaceVisibility',prefixWord),'hidden')
                if (prefix !== null) {
                    css(t[e], getRightJsStyleName('transform', prefixWord), 'rotateX(' + diceStart[i].x + 'deg) rotateY(' + diceStart[i].y + 'deg) rotate(' + diceStart[i].z + 'deg) translateZ(' + (t.edgeLength / 2) + 'px)')
                    // css(t[e],getRightJsStyleName('perspective',prefixWord),'800px')
                }
                t[e].className = 'dice_face dice_' + e
                t[e].innerHTML = faceHtml.html[i].replace(/\#\{margin\}/g, 'margin-top:-' + (t.edgeLength / 10) + 'px;margin-left:-' + (t.edgeLength / 10) + 'px').replace(/\#\{border\}/g, 'border:' + (t.edgeLength / 10) + 'px #' + ((i === 1 || i === 4) ? 'F' : '0') + '00 solid;border-radius:' + (t.edgeLength / 10) + 'px')
                t.wrapper.appendChild(t[e])
            }
        })
        css(container, 'position', 'relative')
        if (prefix !== null) {
            css(container, getRightJsStyleName('perspective', prefixWord), '800px')
            css(container, getRightJsStyleName('perspectiveOrigin', prefixWord), '50% 50%')
        }
        container.appendChild(t.wrapper)
    }
    Dice.prototype.roll = function (valueArr) { // todo：提供单次roll的 keepAnimationTime,endAnimationTime,thisRollOnKeepAnimationEnd,thisRollOnEndAnimationEnd 可配，只在这一次roll中生效
        var t = this
            , _valueArr
            , v
            , timeLen
            , isS = false
        if (t.rafId !== null) {
            return
        }
        if (isArray(valueArr)) {
            _valueArr = []
            forEach.call(valueArr, function (e, i) {
                v = parseInt(e, 10)
                if (v >= 1 && v <= 6) {
                    _valueArr.push(v)
                }
            })
        } else if (typeof (valueArr) === 'number') {
            _valueArr = [valueArr]
        }
        if (!_valueArr || (isArray(_valueArr) && !_valueArr.length)) {
            _valueArr = [1, 2, 3, 4, 5, 6]
        }
        t.result = random(_valueArr)

        if (prefix !== null) {
            t.curRollIsRotateX = !!random([0, 1])
            css(t.wrapper, prefix + 'transition', prefix + 'transform 0s linear')
            t.stime = new Date().getTime()
            off(t.wrapper, getRightJsStyleName('transitionEnd', prefixWord), t._onEndAnimationEnd)
            off(t.wrapper, getRightJsStyleName('transitionEnd', prefixWord), t._onRollEnd)
            requestAnimationFrame_(function () { keepAnimation(t) })
        } else {
            noAnimation(t)
        }

        return t.result
    }
    Dice.prototype.stop = function () {
        var t = this
        if (t.rafId !== null) {
            cancelAnimationFrame_(t.rafId)
            t.rafId = null
        }
    }

    // 可配项和默认配置
    var defaultConfig = {
        edgeLength: 100
        , radius: 5
        , hasShadow: true
        , shadowTop: 75
        , keepAnimationTime: 3000
        , endAnimationTime: 1000
        , onKeepAnimationEnd: emptyFn
        , onEndAnimationEnd: emptyFn
        , onNoAnimationEnd: emptyFn
        , onRollEnd: emptyFn
    }

    window.dice = function (container, userConfig) {
        var k
            , formattedConfig
        if (arguments.length === 0) {
            return
        }
        if (!userConfig) {
            formattedConfig = defaultConfig
        } else {
            formattedConfig = {}
            for (k in defaultConfig) {
                if (userConfig.hasOwnProperty(k) && defaultConfig.hasOwnProperty(k) && callType(defaultConfig[k]) === callType(userConfig[k])) {
                    formattedConfig[k] = userConfig[k]
                } else {
                    formattedConfig[k] = defaultConfig[k]
                }
            }
        }
        return new Dice(container, formattedConfig)
    }

})(window, document, parseInt)
