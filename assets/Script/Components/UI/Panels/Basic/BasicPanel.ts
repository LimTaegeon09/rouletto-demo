import { _decorator, Button, Component, Label, Node } from 'cc';
import { BettingInfo, COLOR_COMBINATIONS, COLUMN_NUMBERS, Console, DOZEN_NUMBERS, gameConfig, moneyConfig, SPECIAL_HIGH_NUMBERS, SPECIAL_LOW_NUMBERS } from 'db://assets/Script/Configs/Config';
import { GameConstants } from 'db://assets/Script/Configs/GameConstants';
import { creatEventHandler, formatNumber, getColorCombination, parseNumber } from 'db://assets/Script/Utils/Utils';
import { EventManager, evtFunc, evtNode } from '../../../EventManager';
const { ccclass, property } = _decorator;

class WinNode {
    straightUp: Node[] = [];
    column: Node[] = [];
    dozen: Node[] = [];
    color: Node[] = [];
    special: Node[] = [];
}

class ChipNode {
    straightUp: Node[] = [];
    split: Node[] = [];
    street: Node[] = [];
    column: Node[] = [];
    dozen: Node[] = [];
    color: Node[] = [];
    special: Node[] = [];
}

@ccclass('BasicPanel')
export class BasicPanel extends Component {
    private winNode: WinNode = new WinNode();
    public chipNode: ChipNode = new ChipNode();
    private allWinNodes: Node[] = [];
    private allChipNodes: Node[] = [];

    private minMaxLabel: Label = null;

    private currentBettingRecord: BettingInfo[] = [];
    private previousBettingRecord: BettingInfo[] = [];

    protected onLoad(): void {


        const win = this.node.getChildByName('Win');
        const chip = this.node.getChildByName('Chip');

        this.winNode.straightUp = win.getChildByName('StraightUp').children;
        this.winNode.column = win.getChildByName('Column').children;
        this.winNode.dozen = win.getChildByName('Dozen').children;
        this.winNode.color = win.getChildByName('Color').children;
        this.winNode.special = win.getChildByName('Special').children;

        this.chipNode.straightUp = chip.getChildByName('StraightUp').children;
        this.chipNode.split = chip.getChildByName('Split').children;
        this.chipNode.street = chip.getChildByName('Street').children;
        this.chipNode.column = chip.getChildByName('Column').children;
        this.chipNode.dozen = chip.getChildByName('Dozen').children;
        this.chipNode.color = chip.getChildByName('Color').children;
        this.chipNode.special = chip.getChildByName('Special').children;

        const allWinNodeArrays = Object.values(this.winNode);
        this.allWinNodes = allWinNodeArrays.flat();

        const allChipNodeArrays = Object.values(this.chipNode);
        this.allChipNodes = allChipNodeArrays.flat();

        this.minMaxLabel = this.node.getChildByName('MinMaxLabel').getComponent(Label);

        ///////////////////////////////////////////////////////////////////////////////

        this.allChipNodes.forEach((a, i) => {
            a.getComponent(Button).clickEvents.push(creatEventHandler(this.node, this, 'clickPanel', i));
        });
    }

    start() {
        this.minMaxLabel.string = 'MIN : $' + formatNumber(GameConstants.MIN_BET_BASIC) + '   MAX : $' + formatNumber(GameConstants.MAX_BET_BASIC);
    }

    private clickPanel(event, customEventData) {
        const node = this.allChipNodes[parseInt(customEventData)];
        if (gameConfig.currentBet === 0 || !node) return;

        const chip = node.getChildByName('Sprite');
        const label = node.getChildByName('Label').getComponent(Label);
        let bet = gameConfig.currentBet;

        // 첫 베팅         
        if (!chip.active) {

            // 최소 제한 미달
            if (bet < GameConstants.MIN_BET_BASIC) bet = GameConstants.MIN_BET_BASIC;

            // 최대 제한 초과
            else if (bet > GameConstants.MAX_BET_BASIC) bet = GameConstants.MAX_BET_BASIC;

            // 베팅금액 > 보유크레딧
            if (bet > moneyConfig.credit) {
                Console.css("%cNot enough credits.", "color: #ffffff; background:rgb(250, 0, 0); font-weight: bold;");
                emitUIManager(evtFunc.showNotCredit, evtNode.basicPanel, chip.worldPosition);
                return;
            }

            chip.active = true;
            label.string = formatNumber(bet);
        }

        // 추가 베팅 (현재 최소 베팅 이상)
        else {
            const previousBet = parseNumber(label.string);

            // 이미 최대 제한 도달
            if (previousBet >= GameConstants.MAX_BET_BASIC) {
                Console.css("%cMax bet reached for Basic.", "color: #ffffff; background:rgb(250, 0, 0); font-weight: bold;");
                emitUIManager(evtFunc.showMaxBet, evtNode.basicPanel, chip.worldPosition);
                return;
            }

            // 최종 베팅의 최대 제한 초과
            if (previousBet + bet > GameConstants.MAX_BET_BASIC) {
                bet = GameConstants.MAX_BET_BASIC - previousBet;
            }

            // 베팅금액 > 보유크레딧
            if (bet > moneyConfig.credit) {
                Console.css("%cNot enough credits.", "color: #ffffff; background:rgb(250, 0, 0); font-weight: bold;");
                emitUIManager(evtFunc.showNotCredit, evtNode.basicPanel, chip.worldPosition);
                return;
            }

            label.string = formatNumber(previousBet + bet);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////

        emitCommonManager(evtFunc.addBasicBet, bet);

        this.currentBettingRecord.push({
            chipNode: node,
            betMoney: bet
        });
    }

    public bettingBtnsLock() {
        this.allChipNodes.forEach((a, i) => {
            a.getComponent(Button).interactable = false;
        });
    }

    public bettingBtnsUnlock() {
        this.allChipNodes.forEach((a, i) => {
            a.getComponent(Button).interactable = true;
        });
    }

    public setPanelActive(active: boolean) {
        this.node.setPosition(0, 0);
        this.node.active = active;
    }

    public winStart(numbers: number[]) {

        // straightUp
        for (let i = 0; i < numbers.length; i++) {
            this.winNode.straightUp[numbers[i]].active = true;
        }

        // dozen
        for (let i = 0; i < 3; i++) {
            if (numbers.every(num => DOZEN_NUMBERS[i].has(num))) {
                this.winNode.dozen[i].active = true;
                break;
            }
        }

        // column
        for (let i = 0; i < 3; i++) {
            if (numbers.every(num => COLUMN_NUMBERS[i].has(num))) {
                this.winNode.column[i].active = true;
                break;
            }
        }

        // color
        const color = getColorCombination(numbers);
        if (color) {
            this.winNode.color[COLOR_COMBINATIONS.indexOf(color)].active = true;
        }

        // special
        if (numbers.every(num => SPECIAL_LOW_NUMBERS.has(num))) {
            this.winNode.special[0].active = true;
        }
        else if (numbers.every(num => SPECIAL_HIGH_NUMBERS.has(num))) {
            this.winNode.special[3].active = true;
        }
        const sorted = [...numbers].sort((a, b) => a - b);
        const isConsecutive1 = sorted[1] === sorted[0] + 1;
        const isConsecutive2 = sorted[2] === sorted[1] + 1;
        const isConsecutive3 = sorted[3] === sorted[2] + 1;
        if (isConsecutive1 && isConsecutive2 && isConsecutive3) {
            this.winNode.special[1].active = true;
        }
        else if ((isConsecutive1 && isConsecutive2) || (isConsecutive2 && isConsecutive3)) {
            this.winNode.special[2].active = true;
        }
    }

    public clearPanel() {
        this.allWinNodes.forEach(a => {
            a.active = false;
        });

        this.allChipNodes.forEach(a => {
            a.getChildByName('Sprite').active = false;
            a.getChildByName('Label').getComponent(Label).string = '';
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

        emitCommonManager(evtFunc.subBasicBet, bet);
    }

    public doubleBetting() {
        if (this.currentBettingRecord.length === 0) return;

        const doubleBettingInfoArr: BettingInfo[] = [];

        this.allChipNodes.forEach(node => {
            if (!node.getChildByName('Sprite').active) return;

            const label = node.getChildByName('Label').getComponent(Label);
            const previousBet = parseNumber(label.string);
            let increaseBet = previousBet;

            if (previousBet + increaseBet > GameConstants.MAX_BET_BASIC) {
                increaseBet = GameConstants.MAX_BET_BASIC - previousBet;
            }

            if (increaseBet > moneyConfig.credit || increaseBet === 0) return;

            label.string = formatNumber(previousBet + increaseBet);

            emitCommonManager(evtFunc.addBasicBet, increaseBet);

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

        this.allChipNodes.forEach(node => {
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

            emitCommonManager(evtFunc.addBasicBet, bet);

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


