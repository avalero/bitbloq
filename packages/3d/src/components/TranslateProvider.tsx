import * as React from 'react';

export const TranslateContext = React.createContext((id: string) => id);

interface TranslateProviderProps {
  messagesFiles: any;
}

class TranslateProvider extends React.Component<TranslateProviderProps> {
  readonly state = {
    messages: null,
  };

  componentDidMount() {
    this.getLanguageMessages();
  }

  async getLanguageMessages() {
    const {messagesFiles} = this.props;
    const language = navigator.language;
    const langCode = language.split('-')[0] || language;

    const langFile = messagesFiles[langCode] || messagesFiles.en;

    const response = await fetch(langFile);
    const messages = await response.json();
    this.setState({messages});
  }

  render() {
    const messages = this.state.messages || {};

    const translateFn = (id: string) => {
      if (messages[id]) return messages[id];
      console.warn(`Missing translation for ${id}`);
      return id;
    };

    return (
      <TranslateContext.Provider value={translateFn}>
        {this.state.messages ? this.props.children : <div />}
      </TranslateContext.Provider>
    );
  }
}

export const Translate = TranslateContext.Consumer;

interface WithTranslateProps {
  t: () => string;
}

export const withTranslate = <P extends object>(
  Component: React.ComponentType<P>,
) =>
  class WithTranslate extends React.Component<P & WithTranslateProps> {
    render() {
      return <Translate>{t => <Component t={t} {...this.props} />}</Translate>;
    }
  };

export default TranslateProvider;
