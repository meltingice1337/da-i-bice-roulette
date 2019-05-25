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
import * as Progress from 'react-native-progress';

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
      credits: 1000,
      initialCredits: 1000,
      gameStatus: {
        "status": null,
        "spinNumber": null,
        "timeLeft": null,
        "totalTime": 20,
        "lastWinningNumber": null
      },
      winningMessage: null
    }

    this.onPress = this.onPress.bind(this);
    this.onUndo = this.onUndo.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onRefill = this.onRefill.bind(this);

    setInterval(this.checkStatus.bind(this), 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rouleteActions}>
          <View>
            <Text style={styles.spinNumber}>Spin #{this.state.gameStatus.spinNumber}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
            <Progress.Bar progress={this.calculateProgressValue()} width={null} />
            <Text style={{ ...styles.spinNumber, ...styles.gameState }}>{this.state.gameStatus.status === 'WaitingForSpin' ? 'Place your bets !' : 'No more bets ! Roulette Spinning ...'}</Text>
          </View>
          <View>
            <Text style={styles.spinNumber}>Number {this.state.gameStatus.lastWinningNumber}</Text>
          </View>
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
          {this.renderWinning()}
          <ActionButton style={styles.undoAction} disabled={this.state.initialCredits !== 0} onPress={this.onRefill} title="Refill Credits" />
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

  checkStatus() {
    fetch('http://192.168.4.1/status', {
      method: 'GET'
    })
      .then(response => response.json())
      .then((gameStatus) => {
        if (gameStatus.status === 'WaitingForSpin' && this.state.gameStatus.status === 'Spinning') {
          const winning = WinningsHelper.calculateWin(gameStatus.lastWinningNumber, this.state.betMap);
          const newCredits = this.state.credits + winning;
          const winningMessage = `The winning number is: ${gameStatus.lastWinningNumber}. ` + (winning > 0 ? `You have won ${winning} credits !` : 'You didnt win anything !');
          setTimeout(() => { this.setState({ winningMessage: null }) }, 10000);
          this.setState({ initialCredits: newCredits, credits: newCredits, betMap: [], betHistory: [], winningMessage });
        }
        this.setState({ gameStatus });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  calculateProgressValue() {
    const { gameStatus } = this.state;
    if (gameStatus) {
      return (gameStatus.totalTime - gameStatus.timeLeft) / gameStatus.totalTime;
    } else {
      return 0;
    }
  }

  renderWinning() {
    return (
      <View style={{ flex: 1, width: '100%' }}>
        {this.state.winningMessage && <Text style={{ color: 'grey' }}>{this.state.winningMessage}</Text>}
      </View>
    )
  }

  onPress(betType) {
    if (this.state.gameStatus.status !== 'Spinning') {
      if (this.state.credits > 0) {
        const betMap = { ...this.state.betMap };
        const betHistory = [...this.state.betHistory];
        const creditsIncrease = 100;
        betMap[betType] = betMap[betType] ? betMap[betType] + creditsIncrease : creditsIncrease;
        betHistory.push({ betType, creditsIncrease });

        this.setState({ betMap, betHistory, credits: this.state.credits - creditsIncrease });
      }
    }
  }

  onUndo() {
    if (this.state.gameStatus.status !== 'Spinning') {
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
  }

  onRefill() {
    if (this.state.initialCredits === 0) {
      this.setState({ credits: 1000, initialCredits: 1000 });
    }
  }

  onReset() {
    if (this.state.gameStatus.status !== 'Spinning') {
      this.setState({ betMap: {}, betHistory: [], credits: this.state.initialCredits });
    }
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
  },
  gameState: {
    position: 'absolute',
    top: 10,
    width: '100%',
    textAlign: 'center'
  },
  spinNumber: {
    color: 'white'
  },
  creditsContainer: {
    marginRight: 10
  },
  undoAction: {
    marginRight: 10
  }
});
