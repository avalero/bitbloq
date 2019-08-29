import React, { FC } from "react";
import { Switch } from "@bitbloq/ui";
import styled from "@emotion/styled";

interface PublishBarProps {
  isPublic: boolean;
  onToggle: () => any;
  error?: string;
  url?: string;
}

const PublishBar: FC<PublishBarProps> = ({ isPublic, onToggle, url, error }) => {
  return (
    <Container>
      <SwitchWrap>
        <span>Privado</span>
        <Switch value={isPublic} onChange={onToggle} />
        <span>Público</span>
      </SwitchWrap>
      <UrlBar>
        <UrlLabel>URL para compartir:</UrlLabel>
    <Url value={error || url || "-"} disabled hasError={!!error} />
      </UrlBar>
    </Container>
  );
};

export default PublishBar;

const Container = styled.div`
  height: 40px;
  border-bottom: solid 1px #cfcfcf;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0px 20px;
`;

const SwitchWrap = styled.div`
  display: flex;
  align-items: center;
  margin-left: -10px;
  margin-right: 10px;

  span {
    font-size: 14px;
    margin: 0px 10px;
  }
`;

const UrlBar = styled.div`
  height: 28px;
  border-radius: 4px;
  border: solid 1px #cfcfcf;
  display: flex;
  font-size: 14px;
  flex: 1;
  overflow: hidden;
`;

const UrlLabel = styled.div`
  padding: 0px 10px 0px 20px;
  font-weight: bold;
  height: 28px;
  display: flex;
  align-items: center;
  border-right: solid 1px #cfcfcf;
`;

interface UrlProps {
  hasError: boolean;
}
const Url = styled.input<UrlProps>`
  border: none;
  background-color: #eee;
  flex: 1;
  height: 28px;
  display: flex;
  align-items: center;
  padding: 0px 20px 0px 10px;
  color: ${props => props.hasError ? "#d82b32" : "inherit"};
`;
