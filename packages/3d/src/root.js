import React from 'react';
import uuid from 'uuid/v1';
import { Provider } from 'react-redux';
import App from './components/App';
import createStore from './store';
import { createObject } from './actions/threed';
import config from './config/threed';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore();

    this.store.subscribe(() => {
      const state = this.store.getState();
      const content = state.threed.scene.objects;
      if (this.currentContent && content !== this.currentContent) {
        if (this.props.onContentChange) {
          this.props.onContentChange(content);
        }
      }
      this.currentContent = content;
    });
  }

  createObject(type, parameters, name) {
    const { advancedMode } = this.store.getState().threed.ui;
    const object = {
      id: uuid(),
      type,
      parameters,
      operations: config.defaultOperations(advancedMode),
      viewOptions: {
        name,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
      },
    };

    this.store.dispatch(createObject(object));
  }

  exportToSTL(name, separate) {
    const state = this.store.getState();
    const scene = state.threed.scene.sceneInstance;
    const nameToPass = name === '' ? 'scene' : name;
    scene.exportToSTLAsync(nameToPass, separate);
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
