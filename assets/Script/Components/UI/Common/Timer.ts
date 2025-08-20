import { _decorator, Component, Label, Node, Sprite, Tween, tween } from 'cc';
import { gameConfig } from '../../../Configs/Config';
const { ccclass, property } = _decorator;

const callsStrig = {
    noMore: 'NO MORE BET',
    place: 'PLACE YOUR BETS',
    result: 'RESULT'
};

@ccclass('Timer')
export class Timer extends Component {
    private callsLabel: Label = null;
    private barBgSprNode: Node = null;
    private barSpr: Sprite = null;
    private barTween: Tween<Sprite> = null;

    protected onLoad(): void {
        this.callsLabel = this.node.getChildByName('CallsLabel').getComponent(Label);
        this.barBgSprNode = this.node.getChildByName('BgSpr');
        this.barSpr = this.node.getChildByName('BarSpr').getComponent(Sprite);
    }

    protected start(): void {
        if (!gameConfig.isBettable) this.setNoMoreBet();
    }

    public setNoMoreBet() {
        gameConfig.isBettable = false;

        if (this.barTween) this.barTween.stop();
        this.callsLabel.string = callsStrig.noMore;
        this.barBgSprNode.active = false;
        this.barSpr.fillRange = 0;

        //Console.css("%c" + callsStrig.noMore, "color: #000000; background: #CC9999; font-weight: bold;");
    }

    public setPlaceYourBet(time: number) {
        gameConfig.isBettable = true;

        this.callsLabel.string = callsStrig.place;
        this.barBgSprNode.active = true;
        this.startCountdown(time);

        //Console.css("%c" + callsStrig.place, "color: #000000; background: #CC9999; font-weight: bold;");
    }

    private setResult() {
        gameConfig.isBettable = false;

        if (this.barTween) this.barTween.stop();
        this.callsLabel.string = callsStrig.result;
        this.barBgSprNode.active = false;
        this.barSpr.fillRange = 0;

        //Console.css("%c" + callsStrig.result, "color: #000000; background: #CC9999; font-weight: bold;");
    }

    private startCountdown(time: number): void {
        this.barSpr.fillRange = 1;

        this.barTween = tween(this.barSpr)
            .to(time, { fillRange: 0 })
            .call(() => {
                this.setNoMoreBet();
            })
            .start();
    }
}


