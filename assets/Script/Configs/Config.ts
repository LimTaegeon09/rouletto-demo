import { Node } from 'cc';
import { PayoutTable } from './PayoutTable';

export const isPlayableForPREVIEW: boolean = true; // for Test

export const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
export const BLACK_NUMBERS = new Set([2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]);

export const COLUMN_NUMBERS = [
    new Set([3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]),
    new Set([2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35]),
    new Set([1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34])
];

export const DOZEN_NUMBERS = [
    new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    new Set([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]),
    new Set([25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36])
];

export const SPECIAL_LOW_NUMBERS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
export const SPECIAL_HIGH_NUMBERS = new Set([19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]);

export const COLOR_COMBINATIONS = Object.keys(PayoutTable.Basic.color);

//!-------------------------------------------------------------

export interface BettingInfo {
    chipNode?: Node;
    betMoney?: number;
    betInfoArr?: BettingInfo[]
}

export enum panelState {
    basic = 'Basic',
    fourSum = 'FourSum',
    jackpot = 'Jackpot'
};

export enum volumeState {
    off,
    low,
    mid,
    high
};

interface currencyInfo {
    symbol: string,
    bmFont: string,
    code: string
}

export const currency: Record<string, currencyInfo> = {
    Cent: {
        symbol: '¢',
        bmFont: 'C',
        code: 'Cent'
    },
    CNY: {
        symbol: '¥',
        bmFont: 'Y',
        code: 'CNY'
    },
    KRW: {
        symbol: '₩',
        bmFont: 'W',
        code: 'KRW'
    },
    PHP: {
        symbol: '₱',
        bmFont: 'P',
        code: 'PHP'
    },
    USD: {
        symbol: '$',
        bmFont: 'S',
        code: 'USD'
    }
}

//!-------------------------------------------------------------

export var gameConfig = {
    panel: panelState.basic,
    volume: volumeState.off,
    chip: 1,
    denom: 1,
    currentBet: 1,
    isAutoReBet: false,
    isJackpotWin: false,
    currency: currency.USD
};

export var moneyConfig = {
    credit: 0,
    win: 0,
    bet: 0,
    basicBet: 0,
    fourSumBet: 0,
    jackpotBet: 0,
    jackpotWin: 0
};

export var Console = {
    css: (...data: any[]) => {
        //if (WS.domain == domains.release) return;

        if (data[2] != null) console.log(data[0], data[1], data[2]);
        else console.log(data[0], data[1]);
    },
    group: (...data: any[]) => {
        //if (WS.domain == domains.release) return;

        console.group(data[0], data[1]);
    },
    groupCollapsed: (...data: any[]) => {
        //if (WS.domain == domains.release) return;

        console.groupCollapsed(data[0], data[1]);
    },
    groupEnd: () => {
        //if (WS.domain == domains.release) return;

        console.groupEnd();
    }
};

//!-------------------------------------------------------------

declare global {
    interface Window {
        onresize: any,
        videosize: any,
    }
};
