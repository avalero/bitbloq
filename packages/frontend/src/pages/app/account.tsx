import dayjs from "dayjs";
import React, { FC, useRef, useState } from "react";
import { useMutation } from "react-apollo";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { NextPage } from "next";
import { useTranslate, Button, DialogModal, Icon, colors } from "@bitbloq/ui";
import { CHANGE_EMAIL_MUTATION } from "../../apollo/queries";
import withApollo from "../../apollo/withApollo";
import CounterButton from "../../components/CounterButton";
import AppLayout from "../../components/AppLayout";
import EditTitleModal from "../../components/EditTitleModal";
import ErrorLayout from "../../components/ErrorLayout";
import { plans } from "../../config.js";
import useUserData from "../../lib/useUserData";

enum TabType {
  UserData,
  PurchasedItems
}

const AccountPage: NextPage = () => {
  const t = useTranslate();
  const userData = useUserData();

  const memberPlan = plans.filter(p => p.name === "member")[0];
  const teacherPlan = plans.filter(p => p.name === "teacher")[0];

  const [changeEmail] = useMutation(CHANGE_EMAIL_MUTATION);

  const newEmailRef = useRef<string>("");

  const [currentTab, setCurrentTab] = useState(TabType.UserData);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [personalDataEditable, setPersonalDataEditable] = useState(false);
  const [plan, setPlan] = useState(userData.teacher ? teacherPlan : memberPlan);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  const onSaveNewEmail = (newEmail: string) => {
    newEmailRef.current = newEmail;
    setLoadingData(true);
    changeEmail({
      variables: {
        newEmail
      }
    })
      .then(result => {
        const {
          data: { sendChangeMyEmailToken }
        } = result;
        if (sendChangeMyEmailToken === "OK") {
          setEmailSent(true);
          setError(false);
          setLoadingData(false);
          setShowEmailModal(false);
        } else {
          setError(true);
          setLoadingData(false);
          setShowEmailModal(false);
        }
      })
      .catch(e => {
        if (
          e.graphQLErrors &&
          e.graphQLErrors[0] &&
          e.graphQLErrors[0].extensions.code === "EMAIL_EXISTS"
        ) {
          setErrorText(t("account.user-data.email.email-exists"));
          setLoadingData(false);
        }
      });
  };

  return (
    <AppLayout header="Mi cuenta">
      <Container>
        <Tabs>
          <Tab
            selected={currentTab === TabType.UserData}
            // onClick={() => setCurrentTab(TabType.UserData)}
          >
            {t("account.user-data.title")}
          </Tab>
          {/* <Tab
            selected={currentTab === TabType.PurchasedItems}
            onClick={() => setCurrentTab(TabType.PurchasedItems)}
          >
            {t("account.purchased-items.title")}
          </Tab> */}
        </Tabs>
        {currentTab === TabType.UserData && (
          <Content>
            <Panel
              title={t("account.user-data.personal-data.title")}
              icon="description"
              buttons={
                personalDataEditable ? (
                  <>
                    <Button onClick={() => setPersonalDataEditable(true)}>
                      {t("account.user-data.personal-data.button-save")}
                    </Button>
                    <Button
                      secondary
                      onClick={() => setPersonalDataEditable(true)}
                    >
                      {t("account.user-data.personal-data.button-cancel")}
                    </Button>
                  </>
                ) : (
                  <Button
                    tertiary
                    onClick={() => setPersonalDataEditable(false)}
                  >
                    {t("account.user-data.personal-data.button")}
                  </Button>
                )
              }
            >
              {!personalDataEditable && (
                <>
                  <Field>
                    <div>Nombre</div>
                    <div>{userData.name}</div>
                  </Field>
                  <Field>
                    <div>Apellidos</div>
                    <div>{userData.surnames}</div>
                  </Field>
                  <Field>
                    <div>Fecha de nacimiento</div>
                    <div>
                      {userData.birthDate &&
                        dayjs(new Date(userData.birthDate)).format(
                          "DD/MM/YYYY"
                        )}
                    </div>
                  </Field>
                </>
              )}
            </Panel>
            <Panel
              title={t("account.user-data.email.title")}
              icon="at"
              buttons={
                <Button onClick={() => setShowEmailModal(true)} tertiary>
                  {t("account.user-data.email.button")}
                </Button>
              }
            >
              {userData.email}
            </Panel>
            <Panel
              title={t("account.user-data.password.title")}
              icon="padlock-close"
              buttons={
                <Button tertiary>
                  {t("account.user-data.password.button")}
                </Button>
              }
            />
            <Panel
              title={t("account.user-data.plan.title")}
              icon="user"
              buttons={
                plan === memberPlan ? (
                  <Button>{t("account.user-data.plan.button")}</Button>
                ) : (
                  undefined
                )
              }
            >
              <>
                <h1>{t(`plans.${plan.name}`)}</h1>
                <br />
                <p>{t(`plans.${plan.name}-description`)}</p>
                {/* { plan === teacherPlan && <>
                  <br />
                  <p style={{fontStyle: "italic"}}>Fecha de próxima renovación: 00/00/0000</p>
                </>} */}
              </>
            </Panel>
            <Panel
              title={t("account.user-data.delete.title")}
              icon="trash"
              buttons={
                <Button secondary>
                  {t("account.user-data.delete.button")}
                </Button>
              }
            />
          </Content>
        )}
      </Container>
      {error && <ErrorLayout code="500" />}
      <EditEmailModal
        disabledSave={loadingData}
        errorText={errorText}
        isOpen={showEmailModal}
        label={t("account.user-data.email.new")}
        modalText={t("account.user-data.email.change-text")}
        modalTitle={t("account.user-data.email.button")}
        onCancel={() => setShowEmailModal(false)}
        onChange={() => setErrorText("")}
        onSave={onSaveNewEmail}
        placeholder={t("account.user-data.email.new")}
        saveButton={t("general-change-button")}
        type="email"
      />
      <DialogModal
        cancelButton={
          <Button
            onClick={() => {
              newEmailRef.current = "";
              setEmailSent(false);
              setError(false);
              setLoadingData(false);
              setShowEmailModal(false);
            }}
          >
            {t("general-accept-button")}
          </Button>
        }
        isOpen={emailSent}
        okButton={
          <CounterButton
            onClick={() => {
              changeEmail({
                variables: {
                  newEmail: newEmailRef.current
                }
              });
            }}
          >
            {t("account.user-data.email.sent-button")}
          </CounterButton>
        }
        text={t("account.user-data.email.sent-text")}
        title={t("account.user-data.email.sent-title")}
      />
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
  box-shadow: 0 2px 3px 0 ${colors.gray3};
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  margin: 30px 20px;
`;

const EditEmailModal = styled(EditTitleModal)`
  p {
    color: #5d6069;
    line-height: 1.57;
    margin: 10px 0 40px !important;
  }
`;

const Field = styled.div`
  align-items: center;
  height: 36px;
  display: flex;
  justify-content: space-between;
  border: 0px solid #8c919b;
  border-top-width: 1px;

  &:last-of-type {
    border-bottom-width: 1px;
  }
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
    border-right: 1px solid ${colors.gray3};
    flex: 1;
    min-height: 40px;
  }
`;

const Tab = styled.div<{ selected?: boolean }>`
  align-items: center;
  background-color: ${colors.gray2};
  border: solid ${colors.gray3};
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
  border: solid 1px ${colors.gray3};
  margin-bottom: 30px;

  &:last-of-type {
    margin-bottom: 0;
  }
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
  border-top: solid 1px ${colors.gray3};
  font-size: 14px;
  line-height: normal;
  padding: 20px;

  h1 {
    font-size: 16px;
  }
`;
