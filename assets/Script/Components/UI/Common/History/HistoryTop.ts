import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { RED_NUMBERS } from 'db://assets/Script/Configs/Config';
import { sortNumbersAscending } from 'db://assets/Script/Utils/Utils';
const { ccclass, property } = _decorator;

@ccclass('HistoryTop')
export class HistoryTop extends Component {
    private resultNodes: Array<Node> = [];

    protected onLoad(): void {
        this.resultNodes = this.node.getChildByName('Results').children
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
}


