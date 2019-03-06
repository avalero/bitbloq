import React from 'react';
import styled from '@emotion/styled';
import ConnectionEditor from './ConnectionEditor';

const Container = styled.div`
  display: flex;
  flex: 1;
`;

class Hardware extends React.Component {
  render() {
    return (
      <Container>
        <ConnectionEditor />
      </Container>
    );
  }
}

export default Hardware;
