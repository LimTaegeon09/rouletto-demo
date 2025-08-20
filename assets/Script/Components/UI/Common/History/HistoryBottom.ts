import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { RED_NUMBERS } from 'db://assets/Script/Configs/Config';
const { ccclass, property } = _decorator;

@ccclass('HistoryBottom')
export class HistoryBottom extends Component {
    private RgbNode: Node = null;
    private LmhNode: Node = null;
    private EoNode: Node = null;

    protected onLoad(): void {
        this.RgbNode = this.node.getChildByName('R_G_B');
        this.LmhNode = this.node.getChildByName('L_M_H');
        this.EoNode = this.node.getChildByName('E_O');
    }

    public setGage(numbers: number[][]) {
        this.setRgb(numbers);
        this.setLmh(numbers);
        this.setEo(numbers);
    }

    private setRgb(numbers: number[][]) {
        const percentages = calculateColorPercentages(numbers);

        const rSprNode = this.RgbNode.getChildByName('RGageSpr');
        const gSprNode = this.RgbNode.getChildByName('GGageSpr');
        const bSprNode = this.RgbNode.getChildByName('BGageSpr');
        const rLabel = this.RgbNode.getChildByName('RPercentLabel').getComponent(Label);
        const gLabel = this.RgbNode.getChildByName('GPercentLabel').getComponent(Label);
        const bLabel = this.RgbNode.getChildByName('BPercentLabel').getComponent(Label);

        rSprNode.active = true;
        rSprNode.getComponent(UITransform).width = 188 * percentages.red / 100;

        gSprNode.active = true;
        gSprNode.getComponent(UITransform).width = 188 * percentages.green / 100;
        gSprNode.setPosition(
            rSprNode.getPosition().x + rSprNode.getComponent(UITransform).width,
            gSprNode.getPosition().y
        );

        bSprNode.active = true;
        bSprNode.getComponent(UITransform).width = 188 * percentages.black / 100;

        rLabel.string = percentages.red + '%';
        gLabel.string = percentages.green + '%';
        bLabel.string = percentages.black + '%';
    }

    private setLmh(numbers: number[][]) {
        const percentages = calculateSumCategoryPercentages(numbers);

        const lSprNode = this.LmhNode.getChildByName('LGageSpr');
        const mSprNode = this.LmhNode.getChildByName('MGageSpr');
        const hSprNode = this.LmhNode.getChildByName('HGageSpr');
        const lLabel = this.LmhNode.getChildByName('LPercentLabel').getComponent(Label);
        const mLabel = this.LmhNode.getChildByName('MPercentLabel').getComponent(Label);
        const hLabel = this.LmhNode.getChildByName('HPercentLabel').getComponent(Label);

        lSprNode.active = true;
        lSprNode.getComponent(UITransform).width = 188 * percentages.low / 100;

        mSprNode.active = true;
        mSprNode.getComponent(UITransform).width = 188 * percentages.mid / 100;
        mSprNode.setPosition(
            lSprNode.getPosition().x + lSprNode.getComponent(UITransform).width,
            mSprNode.getPosition().y
        );

        hSprNode.active = true;
        hSprNode.getComponent(UITransform).width = 188 * percentages.high / 100;

        lLabel.string = percentages.low + '%';
        mLabel.string = percentages.mid + '%';
        hLabel.string = percentages.high + '%';
    }

    private setEo(numbers: number[][]) {
        const percentages = calculateOddEvenPercentages(numbers);

        const eSprNode = this.EoNode.getChildByName('EGageSpr');
        const oSprNode = this.EoNode.getChildByName('OGageSpr');
        const eLabel = this.EoNode.getChildByName('EPercentLabel').getComponent(Label);
        const oLabel = this.EoNode.getChildByName('OPercentLabel').getComponent(Label);

        eSprNode.active = true;
        eSprNode.getComponent(UITransform).width = 188 * percentages.even / 100;

        oSprNode.active = true;
        oSprNode.getComponent(UITransform).width = 188 * percentages.odd / 100;

        eLabel.string = percentages.even + '%';
        oLabel.string = percentages.odd + '%';
    }
}

//!-/////////////////////////////////////////////////////////////////////////

// 색상별 등장 횟수와 비율을 담을 인터페이스 (타입 정의)
interface ColorPercentages {
    green: number;
    red: number;
    black: number;
}

/**
 * 여러 숫자 배열들에서 각 숫자에 해당하는 색상의 등장 비율을 계산합니다.
 * @param draws 4개의 숫자가 담긴 배열들의 배열
 * @returns {ColorPercentages} 각 색상의 등장 비율(%)이 담긴 객체
 */
function calculateColorPercentages(draws: number[][]): ColorPercentages {
    // 1. 모든 숫자를 하나의 배열로 합칩니다.
    const allNumbers = draws.flat();
    const totalCount = allNumbers.length;

    // 만약 데이터가 없다면 0%로 반환합니다.
    if (totalCount === 0) {
        return { green: 0, red: 0, black: 0 };
    }

    // 2. 각 색상이 몇 번 등장했는지 횟수를 셉니다.
    const colorCounts = { green: 0, red: 0, black: 0 };

    allNumbers.forEach(num => {
        if (num === 0) {
            colorCounts.green++;
        }
        else if (RED_NUMBERS.has(num)) {
            colorCounts.red++;
        }
        else {
            colorCounts.black++;
        }
    });

    // 1. 반올림 대신 소수점까지 정확한 비율을 먼저 계산합니다.
    const greenPercent = (colorCounts.green / totalCount) * 100;
    const redPercent = (colorCounts.red / totalCount) * 100;
    const blackPercent = (colorCounts.black / totalCount) * 100;

    // 2. 가장 작은 두 항목의 비율은 반올림합니다.
    const roundedGreen = Math.round(greenPercent);
    const roundedRed = Math.round(redPercent);
    const roundedBlack = Math.round(blackPercent);

    // 3. 반올림된 값들의 합계를 구합니다.
    const roundedTotal = roundedGreen + roundedRed + roundedBlack;

    // 4. 합계와 100의 차이(오차)를 계산합니다.
    const diff = 100 - roundedTotal;

    // 5. 오차를 가장 큰 비율을 가진 항목에 더해줍니다.
    //    (이 방법은 가장 일반적인 '최대 나머지 방법'의 단순화 버전입니다.)
    const percentages = {
        green: roundedGreen,
        red: roundedRed,
        black: roundedBlack
    };

    const percents = [greenPercent, redPercent, blackPercent];
    const maxPercent = Math.max(...percents);

    if (diff !== 0) {
        if (maxPercent === greenPercent) percentages.green += diff;
        else if (maxPercent === redPercent) percentages.red += diff;
        else percentages.black += diff;
    }

    return percentages;
}

//!-/////////////////////////////////////////////////////////////////////////

// 합계의 카테고리(low, mid, high)를 정의합니다.
enum SumCategory {
    Low = 'low',
    Mid = 'mid',
    High = 'high',
    None = 'none' // 범위에 속하지 않는 경우
}

// 각 카테고리의 백분율을 담을 인터페이스
interface CategoryPercentages {
    low: number;
    mid: number;
    high: number;
}

/**
 * 숫자의 합이 어떤 카테고리에 속하는지 판별하는 함수
 * @param sum 숫자의 합
 */
function getSumCategory(sum: number): SumCategory {
    if (sum >= 6 && sum <= 59) {
        return SumCategory.Low;
    }
    else if (sum >= 60 && sum <= 75) {
        return SumCategory.Mid;
    }
    else if (sum >= 76 && sum <= 138) {
        return SumCategory.High;
    }
    return SumCategory.None;
}

/**
 * 여러 숫자 배열들의 합계를 low, mid, high 카테고리로 분류하고,
 * 각 카테고리의 등장 비율을 100% 기준 정수로 계산합니다.
 * @param draws 4개의 숫자가 담긴 배열들의 배열
 * @returns {CategoryPercentages} 각 카테고리의 백분율이 담긴 객체
 */
function calculateSumCategoryPercentages(draws: number[][]): CategoryPercentages {
    const totalDraws = draws.length;

    if (totalDraws === 0) {
        return { low: 0, mid: 0, high: 0 };
    }

    // 1. 각 카테고리의 등장 횟수를 셉니다.
    const categoryCounts = { low: 0, mid: 0, high: 0 };
    draws.forEach(draw => {
        const sum = draw.reduce((acc, current) => acc + current, 0);
        const category = getSumCategory(sum);
        if (category !== SumCategory.None) {
            categoryCounts[category]++;
        }
    });

    // 2. 정확한 비율을 먼저 계산합니다.
    const lowPercent = (categoryCounts.low / totalDraws) * 100;
    const midPercent = (categoryCounts.mid / totalDraws) * 100;
    const highPercent = (categoryCounts.high / totalDraws) * 100;

    // 3. 각 비율을 반올림하고, 합계가 100%가 되도록 오차를 보정합니다.
    const roundedLow = Math.round(lowPercent);
    const roundedMid = Math.round(midPercent);
    const roundedHigh = Math.round(highPercent);

    const roundedTotal = roundedLow + roundedMid + roundedHigh;
    const diff = 100 - roundedTotal;

    const percentages: CategoryPercentages = {
        low: roundedLow,
        mid: roundedMid,
        high: roundedHigh
    };

    if (diff !== 0) {
        const percents = [lowPercent, midPercent, highPercent];
        const maxPercent = Math.max(...percents);

        if (maxPercent === lowPercent) percentages.low += diff;
        else if (maxPercent === midPercent) percentages.mid += diff;
        else percentages.high += diff;
    }

    return percentages;
}

//!-/////////////////////////////////////////////////////////////////////////

// 홀수/짝수 백분율을 담을 인터페이스
interface OddEvenPercentages {
    odd: number;
    even: number;
}

/**
 * 여러 숫자 배열들의 합계가 홀수인지 짝수인지 분류하고,
 * 각 카테고리의 등장 비율을 100% 기준 정수로 계산합니다.
 * (배열에 0이 포함된 경우 해당 배열은 통계에서 제외됩니다.)
 * @param draws 4개의 숫자가 담긴 배열들의 배열
 * @returns {OddEvenPercentages} 홀수/짝수의 백분율이 담긴 객체
 */
function calculateOddEvenPercentages(draws: number[][]): OddEvenPercentages {
    let evenCount = 0;
    let validDrawsCount = 0; // 0을 포함하지 않는 유효한 배열의 개수

    // 1. 각 배열을 순회합니다.
    draws.forEach(draw => {
        // ★★ 추가된 조건: 배열에 0이 포함되어 있다면, 건너뜁니다. ★★
        if (draw.includes(0)) {
            return; // forEach 반복문에서 continue와 같은 역할을 합니다.
        }

        // 0이 포함되지 않은 유효한 배열이므로, 카운트를 1 증가시킵니다.
        validDrawsCount++;

        // 합계를 계산하고 짝수인지 확인합니다.
        const sum = draw.reduce((acc, current) => acc + current, 0);
        if (sum % 2 === 0) {
            evenCount++;
        }
    });

    // 2. 유효한 데이터가 없는 경우 0%를 반환합니다.
    if (validDrawsCount === 0) {
        return { odd: 0, even: 0 };
    }

    // 3. '유효한 배열의 총 개수'를 기준으로 비율을 계산합니다.
    const evenPercent = Math.round((evenCount / validDrawsCount) * 100);
    const oddPercent = 100 - evenPercent;

    return {
        odd: oddPercent,
        even: evenPercent
    };
}



