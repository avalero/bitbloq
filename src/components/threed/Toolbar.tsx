import * as React from 'react';
import {connect} from 'react-redux';
import styled from 'react-emotion';
import {
  createObject,
  undo,
  redo
} from '../../actions/threed';
import {getSelectedObjects} from '../../reducers/threed/';
import config from '../../config/threed';

const Container = styled.div`
  height: 50px;
  border-bottom: 1px solid #cfcfcf;
  padding: 0px 20px;
  display: flex;
`;

const Button = styled.div`
  background-color: #ebebeb;
  width: 60px;
  border-width: 0px 1px;
  border-style: solid;
  border-color: #cfcfcf;
  cursor: pointer;
`;

const Operations = styled.div`
  flex: 1;
  display: flex;
`;

const UndoRedo = styled.div`
  display: flex;
`;

class Toolbar extends React.Component {
  onComposeObjects(operation) {
    const {createObject, selectedObjects} = this.props;
    createObject(operation.create(selectedObjects));
  }

  render() {
    return (
      <Container>
        <Operations>
          {config.compositionOperations.map(operation => (
            <Button
              key={operation.name}
              onClick={() => this.onComposeObjects(operation)}>
              <img src={operation.icon} />
            </Button>
          ))}
        </Operations>
        <UndoRedo>
          <Button>Undo</Button>
          <Button>Redo</Button>
        </UndoRedo>
      </Container>
    );
  }
}

const mapStateToProps = ({threed}) => ({
  selectedObjects: getSelectedObjects(threed)
});

const mapDispatchToProps = {
  createObject,
  undo,
  redo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);

