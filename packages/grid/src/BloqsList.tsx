import React, { FC, ReactElement } from "react";
import { HorizontalBloq } from "@bitbloq/bloqs";
import { breakpoints } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { bloqTypes } from "./config";

interface IAddBloqPanelProps {
  bloqs: { [bloq: string]: number };
  children?: (typeName: string) => ReactElement;
  className?: string;
}

const BloqsList: FC<IAddBloqPanelProps> = ({ bloqs, children, className }) => (
  <Container className={className}>
    {Object.keys(bloqs).map(typeName => {
      const type = bloqTypes.find(t => t.name === typeName)!;
      return (
        <Content key={typeName}>
          <Bloq>
            <StyledBloq key={type.name} type={type} shadow={false} />
          </Bloq>
          <BloqInformation>
            {children ? (
              children(typeName)
            ) : bloqs[typeName] > 0 ? (
              bloqs[typeName]
            ) : (
              <>&#8734;</>
            )}
          </BloqInformation>
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

const BloqInformation = styled.div`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  width: calc(100% - 50px);
`;

const Container = styled.div`
  border: solid 2px #eeeeee;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: auto auto;
  padding: 8px;
  width: max-content;

  @media screen and (min-width: ${breakpoints.tablet}px) {
    grid-template-columns: auto;
  }
`;

const Content = styled.div`
  align-items: center;
  display: flex;
  height: 40px;
  justify-content: space-between;
  min-width: 74px;
`;

const StyledBloq = styled(HorizontalBloq)`
  cursor: default;
  margin: 3px;
  position: absolute;
  transform: translate(0, -50%);
  top: 50%;
`;
