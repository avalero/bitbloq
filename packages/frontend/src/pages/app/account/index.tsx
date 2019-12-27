import { ApolloError } from "apollo-client";
import React, { FC, useEffect, useRef, useState } from "react";
import { useMutation } from "react-apollo";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { NextPage } from "next";
import { useTranslate, Button, DialogModal, Icon, colors } from "@bitbloq/ui";
import {
  CHANGE_EMAIL_MUTATION,
  DELETE_USER,
  UPDATE_USER_DATA_MUTATION
} from "../../../apollo/queries";
import withApollo from "../../../apollo/withApollo";
import AccountPersonalData from "../../../components/AccountPersonalData";
import AppLayout from "../../../components/AppLayout";
import ChangePasswordModal from "../../../components/ChangePasswordModal";
import ChangePlanModal from "../../../components/ChangePlanModal";
import CounterButton from "../../../components/CounterButton";
import EditInputModal from "../../../components/EditInputModal";
import ErrorLayout from "../../../components/ErrorLayout";
import GraphQLErrorMessage from "../../../components/GraphQLErrorMessage";
import { plans } from "../../../config.js";
import useUserData from "../../../lib/useUserData";
import redirect from "../../../lib/redirect";
import { isValidAge } from "../../../util";
import { IPlan, IUser } from "../../../types";

enum TabType {
  UserData,
  Purchases
}

const AccountPage: NextPage = () => {
  const personalDataFormId = "personal-data-form";
  const t = useTranslate();
  const { userData, fetchUserData } = useUserData();

  const memberPlan: IPlan = plans.filter(p => p.name === "member")[0];
  const teacherPlan: IPlan = plans.filter(p => p.name === "teacher")[0];

  const [changeEmail] = useMutation(CHANGE_EMAIL_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER);
  const [updatePersonalData] = useMutation(UPDATE_USER_DATA_MUTATION);

  const newEmailRef = useRef<string>("");

  const [serverError, setServerError] = useState<boolean>(false);
  const [error, setError] = useState<ApolloError>();
  const [errorText, setErrorText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [currentTab, setCurrentTab] = useState<TabType>(TabType.UserData);
  const [personalDataEditable, setPersonalDataEditable] = useState<boolean>(
    false
  );
  const [plan, setPlan] = useState(userData.teacher ? teacherPlan : memberPlan);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal
  ] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);

  useEffect(() => {
    setPlan(userData.teacher ? teacherPlan : memberPlan);
  }, [userData]);

  const onDeleteUser = (password: string) => {
    if (!password) {
      setErrorText(t("change-email-page.password-empty"));
      return;
    }
    setLoading(true);
    deleteUser({
      variables: {
        password
      }
    })
      .then(() => {
        redirect({}, "/app/account/delete");
      })
      .catch(e => {
        setLoading(false);
        if (
          e.graphQLErrors &&
          e.graphQLErrors[0] &&
          e.graphQLErrors[0].extensions.code === "PASSWORD_INCORRECT"
        ) {
          setErrorText(t("change-email-page.password-error"));
        } else {
          setError(e);
        }
      });
  };

  const onSaveNewEmail = (newEmail: string) => {
    newEmailRef.current = newEmail;
    setLoading(true);
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
          setServerError(false);
          setLoading(false);
          setShowEmailModal(false);
          fetchUserData();
        } else {
          setServerError(true);
          setLoading(false);
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
          setLoading(false);
        }
      });
  };

  const togglePersonalDataEditable = (e: React.MouseEvent) => {
    e.preventDefault();
    setPersonalDataEditable(!personalDataEditable);
  };

  const onUpdatePersonalData = async (input: IUser) => {
    setLoading(true);
    try {
      await updatePersonalData({
        variables: {
          id: userData.id,
          input: {
            avatar: input.avatar,
            name: input.name,
            surnames: input.surnames,
            birthDate: input.birthDate
          }
        }
      });
      fetchUserData();
      setLoading(false);
      setPersonalDataEditable(false);
    } catch (e) {
      setError(e);
    }
  };

  if (error) {
    return <GraphQLErrorMessage apolloError={error} />;
  }

  return (
    <AppLayout header={t("account.title")}>
      <Container>
        <Tabs>
          <Tab
            selected={currentTab === TabType.UserData}
            // onClick={() => setCurrentTab(TabType.UserData)}
          >
            {t("account.user-data.title")}
          </Tab>
          {/* <Tab
            selected={currentTab === TabType.Purchases}
            onClick={() => setCurrentTab(TabType.Purchases)}
          >
            {t("account.purchases.title")}
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
                    <Button
                      form={personalDataFormId}
                      type="submit"
                      disabled={loading}
                    >
                      {t("account.user-data.personal-data.button-save")}
                    </Button>
                    <Button secondary onClick={togglePersonalDataEditable}>
                      {t("account.user-data.personal-data.button-cancel")}
                    </Button>
                  </>
                ) : (
                  <Button tertiary onClick={togglePersonalDataEditable}>
                    {t("account.user-data.personal-data.button")}
                  </Button>
                )
              }
            >
              <AccountPersonalData
                editable={personalDataEditable}
                formId={personalDataFormId}
                onSubmit={onUpdatePersonalData}
              />
            </Panel>
            <Panel
              title={t("account.user-data.email.title")}
              icon="at"
              buttons={
                !userData.socialLogin ? (
                  <Button onClick={() => setShowEmailModal(true)} tertiary>
                    {t("account.user-data.email.button")}
                  </Button>
                ) : (
                  undefined
                )
              }
            >
              {userData.email}
            </Panel>
            {!userData.socialLogin && (
              <Panel
                title={t("account.user-data.password.title")}
                icon="padlock-close"
                buttons={
                  <Button onClick={() => setShowPasswordModal(true)} tertiary>
                    {t("account.user-data.password.button")}
                  </Button>
                }
              />
            )}
            <Panel
              title={t("account.user-data.plan.title")}
              icon="user"
              buttons={
                plan === memberPlan &&
                isValidAge(
                  new Date(userData.birthDate).toLocaleDateString(),
                  teacherPlan.ageLimit
                ) ? (
                  <Button onClick={() => setShowPlanModal(true)}>
                    {t("account.user-data.plan.button")}
                  </Button>
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
            {!userData.socialLogin && (
              <Panel
                title={t("account.user-data.delete.title")}
                icon="trash"
                buttons={
                  <Button secondary onClick={() => setShowDeleteModal(true)}>
                    {t("account.user-data.delete.button")}
                  </Button>
                }
              />
            )}
          </Content>
        )}
      </Container>
      {serverError && <ErrorLayout code="500" />}
      <EditInputModal
        disabledSave={loading}
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
        title=""
        type="email"
      />
      <ChangePasswordModal
        disabledSave={loading}
        isOpen={showPasswordModal}
        onCancel={() => setShowPasswordModal(false)}
        title=""
      />
      <ChangePlanModal
        disabledSave={loading}
        isOpen={
          showPlanModal &&
          isValidAge(
            new Date(userData.birthDate).toLocaleDateString(),
            teacherPlan.ageLimit
          )
        }
        onSave={() => {
          fetchUserData();
          setShowPlanModal(false);
        }}
        title=""
      />
      <DialogModal
        cancelButton={
          <Button
            onClick={() => {
              newEmailRef.current = "";
              setEmailSent(false);
              setServerError(false);
              setLoading(false);
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
      <DialogModal
        cancelText={t("general-cancel-button")}
        content={
          <p>
            {t(`account.user-data.delete.modal.content-${plan.name}`)}{" "}
            <b>{t("account.user-data.delete.modal.content-highlighted")}</b>.
          </p>
        }
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onOk={() => {
          setShowDeleteModal(false);
          setShowDeleteConfirmationModal(true);
        }}
        okText={t("general-accept-button")}
        title={t("account.user-data.delete.modal.title")}
      />
      <EditInputModal
        disabledSave={loading}
        errorText={errorText}
        isOpen={showDeleteConfirmationModal}
        label={t("account.user-data.delete.modal-confirmation.label")}
        modalText={t("account.user-data.delete.modal-confirmation.text")}
        modalTitle={t("account.user-data.delete.modal-confirmation.title")}
        onSave={onDeleteUser}
        onChange={() => setErrorText("")}
        onCancel={() => setShowDeleteConfirmationModal(false)}
        placeholder={t(
          "account.user-data.delete.modal-confirmation.placeholder"
        )}
        saveButton={t("account.user-data.delete.modal-confirmation.save")}
        type="password"
        validateInput={false}
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
  box-sizing: border-box;
  flex: 1;
  max-width: 75%;
  padding: 30px 20px;
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
