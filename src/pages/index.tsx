import * as React from 'react';
import styled from '@emotion/styled';
import {baseStyles, colors, Input, Panel} from '@bitbloq/ui';
import { Global } from '@emotion/core';
import SEO from '../components/SEO';

const IndexPage: React.SFC = () => (
  <>
    <SEO title="Home" keywords={[`bitbloq`]} />
    <Global styles={baseStyles} />
    <Wrap>
      <Container>
        <h1>Bitbloq</h1>
        <Panel>
          <TabContent>
            <TabInfo>
            </TabInfo>
            <DashedLine />
            <LoginForm>
              <Input placeholder="Correo electrónico" type="email" />
              <Input placeholder="Contraseña" />
            </LoginForm>
          </TabContent>
        </Panel>
      </Container>
    </Wrap>
  </>
);

export default IndexPage;

const Wrap = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${colors.gray1};
`;

const Container = styled.div`
  max-width: 1085px;
  margin: 60px;
  width: 100%;
`;

const TabContent = styled.div`
  display: flex;
`;

const TabInfo = styled.div`
  flex: 1;
`;

const DashedLine = styled.div`
  width: 1px;
  background-image: linear-gradient(${colors.gray2} 55%, white 45%);
  background-size: 100% 24px;
`;

const LoginForm = styled.div`
  box-sizing: border-box;
  width: 360px;
  padding: 40px;

  ${Input} {
    margin-bottom: 20px;
  }
`;
