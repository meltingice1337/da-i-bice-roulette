const WinningsHelper = {
    getWinningOds: (betType) => {
        if (/^\d+$/.test(betType)) {
            return 36;
        } else if (/^([123](?:st|nd|rd) 12)|(2 to 1(?: \d)?)$/.test(betType)) {
            return 3;
        } else {
            return 2;
        }
    },
    isWinningBet: (winningNumber, betType) => {
        if (betType === '2 to 1 1') {
            return [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(winningNumber)
        } else if (betType === '2 to 1 2') {
            return [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(winningNumber)
        } else if (betType === '2 to 1 3') {
            return [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(winningNumber)
        } else if (betType === '1st 12') {
            return 1 <= winningNumber && winningNumber <= 12;
        } else if (betType === '2nd 12') {
            return 13 <= winningNumber && winningNumber <= 24;
        } else if (betType === '3rd 12') {
            return 25 <= winningNumber && winningNumber <= 36;
        } else if (betType === '1 to 18') {
            return 1 <= winningNumber && winningNumber <= 18;
        } else if (betType === '19 to 36') {
            return 1 <= winningNumber && winningNumber <= 18;
        } else if (betType === 'Even') {
            return winningNumber % 2 === 0 && winningNumber !== 0;
        } else if (betType === 'Odd') {
            return winningNumber % 2 === 1 && winningNumber !== 0;
        } else if (betType === 'RED') {
            return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(winningNumber)
        } else if (betType === 'BLACK') {
            return [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(winningNumber)
        } else {
            return Number.parseInt(betType) === winningNumber;
        }
    },
    calculateWin: (winningNumber, betMap) => {
        return Object.keys(betMap)
            .reduce(
                (acc, betType) =>
                    WinningsHelper.isWinningBet(Number.parseInt(winningNumber), betType)
                        ? acc + WinningsHelper.getWinningOds(betType) * betMap[betType]
                        : acc,
                0);
    }
}
export default WinningsHelper;