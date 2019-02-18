import * as React from "react";
import { connect } from "react-redux";
import { keyDown, keyUp } from "../actions/ui";
import ThreeD from "./threed/ThreeD";

export interface AppProps {
  keyDown: (key: string) => any;
  keyUp: (key: string) => any;
}

class App extends React.Component<AppProps> {
  componentDidMount() {
    document.body.addEventListener("keydown", this.onBodyKeyDown);
    document.body.addEventListener("keyup", this.onBodyKeyUp);
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.onBodyKeyDown);
    document.body.removeEventListener("keyup", this.onBodyKeyUp);
  }

  onBodyKeyDown = (e: KeyboardEvent) => {
    this.props.keyDown(e.key);
  };

  onBodyKeyUp = (e: KeyboardEvent) => {
    this.props.keyUp(e.key);
  };

  render() {
    return (
      <div>
        <ThreeD {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = { keyDown, keyUp };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
