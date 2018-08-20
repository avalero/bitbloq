import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid/v1';
import styled from 'react-emotion';
import {updateObject, wrapObjects} from '../../actions/threed.js';
import {colors} from '../../base-styles';
import CubeIcon from '../../assets/images/cube.svg';
import TranslateIcon from '../../assets/images/translate.svg';
import RotateIcon from '../../assets/images/rotate.svg';
import ScaleIcon from '../../assets/images/scale.svg';

const Container = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;
  width: 240px;
`;

const Panel = styled.div`
  background-color: white;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  background-color: #eee;
  padding: 6px;
`;

const PanelIcon = styled.img`
  height: 24px;
  margin-right: 6px;
`;

const PanelBody = styled.div`
  padding: 12px;
`;

const FormGroup = styled.div`
  margin-bottom: 6px;
  display: flex;
  align-items: center;

  label {
    width: 60px;
    display: block;
  }

  input {
    border: 1px solid #ccc;
    border-radius: 6px;
    flex: 1;
    height: 18px;
  }
`;

const Button = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: white;
  background-color: ${colors.brand};
  padding: 6px;
  border-radius: 6px;
  margin-bottom: 12px;
`;

const ButtonIcon = styled.img`
  height: 24px;
  margin-right: 6px;
`;

const InputProperty = ({label, field, object, onChange}) => (
  <FormGroup>
    <label>{label}</label>
    <input
      value={object.params[field]}
      onChange={e =>
        onChange({
          ...object,
          params: {...object.params, [field]: e.target.value},
        })
      }
    />
  </FormGroup>
);

const objectPropertiesRenderers = {
  Cube: (object, onChange) => (
    <div>
      <InputProperty
        label="Width"
        field="width"
        object={object}
        onChange={onChange}
      />
      <InputProperty
        label="Height"
        field="height"
        object={object}
        onChange={onChange}
      />
      <InputProperty
        label="Depth"
        field="depth"
        object={object}
        onChange={onChange}
      />
    </div>
  ),
  Sphere: (object, onChange) => (
    <div>
      <InputProperty
        label="Radius"
        field="radius"
        object={object}
        onChange={onChange}
      />
    </div>
  ),
  Translate: (object, onChange) => (
    <div>
      <InputProperty label="X" field="x" object={object} onChange={onChange} />
      <InputProperty label="Y" field="y" object={object} onChange={onChange} />
      <InputProperty label="Z" field="z" object={object} onChange={onChange} />
    </div>
  ),
};

const defaultParams = {
  Tanslate: {
    x: 0,
    y: 0,
    z: 0,
  },
};

class PropertiesPanel extends React.Component {
  onObjectChange = object => {
    this.props.updateObject(object);
  };

  onWrapObjects(type) {
    const {objects, selectedObjects, wrapObjects} = this.props;
    const children = objects.filter(o => selectedObjects.includes(o.id));

    const parent = {
      id: uuid(),
      type,
      params: {...defaultParams[type]},
    };

    wrapObjects(parent, children);
  }

  renderObjectPanel(object) {
    const renderProperties = objectPropertiesRenderers[object.type];

    return (
      <Panel>
        <PanelHeader>
          <PanelIcon src={CubeIcon} />
          <div>{object.name}</div>
        </PanelHeader>
        <PanelBody>{renderProperties(object, this.onObjectChange)}</PanelBody>
      </Panel>
    );
  }

  render() {
    const {objects, selectedObjects} = this.props;
    let content;

    if (selectedObjects.length === 1) {
      const object = objects.find(o => o.id === selectedObjects[0]);
      content = (
        <div>
          <Button onClick={() => this.onWrapObjects('Translate')}>
            <ButtonIcon src={TranslateIcon} />
            <div>Translate</div>
          </Button>
          <Button onClick={() => this.onWrapObjects('Rotate')}>
            <ButtonIcon src={RotateIcon} />
            <div>Rotate</div>
          </Button>
          <Button onClick={() => this.onWrapObjects('Scale')}>
            <ButtonIcon src={ScaleIcon} />
            <div>Scale</div>
          </Button>
          {this.renderObjectPanel(object)}
        </div>
      );
    }

    return <Container>{content}</Container>;
  }
}

const mapStateToProps = ({threed}) => ({
  objects: threed.objects,
  selectedObjects: threed.selectedObjects,
});

const mapDispatchToProps = dispatch => ({
  updateObject: object => dispatch(updateObject(object)),
  wrapObjects: (parent, children) => dispatch(wrapObjects(parent, children)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropertiesPanel);
