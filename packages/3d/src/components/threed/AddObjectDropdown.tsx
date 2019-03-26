import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { colors, ScrollableTabs, withTranslate } from "@bitbloq/ui";
import config from "../../config/threed";

export interface IShape {
  type: string;
  parameters: object;
}

export interface IShapeGroup {
  label: string;
  icon: JSX.Element;
  shapes: IShape[];
}

export interface IAddObjectDropDownProps {
  shapeGroups: IShapeGroup[];
  onAddObject: (shapeConfig: IShape) => any;
  t: (id: string) => string;
}

class AddObjectDropdown extends React.Component<IAddObjectDropDownProps> {
  render() {
    const { shapeGroups, onAddObject, t } = this.props;

    return (
      <Tabs
        tabs={shapeGroups.map(group => ({
          icon: group.icon,
          content: (
            <ShapeGroup>
              <GroupLabel>{t(group.label)}</GroupLabel>
              <Shapes>
                {group.shapes.map(shape => (
                  <Shape key={shape.label} onClick={() => onAddObject(shape)}>
                    <ShapeImage>{shape.icon}</ShapeImage>
                    <ShapeText>{t(shape.label)}</ShapeText>
                  </Shape>
                ))}
              </Shapes>
            </ShapeGroup>
          )
        }))}
      />
    );
  }
}

export default withTranslate(AddObjectDropdown);

/* styled components */

const Tabs = styled(ScrollableTabs)`
  width: 380px;
  height: 400px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
`;

const ShapeGroup = styled.div`
  padding: 20px;
  box-sizing: border-box;
  &:last-of-type {
    min-height: 400px;
  }
`;

const GroupLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const Shapes = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

const Shape = styled.div`
  cursor: pointer;
`;

const ShapeImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  background-color: #def6fb;
  display: flex;
  justify-content: center;
  align-items: center;

  svg,
  img {
    width: 56px;
    height: 56px;
  }
`;

const ShapeText = styled.div`
  margin-top: 4px;
  font-size: 14px;
`;
