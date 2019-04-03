import React from "react";
import styled from "@emotion/styled";
import colors from "../colors";

const Container = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
`;

const Bullet = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 7px;
  border: 1px solid ${colors.gray3};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerBullet = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${colors.gray5};
`;

export interface OptionsProps {
  checked?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
}

export default class Option extends React.Component<OptionsProps> {
  render() {
    const { checked, children, onClick, className } = this.props;

    return (
      <Container onClick={onClick} className={className}>
        <Bullet>{checked && <InnerBullet />}</Bullet>
        <div>{children}</div>
      </Container>
    );
  }
}
