import React from 'react'
import { View, TouchableNativeFeedback, Text, StyleSheet } from 'react-native';
import { RouleteChip } from './RouleteChip';

export class RouleteBet extends React.Component {

    constructor(props) {
        super(props);
        this.onPress = this.onPress.bind(this);
    }

    render() {
        return (
            <TouchableNativeFeedback onPress={this.onPress} background={TouchableNativeFeedback.Ripple()}>
                <View style={styles.rouleteBetContainer}>
                    <Text style={{ ...styles.rouleteBetText, ...this.getRotationStyle(), ...this.getStrectchedTextStyle() }}>{this.props.value}</Text>
                    {this.renderRouleteChip()}
                </View>
            </TouchableNativeFeedback>
        );
    }

    renderRouleteChip() {
        let betMapValue = this.props.value;
        if (this.props.id) {
            betMapValue = `${betMapValue} ${this.props.id}`;
        }
        return (
            this.props.betMap &&
            this.props.betMap.hasOwnProperty(betMapValue) &&
            <RouleteChip value={this.props.betMap[betMapValue]} />
        )

    }

    onPress() {
        let value = this.props.value;
        if (this.props.id) {
            value = `${value} ${this.props.id}`;
        }
        this.props.onPress && this.props.onPress(value);
    }

    getRotationStyle() {
        return this.props.rotate ? styles.verticalText : null;
    }

    getStrectchedTextStyle() {
        return this.props.stretched ? styles.stretchedText : null;
    }
}

const styles = StyleSheet.create({
    rouleteBetContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'green',
        borderRightWidth: 0,
    },
    verticalText: {
        transform: [{ rotate: '90deg' }]
    },
    rouleteBetText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },

    stretchedText: {
        fontSize: 14,
    }
});