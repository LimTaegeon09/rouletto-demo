import { _decorator, Button, Component, Label, Node } from 'cc';
import { BettingInfo, Console, gameConfig, moneyConfig } from 'db://assets/Script/Configs/Config';
import { GameConstants } from 'db://assets/Script/Configs/GameConstants';
import { creatEventHandler, formatNumber, parseNumber } from 'db://assets/Script/Utils/Utils';
import { EventManager, evtFunc, evtNode } from '../../../EventManager';
const { ccclass, property } = _decorator;

@ccclass('FourSumPanel')
export class FourSumPanel extends Component {
    public winNodes: Node[] = [];
    public chipNodes: Node[] = [];

    private minMaxLabel: Label = null;

    private currentBettingRecord: BettingInfo[] = [];
    private previousBettingRecord: BettingInfo[] = [];

    protected onLoad(): void {
        const win = this.node.getChildByName('Win');
        const chip = this.node.getChildByName('Chip');

        this.winNodes = win.children;
        this.chipNodes = chip.children;

        this.minMaxLabel = this.node.getChildByName('MinMaxLabel').getComponent(Label);

        ///////////////////////////////////////////////////////////////////////////////

        this.chipNodes.forEach((c, i) => {
            c.getComponent(Button).clickEvents.push(creatEventHandler(this.node, this, 'clickPanel', i));
        });
    }

    start() {
        this.minMaxLabel.string = 'MIN : $' + formatNumber(GameConstants.MIN_BET_FOURSUM) + '   MAX : $' + formatNumber(GameConstants.MAX_BET_FOURSUM);
    }

    private clickPanel(event, customEventData) {
        const node = this.chipNodes[parseInt(customEventData)];
        if (gameConfig.currentBet == 0 || !node) return;

        const chip = node.getChildByName('Sprite');
        const label = node.getChildByName('Label').getComponent(Label);
        let bet = gameConfig.currentBet;

        // 첫 베팅         
        if (!chip.active) {

            // 최소 제한 미달
            if (bet < GameConstants.MIN_BET_FOURSUM) bet = GameConstants.MIN_BET_FOURSUM;

            // 최대 제한 초과
            else if (bet > GameConstants.MAX_BET_FOURSUM) bet = GameConstants.MAX_BET_FOURSUM;

            // 베팅금액 > 보유크레딧
            if (bet > moneyConfig.credit) {
                Console.css("%cNot enough credits.", "color: #ffffff; background:rgb(250, 0, 0); font-weight: bold;");
                emitUIManager(evtFunc.showNotCredit, evtNode.fourSumPanel, chip.worldPosition);
                return;
            }

            chip.active = true;
            label.string = formatNumber(bet);
        }

        // 추가 베팅 (현재 최소 베팅 이상)
        else {
            const previousBet = parseNumber(label.string);

            // 이미 최대 제한 도달
            if (previousBet >= GameConstants.MAX_BET_FOURSUM) {
                Console.css("%cMax bet reached for FourSum.", "color: #ffffff; background:rgb(250, 0, 0); font-weight: bold;");
                emitUIManager(evtFunc.showMaxBet, evtNode.fourSumPanel, chip.worldPosition);
                return;
            }

            // 최종 베팅의 최대 제한 초과
            if (previousBet + bet > GameConstants.MAX_BET_FOURSUM) {
                bet = GameConstants.MAX_BET_FOURSUM - previousBet;
            }

            // 베팅금액 > 보유크레딧
            if (bet > moneyConfig.credit) {
                Console.css("%cNot enough credits.", "color: #ffffff; background:rgb(250, 0, 0); font-weight: bold;");
                emitUIManager(evtFunc.showNotCredit, evtNode.fourSumPanel, chip.worldPosition);
                return;
            }

            label.string = formatNumber(previousBet + bet);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        emitCommonManager(evtFunc.addFourSumBet, bet);

        this.currentBettingRecord.push({
            chipNode: node,
            betMoney: bet
        });
    }

    public bettingBtnsLock() {
        this.chipNodes.forEach((a, i) => {
            a.getComponent(Button).interactable = false;
        });
    }

    public bettingBtnsUnlock() {
        this.chipNodes.forEach((a, i) => {
            a.getComponent(Button).interactable = true;
        });
    }

    public setPanelActive(active: boolean) {
        this.node.setPosition(0, 0);
        this.node.active = active;
    }

    public winStart(numbers: number[]) {
        const hasZero = numbers.includes(0);
        const sum = numbers.reduce((acc, current) => acc + current, 0);

        if (sum === 88) this.winNodes[0].active = true;
        if (sum === 77) this.winNodes[1].active = true;
        if (sum % 10 === 8) this.winNodes[2].active = true;
        if (sum % 10 === 7) this.winNodes[3].active = true;
        if (sum >= 6 && sum <= 59) this.winNodes[4].active = true;
        if (sum >= 60 && sum <= 75) this.winNodes[5].active = true;
        if (sum >= 76 && sum <= 138) this.winNodes[6].active = true;
        if (sum >= 6 && sum <= 52) this.winNodes[7].active = true;
        if (sum >= 53 && sum <= 63) this.winNodes[8].active = true;
        if (sum >= 64 && sum <= 75) this.winNodes[9].active = true;
        if (sum >= 76 && sum <= 88) this.winNodes[10].active = true;
        if (sum >= 89 && sum <= 138) this.winNodes[11].active = true;
        if (sum % 2 === 0 && !hasZero) this.winNodes[12].active = true;
        if (hasZero) this.winNodes[13].active = true;
        if (sum % 2 !== 0 && !hasZero) this.winNodes[14].active = true;
    }

    public clearPanel() {
        this.winNodes.forEach(w => {
            w.active = false;
        });

        this.chipNodes.forEach(c => {
            c.getChildByName('Sprite').active = false;
            c.getChildByName('Label').getComponent(Label).string = '';
        });

        this.currentBettingRecord = [];
    }

    public undoBetting() {
        if (this.currentBettingRecord.length === 0) return;

        const lastBet = this.currentBettingRecord[this.currentBettingRecord.length - 1];

        if (!lastBet.betInfoArr) {
            this.undoBet(lastBet);
        }
        else {
            const lastBets = lastBet.betInfoArr;
            lastBets.forEach(l => {
                this.undoBet(l);
            });
        }

        this.currentBettingRecord.pop();
    }

    private undoBet(lastBet: BettingInfo) {
        const chip = lastBet.chipNode;
        const bet = lastBet.betMoney;

        if (!chip || !bet) {
            console.error("잘못된 베팅 순서입니다.");
            return;
        }

        const label = chip.getChildByName('Label').getComponent(Label);
        const change = parseNumber(label.string) - bet;

        if (change === 0) {
            chip.getChildByName('Sprite').active = false;
            label.string = '';
        }
        else if (change < 0) {
            console.error("되돌릴 금액이 베팅한 금액보다 많습니다.");
            return;
        }
        else {
            label.string = formatNumber(change);
        }

        emitCommonManager(evtFunc.subFourSumBet, bet);
    }

    public doubleBetting() {
        if (this.currentBettingRecord.length === 0) return;

        const doubleBettingInfoArr: BettingInfo[] = [];

        this.chipNodes.forEach(node => {
            if (!node.getChildByName('Sprite').active) return;

            const label = node.getChildByName('Label').getComponent(Label);
            const previousBet = parseNumber(label.string);
            let increaseBet = previousBet;

            if (previousBet + increaseBet > GameConstants.MAX_BET_FOURSUM) {
                increaseBet = GameConstants.MAX_BET_FOURSUM - previousBet;
            }

            if (increaseBet > moneyConfig.credit || increaseBet === 0) return;

            label.string = formatNumber(previousBet + increaseBet);

            emitCommonManager(evtFunc.addFourSumBet, increaseBet);

            doubleBettingInfoArr.push({
                chipNode: node,
                betMoney: increaseBet
            });
        });

        if (doubleBettingInfoArr.length === 0) return;

        this.currentBettingRecord.push({
            betInfoArr: doubleBettingInfoArr
        });
    }

    public saveBettingHistory() {
        this.previousBettingRecord = [];

        if (this.currentBettingRecord.length === 0) return;

        this.chipNodes.forEach(node => {
            if (!node.getChildByName('Sprite').active) return;

            const label = node.getChildByName('Label').getComponent(Label);

            this.previousBettingRecord.push({
                chipNode: node,
                betMoney: parseNumber(label.string)
            });
        });
    }

    public loadBettingHistory() {
        if (this.previousBettingRecord.length === 0 ||
            this.currentBettingRecord.length !== 0) return;

        const reBettingInfoArr: BettingInfo[] = [];

        this.previousBettingRecord.forEach(bettingInfo => {
            const node = bettingInfo.chipNode;
            let bet = bettingInfo.betMoney;

            if (bet > moneyConfig.credit) bet = moneyConfig.credit;
            if (bet === 0) return;

            node.getChildByName('Sprite').active = true;
            const label = node.getChildByName('Label').getComponent(Label);
            label.string = formatNumber(bet);

            emitCommonManager(evtFunc.addFourSumBet, bet);

            reBettingInfoArr.push({
                chipNode: node,
                betMoney: bet
            });
        });

        if (reBettingInfoArr.length === 0) return;

        this.currentBettingRecord.push({
            betInfoArr: reBettingInfoArr
        });
    }
}

function emitCommonManager(...args: any[]) {
    EventManager.instance.node.emit(evtNode.commonManager, args);
}

function emitUIManager(...args: any[]) {
    EventManager.instance.node.emit(evtNode.uiManager, args);
}


