/**
 * gameStart        St01
 * bettingEnd       St02
 * spinBall         St03
 * ballResults      Result
 * numberConfirm    confirm
 * gameEnd          end
 */

export const WebSocketMsg = {

    isConnected: { "type": "welcome" },

    tableInfo: {
        "type": "Info",
        "data": "RT001"
    },

    gameStart: {
        "type": "St01",
        "data": "newgame"
    },

    bettingEnd: {
        "type": "St02",
        "data": "nomorebet"
    },

    spinReady: {
        "type": "St03",
        "data": "spinready"
    },

    spinBall: {
        "type": "St04",
        "data": "spinball"
    },

    ballResults: {
        "type": "Result",
        "data": [1, 2, 3, 4]
    },

    numberConfirm: {
        "type": "St05",
        "data": "confirm"
    },

    gameEnd: {
        "type": "St06",
        "data": "end"
    },

    errMainOpen: {
        "type": "error",
        "data": "main door open"
    },

    errCasingOpen: {
        "type": "error",
        "data": "casing door open"
    },

    errDisconnect: {
        "type": "error",
        "data": "disconnect"
    },

    errBallNumberFail: {
        "type": "error",
        "data": "ball number fail"
    },
}

