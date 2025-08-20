import { _decorator, Component, find } from 'cc';
import { Console, gameConfig, moneyConfig } from 'db://assets/Script/Configs/Config';
import { GameConstants } from 'db://assets/Script/Configs/GameConstants';
import { PayoutTable } from 'db://assets/Script/Configs/PayoutTable';
import { UIManager } from '../../UIManager';
const { ccclass, property } = _decorator;

@ccclass('JackpotPrizeCalculator')
export class JackpotPrizeCalculator extends Component {
    private uiManager: UIManager = null;
    private betNumbersArr: number[][] = [];
    private pageCnt: number = 0;

    protected onLoad(): void {
        this.uiManager = find('Canvas/UI').getComponent(UIManager);
    }

    start() {
        this.pageCnt = this.uiManager.jackpotPanel.jackpotPages.length;
    }

    public calculate(winningNumbers: number[], betNumbers: number[]) {
        const sortedBetNumbers = [...betNumbers].sort((a, b) => a - b);
        this.betNumbersArr.push(sortedBetNumbers);

        if (this.betNumbersArr.length === this.pageCnt) {
            const sortedWinningNumbers = [...winningNumbers].sort((a, b) => a - b);
            const winMoney = this.calculateWinnings(sortedWinningNumbers, this.betNumbersArr);

            Console.css("%cJackpot Prize", "color: #000000; background: #CC9999; font-weight: bold;", winMoney);
            this.uiManager.commonManager.addWin(winMoney);

            this.betNumbersArr = [];
        }
    }

    private calculateWinnings(winningNumbers: number[], betNumbersArr: number[][]) {
        let totalWinnings = 0;

        const stringWinning = JSON.stringify(winningNumbers);
        const newBetArr = betNumbersArr.filter(element => JSON.stringify(element) !== stringWinning);
        const amount = GameConstants.MIN_BET_JACKPOT;

        if (newBetArr.length !== betNumbersArr.length) {
            totalWinnings += moneyConfig.jackpotWin + amount;
            gameConfig.isJackpotWin = true;
        }

        newBetArr.forEach(subArray => {
            const hits = this.countCommonElements(winningNumbers, subArray);
            if (hits >= 1) {
                const payKey = hits === 1 ? '1Hit' : `${hits}Hits`;
                totalWinnings += amount * PayoutTable.Jackpot[payKey].pays + amount;
            }
        });

        return totalWinnings;
    }

    private countCommonElements(arr1, arr2) {
        const set1 = new Set(arr1);
        let commonCount = 0;

        for (const element of arr2) {
            if (set1.has(element)) {
                commonCount++;
            }
        }

        return commonCount;
    }
}


