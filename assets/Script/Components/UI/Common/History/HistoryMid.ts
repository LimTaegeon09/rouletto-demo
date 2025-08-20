import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { RED_NUMBERS } from 'db://assets/Script/Configs/Config';
const { ccclass, property } = _decorator;

@ccclass('HistoryMid')
export class HistoryMid extends Component {
    private hotNodes: Node[];
    private coldNodes: Node[];

    protected onLoad(): void {
        this.hotNodes = this.node.getChildByName('Hot').children;
        this.coldNodes = this.node.getChildByName('Cold').children;
    }

    public setHotCold(numbers: Array<any>) {
        this.setHot(numbers);
        this.setCold(numbers);
    }

    private setHot(numbers: number[][]) {
        const topNumbers = getTop5FrequentNumbers(numbers);

        topNumbers.forEach((t, i) => {
            this.setNumber(this.hotNodes[i], t);
        });
    }

    private setCold(numbers: number[][]) {
        const leastNumbers = getLeast5FrequentNumbers(numbers);

        leastNumbers.forEach((l, i) => {
            this.setNumber(this.coldNodes[i], l);
        });
    }

    private setNumber(node: Node, number: number) {
        const label = node.getChildByName('Label').getComponent(Label);
        label.string = String(number);

        const spr = node.getComponent(Sprite);
        spr.spriteFrame = spr.spriteAtlas.getSpriteFrame(this.getHistorySpriteFrame(number));
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

//!-/////////////////////////////////////////////////////////////////////////

/**
 * 여러 숫자 배열들에서 각 숫자의 등장 빈도를 계산하여,
 * 빈도가 높은 순 & 낮은 숫자 순으로 상위 5개를 정렬하여 반환합니다.
 * @param draws 4개의 숫자가 담긴 배열들의 배열 (예: [[1,2,3,4], [3,4,5,6]])
 * @returns {number[]} 정렬된 상위 5개의 숫자 배열
 */
function getTop5FrequentNumbers(draws: number[][]): number[] {
    // 1. 모든 숫자의 등장 빈도를 계산합니다.
    const frequencyMap = new Map<number, number>();

    // `flat()`으로 2차원 배열을 1차원 배열로 만듭니다.
    draws.flat().forEach(num => {
        const currentCount = frequencyMap.get(num) || 0;
        frequencyMap.set(num, currentCount + 1);
    });

    // 2. 정렬을 위해 Map을 배열 형태로 변환합니다.
    // 예: [{number: 5, frequency: 3}, {number: 10, frequency: 2}]
    const frequencyArray = Array.from(frequencyMap, ([number, frequency]) => ({
        number,
        frequency
    }));

    // 3. 정렬 규칙에 따라 배열을 정렬합니다.
    frequencyArray.sort((a, b) => {
        // 주 정렬: 빈도가 높은 순서 (내림차순)
        if (a.frequency !== b.frequency) {
            return b.frequency - a.frequency;
        }
        // 보조 정렬: 빈도가 같으면 낮은 숫자가 먼저 (오름차순)
        return a.number - b.number;
    });

    // 4. 정렬된 배열에서 상위 5개의 숫자만 추출하여 반환합니다.
    return frequencyArray.slice(0, 5).map(item => item.number);
}

function getLeast5FrequentNumbers(draws: number[][]): number[] {
    const frequencyMap = new Map<number, number>();

    draws.flat().forEach(num => {
        const currentCount = frequencyMap.get(num) || 0;
        frequencyMap.set(num, currentCount + 1);
    });

    const frequencyArray = Array.from(frequencyMap, ([number, frequency]) => ({
        number,
        frequency
    }));

    frequencyArray.sort((a, b) => {
        if (a.frequency !== b.frequency) {
            return a.frequency - b.frequency;
        }
        return a.number - b.number;
    });

    return frequencyArray.slice(0, 5).map(item => item.number);
}

