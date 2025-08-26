import { _decorator, Button, Component, Label, Node, Sprite } from 'cc';
import { Console, moneyConfig } from 'db://assets/Script/Configs/Config';
import { GameConstants } from 'db://assets/Script/Configs/GameConstants';
import { creatEventHandler, formatNumber, pickRandomNumbers } from 'db://assets/Script/Utils/Utils';
import { EventManager, evtFunc, evtNode } from '../../../EventManager';
import { JackpotPrizeCalculator } from './JackpotPrizeCalculator';
import { sndType, SoundManager } from 'db://assets/Script/managers/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('JackpotPage')
export class JackpotPage extends Component {
    private jackpotPrizeCalculator: JackpotPrizeCalculator = null;

    private numNodes: Array<Node> = [];
    private numbers: number[] = [];

    private ranBtn: Button = null;
    private betBtn: Button = null;
    private chipNode: Node = null;
    private winLabel: Label = null;
    private betLabel: Label = null;
    private winNode: Node = null;

    private isBetting: boolean = false;

    public index: number = null;

    protected onLoad(): void {
        this.jackpotPrizeCalculator = this.node.parent.getComponent(JackpotPrizeCalculator);

        this.numNodes = this.node.getChildByName('Win').children;

        this.ranBtn = this.node.getChildByName('RandomBtn').getComponent(Button);
        this.betBtn = this.node.getChildByName('BetBtn').getComponent(Button);
        this.chipNode = this.node.getChildByName('ChipSpr');
        this.winLabel = this.node.getChildByName('WinLabel').getComponent(Label);
        this.betLabel = this.node.getChildByName('BetLabel').getComponent(Label);
        this.winNode = this.node.getChildByName('WinSpr');

        ////////////////////////////////////////////////

        this.numNodes.forEach((d, i) => {
            d.getComponent(Button).clickEvents.push(creatEventHandler(this.node, this, 'clickNum', i));
        });
        this.ranBtn.clickEvents.push(creatEventHandler(this.node, this, 'clickRandomBtn'));
        this.betBtn.clickEvents.push(creatEventHandler(this.node, this, 'clickBetBtn'));
    }

    start() {
        const label = this.chipNode.getChildByName('Label').getComponent(Label);
        label.string = formatNumber(GameConstants.MIN_BET_JACKPOT);
    }

    private clickNum(event, customEventData) {
        let index = parseInt(customEventData);
        const spr = this.numNodes[index].getComponent(Sprite);

        if (!spr.enabled) {
            if (this.numbers.length >= 4) return;
            this.numbers.push(index);
        }
        else {
            const arrIndex = this.numbers.indexOf(index);
            if (arrIndex > -1) this.numbers.splice(arrIndex, 1);
        }

        spr.enabled = !spr.enabled;

        if (this.numbers.length >= 4) this.betBtn.interactable = true;
        else this.betBtn.interactable = false;
    }

    private clickBetBtn() {
        if (!this.isBetting) {
            if (moneyConfig.credit < GameConstants.MIN_BET_JACKPOT) {
                Console.css("%cNot enough credits.", "color: #ffffff; background:rgb(250, 0, 0); font-weight: bold;");
                emit(evtNode.uiManager, evtFunc.showNotCredit, evtNode.jackpotPanel, this.betBtn.node.worldPosition);
                SoundManager.instance.play(sndType.maxbet_notenoughtmoney_message);
                return;
            }

            this.chipNode.active = true;
            emit(evtNode.commonManager, evtFunc.addJackpotBet);

            this.numNodes.forEach(n => {
                n.getComponent(Button).interactable = false;
            });
            this.betLabel.string = 'BET: $' + formatNumber(GameConstants.MIN_BET_JACKPOT);

            emit(evtNode.jackpotPanel, evtFunc.addPageRecord, this.index, this.numNodes);

            const atlas = this.betBtn.getComponent(Sprite).spriteAtlas;
            this.betBtn.normalSprite = atlas.getSpriteFrame('BTN-Cancel_off');
            this.betBtn.pressedSprite = atlas.getSpriteFrame('BTN-Cancel_on');

            this.ranBtn.interactable = false;

            SoundManager.instance.play(sndType.jackpot_game_bet_button);
        }
        else {
            this.chipNode.active = false;
            emit(evtNode.commonManager, evtFunc.subJackpotBet);

            this.numNodes.forEach(n => {
                n.getComponent(Button).interactable = true;
            });
            this.betLabel.string = 'BET: $0';

            emit(evtNode.jackpotPanel, evtFunc.removePageRecord, this.index);

            const atlas = this.betBtn.getComponent(Sprite).spriteAtlas;
            this.betBtn.normalSprite = atlas.getSpriteFrame('BTN-Bet_off');
            this.betBtn.pressedSprite = atlas.getSpriteFrame('BTN-Bet_on');

            this.ranBtn.interactable = true;

            SoundManager.instance.play(sndType.jackpot_game__cancel_button);
        }

        this.isBetting = !this.isBetting;
    }

    private clickRandomBtn(event, customEventData) {
        this.numNodes.forEach(n => {
            n.getComponent(Sprite).enabled = false;
        });

        this.numbers = pickRandomNumbers();
        for (let i = 0, length = this.numbers.length; i < length; i++) {
            this.numNodes[this.numbers[i]].getComponent(Sprite).enabled = true;
        }

        this.betBtn.interactable = true;

        SoundManager.instance.play(sndType.jackpot_game_random_button);
    }

    public bettingBtnsLock() {
        this.numNodes.forEach((d, i) => {
            d.getComponent(Button).interactable = false;
        });
        this.ranBtn.interactable = false;
    }

    public bettingBtnsUnlock() {
        this.numNodes.forEach((d, i) => {
            d.getComponent(Button).interactable = true;
        });
        this.ranBtn.interactable = true;
    }

    public winStart(numbers: number[]) {
        if (this.numbers.length === numbers.length) {
            const set1 = new Set(numbers);
            if (this.numbers.every(num => set1.has(num))) {
                this.winNode.active = true;
            }
        }

        this.jackpotPrizeCalculator.calculate(numbers, this.numbers);
    }

    public clearPage() {
        this.isBetting = false;

        this.betLabel.string = 'BET: $0';
        this.winLabel.string = 'WIN: $0';

        this.chipNode.active = false;
        this.numNodes.forEach(n => {
            n.getComponent(Sprite).enabled = false;
            n.getComponent(Button).interactable = true;
        });
        this.ranBtn.interactable = true;

        const atlas = this.betBtn.getComponent(Sprite).spriteAtlas;
        this.betBtn.normalSprite = atlas.getSpriteFrame('BTN-Bet_off');
        this.betBtn.pressedSprite = atlas.getSpriteFrame('BTN-Bet_on');

        this.betBtn.interactable = false;

        this.winNode.active = false;

        this.numbers = [];
    }

    public loadBettingHistory(betNumbers: number[]) {
        this.clearPage();

        this.numbers = [...betNumbers];

        this.numbers.forEach(number => {
            this.numNodes[number].getComponent(Sprite).enabled = true;
        });

        this.betBtn.interactable = true;

        this.clickBetBtn();
    }
}

function emit(target: string, ...args: any[]) {
    EventManager.instance.node.emit(target, args);
}


