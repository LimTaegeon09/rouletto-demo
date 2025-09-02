import { _decorator, Component } from 'cc';
import { getRandomNumber, pickRandomNumbers } from 'db://assets/Script/Utils/Utils';
import { HistoryBottom } from './HistoryBottom';
import { HistoryMid } from './HistoryMid';
import { HistoryTop } from './HistoryTop';
const { ccclass, property } = _decorator;

@ccclass('HistoryManager')
export class HistoryManager extends Component {
    private historyTop: HistoryTop = null;
    private historyMid: HistoryMid = null;
    private historyBottom: HistoryBottom = null;

    private numbers: Array<any> = [];

    protected onLoad(): void {
        this.historyTop = this.node.getChildByName('Top').getComponent(HistoryTop);
        this.historyMid = this.node.getChildByName('Mid').getComponent(HistoryMid);
        this.historyBottom = this.node.getChildByName('Bottom').getComponent(HistoryBottom);
    }

    private getRandom() {
        const rand = getRandomNumber(20);
        for (let i = 0; i < rand; i++) {
            this.numbers.push(pickRandomNumbers());
        }
        this.setHistory();
    }

    public addHistory(data) {
        this.numbers.unshift(data);
        this.setHistory();

        this.historyTop.lightOn();
    }

    private setHistory() {
        this.historyTop.setResults(this.numbers);
        this.historyMid.setHotCold(this.numbers);
        this.historyBottom.setGage(this.numbers);
    }

    public lightOff() {
        this.historyTop.lightOff();
    }

}


