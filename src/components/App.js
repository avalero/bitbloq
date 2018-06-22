import React from 'react';
import styled from 'react-emotion';
import Software from './Software';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  height: 100px;
  box-shadow: 0px 1px 4px rgba(0,0,0,0.2);
`;

const App = () => (
  <Container>
    <Header>
    </Header>
    <Software />
  </Container>
);

export default App;
