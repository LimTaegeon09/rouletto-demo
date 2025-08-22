import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

export const evtNode = {
    uiManager: 'uiManager',
    commonManager: 'commonManager',
    commonBtns: 'commonBtns',
    basicPanel: 'basicPanel',
    fourSumPanel: 'fourSumPanel',
    jackpotPanel: 'jackpotPanel',
    popupManager: 'popupManager',
};

export const evtFunc = {
    setPanelActive: 'setPanelActive',
    ballResults: 'ballResults',
    clearBasic: 'clearBasic',
    clearFourSum: 'clearFourSum',
    clearJackpot: 'clearJackpot',
    doubleBetting: 'doubleBetting',
    loadBettingHistory: 'loadBettingHistory',
    undoBetting: 'undoBetting',
    addBasicBet: 'addBasicBet',
    subBasicBet: 'subBasicBet',
    addWin: 'addWin',
    addFourSumBet: 'addFourSumBet',
    subFourSumBet: 'subFourSumBet',
    addJackpotBet: 'addJackpotBet',
    subJackpotBet: 'subJackpotBet',
    addPageRecord: 'addPageRecord',
    removePageRecord: 'removePageRecord',
    gameEnd: 'gameEnd',
    bettingEnd: 'bettingEnd',
    openExitPopup: 'openExitPopup',
    toggleStreamingPopup: 'toggleStreamingPopup',
    showMaxBet: 'showMaxBet',
    showNotCredit: 'showNotCredit',
}

@ccclass('EventManager')
export class EventManager extends Component {
    private static _instance: EventManager = null;
    public static get instance(): EventManager {
        return this._instance;
    }

    protected onLoad(): void {
        if (EventManager._instance === null) {
            EventManager._instance = this;
        } else {
            this.destroy();
            return;
        }
    }

}


