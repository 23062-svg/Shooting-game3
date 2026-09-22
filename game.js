/* =========================================================
   🎯 2人プレイ・シューティングゲーム
   マウス + Joy-Con
   ゲーム画面：1024 × 661
========================================================= */


/* =========================================================
   基本設定
========================================================= */

const GAME_WIDTH = 1024;
const GAME_HEIGHT = 661;

let leftScore = 0;
let rightScore = 0;

let gameStarted = false;
let gameOver = false;

let practiceMode = false;

let timeLeft = 30;

let leftPad = null;
let rightPad = null;


/* =========================================================
   HTML要素
========================================================= */

const game =
    document.getElementById("game");

const startScreen =
    document.getElementById("start-screen");

const startButton =
    document.getElementById("start-button");

const timerText =
    document.getElementById("timer");

const leftScoreText =
    document.getElementById("left-score");

const rightScoreText =
    document.getElementById("right-score");

const practiceTargets =
    document.getElementById("practice-targets");

const practiceText =
    document.getElementById("practice-text");

const crosshair =
    document.getElementById("crosshair");


/* =========================================================
   効果音
========================================================= */

const hitSound =
    new Audio("pon.mp3");


/* =========================================================
   スコア表示
========================================================= */

function updateScores() {

    if (leftScoreText) {
        leftScoreText.textContent =
            "LEFT: " + leftScore;
    }

    if (rightScoreText) {
        rightScoreText.textContent =
            "RIGHT: " + rightScore;
    }
}


/* =========================================================
   タイマー表示
========================================================= */

function updateTimer() {

    if (timerText) {
        timerText.textContent =
            "Time: " + timeLeft;
    }
}


/* =========================================================
   ターゲット作成
========================================================= */

function addTarget(
    containerId,
    imageFile,
    points,
    x,
    y,
    size = 120
) {

    const container =
        document.getElementById(containerId);

    if (!container) {
        console.warn(
            "コンテナがありません:",
            containerId
        );
        return null;
    }

    const target =
        document.createElement("img");

    target.src = imageFile;

    target.className =
        "shooting-target";

    target.dataset.points =
        points;

    target.dataset.image =
        imageFile;

    target.style.position =
        "absolute";

    target.style.width =
        size + "px";

    target.style.height =
        "auto";

    target.style.left =
        x + "px";

    target.style.top =
        y + "px";

    target.style.cursor =
        "crosshair";

    target.draggable =
        false;


    /* -----------------------------------------------------
       クリック
    ----------------------------------------------------- */

    target.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const rect =
                game.getBoundingClientRect();

            const shotX =
                (event.clientX - rect.left)
                * GAME_WIDTH
                / rect.width;

            const shotY =
                (event.clientY - rect.top)
                * GAME_HEIGHT
                / rect.height;

            shootAt(
                shotX,
                shotY,
                "left"
            );
        }
    );


    container.appendChild(target);

    return target;
}


/* =========================================================
   的を撃つ
========================================================= */

function shootTarget(
    target,
    player
) {

    if (!target) {
        return;
    }

    if (!gameStarted || gameOver) {
        return;
    }

    if (target.style.display === "none") {
        return;
    }


    /* -----------------------------------------------------
       練習モード
       的は消さずにインクだけ表示
    ----------------------------------------------------- */

    if (practiceMode) {

        createInk(
            window.currentShotX,
            window.currentShotY,
            player
        );

        playHitSound();

        return;
    }


    /* -----------------------------------------------------
       通常ゲーム
    ----------------------------------------------------- */

    const points =
        Number(target.dataset.points || 0);


    if (player === "left") {

        leftScore += points;

    } else {

        rightScore += points;
    }


    updateScores();

    playHitSound();


    /* 的を一度消す */

    target.style.display =
        "none";


    /* 少し待って再表示 */

    setTimeout(
        function () {

            if (!gameOver) {

                target.style.display =
                    "block";
            }

        },
        700
    );
}


/* =========================================================
   命中処理
========================================================= */

function shootAt(
    x,
    y,
    player
) {

    if (!gameStarted || gameOver) {
        return;
    }

    window.currentShotX = x;
    window.currentShotY = y;


    const targets =
        document.querySelectorAll(
            ".shooting-target"
        );


    /* 上にある的から判定する */

    const sortedTargets =
        Array.from(targets)
        .reverse();


    for (
        const target of sortedTargets
    ) {

        if (
            target.style.display ===
            "none"
        ) {
            continue;
        }


        const rect =
            target.getBoundingClientRect();

        const gameRect =
            game.getBoundingClientRect();


        const targetX =
            (rect.left - gameRect.left)
            * GAME_WIDTH
            / gameRect.width;

        const targetY =
            (rect.top - gameRect.top)
            * GAME_HEIGHT
            / gameRect.height;


        const targetWidth =
            rect.width
            * GAME_WIDTH
            / gameRect.width;

        const targetHeight =
            rect.height
            * GAME_HEIGHT
            / gameRect.height;


        if (
            x >= targetX &&
            x <= targetX + targetWidth &&
            y >= targetY &&
            y <= targetY + targetHeight
        ) {

            shootTarget(
                target,
                player
            );

            return;
        }
    }
}


/* =========================================================
   効果音
========================================================= */

function playHitSound() {

    try {

        hitSound.currentTime = 0;

        const result =
            hitSound.play();

        if (
            result &&
            result.catch
        ) {
            result.catch(
                () => {}
            );
        }

    } catch (error) {

        console.log(
            "効果音エラー",
            error
        );
    }
}


/* =========================================================
   練習モードのインク
========================================================= */

function createInk(
    x,
    y,
    player
) {

    if (!practiceTargets) {
        return;
    }


    const ink =
        document.createElement("div");

    ink.className =
        "practice-ink";


    ink.style.position =
        "absolute";

    ink.style.left =
        x + "px";

    ink.style.top =
        y + "px";


    if (player === "left") {

        ink.style.background =
            "#ff77b7";

    } else {

        ink.style.background =
            "#7ddcff";
    }


    ink.style.width =
        "70px";

    ink.style.height =
        "70px";

    ink.style.borderRadius =
        "50%";

    ink.style.transform =
        "translate(-50%, -50%)";

    ink.style.pointerEvents =
        "none";

    ink.style.zIndex =
        "999";


    practiceTargets.appendChild(
        ink
    );
}


/* =========================================================
   🦖 レックス
   500点
========================================================= */

const rexTargets =
    [];

for (
    let i = 0;
    i < 4;
    i++
) {

    const rex =
        addTarget(
            "blue-targets",
            "レックス500.png",
            500,
            230 + i * 140,
            200,
            120
        );

    rexTargets.push(rex);
}


let rexStep = 0;


setInterval(
    function () {

        if (
            !gameStarted ||
            gameOver
        ) {
            return;
        }


        rexStep++;

        if (
            rexStep >= 4
        ) {
            rexStep = 0;
        }


        rexTargets.forEach(
            function (rex, index) {

                if (!rex) {
                    return;
                }


                const x =
                    230
                    + index * 140
                    + (rexStep % 2) * 10;

                rex.style.transition =
                    "left 0.6s ease";

                rex.style.left =
                    x + "px";


                rex.classList.remove(
                    "rabbit-jump"
                );

                void rex.offsetWidth;

                rex.classList.add(
                    "rabbit-jump"
                );
            }
        );

    },
    2000
);


/* =========================================================
   🟣 ブルズアイ
   400点
========================================================= */

const bullseye =
    addTarget(
        "purple-targets",
        "ブルズアイ.png",
        400,
        650,
        200,
        150
    );


if (bullseye) {

    bullseye.style.display =
        "none";


    setTimeout(
        function () {

            if (!gameOver) {

                bullseye.style.display =
                    "block";
            }

        },
        5000
    );
}


/* =========================================================
   🐷 ハム
   100点
========================================================= */

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    550,
    300,
    120
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    660,
    300,
    120
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    770,
    300,
    120
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    880,
    300,
    120
);


/* =========================================================
   🦆 黄色いアヒル
   100点
========================================================= */

const yellowTargets =
    [];

for (
    let i = 0;
    i < 5;
    i++
) {

    const duck =
        addTarget(
            "yellow-targets",
            "アヒル100.png",
            100,
            520 + i * 80,
            350,
            120
        );

    yellowTargets.push(
        duck
    );
}


let yellowDirection = 1;


setInterval(
    function () {

        if (
            !gameStarted ||
            gameOver
        ) {
            return;
        }


        yellowTargets.forEach(
            function (duck) {

                if (!duck) {
                    return;
                }


                let x =
                    parseFloat(
                        duck.style.left
                    );


                x +=
                    12
                    * yellowDirection;


                if (x >= 880) {

                    yellowDirection =
                        -1;

                }


                if (x <= 500) {

                    yellowDirection =
                        1;
                }


                duck.style.transition =
                    "left 1s linear";

                duck.style.left =
                    x + "px";
            }
        );

    },
    1000
);


/* =========================================================
   🦆 緑のアヒル
   100点
========================================================= */

const greenTargets =
    [];

for (
    let i = 0;
    i < 5;
    i++
) {

    const duck =
        addTarget(
            "green-targets",
            "アヒル100.png",
            100,
            520 + i * 80,
            400,
            120
        );

    greenTargets.push(
        duck
    );
}


let greenDirection = 1;


setInterval(
    function () {

        if (
            !gameStarted ||
            gameOver
        ) {
            return;
        }


        greenTargets.forEach(
            function (duck) {

                if (!duck) {
                    return;
                }


                let x =
                    parseFloat(
                        duck.style.left
                    );


                x +=
                    10
                    * greenDirection;


                if (x >= 880) {

                    greenDirection =
                        -1;

                }


                if (x <= 500) {

                    greenDirection =
                        1;
                }


                duck.style.transition =
                    "left 1s linear";

                duck.style.left =
                    x + "px";
            }
        );

    },
    1000
);


/* =========================================================
   🦝 アライグマ
   300点
========================================================= */

addTarget(
    "orange-targets",
    "アライグマ.png",
    300,
    250,
    460,
    250
);

addTarget(
    "orange-targets",
    "アライグマ.png",
    300,
    450,
    460,
    250
);

addTarget(
    "orange-targets",
    "アライグマ.png",
    300,
    650,
    460,
    250
);


/* =========================================================
   🐦 ことり
   1000点
========================================================= */

addTarget(
    "bird-targets",
    "ことり.png",
    1000,
    340,
    160,
    100
);

addTarget(
    "bird-targets",
    "ことり.png",
    1000,
    400,
    130,
    100
);

addTarget(
    "bird-targets",
    "ことり.png",
    1000,
    460,
    160,
    100
);


/* =========================================================
   🐔 チキン
   500点
========================================================= */

const chicken =
    addTarget(
        "chicken-targets",
        "レックス500.png",
        500,
        -150,
        500,
        300
    );


let chickenMoving =
    false;


function moveChicken() {

    if (
        !chicken ||
        !gameStarted ||
        gameOver
    ) {
        return;
    }


    if (chickenMoving) {
        return;
    }


    chickenMoving =
        true;


    chicken.style.transition =
        "left 7s linear";

    chicken.style.left =
        "991px";


    setTimeout(
        function () {

            if (!gameOver) {

                chicken.style.transition =
                    "none";

                chicken.style.left =
                    "-150px";

                chickenMoving =
                    false;
            }

        },
        7200
    );
}


setInterval(
    moveChicken,
    9000
);


/* =========================================================
   🐰 うさぎ
   300点
   レックスのように跳ねながら横移動
========================================================= */

const rabbit =
    addTarget(
        "rabbit-targets",
        "うさぎ.png",
        300,
        180,
        250,
        170
    );


let rabbitDirection =
    1;


function moveRabbit() {

    if (
        !rabbit ||
        !gameStarted ||
        gameOver
    ) {
        return;
    }


    let currentX =
        parseFloat(
            rabbit.style.left
        );


    currentX +=
        120 * rabbitDirection;


    if (
        currentX >= 700
    ) {

        rabbitDirection =
            -1;
    }


    if (
        currentX <= 100
    ) {

        rabbitDirection =
            1;
    }


    rabbit.style.transition =
        "left 1.5s ease-in-out";

    rabbit.style.left =
        currentX + "px";


    rabbit.classList.remove(
        "rabbit-jump"
    );

    void rabbit.offsetWidth;

    rabbit.classList.add(
        "rabbit-jump"
    );
}


setInterval(
    moveRabbit,
    1500
);


/* =========================================================
   🐱 猫
   400点
========================================================= */

addTarget(
    "cat-targets",
    "ねこ.png",
    400,
    780,
    230,
    180
);


/* =========================================================
   🐐 やぎ
   600点
   山を登るように移動
========================================================= */

const goat =
    addTarget(
        "goat-targets",
        "やぎ.png",
        600,
        120,
        500,
        150
    );


let goatStep =
    0;


function moveGoat() {

    if (
        !goat ||
        !gameStarted ||
        gameOver
    ) {
        return;
    }


    goatStep++;


    const goatX =
        120
        + goatStep * 80;

    const goatY =
        500
        - goatStep * 45;


    goat.style.transition =
        "left 1.2s ease-in-out, top 1.2s ease-in-out";

    goat.style.left =
        goatX + "px";

    goat.style.top =
        goatY + "px";


    if (
        goatStep >= 7
    ) {

        goatStep =
            0;


        setTimeout(
            function () {

                if (!goat) {
                    return;
                }


                goat.style.transition =
                    "none";

                goat.style.left =
                    "120px";

                goat.style.top =
                    "500px";

            },
            1200
        );
    }
}


setInterval(
    moveGoat,
    1200
);


/* =========================================================
   🦖 レクサー
   500点
========================================================= */

addTarget(
    "rexer-targets",
    "レクサー.png",
    500,
    780,
    150,
    180
);


/* =========================================================
   🐦 スズメ
   500点
   空を飛ぶように横移動
========================================================= */

const sparrow =
    addTarget(
        "sparrow-targets",
        "スズメ.png",
        500,
        250,
        80,
        120
    );


let sparrowDirection =
    1;


function moveSparrow() {

    if (
        !sparrow ||
        !gameStarted ||
        gameOver
    ) {
        return;
    }


    let currentX =
        parseFloat(
            sparrow.style.left
        );


    currentX +=
        250 * sparrowDirection;


    if (
        currentX >= 750
    ) {

        sparrowDirection =
            -1;
    }


    if (
        currentX <= 100
    ) {

        sparrowDirection =
            1;
    }


    sparrow.style.transition =
        "left 3s ease-in-out";

    sparrow.style.left =
        currentX + "px";
}


setInterval(
    moveSparrow,
    3000
);


/* =========================================================
   🎮 Joy-Con接続
========================================================= */

function updateGamepads() {

    const pads =
        navigator.getGamepads();


    leftPad =
        null;

    rightPad =
        null;


    for (
        const pad of pads
    ) {

        if (!pad) {
            continue;
        }


        /*
         * 最初に見つかったコントローラー
         * → LEFT
         */

        if (!leftPad) {

            leftPad =
                pad;

            continue;
        }


        /*
         * 2台目
         * → RIGHT
         */

        if (!rightPad) {

            rightPad =
                pad;
        }
    }


    /* -----------------------------------------------------
       LEFT Joy-Con
       axes 0 / 1
    ----------------------------------------------------- */

    if (
        leftPad &&
        gameStarted &&
        !gameOver
    ) {

        const x =
            leftPad.axes[0] || 0;

        const y =
            leftPad.axes[1] || 0;


        movePlayerCursor(
            "left",
            x,
            y
        );


        /*
         * ボタンが押されたら発射
         */

        for (
            let i = 0;
            i < leftPad.buttons.length;
            i++
        ) {

            if (
                leftPad.buttons[i] &&
                leftPad.buttons[i].pressed
            ) {

                fireFromCursor(
                    "left"
                );

                break;
            }
        }
    }


    /* -----------------------------------------------------
       RIGHT Joy-Con
       axes 0 / 1
    ----------------------------------------------------- */

    if (
        rightPad &&
        gameStarted &&
        !gameOver
    ) {

        const x =
            rightPad.axes[0] || 0;

        const y =
            rightPad.axes[1] || 0;


        movePlayerCursor(
            "right",
            x,
            y
        );


        for (
            let i = 0;
            i < rightPad.buttons.length;
            i++
        ) {

            if (
                rightPad.buttons[i] &&
                rightPad.buttons[i].pressed
            ) {

                fireFromCursor(
                    "right"
                );

                break;
            }
        }
    }


    requestAnimationFrame(
        updateGamepads
    );
}


/* =========================================================
   プレイヤーカーソル
========================================================= */

const playerCursors =
    {};


/* ---------------------------------------------------------
   LEFT
--------------------------------------------------------- */

playerCursors.left =
    document.createElement(
        "div"
    );

playerCursors.left.className =
    "player-cursor";

playerCursors.left.textContent =
    "🩷";


playerCursors.left.style.position =
    "absolute";

playerCursors.left.style.left =
    "300px";

playerCursors.left.style.top =
    "300px";

playerCursors.left.style.fontSize =
    "50px";

playerCursors.left.style.zIndex =
    "9999";

playerCursors.left.style.pointerEvents =
    "none";


/* ---------------------------------------------------------
   RIGHT
--------------------------------------------------------- */

playerCursors.right =
    document.createElement(
        "div"
    );

playerCursors.right.className =
    "player-cursor";

playerCursors.right.textContent =
    "🩵";


playerCursors.right.style.position =
    "absolute";

playerCursors.right.style.left =
    "700px";

playerCursors.right.style.top =
    "300px";

playerCursors.right.style.fontSize =
    "50px";

playerCursors.right.style.zIndex =
    "9999";

playerCursors.right.style.pointerEvents =
    "none";


if (game) {

    game.appendChild(
        playerCursors.left
    );

    game.appendChild(
        playerCursors.right
    );
}


/* =========================================================
   カーソル移動
========================================================= */

const cursorSpeed =
    5;


function movePlayerCursor(
    player,
    axisX,
    axisY
) {

    const cursor =
        playerCursors[player];


    if (!cursor) {
        return;
    }


    let x =
        parseFloat(
            cursor.style.left
        );

    let y =
        parseFloat(
            cursor.style.top
        );


    if (
        Math.abs(axisX) <
        0.15
    ) {

        axisX = 0;
    }


    if (
        Math.abs(axisY) <
        0.15
    ) {

        axisY = 0;
    }


    x +=
        axisX * cursorSpeed;

    y +=
        axisY * cursorSpeed;


    const cursorSize =
        50;


    x =
        Math.max(
            0,
            Math.min(
                GAME_WIDTH -
                cursorSize,
                x
            )
        );


    y =
        Math.max(
            0,
            Math.min(
                GAME_HEIGHT -
                cursorSize,
                y
            )
        );


    cursor.style.left =
        x + "px";

    cursor.style.top =
        y + "px";
}


/* =========================================================
   カーソル位置から発射
========================================================= */

function fireFromCursor(
    player
) {

    const cursor =
        playerCursors[player];


    if (!cursor) {
        return;
    }


    const x =
        parseFloat(
            cursor.style.left
        ) + 25;

    const y =
        parseFloat(
            cursor.style.top
        ) + 25;


    shootAt(
        x,
        y,
        player
    );
}


/* =========================================================
   マウス照準
========================================================= */

if (game) {

    game.addEventListener(
        "mousemove",
        function (event) {

            if (!gameStarted) {
                return;
            }


            const rect =
                game.getBoundingClientRect();


            const x =
                (event.clientX - rect.left)
                * GAME_WIDTH
                / rect.width;


            const y =
                (event.clientY - rect.top)
                * GAME_HEIGHT
                / rect.height;


            if (playerCursors.left) {

                playerCursors.left.style.left =
                    (x - 25) + "px";

                playerCursors.left.style.top =
                    (y - 25) + "px";
            }
        }
    );


    game.addEventListener(
        "click",
        function (event) {

            /*
             * 的自身のclickで処理した場合は
             * ここでは二重判定しない
             */

            if (
                event.target.classList.contains(
                    "shooting-target"
                )
            ) {
                return;
            }


            const rect =
                game.getBoundingClientRect();


            const x =
                (event.clientX - rect.left)
                * GAME_WIDTH
                / rect.width;


            const y =
                (event.clientY - rect.top)
                * GAME_HEIGHT
                / rect.height;


            shootAt(
                x,
                y,
                "left"
            );
        }
    );
}


/* =========================================================
   ゲーム開始
========================================================= */

function startGame() {

    if (gameStarted) {
        return;
    }


    leftScore =
        0;

    rightScore =
        0;


    updateScores();


    gameStarted =
        false;

    gameOver =
        false;


    practiceMode =
        false;


    timeLeft =
        30;


    updateTimer();


    /* スタート画面を消す */

    if (startScreen) {

        startScreen.style.display =
            "none";
    }


    /* 練習画面を消す */

    if (practiceTargets) {

        practiceTargets.style.display =
            "none";
    }


    if (practiceText) {

        practiceText.style.display =
            "none";
    }


    startCountdown();
}


/* =========================================================
   カウントダウン
========================================================= */

function startCountdown() {

    const countdown =
        document.getElementById(
            "countdown"
        );


    if (!countdown) {

        beginGame();

        return;
    }


    let count =
        5;


    countdown.style.display =
        "flex";

    countdown.textContent =
        count;


    const interval =
        setInterval(
            function () {

                count--;


                if (count > 0) {

                    countdown.textContent =
                        count;

                } else {

                    clearInterval(
                        interval
                    );

                    countdown.style.display =
                        "none";

                    beginGame();
                }

            },
            1000
        );
}


/* =========================================================
   本編開始
========================================================= */

function beginGame() {

    gameStarted =
        true;

    gameOver =
        false;

    practiceMode =
        false;


    timeLeft =
        30;

    updateTimer();


    /*
     * ゲーム開始時に的を全部表示
     */

    document
        .querySelectorAll(
            ".shooting-target"
        )
        .forEach(
            function (target) {

                if (
                    target !== bullseye
                ) {

                    target.style.display =
                        "block";
                }
            }
        );


    /*
     * ブルズアイは5秒後
     */

    if (bullseye) {

        bullseye.style.display =
            "none";


        setTimeout(
            function () {

                if (
                    gameStarted &&
                    !gameOver
                ) {

                    bullseye.style.display =
                        "block";
                }

            },
            5000
        );
    }


    startTimer();
}


/* =========================================================
   30秒タイマー
========================================================= */

let timerInterval =
    null;


function startTimer() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );
    }


    timerInterval =
        setInterval(
            function () {

                if (
                    !gameStarted ||
                    gameOver
                ) {

                    return;
                }


                timeLeft--;


                updateTimer();


                if (
                    timeLeft <= 0
                ) {

                    endGame();
                }

            },
            1000
        );
}


/* =========================================================
   ゲーム終了
========================================================= */

function endGame() {

    gameOver =
        true;

    gameStarted =
        false;


    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval =
            null;
    }


    timeLeft =
        0;

    updateTimer();


    /*
     * 最終結果画面
     */

    const finalScore =
        document.getElementById(
            "final-score"
        );


    if (finalScore) {

        finalScore.style.display =
            "flex";
    }


    const finalLeft =
        document.getElementById(
            "final-left-score"
        );


    const finalRight =
        document.getElementById(
            "final-right-score"
        );


    if (finalLeft) {

        finalLeft.textContent =
            leftScore;
    }


    if (finalRight) {

        finalRight.textContent =
            rightScore;
    }


    /*
     * 古いIDにも対応
     */

    const leftResult =
        document.getElementById(
            "left-final-score"
        );

    const rightResult =
        document.getElementById(
            "right-final-score"
        );


    if (leftResult) {

        leftResult.textContent =
            leftScore;
    }


    if (rightResult) {

        rightResult.textContent =
            rightScore;
    }
}


/* =========================================================
   スタートボタン
========================================================= */

if (startButton) {

    startButton.addEventListener(
        "click",
        startGame
    );
}


/* =========================================================
   練習モード
========================================================= */

function startPractice() {

    gameStarted =
        true;

    gameOver =
        false;

    practiceMode =
        true;


    if (startScreen) {

        startScreen.style.display =
            "none";
    }


    if (practiceTargets) {

        practiceTargets.style.display =
            "block";
    }


    if (practiceText) {

        practiceText.style.display =
            "block";
    }


    /*
     * 練習用の大きな的
     */

    if (practiceTargets) {

        practiceTargets.innerHTML =
            "";

        const target1 =
            document.createElement(
                "img"
            );

        target1.src =
            "アヒル100.png";

        target1.style.position =
            "absolute";

        target1.style.left =
            "-80px";

        target1.style.top =
            "130px";

        target1.style.width =
            "700px";

        target1.style.pointerEvents =
            "none";


        const target2 =
            document.createElement(
                "img"
            );

        target2.src =
            "アヒル100.png";

        target2.style.position =
            "absolute";

        target2.style.left =
            "380px";

        target2.style.top =
            "130px";

        target2.style.width =
            "700px";

        target2.style.pointerEvents =
            "none";


        practiceTargets.appendChild(
            target1
        );

        practiceTargets.appendChild(
            target2
        );
    }
}


/* =========================================================
   画面サイズ調整
========================================================= */

function resizeGame() {

    if (!game) {
        return;
    }


    const scaleX =
        window.innerWidth /
        GAME_WIDTH;


    const scaleY =
        window.innerHeight /
        GAME_HEIGHT;


    const scale =
        Math.min(
            scaleX,
            scaleY
        );


    game.style.transform =
        "scale(" + scale + ")";


    game.style.transformOrigin =
        "center center";
}


window.addEventListener(
    "resize",
    resizeGame
);


resizeGame();


/* =========================================================
   Joy-Con開始
========================================================= */

window.addEventListener(
    "gamepadconnected",
    function (event) {

        console.log(
            "Gamepad connected:",
            event.gamepad.id
        );
    }
);


window.addEventListener(
    "gamepaddisconnected",
    function (event) {

        console.log(
            "Gamepad disconnected:",
            event.gamepad.id
        );
    }
);


/* =========================================================
   初期化
========================================================= */

updateScores();

updateTimer();


/*
 * Joy-Con監視開始
 */

requestAnimationFrame(
    updateGamepads
);


/* =========================================================
   最初はゲームを停止
========================================================= */

if (practiceTargets) {

    practiceTargets.style.display =
        "none";
}


if (practiceText) {

    practiceText.style.display =
        "none";
}


/* =========================================================
   完了
========================================================= */

console.log(
    "🎯 Shooting Game loaded!"
);
