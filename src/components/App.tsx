import * as React from "react";
import { connect } from "react-redux";
import { keyDown, keyUp, appClick } from "../actions/ui";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import Hardware from "./Hardware";
import Software from "./Software";
import ThreeD from "./threed/ThreeD";

export interface AppProps {
  keyDown: (key: string) => any;
  keyUp: (key: string) => any;
  appClick: (x: number, y: number) => any;
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

  onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.appClick(e.clientX, e.clientY);
  };

  render() {
    return (
      <div onClick={this.onClick}>
        <Router>
          <Switch>
            <Route path="/software" component={Software} />
            <Route path="/hardware" component={Hardware} />
            <Route path="/3d" component={ThreeD} />
            <Route render={() => <Redirect to="/3d" />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = { keyDown, keyUp, appClick };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
