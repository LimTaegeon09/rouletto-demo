import { _decorator, Component, Label, Node, Sprite, Tween, tween } from 'cc';
import { GameConstants } from '../../../Configs/GameConstants';
import { sndType, SoundManager } from '../../../managers/SoundManager';
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
    private tweens: Tween<any>[] = [];

    protected onLoad(): void {
        this.callsLabel = this.node.getChildByName('CallsLabel').getComponent(Label);
        this.barBgSprNode = this.node.getChildByName('BgSpr');
        this.barSpr = this.node.getChildByName('BarSpr').getComponent(Sprite);
    }

    protected start(): void {
        this.setNoMoreBet();
    }

    public setPlaceYourBet() {
        this.callsLabel.string = callsStrig.place;
        this.barBgSprNode.active = true;
        this.startCountdown(GameConstants.COUNTDOWN_TIME);
    }

    public setNoMoreBet() {
        this.tweens.forEach(t => {
            t.stop();
        });
        this.callsLabel.string = callsStrig.noMore;
        this.barBgSprNode.active = false;
        this.barSpr.fillRange = 0;
    }

    private setResult() {
        this.tweens.forEach(t => {
            t.stop();
        });
        this.callsLabel.string = callsStrig.result;
        this.barBgSprNode.active = false;
        this.barSpr.fillRange = 0;
    }

    private startCountdown(time: number): void {
        this.barSpr.fillRange = 1;

        this.tweens[0] = tween(this.barSpr)
            .to(time, { fillRange: 0 })
            .call(() => {
                emit(evtFunc.bettingEnd);
            })
            .start();

        this.tweens[1] = tween(this.node)
            .delay(time - 10)
            .call(() => {
                SoundManager.instance.play(sndType.ten_seconds_remaining);
            })
            .start();

        this.tweens[2] = tween(this.node)
            .delay(time - 9)
            .call(() => {
                emit(evtFunc.startCountDown);
            })
            .start();
    }
}

function emit(...args: any[]) {
    EventManager.instance.node.emit(evtNode.uiManager, args);
}


