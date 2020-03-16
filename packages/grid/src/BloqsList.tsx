import React, { FC } from "react";
import styled from "@emotion/styled";
import { HorizontalBloq } from "@bitbloq/bloqs";
import { bloqTypes, breakpoint } from "./config";

interface IAddBloqPanelProps {
  bloqs: { [bloq: string]: number };
}

const BloqsList: FC<IAddBloqPanelProps> = ({ bloqs }) => (
  <Container>
    {Object.keys(bloqs).map(typeName => {
      if (!bloqs[typeName]) {
        return;
      }

      const type = bloqTypes.find(t => t.name === typeName)!;
      return (
        <Content>
          <Bloq>
            <StyledBloq key={type.name} type={type} shadow={false} />
          </Bloq>
          <Number>
            {bloqs[typeName] > 0 ? bloqs[typeName] : <>&#8734;</>}
          </Number>
        </Content>
      );
    })}
  </Container>
);

export default BloqsList;

/* Styled components */

const Bloq = styled.div`
  transform: scale(calc(40 / 86));
`;

const Container = styled.div`
  border: solid 2px #f1f1f1;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: auto auto;
  padding: 8px;
  width: max-content;

  @media screen and (min-width: ${breakpoint}px) {
    grid-template-columns: auto;
  }
`;

const Content = styled.div`
  align-items: center;
  display: flex;
  height: 40px;
  justify-content: space-between;
  width: 74px;
`;

const Number = styled.div`
  color: #373b44;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  width: 24px;
`;

const StyledBloq = styled(HorizontalBloq)`
  cursor: default;
  margin: 3px;
  position: absolute;
  transform: translate(0, -50%);
  top: 50%;
`;
