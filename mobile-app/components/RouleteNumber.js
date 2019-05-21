import React from 'react'
import { TouchableNativeFeedback, View, Text, StyleSheet } from 'react-native';

import { RouleteChip } from './RouleteChip';

export class RouleteNumber extends React.Component {

    constructor(props) {
        super(props)
        this.onPress = this.onPress.bind(this);
    }

    render() {
        return (
            <TouchableNativeFeedback onPress={this.onPress} background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={{ ...styles.container, ...this.getNumberColor(), ...this.props.style }}>
                    <Text style={styles.numberText}>{this.props.value}</Text>
                    {this.props.betMap && this.props.betMap.hasOwnProperty(this.props.value) && <RouleteChip value={this.props.betMap[this.props.value]} />}
                </View>
            </TouchableNativeFeedback>
        );
    }

    onPress() {
        this.props.onPress && this.props.onPress(this.props.value);
    }

    getNumberColor() {
        if (redNumbers.includes(this.props.value)) {
            return styles.redNumber;
        }
        if (blackNumbers.includes(this.props.value)) {
            return styles.blackNumber
        }
        if (greenNumbers.includes(this.props.value)) {
            return styles.greenNumber;
        }
        throw new Error('Wrong number wtf mate');
    }
}

const redNumbers = [1, 3, 5, 7, 9, 12,
    14, 16, 18, 19, 21, 23,
    25, 27, 30, 32, 34, 36];

const blackNumbers = [2, 4, 6, 8, 10, 11,
    13, 15, 17, 20, 22, 24,
    26, 28, 29, 31, 33, 35]

const greenNumbers = [0]

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        borderRightWidth: 0,
    },
    numberText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    redNumber: {
        backgroundColor: 'red',
    },
    blackNumber: {
        backgroundColor: 'black',
    },
    greenNumber: {
        backgroundColor: 'green',
    }
});