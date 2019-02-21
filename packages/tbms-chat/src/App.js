import 'babel-polyfill';
import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import styles from './App.css';

import YUNXINSDK from 'tbms-brandsdk-yunxin/build/index';

class App extends Component {
  constructor() {
    super();
    this.sdk = new YUNXINSDK({
      uid: 'Alice',
      onmsg: () => {},
      onofflinemsg: () => {},
      onerror: () => {},
      onclose: () => {},
      onconversation: () => {},
      onsystemmsg: () => {},
      onlogin: () => {}
    });
  }
  render() {
    return (
      <View style={styles.app}>
        <View style={styles.appHeader}>
          <Text style={styles.appBanner}>Welcome to Rax</Text>
        </View>
        <Text style={styles.appIntro}>
          To get started, edit src/App.js and save to reload.
        </Text>
      </View>
    );
  }
}

export default App;
