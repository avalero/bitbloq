import React from 'react';
import { Provider } from 'react-redux';
import App from './components/App';
import createStore from './store';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore();

    this.store.subscribe(() => {
      const state = this.store.getState();
      const content = state.threed.scene.objects;
      if (this.currentContent && content !== this.currentContent) {
        if (props.onContentChange) {
          props.onContentChange(content);
        }
      }
      this.currentContent = content;
    });
  }

  exportToSTL() {
    const state = this.store.getState();
    const scene = state.threed.scene.sceneInstance;
    scene.exportToSTLAsync();
  }

  render() {
    return (
      <Provider store={this.store}>
        <App {...this.props} />
      </Provider>
    );
  }
}

export default Root;
