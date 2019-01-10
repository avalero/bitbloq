import * as React from 'react';
import styled from '@emotion/styled';
import {Global} from '@emotion/core';
import SEO from '../components/SEO';
import {
  baseStyles,
  colors,
  Input,
  Panel,
  Button,
  HorizontalRule,
} from '@bitbloq/ui';
import logoBetaImage from '../images/logo-beta.svg';

class SignupPage extends React.Component {
  render() {
    return (
      <>
        <SEO title="Signup" keywords={[`bitbloq`]} />
        <Global styles={baseStyles} />
        <Wrap>
          <Container>
            <Logo src={logoBetaImage} alt="Bitbloq Beta" />
          </Container>
        </Wrap>
      </>
    );
  }
}

export default SignupPage;

/* Styled components */

const Wrap = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  min-height: 100%;
  justify-content: center;
  background-color: ${colors.gray1};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 180px;
  margin-bottom: 40px;
`;
