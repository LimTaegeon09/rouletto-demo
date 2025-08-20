import { _decorator, Component } from 'cc';
import { Console, gameConfig } from '../../Configs/Config';
import { GameConstants } from '../../Configs/GameConstants';
import { CommonBtns } from './Common/CommonBtns';
import { CommonManager } from './Common/CommonManager';
import { HistoryManager } from './Common/History/HistoryManager';
import { Timer } from './Common/Timer';
import { BasicPanel } from './Panels/Basic/BasicPanel';
import { FourSumPanel } from './Panels/FourSum/FourSumPanel';
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
    public fourSumPanel: FourSumPanel = null;
    public jackpotPanel: JackpotPanel = null;

    public streamingPopup: StreamingPopup = null;

    private ballNums: any[] = [];

    protected onLoad(): void {
        const common = this.node.getChildByName('Common');

        this.commonManager = common.getComponent(CommonManager);
        this.commonBtn = common.getComponent(CommonBtns);
        this.historyManager = common.getChildByName('History').getComponent(HistoryManager);
        this.timer = common.getChildByName('Top').getChildByName('Timer').getComponent(Timer);
        this.basicPanel = this.node.getChildByName('Basic').getComponent(BasicPanel);
        this.fourSumPanel = this.node.getChildByName('FourSum').getComponent(FourSumPanel);
        this.jackpotPanel = this.node.getChildByName('Jackpot').getComponent(JackpotPanel);
        this.streamingPopup = this.node.getChildByName('Streaming').getComponent(StreamingPopup);
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
        this.commonManager.addJackpotWin();

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


