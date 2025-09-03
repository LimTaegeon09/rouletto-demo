import { _decorator, Component, Label, Node, Sprite, tween, Tween, UIOpacity } from 'cc';
import { RED_NUMBERS } from 'db://assets/Script/Configs/Config';
import { GameConstants } from 'db://assets/Script/Configs/GameConstants';
import { sortNumbersAscending } from 'db://assets/Script/Utils/Utils';
const { ccclass, property } = _decorator;

@ccclass('HistoryTop')
export class HistoryTop extends Component {
    private resultNodes: Array<Node> = [];
    private lightOpacity: UIOpacity = null;
    private lightTween: Tween<UIOpacity> = null;

    protected onLoad(): void {
        this.resultNodes = this.node.getChildByName('Results').children
        this.lightOpacity = this.node.getChildByName('LightSpr').getComponent(UIOpacity);
    }

    protected start(): void {
        this.lightOn();
    }

    public setResults(numbers: Array<any>) {
        for (let i = 0, length = numbers.length; i < length; i++) {
            if (!this.resultNodes[i]) break;
            this.setResult(this.resultNodes[i], numbers[i]);
        }
    }

    private setResult(node: Node, numbers: Array<number>) {
        const arr = sortNumbersAscending(numbers);
        let totalNum = 0;

        for (let i = 0; i < 4; i++) {
            this.setNumber(node.getChildByName('NumSpr' + i), arr[i]);
            totalNum += arr[i];
        }

        this.setTotalNumber(node.getChildByName('TotalSpr'), totalNum);
    }

    private setNumber(node: Node, number: number) {
        const label = node.getChildByName('Label').getComponent(Label);
        label.string = String(number);

        const spr = node.getComponent(Sprite);
        spr.spriteFrame = spr.spriteAtlas.getSpriteFrame(this.getHistorySpriteFrame(number));
    }

    private setTotalNumber(node: Node, number: number) {
        const label = node.getChildByName('Label').getComponent(Label);
        label.string = String(number);

        const spr = node.getComponent(Sprite);
        spr.spriteFrame = spr.spriteAtlas.getSpriteFrame('bar_box_yellow');
    }

    private getHistorySpriteFrame(num: number) {
        let spriteFileName = 'bar_box_green';

        if (RED_NUMBERS.has(num)) {
            spriteFileName = 'bar_box_red';
        }
        else if (num !== 0) {
            spriteFileName = 'bar_box_black';
        }

        return spriteFileName;
    }

    private lightOn() {
        if (this.lightTween) this.lightTween.stop();

        const sequence = tween()
            .set({ opacity: 255 * 0.8 })
            .to(GameConstants.HISTORY_BLINK_DURATION, { opacity: 0 });

        this.lightTween = tween(this.lightOpacity)
            .repeatForever(sequence)
            .start();
    }

    private lightOff() {
        if (this.lightTween) this.lightTween.stop();
        this.lightOpacity.opacity = 0;
    }
}


