const hitSound = new Audio("pon.mp3");

/* =========================================================
   2人プレイ・シューティングゲーム
   マウス + Joy-Con 2台
========================================================= */
const practiceTargets = document.getElementById("practice-targets");
const practiceText = document.getElementById("practice-text");

// 最初は練習画面を完全に隠す
practiceTargets.style.display = "none";
practiceText.style.display = "none";

/* =========================================================
   ゲーム状態
========================================================= */

let timeLeft = 30;
let gameOver = false;
let gameStarted = false;
let practiceMode = false;
let gameTimer = null;

/* =========================================================
   HTML要素
========================================================= */

const gameArea = document.getElementById("game");

let scoreText = document.getElementById("score");
let timerText = document.getElementById("timer");

/* score / timer がHTMLに無くても自動作成 */
if (!scoreText) {
    scoreText = document.createElement("div");
    scoreText.id = "score";
    scoreText.textContent = "LEFT: 0     RIGHT: 0";
    document.body.insertBefore(scoreText, gameArea);
}

if (!timerText) {
    timerText = document.createElement("div");
    timerText.id = "timer";
    timerText.textContent = "Time: 30";
    document.body.insertBefore(timerText, gameArea);
}

/* =========================================================
   得点
========================================================= */

let leftScore = 0;
let rightScore = 0;

function updateScores() {

    scoreText.textContent =
        "LEFT: " + leftScore +
        "     RIGHT: " + rightScore;

}

/* =========================================================
   Joy-Con照準
========================================================= */

const leftCursor = document.createElement("div");
const rightCursor = document.createElement("div");

leftCursor.className =
    "player-cursor left-cursor";

rightCursor.className =
    "player-cursor right-cursor";

leftCursor.textContent = "🩷";
rightCursor.textContent = "🩵";

gameArea.appendChild(leftCursor);
gameArea.appendChild(rightCursor);

/* =========================================================
   照準位置
========================================================= */

let leftX = 300;
let leftY = 300;

let rightX = 700;
let rightY = 300;

const cursorSpeed = 5;

/* =========================================================
   発射ボタン
========================================================= */

let leftFirePressed = false;
let rightFirePressed = false;

/* =========================================================
   的を作る共通関数
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
        console.error(
            "的の入れ物がありません:",
            containerId
        );
        return null;
    }

    const target =
        document.createElement("img");

    target.src = imageFile;

    target.classList.add(
        "shooting-target"
    );

    target.style.position =
        "absolute";

    target.style.left =
        x + "px";

    target.style.top =
        y + "px";

    target.style.width =
        size + "px";

    target.style.height =
        "auto";

    target.style.cursor =
        "crosshair";

    /* =====================================================
       的を撃つ
    ===================================================== */

    function shootTarget(player) {

        if (
            target.style.display ===
            "none"
        ) {
            return;
        }

    hitSound.currentTime = 0;
    hitSound.play();

 /* -------------------------
   練習モード
------------------------- */

if (practiceMode) {

    // 撃った場所にインクを付ける
    createInk(
        target,
        window.currentShotX,
        window.currentShotY,
        player
    );

    // 的は消さない
    return;
}

        /* -------------------------
           ゲーム開始前・終了後
        ------------------------- */

        if (
            !gameStarted ||
            gameOver
        ) {
            return;
        }

        /* -------------------------
           得点
        ------------------------- */

        if (player === "left") {
            leftScore += points;
        }

        if (player === "right") {
            rightScore += points;
        }

        updateScores();

        /* -------------------------
           的が倒れる
        ------------------------- */

        target.classList.add(
            "fall-back"
        );

        setTimeout(function () {

            target.style.display =
                "none";

            target.classList.remove(
                "fall-back"
            );

        }, 600);

        /* -------------------------
           5秒後に復活
        ------------------------- */

        setTimeout(function () {

            if (
                gameStarted &&
                !gameOver
            ) {

                target.style.display =
                    "block";

            }

        }, 5000);

    }

    /* =====================================================
       マウスクリック
    ===================================================== */

    target.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            if (gameOver) {
                return;
            }

            const gameRect =
                gameArea.getBoundingClientRect();

            const clickX =
                event.clientX -
                gameRect.left;

            const clickY =
                event.clientY -
                gameRect.top;

            /* 透明部分ならハズレ */

            if (
                !isVisiblePixel(
                    target,
                    clickX,
                    clickY
                )
            ) {
                return;
            }

            shootTarget("left");

        }
    );

    /* Joy-Conから使うため保存 */

    target.shootTarget =
        shootTarget;

    container.appendChild(
        target
    );

    return target;
}

/* =========================================================
   画像の透明部分を判定
========================================================= */

function isVisiblePixel(
    target,
    gameX,
    gameY
) {

    const gameRect =
        gameArea.getBoundingClientRect();

    const targetRect =
        target.getBoundingClientRect();

    const screenX =
        gameRect.left + gameX;

    const screenY =
        gameRect.top + gameY;

    if (
        screenX < targetRect.left ||
        screenX > targetRect.right ||
        screenY < targetRect.top ||
        screenY > targetRect.bottom
    ) {

        return false;

    }

    if (
        !target.complete ||
        target.naturalWidth === 0 ||
        target.naturalHeight === 0
    ) {

        return false;

    }

    const imageX =
        Math.floor(
            (screenX - targetRect.left) *
            target.naturalWidth /
            targetRect.width
        );

    const imageY =
        Math.floor(
            (screenY - targetRect.top) *
            target.naturalHeight /
            targetRect.height
        );

    const canvas =
        document.createElement("canvas");

    canvas.width =
        target.naturalWidth;

    canvas.height =
        target.naturalHeight;

    const ctx =
        canvas.getContext("2d");

    try {

        ctx.drawImage(
            target,
            0,
            0
        );

        const pixel =
            ctx.getImageData(
                imageX,
                imageY,
                1,
                1
            ).data;

        return pixel[3] >= 50;

    } catch (error) {

        console.log(
            "透明部分判定エラー",
            error
        );

        return true;

    }

}

/* =========================================================
   Joy-Con / 照準が的に当たったか
========================================================= */

function shootAt(
    x,
    y,
    player
) {

    if (
    (!gameStarted && !practiceMode) ||
    gameOver
) {
    return;
}

    const targets =
        document.querySelectorAll(
            ".shooting-target"
        );

    targets.forEach(
        function (target) {

            if (
                target.style.display ===
                "none"
            ) {
                return;
            }

if (
    !isVisiblePixel(
        target,
        x,
        y
    )
) {
    return;
}

/* 撃った場所を保存 */

window.currentShotX = x;
window.currentShotY = y;

if (
    typeof target.shootTarget ===
    "function"
) {

    target.shootTarget(
        player
    );

}

        
        }
    );

}

/* =========================================================
   練習モード・インクエフェクト
========================================================= */

function createInk(
    target,
    gameX,
    gameY,
    player
) {

    const container =
        document.getElementById(
            "practice-targets"
        );

    if (!container) {
        return;
    }

    /* 的の位置を取得 */

    const targetLeft =
        parseFloat(target.style.left);

    const targetTop =
        parseFloat(target.style.top);

    /* 的の中での位置 */

    const inkX =
        gameX - targetLeft;

    const inkY =
        gameY - targetTop;

    /* インク */

    const ink =
        document.createElement("div");

    ink.className =
        "practice-ink";

    /* 左＝ピンク */

    if (player === "left") {

        ink.style.background =
            "#ff69b4";

    }

    /* 右＝水色 */

    if (player === "right") {

        ink.style.background =
            "#55dfff";

    }

    /* インクの大きさ */

    const size =
        35 + Math.random() * 25;

    ink.style.width =
        size + "px";

    ink.style.height =
        size + "px";

    /* 撃った位置 */

    ink.style.left =
        (targetLeft + inkX - size / 2) +
        "px";

    ink.style.top =
        (targetTop + inkY - size / 2) +
        "px";

    /* 少しランダムに傾ける */

    ink.style.transform =
        `rotate(${Math.random() * 360}deg)`;

    container.appendChild(
        ink
    );

    /* 小さい飛び散りを追加 */

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const splat =
            document.createElement("div");

        splat.className =
            "practice-ink-splat";

        if (player === "left") {

            splat.style.background =
                "#ff69b4";

        }
        else {

            splat.style.background =
                "#55dfff";

        }

        const splatSize =
            6 + Math.random() * 12;

        const angle =
            Math.random() *
            Math.PI * 2;

        const distance =
            25 + Math.random() * 35;

        const sx =
            Math.cos(angle) *
            distance;

        const sy =
            Math.sin(angle) *
            distance;

        splat.style.width =
            splatSize + "px";

        splat.style.height =
            splatSize + "px";

        splat.style.left =
            (
                targetLeft +
                inkX +
                sx -
                splatSize / 2
            ) + "px";

        splat.style.top =
            (
                targetTop +
                inkY +
                sy -
                splatSize / 2
            ) + "px";

        container.appendChild(
            splat
        );

    }

}

/* =========================================================
   🔵 レックス 500点
========================================================= */

const rex1 = addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    230,
    200
);

const rex2 = addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    370,
    200
);

const rex3 = addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    510,
    200
);

const rex4 = addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    650,
    200
);

const rexTargets = [
    rex1,
    rex2,
    rex3,
    rex4
].filter(Boolean);

let rexDirection = 1;
let rexSteps = 0;

/* =========================================================
   レックス移動
========================================================= */

setInterval(
    function () {

        rexTargets.forEach(
            function (rex) {

                const currentX =
                    parseFloat(
                        rex.style.left
                    );

                rex.style.transition =
                    "left 2s ease-in-out";

                rex.style.left =
                    (
                        currentX +
                        10 *
                        rexDirection
                    ) + "px";

                rex.classList.remove(
                    "rex-jump"
                );

                void rex.offsetWidth;

                rex.classList.add(
                    "rex-jump"
                );

            }
        );

        rexSteps++;

        if (rexSteps >= 3) {

            rexDirection *= -1;
            rexSteps = 0;

        }

    },
    2000
);

/* =========================================================
   🟣 ブルズアイ 400点
========================================================= */

const purple =
    addTarget(
        "purple-targets",
        "bullseye.png",
        400,
        650,
        200,
        150
    );

if (purple) {

    purple.style.display =
        "none";

    purple.shootTarget =
        function (player) {

            if (
                purple.style.display ===
                "none"
            ) {
                return;
            }

            if (practiceMode) {

                purple.style.display =
                    "none";

                setTimeout(
                    function () {

                        if (practiceMode) {

                            purple.style.display =
                                "block";

                        }

                    },
                    500
                );

                return;
            }

            if (
                !gameStarted ||
                gameOver
            ) {
                return;
            }

            if (player === "left") {
                leftScore += 400;
            }

            if (player === "right") {
                rightScore += 400;
            }

            updateScores();

            purple.style.display =
                "none";

            setTimeout(
                function () {

                    if (
                        gameStarted &&
                        !gameOver
                    ) {

                        purple.style.display =
                            "block";

                    }

                },
                5000
            );

        };

    /* 5秒後に登場 */

    setTimeout(
        function () {

            if (
                gameStarted &&
                !gameOver
            ) {

                purple.style.display =
                    "block";

            }

        },
        5000
    );

}

/* =========================================================
   🔴 ハム 100点
========================================================= */

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    550,
    300
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    660,
    300
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    780,
    300
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    900,
    300
);

/* =========================================================
   🟡 黄色のアヒル
========================================================= */

const yellowTargets = [

    addTarget(
        "yellow-targets",
        "アヒル100.png",
        100,
        520,
        350
    ),

    addTarget(
        "yellow-targets",
        "アヒル100.png",
        100,
        600,
        350
    ),

    addTarget(
        "yellow-targets",
        "アヒル100.png",
        100,
        680,
        350
    ),

    addTarget(
        "yellow-targets",
        "アヒル100.png",
        100,
        760,
        350
    ),

    addTarget(
        "yellow-targets",
        "アヒル100.png",
        100,
        840,
        350
    )

].filter(Boolean);

let yellowDirection = 1;

const yellowSpeed = 0.4;

const waterLeft = 500;
const waterRight = 1000;

function moveYellowTargets() {

    yellowTargets.forEach(
        function (target) {

            let currentX =
                parseFloat(
                    target.style.left
                );

            currentX +=
                yellowSpeed *
                yellowDirection;

            target.style.left =
                currentX + "px";

        }
    );

    if (
        yellowTargets.length === 0
    ) {
        return;
    }

    const leftEdge =
        parseFloat(
            yellowTargets[0].style.left
        );

    const lastTarget =
        yellowTargets[
            yellowTargets.length - 1
        ];

    const rightEdge =
        parseFloat(
            lastTarget.style.left
        ) +
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

/* =========================================================
   🟢 緑のアヒル
========================================================= */

const greenTargets = [

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        520,
        400
    ),

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        600,
        400
    ),

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        680,
        400
    ),

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        760,
        400
    ),

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        840,
        400
    )

].filter(Boolean);

let greenDirection = 1;

const greenSpeed = 0.6;

function moveGreenTargets() {

    greenTargets.forEach(
        function (target) {

            let currentX =
                parseFloat(
                    target.style.left
                );

            currentX +=
                greenSpeed *
                greenDirection;

            target.style.left =
                currentX + "px";

        }
    );

    if (
        greenTargets.length === 0
    ) {
        return;
    }

    const leftEdge =
        parseFloat(
            greenTargets[0].style.left
        );

    const lastTarget =
        greenTargets[
            greenTargets.length - 1
        ];

    const rightEdge =
        parseFloat(
            lastTarget.style.left
        ) +
        lastTarget.offsetWidth;

    if (
        leftEdge <= waterLeft ||
        rightEdge >= waterRight
    ) {

        greenDirection *= -1;

    }

    requestAnimationFrame(
        moveGreenTargets
    );

}

moveGreenTargets();

/* =========================================================
   🟠 アライグマ 300点
========================================================= */

addTarget(
    "orange-targets",
    "reccoon.png",
    300,
    250,
    460,
    250
);

addTarget(
    "orange-targets",
    "reccoon.png",
    300,
    450,
    460,
    250
);

addTarget(
    "orange-targets",
    "reccoon.png",
    300,
    650,
    460,
    250
);

/* =========================================================
   🐦 ことり 1000点
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
   🐔 ニワトリ 500点
========================================================= */

const chicken =
    addTarget(
        "chicken-targets",
        "ニワトリ.png",
        500,
        100,
        430,
        200
    );

function moveChicken() {

    if (!chicken) {
        return;
    }

    chicken.style.transition =
        "none";

    chicken.style.left =
        "-150px";

    setTimeout(
        function () {

            if (!gameOver) {

                chicken.style.transition =
                    "left 7s linear";

                chicken.style.left =
                    "991px";

            }

        },
        50
    );

}

moveChicken();

setInterval(
    function () {

        if (!gameOver) {
            moveChicken();
        }

    },
    7000
);

/* =========================================================
   Joy-Con接続
========================================================= */

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

/* =========================================================
   Joy-Con操作
========================================================= */

function updateGamepads() {

    const pads = navigator.getGamepads();

    let leftPad = null;
    let rightPad = null;

/* =========================================================
   🐰 うさぎ 300点
   レックスのように跳ねながら横移動
========================================================= */

const rabbit =
    addTarget(
        "rabbit-targets",
        "うさぎ.png",
        300,
        250,
        250,
        170
    );

let rabbitDirection = 1;
let rabbitSteps = 0;

function moveRabbit() {

    if (!rabbit) {
        return;
    }

    const currentX =
        parseFloat(rabbit.style.left);

    rabbit.style.transition =
        "left 1.5s ease-in-out";

    rabbit.style.left =
        (
            currentX +
            120 * rabbitDirection
        ) + "px";

    /* 跳ねる */

    rabbit.classList.remove(
        "rabbit-jump"
    );

    void rabbit.offsetWidth;

    rabbit.classList.add(
        "rabbit-jump"
    );

    rabbitSteps++;

    if (rabbitSteps >= 1) {

        rabbitDirection *= -1;
        rabbitSteps = 0;

    }

}

/* 1.5秒ごとに移動 */

setInterval(
    moveRabbit,
    1500
);

/* =========================================================
   🐱 猫 400点
   固定
========================================================= */

addTarget(
    "cat-targets",
    "ねこ.png",
    400,
    900,
    230,
    180
);

/* =========================================================
   🐐 やぎ 600点
   山を登るように移動
========================================================= */

const goat =
    addTarget(
        "goat-targets",
        "やぎ.png",
        600,
        350,
        650,
        180
    );

let goatStep = 0;

function moveGoat() {

    if (!goat) {
        return;
    }

    goatStep++;

    /*
       山を登っていく
       左下 → 右上
    */

    const goatX =
        350 + goatStep * 70;

    const goatY =
        650 - goatStep * 45;

    goat.style.transition =
        "left 1.2s ease-in-out, top 1.2s ease-in-out";

    goat.style.left =
        goatX + "px";

    goat.style.top =
        goatY + "px";

    /* 右上まで行ったら最初に戻る */

    if (goatStep >= 7) {

        goatStep = 0;

        setTimeout(
            function () {

                goat.style.transition =
                    "none";

                goat.style.left =
                    "350px";

                goat.style.top =
                    "650px";

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
   🦖 レクサー 500点
   固定
========================================================= */

addTarget(
    "rexer-targets",
    "レクサー.png",
    500,
    1100,
    180,
    200
);

/* =========================================================
   🐦 スズメ 500点
   空を飛ぶように横移動
========================================================= */

const sparrow =
    addTarget(
        "sparrow-targets",
        "スズメ.png",
        500,
        300,
        100,
        120
    );

let sparrowDirection = 1;

function moveSparrow() {

    if (!sparrow) {
        return;
    }

    const currentX =
        parseFloat(
            sparrow.style.left
        );

    sparrow.style.transition =
        "left 3s ease-in-out";

    sparrow.style.left =
        (
            currentX +
            300 * sparrowDirection
        ) + "px";

    /* 端まで行ったら反対方向 */

    if (
        currentX >= 1000
    ) {

        sparrowDirection = -1;

    }

    if (
        currentX <= 200
    ) {

        sparrowDirection = 1;

    }

}

setInterval(
    moveSparrow,
    3000
);

    /* -----------------------------------------
       接続されているJoy-Conを2台取得
    ----------------------------------------- */

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

    /* =====================================================
       左Joy-Con
    ===================================================== */

    if (leftPad) {

        /* 左Joy-Conのスティック */

        const axisX =
            Math.abs(leftPad.axes[0]) > 0.15
                ? leftPad.axes[0]
                : 0;

        const axisY =
            Math.abs(leftPad.axes[1]) > 0.15
                ? leftPad.axes[1]
                : 0;

        leftX += axisX * cursorSpeed;
        leftY += axisY * cursorSpeed;

        /* 画面外に出ないようにする */

        leftX =
            Math.max(
                0,
                Math.min(1024, leftX)
            );

        leftY =
            Math.max(
                0,
                Math.min(661, leftY)
            );

        /* 照準を移動 */

        leftCursor.style.left =
            leftX + "px";

        leftCursor.style.top =
            leftY + "px";

        /* -----------------------------------------
           左Joy-Conのボタン
           どのボタンでも発射
        ----------------------------------------- */

        let leftPressed = false;

        for (
            let i = 0;
            i < leftPad.buttons.length;
            i++
        ) {

            if (
                leftPad.buttons[i] &&
                leftPad.buttons[i].pressed
            ) {

                leftPressed = true;
                break;

            }

        }

        /* 押した瞬間だけ発射 */

        if (
            leftPressed &&
            !leftFirePressed
        ) {

            console.log(
                "LEFT FIRE",
                leftX,
                leftY
            );

            shootAt(
                leftX,
                leftY,
                "left"
            );

        }

        leftFirePressed =
            leftPressed;

    }

    /* =====================================================
       右Joy-Con
    ===================================================== */

    if (rightPad) {

        /* 右Joy-Conも axes 0,1 */

        const axisX =
            Math.abs(rightPad.axes[0]) > 0.15
                ? rightPad.axes[0]
                : 0;

        const axisY =
            Math.abs(rightPad.axes[1]) > 0.15
                ? rightPad.axes[1]
                : 0;

        rightX += axisX * cursorSpeed;
        rightY += axisY * cursorSpeed;

        /* 画面外に出ないようにする */

        rightX =
            Math.max(
                0,
                Math.min(1024, rightX)
            );

        rightY =
            Math.max(
                0,
                Math.min(661, rightY)
            );

        /* 照準を移動 */

        rightCursor.style.left =
            rightX + "px";

        rightCursor.style.top =
            rightY + "px";

        /* -----------------------------------------
           右Joy-Conのボタン
           どのボタンでも発射
        ----------------------------------------- */

        let rightPressed = false;

        for (
            let i = 0;
            i < rightPad.buttons.length;
            i++
        ) {

            if (
                rightPad.buttons[i] &&
                rightPad.buttons[i].pressed
            ) {

                rightPressed = true;
                break;

            }

        }

        /* 押した瞬間だけ発射 */

        if (
            rightPressed &&
            !rightFirePressed
        ) {

            console.log(
                "RIGHT FIRE",
                rightX,
                rightY
            );

            shootAt(
                rightX,
                rightY,
                "right"
            );

        }

        rightFirePressed =
            rightPressed;

    }

    requestAnimationFrame(
        updateGamepads
    );

}

updateGamepads();
/* =========================================================
   30秒タイマー
========================================================= */

function startGameTimer() {

    if (gameTimer) {

        clearInterval(
            gameTimer
        );

    }

    timeLeft = 30;

    gameOver = false;

    timerText.textContent =
        "Time: 30";

    gameTimer =
        setInterval(
            function () {

                timeLeft--;

                timerText.textContent =
                    "Time: " +
                    timeLeft;

                /* 残り5秒 */

                if (
                    timeLeft <= 5 &&
                    timeLeft > 0
                ) {

                    showGameCountdown(
                        timeLeft
                    );

                }

                /* 0秒 */

                if (
                    timeLeft <= 0
                ) {

                    clearInterval(
                        gameTimer
                    );

                    gameTimer = null;

                    gameOver = true;
                    gameStarted = false;

                    timerText.textContent =
                        "Time: 0";

                    hideGameCountdown();

                    /* 上下の幕を閉める */

                    gameArea.classList.remove(
                        "curtain-open"
                    );

                    gameArea.classList.add(
                        "curtain-close"
                    );

                    /* 0.8秒後に結果 */

                    setTimeout(
                        function () {

                            showFinalScore();

                        },
                        800
                    );

                }

            },
            1000
        );

}

/* =========================================================
   残り5秒カウントダウン
========================================================= */

function showGameCountdown(number) {

    let element =
        document.getElementById(
            "game-countdown"
        );

    if (!element) {

        element =
            document.createElement(
                "div"
            );

        element.id =
            "game-countdown";

        gameArea.appendChild(
            element
        );

    }

    element.textContent =
        number;

    element.style.display =
        "flex";

}

function hideGameCountdown() {

    const element =
        document.getElementById(
            "game-countdown"
        );

    if (element) {

        element.style.display =
            "none";

    }

}

/* =========================================================
   スタート画面
========================================================= */

const startButton =
    document.getElementById(
        "start-button"
    );

const startScreen =
    document.getElementById(
        "start-screen"
    );

const countdown =
    document.getElementById(
        "countdown"
    );

/* =========================================================
   練習用の的
========================================================= */

const practiceTarget1 =
    addTarget(
        "practice-targets",
        "練習的.png",
        0,
        -80,
        130,
        700
    );

const practiceTarget2 =
    addTarget(
        "practice-targets",
        "練習的.png",
        0,
        380,
        130,
        700
    );

if (practiceTarget1) {

    practiceTarget1.style.display =
        "none";

}

if (practiceTarget2) {

    practiceTarget2.style.display =
        "none";

}

/* =========================================================
   STARTボタン
========================================================= */

if (startButton) {

    startButton.addEventListener(
        "click",
        function () {

            console.log(
                "STARTボタンが押されました"
            );

            /* 二重スタート防止 */

            if (
                practiceMode ||
                gameStarted
            ) {
                return;
            }

            /* STARTボタンを消す */

            startButton.style.display =
                "none";

/* 状態 */

practiceMode = true;
gameStarted = false;
gameOver = false;

/* 練習画面全体を表示 */

practiceTargets.style.display = "block";

/* 練習用の的を表示 */

if (practiceTarget1) {

    practiceTarget1.style.display =
        "block";

}

if (practiceTarget2) {

    practiceTarget2.style.display =
        "block";

}

/* 「的をねらって！」を表示 */

practiceText.style.display = "block";

            /* 10秒後 */

            setTimeout(
                function () {

                    /* 練習終了 */

                    practiceMode =
                        false;

                    /* 練習の的を消す */

                    if (practiceTarget1) {

                        practiceTarget1.style.display =
                            "none";

                    }

                    if (practiceTarget2) {

                        practiceTarget2.style.display =
                            "none";

                    }

                    const practiceContainer =
                        document.getElementById(
                            "practice-targets"
                        );

                    if (practiceContainer) {

                        practiceContainer.style.display =
                            "none";

                    }

                    /* 練習文字も消す */

                    const practiceText =
                        document.getElementById(
                            "practice-text"
                        );

                    if (practiceText) {

                        practiceText.style.display =
                            "none";

                    }

                    /* スタート背景を消す */

                    if (startScreen) {

                        startScreen.style.display =
                            "none";

                    }

                    /* 3・2・1 */

                    if (countdown) {

                        countdown.style.display =
                            "flex";

                        let count = 3;

                        countdown.textContent =
                            count;

                        const countdownTimer =
                            setInterval(
                                function () {

                                    count--;

                                    if (
                                        count > 0
                                    ) {

                                        countdown.textContent =
                                            count;

                                    }

                                    else {

                                        clearInterval(
                                            countdownTimer
                                        );

                                        countdown.style.display =
                                            "none";

                                        /* 幕を開ける */

                                        gameArea.classList.remove(
                                            "curtain-close"
                                        );

                                        gameArea.classList.add(
                                            "curtain-open"
                                        );

                                        /* 本番開始 */

                                        gameStarted =
                                            true;

                                        gameOver =
                                            false;

                                        /* 得点リセット */

                                        leftScore =
                                            0;

                                        rightScore =
                                            0;

                                        updateScores();

                                        /* タイマー開始 */

                                        startGameTimer();

                                        /* 本番用の的を表示 */

                                        document
                                            .querySelectorAll(
                                                "#game img.shooting-target"
                                            )
                                            .forEach(
                                                function (target) {

                                                    if (
                                                        target !==
                                                        practiceTarget1 &&
                                                        target !==
                                                        practiceTarget2
                                                    ) {

                                                        target.style.display =
                                                            "block";

                                                    }

                                                }
                                            );

                                    }

                                },
                                1000
                            );

                    }

                },
                10000
            );

        }
    );

}
else {

    console.error(
        "STARTボタンが見つかりません"
    );

}

/* =========================================================
   最終得点
========================================================= */

function showFinalScore() {

    const finalCurtain =
        document.getElementById(
            "final-curtain"
        );

    if (finalCurtain) {

        finalCurtain.classList.add(
            "open"
        );

    }

    setTimeout(
        function () {

            if (
                document.getElementById(
                    "final-score"
                )
            ) {
                return;
            }

            const finalScore =
                document.createElement(
                    "div"
                );

            finalScore.id =
                "final-score";

            finalScore.innerHTML = `
                <div class="final-left">
                    ${leftScore}
                </div>

                <div class="final-right">
                    ${rightScore}
                </div>
            `;

            gameArea.appendChild(
                finalScore
            );

        },
        900
    );

}

/* =========================================================
   画面いっぱいに表示
========================================================= */

function resizeGame() {

    const game =
        document.getElementById("game");

    if (!game) return;

    const GAME_WIDTH = 1024;
    const GAME_HEIGHT = 661;

    /* -----------------------------------------
       MacBook画面に合わせて倍率を計算
    ----------------------------------------- */

    const scaleX =
        window.innerWidth / GAME_WIDTH;

    const scaleY =
        window.innerHeight / GAME_HEIGHT;

    const scale =
        Math.min(scaleX, scaleY);

    /* -----------------------------------------
       ゲーム本体
    ----------------------------------------- */

    game.style.width =
        GAME_WIDTH + "px";

    game.style.height =
        GAME_HEIGHT + "px";

    /* -----------------------------------------
       ゲーム全体を拡大・縮小
    ----------------------------------------- */

    game.style.transform =
        "scale(" + scale + ")";

    /* -----------------------------------------
       画面の中央に配置
    ----------------------------------------- */

    game.style.left =
        ((window.innerWidth -
        GAME_WIDTH * scale) / 2) + "px";

    game.style.top =
        ((window.innerHeight -
        GAME_HEIGHT * scale) / 2) + "px";
}

/* 画面サイズが変わったとき */
window.addEventListener(
    "resize",
    resizeGame
);

/* 最初に実行 */
resizeGame();
    
/* =========================================================
   初期化
========================================================= */

updateScores();

console.log(
    "ゲームプログラム読み込み完了"
);
