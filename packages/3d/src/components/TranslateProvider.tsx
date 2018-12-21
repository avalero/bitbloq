import * as React from 'react';
import en from '../assets/messages/en.json';
import es from '../assets/messages/es.json';

const languageMessages = {
  en,
  es,
};

export const TranslateContext = React.createContext((id:string) => id);

const language = navigator.language;
const langCode = language.split('-')[0] || language;

class TranslateProvider extends React.Component {
  readonly state = {
    messages: null,
  };

  componentDidMount() {
    this.getLanguageMessages();
  }

  async getLanguageMessages() {
    const langFile = languageMessages[langCode] || languageMessages.en;

    const response = await fetch(langFile);
    const messages = await response.json();
    this.setState({messages});
  }

  render() {
    const messages = this.state.messages || {};

    const translateFn = (id:string) => {
      if (messages[id]) return messages[id];
      console.warn(`Missing translation for ${id} language ${langCode}`);
      return id;
    }

    return (
      <TranslateContext.Provider value={translateFn}>
        {this.state.messages ? this.props.children : <div />}
      </TranslateContext.Provider>
    );
  }
}

export const Translate = TranslateContext.Consumer;

export default TranslateProvider;
