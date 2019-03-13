import React from "react";
import styled from "@emotion/styled";
import HorizontalBloq from "./HorizontalBloq";
import BloqPlaceholder from "./BloqPlaceholder";

import { Bloq, BloqType, BloqCategory } from "../index.d";

interface BloqsLineProps {
  bloqs: Bloq[];
  bloqTypes: BloqType[];
  placeholderSelected?: boolean;
  onPlaceholderClick: React.MouseEventHandler;
}

const BloqsLine: React.FunctionComponent<BloqsLineProps> = ({
  bloqs,
  bloqTypes,
  placeholderSelected,
  onPlaceholderClick
}) => {
  const placeholderCategory =
    bloqs.length === 0 ? BloqCategory.Event : BloqCategory.Action;

  return (
    <Container>
      {bloqs.map(bloq => (
        <StyledBloq
          key={bloq.type}
          type={bloqTypes.find(t => t.name === bloq.type)!}
        />
      ))}
      <BloqPlaceholder
        onClick={onPlaceholderClick}
        selected={placeholderSelected}
        category={placeholderCategory}
      />
    </Container>
  );
};

export default BloqsLine;

/* styled components */

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const StyledBloq = styled(HorizontalBloq)`
  margin-right: 5px;
`;
