import {createElement, Component, render, findDOMNode} from 'rax';
import View from 'rax-view';
import merge from 'lodash/merge'
import { _ } from 'tbms-util';
import Toast from 'universal-toast';
import { InputText, EmojiPlugin } from 'rax-tbms-chat-plugin'
import ScrollView from 'rax-scrollview';
import componentParser from 'rax-tbms-chat-parser';
import * as biz from './biz';


const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EDEDED',
  },
  containerBody: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20
  }
}

import YUNXINSDK from 'tbms-brandsdk-yunxin';

const AVATOR_MAP = {
  'bob': 'https://img.alicdn.com/tfs/TB1n662KYvpK1RjSZPiXXbmwXXa-748-560.jpg',
  'alice': 'https://img.alicdn.com/tfs/TB1LeT1K9zqK1RjSZPxXXc4tVXa-680-680.jpg'
};


const SCROLLTOP = 100000;

class App extends Component {
  constructor() {
    super();
    this.query = _.getQueryParam(location.search);
    this.state = {
      inputText: '',
      pluginVisible: '',
      MessageList: []
    };

    const { uid, touid } = this.query;
    if (!uid || !touid) {
      Toast.show('uid and touid must be set!!!');
      return;
    }
    this.sdk = new YUNXINSDK({
      uid: uid,
      touid: touid,
      onmsg: this.onMsg.bind(this),
      onofflinemsg: this.onOfflineMsg.bind(this),
      onerror: this.onError.bind(this),
      onconversation: this.onConversation.bind(this),
      onsystemmsg: this.onSystemMsg.bind(this),
      onlogin: this.onLogin.bind(this)
    });
    // 初始化会话
    this.conversation = {
      uid: uid,
      touid: touid,
      uidAvator: AVATOR_MAP[uid.toLowerCase()],
      touidAvator: AVATOR_MAP[touid.toLowerCase()]
    }

    // 设置头像参数
    this.titleParse = biz.titleParse(touid);

    
  }
  onMsg(msg) {
    const MessageList = this.state.MessageList;

    componentParser.dispatch(msg, this.conversation).then(ctx => {
      const ItemComponent = ctx.ItemComponent;
      // 设置页面title
      this.titleParse(ctx.message);
      // push消息组件
      MessageList.push(<ItemComponent {...ctx.message} />);
      // 更新节点
      this.setState({
        MessageList
      }, () => {
        this.horizontalScrollView.scrollTo({y: SCROLLTOP});
      })
    })
  }

  onOfflineMsg(msg) {
    const MessageList = this.state.MessageList; 
    if (_.isObject(msg)) {
      componentParser.dispatch(msg, this.conversation).then((ctx) => {
        const ItemComponent = ctx.ItemComponent;
        MessageList.unshift(<ItemComponent {...ctx.message} />);
        // 更新节点
        this.setState({
          MessageList,
        }, () => {
          const scrollTop = findDOMNode(this.refs['body']).offsetHeight - this.containerHeight;
          this.horizontalScrollView.scrollTo({y: scrollTop});
        })
      })
    } else {
      this.setState({
        isEmpty: true
      })
    }
    componentParser.dispatch(msg, this.conversation).then(ctx => {
      ctx;
    })
  }
  onSystemMsg(msg) {
    Toast.show(msg.content || '这是一条系统消息');
  }
  
  onConversation(conversation) {
    
    this.conversation = merge(this.conversation, conversation);
  }

  onLogin() {
    Toast.show('登入成功');
    this.sdk.getHistoryMessage({
      scene: 'p2p',
      to: this.conversation.touid,  
    })
  }

  onError(err) {
    Toast.show(JSON.stringify(err));
  }

  handleEmojiChange = (word) => {
    this.setState({
      inputText: `${this.state.inputText}${word}`
    });
  }

  handleChangeText = (text) => {
    this.setState({
      inputText: text
    })
  }
  handleSendText = (text) => {
    const content = (text || this.state.inputText).trim()
    if (content) {
      this.sdk.sendMsg({
        type: 'text',
        content: content
      });
      this.setState({
        inputText: ''
      })
    } else {
      Toast.show('亲，输入内容不能为空哦！')
    }
  }
  handlePluginChange = (type) => {
    if (this.state.pluginVisible) {
      this.setState({
        pluginVisible: ''
      })
      
    } else {
      this.setState({
        pluginVisible: type
      });
    }
    
  }
  renderPlugin() {
    if (this.state.pluginVisible === 'emoji') {
      return <EmojiPlugin onChange={this.handleEmojiChange} onSend={this.handleSendText} type="ww" />;
    } else {
      return null;
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.containerBody}
          ref={(scrollView) => {this.horizontalScrollView = scrollView;}}
        >
        <View ref="body">
        {this.state.MessageList}
        </View>
        </ScrollView>

        <InputText text={this.state.inputText}
          onPluginChange={this.handlePluginChange}
          onFocus={this.handleFocus}
          onChange={this.handleChangeText}
          onSubmit={this.handleSendText}
          showPlugin={false}
        />
        {this.renderPlugin()}
      </View>
    );
  }
}

render(<App />);
