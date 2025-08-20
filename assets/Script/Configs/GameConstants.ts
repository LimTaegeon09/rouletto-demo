export let GameConstants = {
    WEBSOCKET_URL: '',
    MIN_BET_BASIC: 0,
    MAX_BET_BASIC: 0,
    MIN_BET_FOURSUM: 0,
    MAX_BET_FOURSUM: 0,
    MIN_BET_JACKPOT: 0,
    MIN_PRIZE_JACKPOT: 0,
    INCREMENT_PRIZE_JACKPOT: 0,
    COUNTDOWN_TIME: 0,
    WS_RECONNECTION_TIME: 0,
    INITIAL_USER_CREDIT: 0,
    CHIP_VALUES: []
};

export function initializeConstants(config: any) {
    GameConstants = Object.freeze({ ...config });
}