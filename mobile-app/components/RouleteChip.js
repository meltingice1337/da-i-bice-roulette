import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export class RouleteChip extends React.Component {
    render() {
        if (this.props.value > 100) {
            return this.renderMany();
        } else {

            return (
                <View style={styles.multipleChipsContainer}>
                    <View style={styles.chipContainer}>
                        <View style={styles.chip}>
                            {/* <View style={{ width: 20, height: 20, backgroundColor: 'red', position: 'absolute' }} /> */}
                            <Text style={styles.chipValue}>{this.props.value}</Text>
                        </View>
                    </View>
                </View>
            )
        }
    }

    renderMany() {
        return (
            <View style={styles.multipleChipsContainer}>
                <View style={styles.chipContainer}>
                    <View style={styles.chip}>
                        {/* <View style={{ width: 20, height: 20, backgroundColor: 'red', position: 'absolute' }} /> */}
                    </View>
                </View>
                <View style={{ ...styles.chipContainer, ...styles.chipOver }}>
                    <View style={styles.chip}>
                        <Text style={styles.chipValue}>{this.props.value}</Text>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    "chipValue": {
        color: 'white',
        fontSize: 10,
    },
    "multipleChipsContainer": {
        position: 'absolute',
        borderRadius: 50,

    },
    "chipContainer": {
        borderRadius: 50,
        backgroundColor: '#212121',
        width: 32,
        height: 32,
    },
    "chip": {
        flex: 1,
        borderWidth: 3.2,
        borderStyle: 'dashed',
        borderColor: 'white',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    "chipOver": {
        position: 'absolute',
        left: 3,
        bottom: 3,
    }
})
