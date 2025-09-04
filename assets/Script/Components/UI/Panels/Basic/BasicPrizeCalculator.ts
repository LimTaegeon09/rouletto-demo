import { _decorator, Component, Label } from 'cc';
import { COLOR_COMBINATIONS, COLUMN_NUMBERS, Console, DOZEN_NUMBERS, SPECIAL_HIGH_NUMBERS, SPECIAL_LOW_NUMBERS } from 'db://assets/Script/Configs/Config';
import { PayoutTable } from 'db://assets/Script/Configs/PayoutTable';
import { getColorCombination, parseNumber } from 'db://assets/Script/Utils/Utils';
import { EventManager, evtFunc, evtNode } from '../../../EventManager';
import { BasicPanel } from './BasicPanel';
const { ccclass, property } = _decorator;

enum BetType {
    StraightUp = 'straightUp',
    Split = 'split',
    Street = 'street',
    Column = 'column',
    Dozen = 'dozen',
    Color = 'color',
    SpecialLow = 'specialLow',
    SpecialStraight = 'specialStraight',
    SpecialHigh = 'specialHigh'
}

interface Bet {
    type: BetType;
    numbers: number[]; // 베팅한 숫자들 (예: [1], [1, 2], [1, 2, 3])
    amount: number;    // 이 베팅에 건 금액
    colorCombination?: string;
    specialStraight?: number;
}

@ccclass('BasicPrizeCalculator')
export class BasicPrizeCalculator extends Component {
    private basicPanel: BasicPanel = null;

    protected onLoad(): void {
        this.basicPanel = this.node.getComponent(BasicPanel);
    }

    public calculate(numbers: number[]) {
        const myBets = this.checkMyBets();
        const winMoney = this.calculateWinnings(myBets, numbers);

        Console.css("%cBasic Prize", "color: #000000; background: #CC9999; font-weight: bold;", winMoney);

        emit(evtFunc.addWin, winMoney);
    }

    private checkMyBets() {
        const myBets: Bet[] = [];
        const chipNode = this.basicPanel.chipNode;

        chipNode.straightUp.forEach((c, i) => {
            if (c.getChildByName('Sprite').active) {
                myBets.push({
                    type: BetType.StraightUp,
                    numbers: [i],
                    amount: parseNumber(c.getChildByName('Label').getComponent(Label).string)
                });
            }
        });

        chipNode.split.forEach(c => {
            if (c.getChildByName('Sprite').active) {
                const numberPart = c.name.replace('Spr', '');
                const stringArray = numberPart.split('_');
                myBets.push({
                    type: BetType.Split,
                    numbers: stringArray.map(str => parseInt(str, 10)),
                    amount: parseNumber(c.getChildByName('Label').getComponent(Label).string)
                });
            }
        });

        chipNode.street.forEach(c => {
            if (c.getChildByName('Sprite').active) {
                const numberPart = c.name.replace('Spr', '');
                const stringArray = numberPart.split('_');
                myBets.push({
                    type: BetType.Street,
                    numbers: stringArray.map(str => parseInt(str, 10)),
                    amount: parseNumber(c.getChildByName('Label').getComponent(Label).string)
                });
            }
        });

        chipNode.column.forEach((c, i) => {
            if (c.getChildByName('Sprite').active) {
                myBets.push({
                    type: BetType.Column,
                    numbers: Array.from(COLUMN_NUMBERS[i]),
                    amount: parseNumber(c.getChildByName('Label').getComponent(Label).string)
                });
            }
        });

        chipNode.dozen.forEach((c, i) => {
            if (c.getChildByName('Sprite').active) {
                myBets.push({
                    type: BetType.Dozen,
                    numbers: Array.from(DOZEN_NUMBERS[i]),
                    amount: parseNumber(c.getChildByName('Label').getComponent(Label).string)
                });
            }
        });

        chipNode.color.forEach((c, i) => {
            if (c.getChildByName('Sprite').active) {
                myBets.push({
                    type: BetType.Color,
                    numbers: [],
                    amount: parseNumber(c.getChildByName('Label').getComponent(Label).string),
                    colorCombination: COLOR_COMBINATIONS[i]
                });
            }
        });

        const specialLowNode = chipNode.special[0];
        if (specialLowNode.getChildByName('Sprite').active) {
            myBets.push({
                type: BetType.SpecialLow,
                numbers: [...SPECIAL_LOW_NUMBERS],
                amount: parseNumber(specialLowNode.getChildByName('Label').getComponent(Label).string)
            });
        }

        const specialStraight4Node = chipNode.special[1];
        if (specialStraight4Node.getChildByName('Sprite').active) {
            myBets.push({
                type: BetType.SpecialStraight,
                numbers: [],
                amount: parseNumber(specialStraight4Node.getChildByName('Label').getComponent(Label).string),
                specialStraight: 4
            });
        }

        const specialStraight3Node = chipNode.special[2];
        if (specialStraight3Node.getChildByName('Sprite').active) {
            myBets.push({
                type: BetType.SpecialStraight,
                numbers: [],
                amount: parseNumber(specialStraight3Node.getChildByName('Label').getComponent(Label).string),
                specialStraight: 3
            });
        }

        const specialHighNode = chipNode.special[3];
        if (specialHighNode.getChildByName('Sprite').active) {
            myBets.push({
                type: BetType.SpecialHigh,
                numbers: [...SPECIAL_HIGH_NUMBERS],
                amount: parseNumber(specialHighNode.getChildByName('Label').getComponent(Label).string)
            });
        }

        return myBets;
    }

    private calculateWinnings(bets: Bet[], winningNumbers: number[]): number {

        console.log(bets);

        let totalWinnings = 0;

        for (const bet of bets) {

            const hits = bet.numbers.filter(num => winningNumbers.includes(num)).length;

            console.log('Before filter:', {
                betNumbers: bet.numbers,
                winningNumbers: winningNumbers,
                winningNumbersLength: winningNumbers.length
            });

            console.log(hits);
            console.log(bet.type);

            if (hits === 0 && bet.type !== BetType.Color && bet.type !== BetType.SpecialStraight) continue;

            const amount = bet.amount;
            let payKey = '';

            console.log('if문 통과했다!');

            switch (bet.type) {
                case BetType.StraightUp:
                    totalWinnings += amount * PayoutTable.Basic[bet.type].pays + amount;
                    break;

                case BetType.Color:
                    const color = getColorCombination(winningNumbers);
                    if (color === bet.colorCombination) {
                        totalWinnings += amount * PayoutTable.Basic[bet.type][color]?.pays + amount;
                    }
                    break;

                case BetType.SpecialStraight:
                    payKey = `${bet.specialStraight}Hits`;
                    const sorted = [...winningNumbers].sort((a, b) => a - b);
                    const isConsecutive1 = sorted[1] === sorted[0] + 1;
                    const isConsecutive2 = sorted[2] === sorted[1] + 1;
                    const isConsecutive3 = sorted[3] === sorted[2] + 1;
                    if (bet.specialStraight === 4) {
                        if (isConsecutive1 && isConsecutive2 && isConsecutive3) {
                            totalWinnings += amount * PayoutTable.Basic[bet.type][payKey].pays + amount;
                        }
                    }
                    else if (bet.specialStraight === 3) {
                        if ((isConsecutive1 && isConsecutive2) || (isConsecutive2 && isConsecutive3)) {
                            totalWinnings += amount * PayoutTable.Basic[bet.type][payKey].pays + amount;
                        }
                    }
                    break;

                default:
                    payKey = hits === 1 ? '1Hit' : `${hits}Hits`;

                    console.log(payKey);

                    console.log(PayoutTable.Basic[bet.type][payKey]);

                    if (PayoutTable.Basic[bet.type][payKey]) {

                        console.log(PayoutTable.Basic[bet.type][payKey].pays, amount);


                        totalWinnings += amount * PayoutTable.Basic[bet.type][payKey].pays + amount;
                    }
                    break;
            }
        }

        return totalWinnings;
    }
}

function emit(...args: any[]) {
    EventManager.instance.node.emit(evtNode.commonManager, args);
}


