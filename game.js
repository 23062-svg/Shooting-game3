/* =========================
   30秒タイマー
========================= */
/* =========================
   ゲーム状態
========================= */

let timeLeft = 30;

let gameOver = false;

let gameStarted = false;

let practiceMode = false;


/* =========================
   30秒タイマー
========================= */

const timerText = document.getElementById("timer");

let gameTimer = null;

const gameArea = document.getElementById("game");
function startGameTimer() {

    timeLeft = 30;

    gameOver = false;

    timerText.textContent = "Time: 30";


    gameTimer = setInterval(function () {

        timeLeft--;

        timerText.textContent =
            "Time: " + timeLeft;


        if (timeLeft <= 0) {

    clearInterval(gameTimer);

    gameOver = true;
    gameStarted = false;

    timerText.textContent = "Time: 0";

    // 幕を閉める
    gameArea.classList.remove("curtain-open");
    gameArea.classList.add("curtain-close");

    // 0.8秒後に最終得点を表示
    setTimeout(function () {
        showFinalScore();
    }, 800);
}
    }, 1000);

}

/* =========================
   2人プレイ・シューティングゲーム
   マウス + Joy-Con 2台
========================= */

let leftScore = 0;
let rightScore = 0;

const scoreText = document.getElementById("score");


/* =========================
   得点表示
========================= */

function updateScores() {

    scoreText.textContent =
        "LEFT: " + leftScore +
        "     RIGHT: " + rightScore;

}


/* =========================
   Joy-Conの照準
========================= */

const game = document.getElementById("game");

const leftCursor = document.createElement("div");
const rightCursor = document.createElement("div");

leftCursor.className = "player-cursor left-cursor";
rightCursor.className = "player-cursor right-cursor";

leftCursor.textContent = "🩷";
rightCursor.textContent = "🩵";

game.appendChild(leftCursor);
game.appendChild(rightCursor);


/* =========================
   照準の初期位置
========================= */

let leftX = 300;
let leftY = 300;

let rightX = 700;
let rightY = 300;


/* =========================
   照準の速度
========================= */

const cursorSpeed = 5;


/* =========================
   発射ボタンの状態
========================= */

let leftFirePressed = false;
let rightFirePressed = false;


/* =========================
   的を作る共通関数
========================= */

function addTarget(
    containerId,
    imageFile,
    points,
    x,
    y,
    size = 120
) {

    const container = document.getElementById(containerId);

    const target = document.createElement("img");

    target.src = imageFile;
    target.classList.add("shooting-target");
    target.style.position = "absolute";
    target.style.left = x + "px";
    target.style.top = y + "px";
    target.style.width = size + "px";
    target.style.height = "auto";
    target.style.cursor = "crosshair";


    /* =========================
       的を撃つ
    ========================= */

    function shootTarget(player) {

        if (target.style.display === "none") {
            return;
        }


        /* =========================
           練習中
           的は撃てるが得点なし
        ========================= */

        if (practiceMode) {

            target.style.display = "none";


            setTimeout(function () {

                target.style.display = "block";

            }, 500);


            return;
        }


        /* =========================
           ゲーム開始前・終了後
        ========================= */

        if (!gameStarted || gameOver) {
            return;
        }


        /* =========================
           得点
        ========================= */

        if (player === "left") {

            leftScore += points;

        }


        if (player === "right") {

            rightScore += points;

        }


        updateScores();


        /* 的を消す */

        target.classList.add("fall-back");

        setTimeout(function () {
            target.style.display = "none";
            target.classList.remove("fall-back");
        }, 600);

        setTimeout(function () {
            target.style.display = "block";
        }, 5000);

    }
    /* =========================
       マウスクリック
    ========================= */


    // Joy-Conから使うため保存
    target.addEventListener("click", function (event) {

        event.stopPropagation();

        // 時間切れなら撃てない
        if (gameOver) {
            return;
        }

        // マウスは左プレイヤー扱い
        shootTarget("left");

    });

    target.shootTarget = shootTarget;
    // ゲーム開始前は的を隠す
    container.appendChild(target);

    return target;

}

/* =========================
   🔵 レックス 500点
========================= */

/* =========================
   レックス4体
========================= */

const rex1 = addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    150,
    210
);

const rex2 = addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    270,
    210
);

const rex3 = addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    390,
    210
);

const rex4 = addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    510,
    210
);


/* =========================
   レックスの左右移動
========================= */

// 4体をまとめる
const rexTargets = [
    rex1,
    rex2,
    rex3,
    rex4
];

// 1 = 右、-1 = 左
let rexDirection = 1;

// 何歩動いたか
let rexSteps = 0;

// 2秒ごとに1歩
/* =========================
   レックス4体のなめらかな移動
========================= */

setInterval(function () {

    // 10px先の位置へ、2秒かけて移動
    rexTargets.forEach(function (rex) {

        const currentX =
            parseFloat(rex.style.left);

        rex.style.transition =
            "left 2s ease-in-out";

        rex.style.left =
            (currentX + 10 * rexDirection) + "px";

        // ジャンプ
        rex.classList.remove("rex-jump");

        void rex.offsetWidth;

        rex.classList.add("rex-jump");

    });

    rexSteps++;

    // 3歩進んだら方向転換
    if (rexSteps >= 3) {

        rexDirection *= -1;
        rexSteps = 0;

    }

}, 2000);




/* =========================
   🟣 ブルズアイ 400点
========================= */

const purple = addTarget(
    "purple-targets",
    "bullseye.png",
    400,
    700,
    200
);


// 最初は隠す
purple.style.display = "none";


// 5秒後に出現
setTimeout(function () {

    purple.style.display = "block";

}, 5000);


// ブルズアイ専用
purple.shootTarget = function (player) {

    if (purple.style.display === "none") {
        return;
    }


    /* 練習中 */

    if (practiceMode) {

        purple.style.display = "none";


        setTimeout(function () {

            purple.style.display = "block";

        }, 500);


        return;
    }


    /* ゲーム開始前・終了後 */

    if (!gameStarted || gameOver) {
        return;
    }



    if (player === "left") {

        leftScore += 400;

    }


    if (player === "right") {

        rightScore += 400;

    }


    updateScores();


    purple.style.display = "none";


    // 5秒後に復活
    setTimeout(function () {

        purple.style.display = "block";

    }, 5000);

};


/* =========================
   🔴 ハム 100点
========================= */

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    420,
    280
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    590,
    280
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    720,
    280
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    850,
    280
);


/* =========================
   🟡 アヒル 100点
========================= */

const yellowTargets = [

    addTarget(
        "yellow-targets",
        "アヒル100.png",
        100,
        380,
        370
    ),

    addTarget(
        "yellow-targets",
        "アヒル100.png",
        100,
        490,
        370
    ),

    addTarget(
        "yellow-targets",
        "アヒル100.png",
        100,
        600,
        370
    ),

    addTarget(
        "yellow-targets",
        "アヒル100.png",
        100,
        710,
        370
    ),

    addTarget(
        "yellow-targets",
        "アヒル100.png",
        100,
        820,
        370
    ),

];


/* =========================
   🟡 アヒルを左右に動かす
========================= */

let yellowDirection = 1;

const yellowSpeed = 0.4;

const waterLeft = 290;
const waterRight = 990;


function moveYellowTargets() {

    yellowTargets.forEach(function (target) {

        let currentX =
            parseFloat(target.style.left);

        currentX +=
            yellowSpeed * yellowDirection;

        target.style.left =
            currentX + "px";

    });


    const leftEdge =
        parseFloat(
            yellowTargets[0].style.left
        );


    const lastTarget =
        yellowTargets[yellowTargets.length - 1];


    const rightEdge =
        parseFloat(lastTarget.style.left) +
        lastTarget.offsetWidth;


    if (
        leftEdge <= waterLeft ||
        rightEdge >= waterRight
    ) {

        yellowDirection *= -1;

    }


    requestAnimationFrame(
        moveYellowTargets
    );

}


moveYellowTargets();


/* =========================
   🟢 アヒル 100点
========================= */

const greenTargets = [

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        380,
        420
    ),

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        490,
        420
    ),

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        600,
        420
    ),

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        710,
        420
    ),

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        820,
        420
    ),

];


/* =========================
   🟢 アヒルを左右に動かす
========================= */

let greenDirection = 1;

const greenSpeed = 0.6;


function moveGreenTargets() {

    greenTargets.forEach(function (target) {

        let currentX =
            parseFloat(target.style.left);

        currentX +=
            greenSpeed * greenDirection;

        target.style.left =
            currentX + "px";

    });


    const leftEdge =
        parseFloat(
            greenTargets[0].style.left
        );


    const lastTarget =
        greenTargets[greenTargets.length - 1];


    const rightEdge =
        parseFloat(lastTarget.style.left) +
        lastTarget.offsetWidth;


    if (
        leftEdge <= 290 ||
        rightEdge >= 990
    ) {

        greenDirection *= -1;

    }


    requestAnimationFrame(
        moveGreenTargets
    );

}


moveGreenTargets();


/* =========================
   🟠 アライグマ 300点
========================= */

addTarget(
    "orange-targets",
    "reccoon.png",
    300,
    300,
    550
);

addTarget(
    "orange-targets",
    "reccoon.png",
    300,
    500,
    550
);

addTarget(
    "orange-targets",
    "reccoon.png",
    300,
    700,
    550
);


/* =========================
   Joy-Con接続
========================= */

window.addEventListener(
    "gamepadconnected",
    function (event) {

        console.log(
            "Joy-Con接続:",
            event.gamepad.index,
            event.gamepad.id
        );

    }
);


window.addEventListener(
    "gamepaddisconnected",
    function (event) {

        console.log(
            "Joy-Con切断:",
            event.gamepad.index
        );

    }
);


/* =========================
   的に当たっているか
========================= */
function shootAt(x, y, player) {

    // 30秒経過後は撃てない
    if (gameOver) {
        return;
    }

    const targets =
        document.querySelectorAll(
            "#game img"
        );


    for (const target of targets) {

        // ボード画像は無視
        if (!target.shootTarget) {
            continue;
        }


        // 隠れている的は無視
        if (
            target.style.display === "none"
        ) {
            continue;
        }


        const rect =
            target.getBoundingClientRect();


        const gameRect =
            game.getBoundingClientRect();


        const targetLeft =
            rect.left - gameRect.left;

        const targetTop =
            rect.top - gameRect.top;

        const targetRight =
            targetLeft + rect.width;

        const targetBottom =
            targetTop + rect.height;


        if (
            x >= targetLeft &&
            x <= targetRight &&
            y >= targetTop &&
            y <= targetBottom
        ) {

            target.shootTarget(player);

            return;

        }

    }

}


/* =========================
   Joy-Con操作
========================= */

function updateGamepads() {

    const pads =
        navigator.getGamepads();


    let leftPad = null;
    let rightPad = null;


    /* =========================
       Joy-Conを2台取得
    ========================= */

    for (const pad of pads) {

        if (!pad) {
            continue;
        }


        if (!leftPad) {

            leftPad = pad;

        }

        else if (!rightPad) {

            rightPad = pad;

        }

    }


    /* =========================
       左Joy-Con
       
       axes 0,1
       button 13 = ▼
    ========================= */

    if (leftPad) {

        const axisX =
            leftPad.axes[0] || 0;

        const axisY =
            leftPad.axes[1] || 0;


        leftX +=
            axisX * cursorSpeed;

        leftY +=
            axisY * cursorSpeed;


        // ゲーム画面内に制限
        leftX =
            Math.max(
                0,
                Math.min(991, leftX)
            );

        leftY =
            Math.max(
                0,
                Math.min(711, leftY)
            );


        leftCursor.style.left =
            leftX + "px";

        leftCursor.style.top =
            leftY + "px";


        /* 発射 */

        const fireButton =
            leftPad.buttons[13];


        if (
            fireButton &&
            fireButton.pressed &&
            !leftFirePressed
        ) {

            shootAt(
                leftX,
                leftY,
                "left"
            );

        }


        leftFirePressed =
            fireButton ?
                fireButton.pressed :
                false;

    }


    /* =========================
       右Joy-Con
       
       axes 2,3
       button 3
    ========================= */

    if (rightPad) {

        const axisX =
            rightPad.axes[2] || 0;

        const axisY =
            rightPad.axes[3] || 0;


        rightX +=
            axisX * cursorSpeed;

        rightY +=
            axisY * cursorSpeed;


        // ゲーム画面内に制限
        rightX =
            Math.max(
                0,
                Math.min(991, rightX)
            );

        rightY =
            Math.max(
                0,
                Math.min(711, rightY)
            );


        rightCursor.style.left =
            rightX + "px";

        rightCursor.style.top =
            rightY + "px";


        /* 発射 */

        const fireButton =
            rightPad.buttons[3];


        if (
            fireButton &&
            fireButton.pressed &&
            !rightFirePressed
        ) {

            shootAt(
                rightX,
                rightY,
                "right"
            );

        }


        rightFirePressed =
            fireButton ?
                fireButton.pressed :
                false;

    }


    requestAnimationFrame(
        updateGamepads
    );

}


updateGamepads();


/* =========================
   初期得点
========================= */

updateScores();

/* =========================
   スタートボタン
========================= */

const startButton =
    document.getElementById("start-button");

const startScreen =
    document.getElementById("start-screen");

const countdown =
    document.getElementById("countdown");



/* =========================
   試し撃ち用の大きな的2つ
========================= */

const practiceTarget1 = addTarget(
    "practice-targets",
    "練習的.png",
    0,
    20,
    250,
    650
);

const practiceTarget2 = addTarget(
    "practice-targets",
    "練習的.png",
    0,
    430,
    250,
    650
);


/* 最初は隠す */

practiceTarget1.style.display = "none";
practiceTarget2.style.display = "none";


/* =========================
   STARTボタン
========================= */

startButton.addEventListener("click", function () {

    /* STARTボタンだけ消す */

    startButton.style.display = "none";


    /* =========================
       試し撃ち開始
    ========================= */

    practiceMode = true;
    gameStarted = false;
    gameOver = false;


    /* 大きな的を表示 */

    practiceTarget1.style.display = "block";
    practiceTarget2.style.display = "block";


    /* =========================
       5秒後
    ========================= */

    setTimeout(function () {

     /* =========================
         試し撃ち終了
     ========================= */

    practiceMode = false;


     /* =========================
         練習の的を完全に消す
     ========================= */

    practiceTarget1.style.display = "none";
    practiceTarget2.style.display = "none";


     // 念のため親コンテナも一時的に隠す
    practiceTarget1.parentElement.style.display = "none";


    /* =========================
      スタート背景を消す
    ========================= */

    startScreen.style.display = "none";


    /* =========================
       カウントダウン開始
    ========================= */

    countdown.style.display = "flex";

    let count = 3;

    countdown.textContent = count;
    


        /* 3 → 2 → 1 */

        const countdownTimer =
            setInterval(function () {

                count--;

                if (count > 0) {

                    countdown.textContent =
                        count;

                } else {

                    clearInterval(countdownTimer);


                    /* カウントダウン終了 */

                    countdown.style.display =
                        "none";


                    /* =========================
                       幕を開ける
                    ========================= */

                    gameArea.classList.add(
                        "curtain-open"
                    );


                    /* =========================
                       本番開始
                    ========================= */

                    gameStarted = true;
                    gameOver = false;


                    /* 練習用コンテナを完全に消したままにする */

                    practiceTarget1.parentElement.style.display = "none";



                    /* =========================
                       本番用の的を全部表示
                    ========================= */

                    document.querySelectorAll("#game img").forEach(function (target) {

                        if (target.shootTarget) {
                            target.style.display = "block";
                        }

                    });


                    /* 30秒タイマー開始 */

                    startGameTimer();

                }

            }, 1000);

    }, 5000);

});
function showFinalScore() {

    // すでに結果画面があれば作らない
    if (document.getElementById("final-score")) {
        return;
    }

    const finalScore = document.createElement("div");

    finalScore.id = "final-score";

    finalScore.innerHTML = `
        <div class="final-title">RESULT</div>
        <div class="final-left">LEFT　${leftScore} POINTS</div>
        <div class="final-right">RIGHT　${rightScore} POINTS</div>
    `;

    gameArea.appendChild(finalScore);
}