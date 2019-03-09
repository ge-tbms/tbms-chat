import { _ } from 'tbms-util';
const scrollTitle = _.scrollDocumentTitle();

export const titleParse = (targetName) => {
  let timer = null;
  let title = '';
  document.title = targetName;
  return (msg) => {
    switch (msg.type) {
      case 'text':
        title = msg.content;
        break;
      case 'image':
        title = '[图片]';
        break;
      case 'system':
        title = '[系统消息]';
        break;
      default:
        break;
    }
    
    // 第一次，单例
    if (!timer) {
      window.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          timer = scrollTitle(title);
        } else {
          clearTimeout(timer);
          document.title = targetName;
        }
      });
    }
  
    // 不在当前页的时候显示
    if (document.hidden) {
      timer = scrollTitle(title);
    }
  }
}