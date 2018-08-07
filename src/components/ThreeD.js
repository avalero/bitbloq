import React from 'react';
import {connect} from 'react-redux';
import styled from 'react-emotion';
import BloqsEditor from './BloqsEditor';
import ThreeDViewer from './ThreeDViewer';
import {update3DBloqs} from '../actions/threed';
import {resolve3DType} from '../lib/bloq-types';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const toolbarBloqs = [
  {type: 'Cube'},
  {type: 'Translate'}
];

class ThreeD extends React.Component {
  render() {
    const {bloqs, code, updateBloqs} = this.props;

    return (
      <Container>
        <BloqsEditor
          bloqs={bloqs}
          toolbarBloqs={toolbarBloqs}
          onBloqsChange={updateBloqs}
          getBloqType={resolve3DType}
        />
        <ThreeDViewer code={code} />
      </Container>
    );
  }
}

const mapStateToProps = ({threed}) => ({
  bloqs: threed.bloqs,
  code: threed.code,
});

const mapDispatchToProps = dispatch => ({
  updateBloqs: bloqs => dispatch(update3DBloqs(bloqs)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThreeD);
