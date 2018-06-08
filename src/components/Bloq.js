import React from 'react';
import styled from 'styled-components';
import {resolveType} from '../lib/bloq-types';

const Path = styled.path`
  cursor: grab;
`;

const Text = styled.text`
  user-select: none;
`;

const paths = {
  event:
    'm 0,0 c 25,-22 71,-22 96,0 H 190 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z',
  statement:
    'm 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 145.34479904174805 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z',
};

const fills = {
  event: 'hsl(45, 80%, 50%)',
  statement: 'hsl(350, 80%, 50%)',
};

const strokes = {
  event: 'hsl(45, 80%, 40%)',
  statement: 'hsl(350, 80%, 40%)',
};

const Bloq = ({className, bloq}) => {
  const bloqType = resolveType(bloq.type) || {};

  return (
    <g transform={`translate(${bloq.x},${bloq.y})`}>
      <Path
        stroke={strokes[bloqType.type]}
        fill={fills[bloqType.type]}
        d={paths[bloqType.type]}
      />
      {bloqType.content && bloqType.content[0] &&
        <Text fill="white" x="12" y="32" >{bloqType.content[0].text}</Text>
      }
      {bloq.next && (
        <g transform="translate(0,48)">
          <Bloq bloq={bloq.next} />
        </g>
      )}
    </g>
  );
};

export default Bloq;
