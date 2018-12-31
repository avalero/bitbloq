import styled from '@emotion/styled';
import colors from '../colors';

const Button = styled.button`
  border-radius: 4px;
  border: none;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 24px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  background-color: ${colors.green};
  cursor: pointer;
`;

/** @component */
export default Button;
