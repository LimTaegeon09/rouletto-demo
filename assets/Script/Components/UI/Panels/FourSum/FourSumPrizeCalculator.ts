import { _decorator, Component, Label } from 'cc';
import { Console } from 'db://assets/Script/Configs/Config';
import { PayoutTable } from 'db://assets/Script/Configs/PayoutTable';
import { parseNumber } from 'db://assets/Script/Utils/Utils';
import { EventManager, evtFunc, evtNode } from '../../../EventManager';
import { FourSumPanel } from './FourSumPanel';
const { ccclass, property } = _decorator;

@ccclass('FourSumPrizeCalculator')
export class FourSumPrizeCalculator extends Component {
    private fourSumPanel: FourSumPanel = null;

    protected onLoad(): void {
        this.fourSumPanel = this.node.getComponent(FourSumPanel);
    }

    public calculate() {
        const winMoney = this.calculateWinnings();

        Console.css("%cFourSum Prize", "color: #000000; background: #CC9999; font-weight: bold;", winMoney);

        emit(evtFunc.addWin, winMoney);
    }

    private calculateWinnings() {
        let totalWinnings = 0;
        const winNodes = this.fourSumPanel.winNodes;
        const chipNodes = this.fourSumPanel.chipNodes;
        const fourSumPays = Object.values(PayoutTable.FourSum).map(item => item.pays);

        for (let i = 0, length = winNodes.length; i < length; i++) {
            if (!winNodes[i].active) continue;
            if (!chipNodes[i].getChildByName('Sprite').active) continue;

            const amount = parseNumber(chipNodes[i].getChildByName('Label').getComponent(Label).string);
            totalWinnings += amount * fourSumPays[i] + amount;
        }

        return totalWinnings;
    }

}

function emit(...args: any[]) {
    EventManager.instance.node.emit(evtNode.commonManager, args);
}


