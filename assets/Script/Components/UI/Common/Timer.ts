import { _decorator, Component, Label, Node, Sprite, Tween, tween } from 'cc';
import { gameConfig } from '../../../Configs/Config';
import { EventManager, evtFunc, evtNode } from '../../EventManager';
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
        this.setNoMoreBet();
    }

    public setNoMoreBet() {
        if (this.barTween) this.barTween.stop();
        this.callsLabel.string = callsStrig.noMore;
        this.barBgSprNode.active = false;
        this.barSpr.fillRange = 0;
    }

    public setPlaceYourBet(time: number) {
        this.callsLabel.string = callsStrig.place;
        this.barBgSprNode.active = true;
        this.startCountdown(time);
    }

    private setResult() {
        if (this.barTween) this.barTween.stop();
        this.callsLabel.string = callsStrig.result;
        this.barBgSprNode.active = false;
        this.barSpr.fillRange = 0;
    }

    private startCountdown(time: number): void {
        this.barSpr.fillRange = 1;

        this.barTween = tween(this.barSpr)
            .to(time, { fillRange: 0 })
            .call(() => {
                emit(evtFunc.bettingEnd);
            })
            .start();
    }
}

function emit(...args: any[]) {
    EventManager.instance.node.emit(evtNode.uiManager, args);
}


