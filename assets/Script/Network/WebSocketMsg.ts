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

    spinBall: {
        "type": "St03",
        "data": "spinball"
    },

    ballResults: {
        "type": "Result",
        "data": [1, 2, 3, 4]
    },

    numberConfirm: {
        "type": "St04",
        "data": "confirm"
    },

    gameEnd: {
        "type": "St05",
        "data": "end"
    },

    gameErr: {
        "type": "error",
        "data": ""
    }



}

