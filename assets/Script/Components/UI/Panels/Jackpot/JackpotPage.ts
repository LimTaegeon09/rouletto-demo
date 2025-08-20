import { _decorator, Button, Component, find, Label, Node, Sprite } from 'cc';
import { UIManager } from 'db://assets/Script/Components/UI/UIManager';
import { Console, gameConfig, moneyConfig } from 'db://assets/Script/Configs/Config';
import { GameConstants } from 'db://assets/Script/Configs/GameConstants';
import { creatEventHandler, formatNumber, pickRandomNumbers } from 'db://assets/Script/Utils/Utils';
import { JackpotPanel } from './JackpotPanel';
import { JackpotPrizeCalculator } from './JackpotPrizeCalculator';
const { ccclass, property } = _decorator;

@ccclass('JackpotPage')
export class JackpotPage extends Component {
    private uiManager: UIManager = null;
    private jackpotPanel: JackpotPanel = null;
    private jackpotPrizeCalculator: JackpotPrizeCalculator = null;

    private numNodes: Array<Node> = [];
    private numbers: number[] = [];

    private ranBtn: Button = null;
    private betBtn: Button = null;
    private chipNode: Node = null;
    private winLabel: Label = null;
    private betLabel: Label = null;

    private isBetting: boolean = false;

    public index: number = null;

    protected onLoad(): void {
        this.uiManager = find('Canvas/UI').getComponent(UIManager);
        this.jackpotPanel = this.node.parent.getComponent(JackpotPanel);
        this.jackpotPrizeCalculator = this.node.parent.getComponent(JackpotPrizeCalculator);

        this.numNodes = this.node.getChildByName('Win').children;

        this.ranBtn = this.node.getChildByName('RandomBtn').getComponent(Button);
        this.betBtn = this.node.getChildByName('BetBtn').getComponent(Button);
        this.chipNode = this.node.getChildByName('ChipSpr');
        this.winLabel = this.node.getChildByName('WinLabel').getComponent(Label);
        this.betLabel = this.node.getChildByName('BetLabel').getComponent(Label);

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

        this.betBtn.interactable = false;
    }

    private clickNum(event, customEventData) {
        if (!gameConfig.isBettable) return;

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
        if (!gameConfig.isBettable) return;

        if (moneyConfig.credit < GameConstants.MIN_BET_JACKPOT) {
            Console.css("%cNot enough credits.", "color: #ffffff; background:rgb(250, 0, 0); font-weight: bold;");
            return;
        }

        this.chipNode.active = true;
        this.uiManager.commonManager.addJackpotBet();

        this.numNodes.forEach(n => {
            n.getComponent(Button).interactable = false;
        });
        this.betBtn.interactable = false;

        this.betLabel.string = 'BET: $' + formatNumber(GameConstants.MIN_BET_JACKPOT);

        ////////////////////////

        this.isBetting = true;

        this.jackpotPanel.addPageRecord(this.index, this.numbers);
    }

    private clickRandomBtn(event, customEventData) {
        if (!gameConfig.isBettable) return;

        this.betBtn.interactable = true;

        if (this.isBetting) {
            this.betLabel.string = 'BET: $0';

            this.numNodes.forEach(n => {
                n.getComponent(Button).interactable = true;
            });

            this.uiManager.commonManager.subJackpotBet();
            this.chipNode.active = false;
        }

        this.numNodes.forEach(n => {
            n.getComponent(Sprite).enabled = false;
        });

        this.numbers = pickRandomNumbers();
        for (let i = 0, length = this.numbers.length; i < length; i++) {
            this.numNodes[this.numbers[i]].getComponent(Sprite).enabled = true;
        }

        //////////////////////////////

        this.isBetting = false;

        this.jackpotPanel.removePageRecord(this.index);
    }

    public winStart(numbers: number[]) {

        // win 연출 추가 ?

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
        this.betBtn.interactable = false;

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


