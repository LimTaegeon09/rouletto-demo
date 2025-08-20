export const PayoutTable = {
    Basic: {
        straightUp: { pays: 7.6 },
        split: {
            "2Hits": { pays: 24 },
            "1Hit": { pays: 2.5 }
        },
        street: {
            "3Hits": { pays: 80 },
            "2Hits": { pays: 12.5 },
            "1Hit": { pays: 1 }
        },
        column: {
            "4Hits": { pays: 8 },
            "3Hits": { pays: 2.1 },
            "2Hits": { pays: 1 }
        },
        dozen: {
            "4Hits": { pays: 8 },
            "3Hits": { pays: 2.1 },
            "2Hits": { pays: 1 }
        },
        color: {
            "B3_G1": { pays: 73 },
            "B4": { pays: 19 },
            "B3_R1": { pays: 3.1 },
            "B2_R2": { pays: 1.6 },
            "B1_R3": { pays: 3.1 },
            "R4": { pays: 19 },
            "R3_G1": { pays: 73 },
        },
        specialLow: {
            "4Hits": { pays: 3.8 },
            "3Hits": { pays: 2 },
        },
        specialStraight: {
            "4Hits": { pays: 1500 },
            "3Hits": { pays: 52 },
        },
        specialHigh: {
            "4Hits": { pays: 3.8 },
            "3Hits": { pays: 2 },
        }
    },
    FourSum: {
        greate88: { pays: 62 },
        lucky77: { pays: 49 },
        remainder8: { pays: 8 },
        remainder7: { pays: 8 },
        low: { pays: 2.2 },
        medium: { pays: 2.1 },
        high: { pays: 1.1 },
        A: { pays: 4 },
        B: { pays: 4.4 },
        C: { pays: 3 },
        D: { pays: 3.2 },
        E: { pays: 3.2 },
        even: { pays: 1 },
        zero: { pays: 7.5 },
        odd: { pays: 1 },
    },
    Jackpot: {
        "3Hits": { pays: 100 },
        "2Hits": { pays: 5 },
        "1Hit": { pays: 0 },
    }
}





