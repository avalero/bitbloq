import React, { FC, useState } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useTranslate, Button, Icon } from "@bitbloq/ui";
import withApollo from "../../apollo/withApollo";
import AppLayout from "../../components/AppLayout";
import { plans } from "../../config.js";

enum TabType {
  UserData,
  PurchasedItems
}

const AccountPage: NextPage = () => {
  const t = useTranslate();
  const router = useRouter();
  const memberPlan = plans.filter(p => p.name === "member")[0];
  const teacherPlan = plans.filter(p => p.name === "teacher")[0];

  const [currentTab, setCurrentTab] = useState(TabType.UserData);
  const [personalDataCollapsed, setPersonalDataCollapsed] = useState(true);

  const plan = "member";

  return (
    <AppLayout header="Mi cuenta">
      <Container>
        <Tabs>
          <Tab
            selected={currentTab === TabType.UserData}
            //  onClick={() => setCurrentTab(TabType.UserData)}
          >
            {t("account.user-data.title")}
          </Tab>
          {/* <Tab selected={currentTab === TabType.PurchasedItems}
               onClick={() => setCurrentTab(TabType.PurchasedItems)}
            >{t("account.purchased-items.title")}</Tab> */}
        </Tabs>
        <Content>
          <Panel
            title={t("account.user-data.personal-data.title")}
            icon="description"
            buttons={
              personalDataCollapsed ? (
                <Button
                  tertiary
                  onClick={() => setPersonalDataCollapsed(false)}
                >
                  {t("account.user-data.personal-data.button")}
                </Button>
              ) : (
                <>
                  <Button onClick={() => setPersonalDataCollapsed(true)}>
                    {t("account.user-data.personal-data.button-save")}
                  </Button>
                  <Button
                    secondary
                    onClick={() => setPersonalDataCollapsed(true)}
                  >
                    {t("account.user-data.personal-data.button-cancel")}
                  </Button>
                </>
              )
            }
          />
          <Panel
            title={t("account.user-data.email.title")}
            icon="at"
            buttons={
              <Button tertiary>{t("account.user-data.email.button")}</Button>
            }
          />
          <Panel
            title={t("account.user-data.password.title")}
            icon="padlock-close"
            buttons={
              <Button tertiary>{t("account.user-data.password.button")}</Button>
            }
          />
          <Panel
            title={t("account.user-data.plan.title")}
            icon="user"
            buttons={
              plan === memberPlan.name ? (
                <Button>{t("account.user-data.plan.button")}</Button>
              ) : (
                undefined
              )
            }
          >
            <>
              <h1>{t(`plans.${plan}`)}</h1>
              <br />
              <p>{t(`plans.${plan}-description`)}</p>
              {/* { plan === teacherPlan.name && <>
                <br />
                <p style={{fontStyle: "italic"}}>Fecha de próxima renovación: 00/00/0000</p>
              </>} */}
            </>
          </Panel>
          <Panel
            title={t("account.user-data.delete.title")}
            icon="trash"
            buttons={
              <Button secondary>{t("account.user-data.delete.button")}</Button>
            }
          />
        </Content>
      </Container>
    </AppLayout>
  );
};

export default withApollo(AccountPage, { requiresSession: true });

interface IPanelProps {
  icon: string;
  title: string;
  buttons?: JSX.Element;
}

const Panel: FC<IPanelProps> = ({ icon, title, buttons, children }) => (
  <PanelContainer>
    <PanelHeader>
      <PanelHeaderTitle>
        <Icon name={icon} />
        {title}
      </PanelHeaderTitle>
      <PanelHeaderButtons>{buttons}</PanelHeaderButtons>
    </PanelHeader>
    {children && <PanelContent>{children}</PanelContent>}
  </PanelContainer>
);

/* styled components */

const Container = styled.div`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 3px 0 #c7c7c7;
  display: flex;
`;

const Content = styled.div`
  color: #373b44;
  flex: 1;
  margin: 0 20px;
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: bold;
  min-width: 25%;

  &:after {
    content: "";
    background-color: white;
    border-right: 1px solid #c0c3c9;
    flex: 1;
  }
`;

const Tab = styled.div<{ selected?: boolean }>`
  align-items: center;
  background-color: #eeeeee;
  border: solid #c0c3c9;
  border-width: 0 1px 1px 0;
  cursor: pointer;
  display: flex;
  height: 40px;
  padding: 0 20px;
  white-space: nowrap;

  ${props =>
    props.selected &&
    css`
      background-color: white;
      border-right-color: transparent;
    `}
`;

const PanelContainer = styled.div`
  border-radius: 4px;
  border: solid 1px #c0c3c9;
  margin: 30px 0;
`;

const PanelHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
`;

const PanelHeaderButtons = styled.div`
  display: flex;

  button {
    margin-right: 10px;
  }
`;

const PanelHeaderTitle = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: bold;
  height: 60px;

  svg {
    height: 24px;
    width: 24px;
    padding: 0 10px;
  }
`;

const PanelContent = styled.div`
  border-top: solid 1px #c0c3c9;
  font-size: 14px;
  padding: 20px;

  h1 {
    font-size: 16px;
  }
`;
