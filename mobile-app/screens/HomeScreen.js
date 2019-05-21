import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  View,
  TouchableNativeFeedback
} from 'react-native';

import { RouleteBoard } from '../components/RouleteBoard';
import { RouleteBet } from '../components/RouleteBet';
import { RouleteNumber } from '../components/RouleteNumber';
import ActionButton from '../components/ActionButton';
import WinningsHelper from '../helpers/WinningsHelper';

export default class HomeScreen extends React.Component {
  static navigationOptions = { header: null }

  constructor(props) {
    super(props);
    this.state = {
      betMap: {},
      betHistory: [],
      credits: 1000
    }

    this.onPress = this.onPress.bind(this);
    this.onUndo = this.onUndo.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rouleteActions}>
        </View>
        <View style={styles.rouleteContainer}>
          <View style={styles.rouleteColumn}>
            <View style={styles.columnBetting}>
              <RouleteNumber betMap={this.state.betMap} onPress={this.onPress} value={0} />
            </View>
          </View>
          <View style={{ ...styles.rouleteColumn, ...styles.mainBoardContainer }}>
            <View style={{ ...styles.rowBetting, ...{ flex: 0.7 } }}>
              <RouleteBoard betMap={this.state.betMap} onPress={this.onPress} />
            </View>
            <View style={{ ...styles.rowBetting, ...{ flex: 0.15 } }}>
              <View style={styles.rowBetting}>
                <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="1st 12" stretched={true} />
                <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="2nd 12" stretched={true} />
                <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="3rd 12" stretched={true} />
              </View>
            </View>
            <View style={{ ...styles.rowBetting, ...{ flex: 0.15 } }}>
              <View style={{ ...styles.rowBetting, ...styles.halfRowBetting }}>
                <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="1 to 18" />
                <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="Even" />
              </View>
              <View style={{ ...styles.rowBetting, ...styles.halfRowBetting }}>
                <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="RED" />
                <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="BLACK" />
              </View>
              <View style={{ ...styles.rowBetting, ...styles.halfRowBetting }}>
                <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="Odd" />
                <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="19 to 36" />
              </View>
            </View>
          </View>
          <View style={styles.rouleteColumn}>
            <View style={{ ...styles.columnBetting, ...{ borderColor: 'white', borderRightWidth: 2 } }}>
              <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="2 to 1" rotate={true} id={1} stretched={true} />
              <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="2 to 1" rotate={true} id={2} stretched={true} />
              <RouleteBet betMap={this.state.betMap} onPress={this.onPress} value="2 to 1" rotate={true} id={3} stretched={true} />
            </View>
          </View>
        </View>
        <View style={styles.rouleteActions}>
          <View style={styles.creditsContainer}>
            <Text style={{ color: 'white' }}>Credits: {this.state.credits}</Text>
          </View>
          <ActionButton style={styles.undoAction} disabled={this.state.betHistory.length === 0} onPress={this.onUndo} title="Undo" />
          <ActionButton disabled={this.state.betHistory.length === 0} onPress={this.onReset} title="Reset" />

        </View>
      </View>
    );
  }

  componentWillMount() {
    StatusBar.setHidden(true);
  }

  componentDidMount() {
    Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.LANDSCAPE);
  }

  onPress(betType) {
    if (this.state.credits > 0) {
      const betMap = { ...this.state.betMap };
      const betHistory = [...this.state.betHistory];
      const creditsIncrease = 100;
      betMap[betType] = betMap[betType] ? betMap[betType] + creditsIncrease : creditsIncrease;
      betHistory.push({ betType, creditsIncrease });

      this.setState({ betMap, betHistory, credits: this.state.credits - creditsIncrease });
    }
  }

  onUndo() {
    if (this.state.betHistory.length > 0) {
      const lastBet = this.state.betHistory[this.state.betHistory.length - 1];
      const betMap = { ...this.state.betMap }
      betMap[lastBet.betType] -= lastBet.creditsIncrease;
      if (betMap[lastBet.betType] === 0) {
        delete betMap[lastBet.betType];
      }

      this.setState({
        betHistory: this.state.betHistory.slice(0, this.state.betHistory.length - 1),
        credits: this.state.credits + lastBet.creditsIncrease,
        betMap,
      });
    }
  }

  onReset() {
    // this.setState({ betMap: {}, betHistory: [], credits: 1000 });
    min = Math.ceil(0);
    max = Math.floor(36);
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log({ number, winning: WinningsHelper.calculateWin(number, this.state.betMap) });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08450A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rouleteContainer: {
    flex: 0.7,
    width: '90%',
    flexDirection: 'row'
  },
  columnBetting: {
    flex: 0.7,
    flexDirection: 'column'
  },
  mainBoardContainer: {
    flex: 0.8
  },
  rouleteColumn: {
    flex: 0.1,
  },
  rowBetting: {
    flex: 1,
    flexDirection: 'row'
  },
  halfRow: {
    flex: 0.5
  },
  rouleteActions: {
    flex: 0.15,
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1
  },
  creditsContainer: {
    flex: 1,
  },
  undoAction: {
    marginRight: 10
  }
});
