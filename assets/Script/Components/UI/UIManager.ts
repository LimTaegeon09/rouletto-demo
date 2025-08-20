import { _decorator, Component } from 'cc';
import { Console, gameConfig } from '../../Configs/Config';
import { GameConstants } from '../../Configs/GameConstants';
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
import { StreamingPopup } from './Popups/StreamingPopup';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    public commonManager: CommonManager = null;
    public commonBtn: CommonBtns = null;

    public historyManager: HistoryManager = null;

    public timer: Timer = null;

    public basicPanel: BasicPanel = null;
    private basicPrizeCalculator: BasicPrizeCalculator = null;

    public fourSumPanel: FourSumPanel = null;
    private fourSumPrizeCalculator: FourSumPrizeCalculator = null;

    public jackpotPanel: JackpotPanel = null;

    public streamingPopup: StreamingPopup = null;

    private ballNums: any[] = [];

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

        this.streamingPopup = this.node.getChildByName('Streaming').getComponent(StreamingPopup);

        ///////////////////////////////////////////////

        EventManager.instance.node.on(evtNode.commonManager, this.evtCommonManager, this);
        EventManager.instance.node.on(evtNode.commonBtns, this.evtCommonBtns, this);
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

            case evtNode.streamingPopup:
                if (args[1] === evtFunc.setPopupActive) this.streamingPopup.setPopupActive(args[2]);
                break;

            case evtFunc.ballResults:
                this.ballResults(args[1]);
                this.numberConfirm();
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
        }
    }

    ///////////////////////////////////////////////

    // "newgame"
    public gameStart() {
        this.timer.setPlaceYourBet(GameConstants.COUNTDOWN_TIME);

        this.commonManager.initBet();
        if (gameConfig.isJackpotWin) {
            gameConfig.isJackpotWin = false;
            this.commonManager.initJackpotWin();
        }

        this.loadBettingHistory();
    }

    // "nomorebet"
    public bettingEnd() {
        this.timer.setNoMoreBet();

        this.commonManager.initWin();
        this.commonManager.addJackpotWin(this.jackpotPanel.getIsBetting());

        this.saveBettingHistory();
    }

    // "spinball"
    public spinBall() {
        this.commonBtn.setStreamingBtn(true);
    }

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
        this.commonBtn.setStreamingBtn(false);

        if (this.ballNums.length === 0) return;

        this.historyManager.addHistory(this.ballNums);

        this.basicPanel.winStart(this.ballNums);
        this.fourSumPanel.winStart(this.ballNums);
        this.jackpotPanel.winStart(this.ballNums);

        this.basicPrizeCalculator.calculate(this.ballNums);
        this.fourSumPrizeCalculator.calculate();

    }

    // "end"
    public gameEnd() {
        this.basicPanel.clearPanel();
        this.fourSumPanel.clearPanel();
        this.jackpotPanel.clearPanel();

        this.commonManager.gameEnd();
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
        this.jackpotPanel.clearPanel();
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

}


