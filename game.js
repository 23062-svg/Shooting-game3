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

leftCursor.textContent = "🎯";
rightCursor.textContent = "🎯";

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


        if (player === "left") {

            leftScore += points;

        }


        if (player === "right") {

            rightScore += points;

        }


        updateScores();


        // 的を消す
        target.style.display = "none";


        // 3秒後に復活
        setTimeout(function() {

            target.style.display = "block";

        }, 3000);

    }


    /* =========================
       マウスクリック
    ========================= */

    target.addEventListener("click", function(event) {

        event.stopPropagation();

        // マウスは左プレイヤー扱い
        shootTarget("left");

    });


    // Joy-Conから使うため保存
    target.shootTarget = shootTarget;


    container.appendChild(target);

    return target;

}


/* =========================
   🔵 レックス 500点
========================= */

addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    150,
    210
);

addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    270,
    210
);

addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    390,
    210
);

addTarget(
    "blue-targets",
    "レックス500.png",
    500,
    510,
    210
);


/* =========================
   🟣 ブルズアイ 400点
========================= */

const purple = addTarget(
    "purple-targets",
    "ブルズアイ.png",
    400,
    700,
    250
);


// 最初は隠す
purple.style.display = "none";


// 5秒後に出現
setTimeout(function() {

    purple.style.display = "block";

}, 5000);


// ブルズアイ専用
purple.shootTarget = function(player) {

    if (purple.style.display === "none") {
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
    setTimeout(function() {

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
    490,
    260
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    620,
    260
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    750,
    260
);

addTarget(
    "red-targets",
    "ハム100.png",
    100,
    880,
    260
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

    yellowTargets.forEach(function(target) {

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
        400
    ),

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        490,
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
        710,
        400
    ),

    addTarget(
        "green-targets",
        "アヒル100.png",
        100,
        820,
        400
    ),

];


/* =========================
   🟢 アヒルを左右に動かす
========================= */

let greenDirection = 1;

const greenSpeed = 0.6;


function moveGreenTargets() {

    greenTargets.forEach(function(target) {

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
    "アライグマ.png",
    300,
    300,
    550
);

addTarget(
    "orange-targets",
    "アライグマ.png",
    300,
    500,
    550
);

addTarget(
    "orange-targets",
    "アライグマ.png",
    300,
    700,
    550
);


/* =========================
   Joy-Con接続
========================= */

window.addEventListener(
    "gamepadconnected",
    function(event) {

        console.log(
            "Joy-Con接続:",
            event.gamepad.index,
            event.gamepad.id
        );

    }
);


window.addEventListener(
    "gamepaddisconnected",
    function(event) {

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