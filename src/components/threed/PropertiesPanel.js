import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid/v1';
import styled from 'react-emotion';
import {updateObject, wrapObjects} from '../../actions/threed.js';
import {colors} from '../../base-styles';
import {resolveClass} from '../../lib/object3d';
import CubeIcon from '../../assets/images/cube.svg';
import TranslateIcon from '../../assets/images/translate.svg';
import RotateIcon from '../../assets/images/rotate.svg';
import ScaleIcon from '../../assets/images/scale.svg';

const Container = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;
  width: 300px;
`;

const Panel = styled.div`
  background-color: #fafafa;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  font-size: 1.1em;
  color: #fafafa;
  background-color: #777;
  display: flex;
  align-items: center;
  color: #333;
  background-color: #eee;
  padding: 6px;
`;

const SubPanel = styled(Panel)`
  background-color: white;
`;

const SubPanelHeader = styled(PanelHeader)`
  font-size: 1em;
  color: #333;
  background-color: #eee;
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
  box-shadow: 0px 1px 3px rgba(0,0,0,0.3); 
`;

const ButtonIcon = styled.img`
  height: 24px;
  margin-right: 6px;
`;

const InputProperty = ({label, field, object, onChange}) => (
  <FormGroup>
    <label>{label}</label>
    <input
      value={object.parameters[field]}
      onChange={e =>
        onChange({
          ...object,
          parameters: {...object.parameters, [field]: e.target.value},
        })
      }
    />
  </FormGroup>
);

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
      parameters: {...defaultParams[type]},
    };

    wrapObjects(parent, children);
  }

  renderObjectPanel(object) {
    const Class3D = resolveClass(object.type);
    const {parameterTypes} = Class3D;

    return (
      <Panel>
        <PanelHeader>
          <PanelIcon src={CubeIcon} />
          <div>{object.name}</div>
        </PanelHeader>
        <PanelBody>
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
          <SubPanel>
            <SubPanelHeader>
              <PanelIcon src={CubeIcon} />
              <div>{object.type} Geometry</div>
            </SubPanelHeader>
            <PanelBody>
              {parameterTypes.map(type => (
                <InputProperty
                  key={type.name}
                  label={type.label}
                  field={type.name}
                  object={object}
                  onChange={this.onObjectChange}
                />
              ))}
            </PanelBody>
          </SubPanel>
        </PanelBody>
      </Panel>
    );
  }

  render() {
    const {objects, selectedObjects} = this.props;
    let content;

    if (selectedObjects.length === 1) {
      const object = objects.find(o => o.id === selectedObjects[0]);
      content = this.renderObjectPanel(object);
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
