import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouleteNumber } from '../components/RouleteNumber';

export class RouleteBoard extends React.Component {
    numersBoardLayout =
        [
            [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
            [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
            [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
        ]

    constructor(props) {
        super(props)
        this.onPress = this.onPress.bind(this);
    }

    render() {
        return (
            <View style={styles.rouleteBoard}>
                {this.renderNumbersBoard()}
            </View>
        )
    }

    renderNumbersBoard() {
        return (
            <View style={styles.numbersBoardContainer}>
                <View style={styles.numbersBoardColumn}>
                    {this.numersBoardLayout.map(this.renderNumbersRow.bind(this))}
                </View>
            </View>
        )
    }

    renderNumbersRow(row, rowIndex) {
        return (
            <View key={`roulete-number-row-${rowIndex}`} style={styles.numbersBoardRow}>
                {row.map((number, i) =>
                    <RouleteNumber
                        onPress={this.onPress}
                        key={`roulete-number-${number}`}
                        value={number}
                        betMap={this.props.betMap}
                        style={i === row.length - 1 ? { borderRightWidth: 1 } : null} />
                )}
            </View>
        )
    }

    onPress(number) {
        this.props.onPress && this.props.onPress(number);
    }
}

const styles = StyleSheet.create({
    "rouleteBoard": {
        flex: 1,
        flexDirection: 'column',
    },
    numbersBoardContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    numbersBoardColumn: {
        flex: 1,
        flexDirection: 'column',
    },
    zeroBoardRow: {
        flex: 1,
    },
    numbersBoardRow: {
        flex: 1,
        flexDirection: 'row',
    },
})