import { _decorator, Component, find, Label } from 'cc';
import { Console } from 'db://assets/Script/Configs/Config';
import { PayoutTable } from 'db://assets/Script/Configs/PayoutTable';
import { parseNumber } from 'db://assets/Script/Utils/Utils';
import { UIManager } from '../../UIManager';
const { ccclass, property } = _decorator;

@ccclass('FourSumPrizeCalculator')
export class FourSumPrizeCalculator extends Component {
    private uiManager: UIManager = null;

    protected onLoad(): void {
        this.uiManager = find('Canvas/UI').getComponent(UIManager);
    }

    public calculate() {
        const winMoney = this.calculateWinnings();

        Console.css("%cFourSum Prize", "color: #000000; background: #CC9999; font-weight: bold;", winMoney);
        this.uiManager.commonManager.addWin(winMoney);
    }

    private calculateWinnings() {
        let totalWinnings = 0;
        const winNodes = this.uiManager.fourSumPanel.winNodes;
        const chipNodes = this.uiManager.fourSumPanel.chipNodes;
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


