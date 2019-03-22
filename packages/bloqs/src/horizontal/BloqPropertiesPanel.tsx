import React from "react";
import styled from "@emotion/styled";
import { colors, Input, Select } from "@bitbloq/ui";
import { useSpring, animated } from "react-spring";
import HorizontalBloq from "./HorizontalBloq";

import {
  IBloq,
  IBloqType,
  IBloqParameter,
  IBloqSelectParameter,
  IBloqSelectComponentParameter,
  IComponentInstance,
  BloqParameterType,
  isBloqSelectParameter,
  isBloqSelectComponentParameter
} from "../index";

interface IBloqPropertiesPanelProps {
  isOpen: boolean;
  bloqType: IBloqType;
  bloq: IBloq;
  getComponents: (type: string) => IComponentInstance[];
}

const BloqPropertiesPanel: React.FunctionComponent<
  IBloqPropertiesPanelProps
> = ({ isOpen, bloqType, bloq, getComponents }) => {
  const wrapStyle = useSpring({
    width: isOpen ? 300 : 0,
    from: { width: 0 },
    config: { tension: 600, friction: 40 }
  });

  if (!bloqType) {
    return null;
  }

  const renderParam = (param: IBloqParameter) => {
    if (isBloqSelectParameter(param)) {
      return (
        <FormGroup key={param.name}>
          <label>{param.label}</label>
          <StyledSelect
            options={param.options}
            selectConfig={{ isSearchable: false }}
          />
        </FormGroup>
      );
    }
    if (isBloqSelectComponentParameter(param)) {
      const options = getComponents(param.componentType).map(c => ({ label: c.name, value: c }));

      return (
        <FormGroup key={param.name}>
          <label>{param.label}</label>
          <StyledSelect
            options={options}
            selectConfig={{ isSearchable: false }}
          />
        </FormGroup>
      );
    }

    return null;
  };

  const { parameterDefinitions = [] } = bloqType;

  return (
    <Wrap style={wrapStyle}>
      <Content>
        <Header>
          <HeaderBloq>
            <HorizontalBloq type={bloqType} />
          </HeaderBloq>
          <Title>{bloqType.label}</Title>
        </Header>
        <Properties>
          {parameterDefinitions.map(renderParam)}
        </Properties>
      </Content>
    </Wrap>
  );
};

export default BloqPropertiesPanel;

/* styled componets */

const Wrap = styled(animated.div)`
  overflow: hidden;
  display: flex;
`;

const Content = styled.div`
  min-width: 300px;
  border-left: 1px solid ${colors.gray3};
`;

const Header = styled.div`
  height: 50px;
  border-bottom: 1px solid ${colors.gray3};
  display: flex;
  align-items: center;
  padding: 0px 20px;
`;

const HeaderBloq = styled.div`
  transform: scale(0.5);
  width: 30px;
  margin-left: -8px;
  margin-right: 8px;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: bold;
  font-style: italic;
  margin-left: 10px;
  flex: 1;
`;

const Properties = styled.div`
  padding: 20px;
  font-size: 13px;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  label {
    display: block;
    width: 120px;
  }

  input {
    flex: 1;
  }
`;

const StyledSelect = styled(Select)`
  flex: 1;
`;
