import { _decorator, Component } from 'cc';
import { PREVIEW } from 'cc/env';
import { Console, gameConfig, isPlayableForPREVIEW, moneyConfig } from '../../Configs/Config';
import { sndType, SoundManager } from '../../managers/SoundManager';
import { EventManager, evtFunc, evtNode } from '../EventManager';
import { CommonBtns } from './Common/CommonBtns';
import { CommonManager } from './Common/CommonManager';
import { HistoryManager } from './Common/History/HistoryManager';
import { Timer } from './Common/Timer';
import { BasicPanel } from './Panels/Basic/BasicPanel';
import { BasicPrizeCalculator } from './Panels/Basic/BasicPrizeCalculator';
import { FourSumPanel } from './Panels/FourSum/FourSumPanel';
import { FourSumPrizeCalculator } from './Panels/FourSum/FourSumPrizeCalculator';
import { JackpotPanel } from './Panels/Jackpot/JackpotPanel';
import { PopupManager } from './Popups/PopupManager';
import { PresentationManager } from './Presentation/PresentationManager';
const { ccclass, property } = _decorator;

enum gameState {
    gameStart = 'newgame',
    numberConfirm = 'confirm'
};

@ccclass('UIManager')
export class UIManager extends Component {
    private commonManager: CommonManager = null;
    public commonBtn: CommonBtns = null;

    private historyManager: HistoryManager = null;

    private timer: Timer = null;

    private basicPanel: BasicPanel = null;
    private basicPrizeCalculator: BasicPrizeCalculator = null;

    private fourSumPanel: FourSumPanel = null;
    private fourSumPrizeCalculator: FourSumPrizeCalculator = null;

    private jackpotPanel: JackpotPanel = null;

    private presentationManager: PresentationManager = null;
    private popupManager: PopupManager = null;

    private ballNums: any[] = [];

    private isBettingEndOnce: boolean = true;
    private isGameErrOnce: boolean = true;

    private currentGameState: string = gameState.gameStart;

    protected onLoad(): void {
        const common = this.node.getChildByName('Common');
        this.commonManager = common.getComponent(CommonManager);
        this.commonBtn = common.getComponent(CommonBtns);

        this.historyManager = common.getChildByName('History').getComponent(HistoryManager);
        this.timer = common.getChildByName('Top').getChildByName('Timer').getComponent(Timer);

        const basic = this.node.getChildByName('Basic');
        this.basicPanel = basic.getComponent(BasicPanel);
        this.basicPrizeCalculator = basic.getComponent(BasicPrizeCalculator);

        const fourSum = this.node.getChildByName('FourSum');
        this.fourSumPanel = fourSum.getComponent(FourSumPanel);
        this.fourSumPrizeCalculator = fourSum.getComponent(FourSumPrizeCalculator);

        this.jackpotPanel = this.node.getChildByName('Jackpot').getComponent(JackpotPanel);

        this.presentationManager = this.node.getChildByName('Presentation').getComponent(PresentationManager);
        this.popupManager = this.node.getChildByName('Popup').getComponent(PopupManager);

        ///////////////////////////////////////////////

        EventManager.instance.node.on(evtNode.uiManager, this.evtUIManager, this);
        EventManager.instance.node.on(evtNode.commonManager, this.evtCommonManager, this);
        EventManager.instance.node.on(evtNode.commonBtns, this.evtCommonBtns, this);
    }

    protected start(): void {
        if (PREVIEW && !isPlayableForPREVIEW) {
            this.bettingBtnsUnlock(); // Unlock 함으로써 버튼 테스트
        }
        else {
            this.bettingBtnsLock(); // 정상적으로 Lock
        }
    }

    private evtUIManager(args: any[]) {
        switch (args[0]) {
            case evtFunc.bettingEnd:
                this.bettingEnd();
                break;

            case evtFunc.ballResults:
                // for Test
                this.ballResults(args[1]);
                this.numberConfirm();
                break;

            case evtFunc.gameEnd:
                // for Test
                this.gameEnd();
                break;

            case evtFunc.clearBasic:
                this.clearBasic();
                break;

            case evtFunc.clearFourSum:
                this.clearFourSum();
                break;

            case evtFunc.clearJackpot:
                this.clearJackpot();
                break;

            case evtFunc.showMaxBet:
                this.presentationManager.showMaxBet(args[1], args[2]);
                break;

            case evtFunc.showNotCredit:
                this.presentationManager.showNotCredit(args[1], args[2]);
                break;

            case evtFunc.startCountDown:
                this.presentationManager.startCountDown();
                break;
        }
    }

    private evtCommonManager(args: any[]) {
        switch (args[0]) {
            case evtFunc.addBasicBet:
                this.commonManager.addBasicBet(args[1]);
                break;

            case evtFunc.subBasicBet:
                this.commonManager.subBasicBet(args[1]);
                break;

            case evtFunc.addFourSumBet:
                this.commonManager.addFourSumBet(args[1]);
                break;

            case evtFunc.subFourSumBet:
                this.commonManager.subFourSumBet(args[1]);
                break;

            case evtFunc.addJackpotBet:
                this.commonManager.addJackpotBet();
                break;

            case evtFunc.subJackpotBet:
                this.commonManager.subJackpotBet();
                break;

            case evtFunc.addWin:
                this.commonManager.addWin(args[1]);
                break;
        }
    }

    private evtCommonBtns(args: any[]) {
        switch (args[0]) {
            case evtNode.basicPanel:
                if (args[1] === evtFunc.setPanelActive) this.basicPanel.setPanelActive(args[2]);
                else if (args[1] === evtFunc.doubleBetting) this.basicPanel.doubleBetting();
                else if (args[1] === evtFunc.loadBettingHistory) this.basicPanel.loadBettingHistory();
                else if (args[1] === evtFunc.undoBetting) this.basicPanel.undoBetting();
                break;

            case evtNode.fourSumPanel:
                if (args[1] === evtFunc.setPanelActive) this.fourSumPanel.setPanelActive(args[2]);
                else if (args[1] === evtFunc.doubleBetting) this.fourSumPanel.doubleBetting();
                else if (args[1] === evtFunc.loadBettingHistory) this.fourSumPanel.loadBettingHistory();
                else if (args[1] === evtFunc.undoBetting) this.fourSumPanel.undoBetting();
                break;

            case evtNode.jackpotPanel:
                if (args[1] === evtFunc.setPanelActive) this.jackpotPanel.setPanelActive(args[2]);
                else if (args[1] === evtFunc.loadBettingHistory) this.jackpotPanel.loadBettingHistory();
                else if (args[1] === evtFunc.undoBetting) this.jackpotPanel.undoBetting();
                break;

            case evtNode.popupManager:
                if (args[1] === evtFunc.openExitPopup) this.popupManager.openExitPopup();
                else if (args[1] === evtFunc.toggleStreamingPopup) this.popupManager.toggleStreamingPopup(args[2]);
                else if (args[1] === evtFunc.toggleHelpPopup) this.popupManager.toggleHelpPopup(args[2]);
                break;
        }

        if (args[1] === evtFunc.setPanelActive) {
            if (args[2] === true) this.presentationManager.hideMoneyIssue();
        }
    }

    ///////////////////////////////////////////////

    // "newgame"
    public gameStart() {
        this.currentGameState = gameState.gameStart;

        this.timer.setPlaceYourBet();

        this.bettingBtnsUnlock();

        this.commonManager.initBet();

        if (gameConfig.isJackpotWin) {
            gameConfig.isJackpotWin = false;
            this.commonManager.initJackpotWin();
        }

        this.loadBettingHistory();

        this.presentationManager.endNGS();
        this.presentationManager.startPYB();

        this.popupManager.closeErrorPopup();

        this.isBettingEndOnce = true;
        this.isGameErrOnce = true;

        SoundManager.instance.play(sndType.placeyourbetsplease);
    }

    // "nomorebet"
    public bettingEnd() {
        if (this.isBettingEndOnce) this.isBettingEndOnce = false;
        else return;

        this.timer.setNoMoreBet();
        this.presentationManager.endCountDown();

        this.bettingBtnsLock();

        this.commonManager.initWin();
        this.commonManager.addJackpotWin(this.jackpotPanel.getIsBetting());

        this.saveBettingHistory();

        this.presentationManager.startNMB();

        SoundManager.instance.play(sndType.nomorebets);
    }

    // "spinready"
    public spinReady() {
        if (!this.popupManager.errorPopupNode.active) {
            this.commonBtn.setStreamingToggle(true);
        }
    }

    // "spinball"
    public spinBall() { }

    // [1, 2, 3, 4]
    public ballResults(data: any) {
        let parsedData: any;

        if (typeof data === 'string') {
            try {
                parsedData = JSON.parse(data);
            }
            catch (error) {
                console.error("데이터 파싱 실패: 잘못된 JSON 문자열입니다.", data, error);
                this.ballNums = [];
                return;
            }
        }
        else parsedData = data;

        if (Array.isArray(parsedData)) {
            if (parsedData.every(item => typeof item === 'number')) {
                this.ballNums = parsedData;
            }
            else {
                console.warn("배열에 숫자가 아닌 값이 포함되어 있어 빈 배열로 처리합니다.", parsedData);
                this.ballNums = [];
            }
        }
        else {
            console.error("최종 데이터가 배열 형태가 아니므로 빈 배열로 처리합니다.", parsedData);
            this.ballNums = [];
        }

        Console.css("%cBall Numbers", "color: #000000; background: #CC9999; font-weight: bold;", this.ballNums);
    }

    // "confirm"
    public numberConfirm() {
        this.currentGameState = gameState.numberConfirm;

        this.commonBtn.setStreamingToggle(false);

        if (this.ballNums.length === 0) return;

        this.historyManager.addHistory(this.ballNums);

        this.basicPanel.winStart(this.ballNums);
        this.fourSumPanel.winStart(this.ballNums);
        this.jackpotPanel.winStart(this.ballNums);

        this.basicPrizeCalculator.calculate(this.ballNums);
        this.fourSumPrizeCalculator.calculate();

        this.commonBtn.winStart();

        if (moneyConfig.win > 0) {
            this.presentationManager.startTotalWin(moneyConfig.win);
            SoundManager.instance.play(sndType.youwin);
        }
    }

    // "end"
    public gameEnd() {
        this.basicPanel.clearPanel();
        this.fourSumPanel.clearPanel();
        this.jackpotPanel.clearPanel(false);

        this.commonBtn.winEnd();
        this.commonManager.gameEnd();

        this.presentationManager.startNGS();
        this.presentationManager.endTotalWin();

        this.historyManager.lightOff();
    }

    public gameErr() {
        if (this.isGameErrOnce) this.isGameErrOnce = false;
        else return;

        switch (this.currentGameState) {
            case gameState.gameStart:
                this.clearBasic();
                this.clearFourSum();
                this.clearJackpot();
                break;

            case gameState.numberConfirm:
                this.basicPanel.clearPanel();
                this.fourSumPanel.clearPanel();
                this.jackpotPanel.clearPanel(false);

                this.commonBtn.winEnd();
                this.commonManager.gameEnd();

                this.presentationManager.endTotalWin();
                this.presentationManager.endNGS();
                break;
        }

        this.popupManager.openErrorPopup();
    }

    ///////////////////////////////////////////////

    public clearBasic() {
        this.basicPanel.clearPanel();
        this.commonManager.clearBasicBet();
    }

    public clearFourSum() {
        this.fourSumPanel.clearPanel();
        this.commonManager.clearFourSumBet();
    }

    public clearJackpot() {
        this.jackpotPanel.clearPanel(true);
        this.commonManager.clearJackpotBet();
    }

    ///////////////////////////////////////////////

    public saveBettingHistory() {
        this.basicPanel.saveBettingHistory();
        this.fourSumPanel.saveBettingHistory();
        this.jackpotPanel.saveBettingHistory();
    }

    public loadBettingHistory() {
        if (!gameConfig.isAutoReBet) return;

        this.basicPanel.loadBettingHistory();
        this.fourSumPanel.loadBettingHistory();
        this.jackpotPanel.loadBettingHistory();
    }

    public bettingBtnsLock() {
        this.commonBtn.bettingBtnsLock();
        this.basicPanel.bettingBtnsLock();
        this.fourSumPanel.bettingBtnsLock();
        this.jackpotPanel.bettingBtnsLock();
    }

    public bettingBtnsUnlock() {
        this.commonBtn.bettingBtnsUnlock();
        this.basicPanel.bettingBtnsUnlock();
        this.fourSumPanel.bettingBtnsUnlock();
        this.jackpotPanel.bettingBtnsUnlock();
    }

}


