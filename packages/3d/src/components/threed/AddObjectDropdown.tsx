import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {DropDown, Icon, withTranslate} from '@bitbloq/ui';
import config from '../../config/threed';

export interface Shape {
  type: string;
  parameters: object;
}

export interface ShapeGroup {
  label: string;
  icon: string;
  shapes: Shape[];
}

export interface AddObjectDropDownProps {
  shapeGroups: ShapeGroup[];
  t: (id: string) => string;
}

class AddObjectDropdown extends React.Component<AddObjectDropDownProps> {
  render() {
    const {shapeGroups, t} = this.props;
    return (
      <DropDown attachmentPosition="top left" targetPosition="bottom left">
        {(isOpen: boolean) => (
          <AddButton isOpen={isOpen}>
            <div>+ {t('add-object')}</div>
          </AddButton>
        )}
        <Container>
          <Tabs>
            {shapeGroups.map(group => (
              <Tab>
                <Icon name={group.icon} />
              </Tab>
            ))}
          </Tabs>
          <Shapes />
        </Container>
      </DropDown>
    );
  }
}

export default withTranslate(AddObjectDropdown);

/* styled components */

interface AddButton {
  isOpen: boolean;
}
const AddButton = styled.div<AddButton>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color: #ebebeb;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid #cfcfcf;
  z-index: 2;
  box-shadow: ${props =>
    props.isOpen ? '0 3px 7px 0 rgba(0, 0, 0, 0.5);' : 'none'};
`;

const Container = styled.div`
  display: flex;
  background-color: white;
  width: 380px;
  height: 400px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
`;

const Tabs = styled.div`
  width: 60px;
`;

const Tab = styled.div`
  height: 60px;
  width: 60px;
  border-bottom: 1px solid white;
  background-color: #b9bdc8;
`;

const Shapes = styled.div``;
