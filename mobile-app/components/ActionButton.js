import React from 'react';
import { TouchableOpacity, View, Text, TouchableNativeFeedback, StyleSheet } from 'react-native';
export default class ActionButton extends React.Component {
    render() {
        return (
            <TouchableOpacity disabled={this.props.disabled} activeOpacity={0.5} onPress={this.props.onPress} background={TouchableNativeFeedback.Ripple()}>
                <View style={[styles.action, this.props.disabled ? styles.disabledAction : null, this.props.style ? this.props.style : null]}>
                    <Text style={{ fontSize: 13 }}>{this.props.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    action: {
        alignSelf: 'flex-end',
        backgroundColor: '#92BDA3',
        padding: 5,
        borderRadius: 5,
    },
    disabledAction: {
        opacity: 0.5,
    }
})