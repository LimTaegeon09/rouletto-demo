import { _decorator, Component } from 'cc';
import { Console, gameConfig, moneyConfig } from 'db://assets/Script/Configs/Config';
import { GameConstants } from 'db://assets/Script/Configs/GameConstants';
import { PayoutTable } from 'db://assets/Script/Configs/PayoutTable';
import { EventManager, evtFunc, evtNode } from '../../../EventManager';
const { ccclass, property } = _decorator;

@ccclass('JackpotPrizeCalculator')
export class JackpotPrizeCalculator extends Component {
    private betNumbersArr: number[][] = [];
    private readonly pageCnt: number = 5;

    public calculate(winningNumbers: number[], betNumbers: number[]) {
        const sortedBetNumbers = Array.from(betNumbers).sort((a, b) => a - b);
        this.betNumbersArr.push(sortedBetNumbers);

        if (this.betNumbersArr.length === this.pageCnt) {
            const sortedWinningNumbers = Array.from(winningNumbers).sort((a, b) => a - b);
            const winMoney = this.calculateWinnings(sortedWinningNumbers, this.betNumbersArr);

            Console.css("%cJackpot Prize", "color: #000000; background: #CC9999; font-weight: bold;", winMoney);

            emit(evtFunc.addWin, winMoney);

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

function emit(...args: any[]) {
    EventManager.instance.node.emit(evtNode.commonManager, args);
}

