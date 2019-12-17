import { ApolloError } from "apollo-client";
import _ from "lodash";
import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, ExecutionResult, useApolloClient } from "react-apollo";
import { colors, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import {
  FINISH_SIGNUP_MUTATION,
  SAVE_BIRTH_DATE_MUTATION,
  SAVE_USER_DATA_MUTATION
} from "../../apollo/queries";
import withApollo from "../../apollo/withApollo";
import AccessLayout, { AccessLayoutSize } from "../../components/AccessLayout";
import CounterButton from "../../components/CounterButton";
import GraphQLErrorMessage from "../../components/GraphQLErrorMessage";
import LoginWithGoogleButton from "../../components/LoginWithGoogleButton";
import LoginWithMicrosoftButton from "../../components/LoginWithMicrosoftButton";
import ModalLayout from "../../components/ModalLayout";
import SignupBirthDateForm from "../../components/SignupBirthDateForm";
import SignupPlanSelector from "../../components/SignupPlanSelector";
import SignupUserDataForm from "../../components/SignupUserDataForm";
import {
  educationalStages,
  plans,
  privacyPolicyUrl,
  signupSteps
} from "../../config";
import redirect from "../../lib/redirect";
import { setToken } from "../../lib/session";
import { IPlan, IUserBirthDate, IUserData } from "../../types";
import { getAge } from "../../util";
import { IUserStep1 } from "../../../../api/src/api-types";

const NORMAL_SIGNUP_FLOW = [
  signupSteps.userData,
  signupSteps.plan,
  signupSteps.create
];

const EXTERNAL_SIGNUP_FLOW = [
  signupSteps.leave,
  signupSteps.birthDate,
  signupSteps.plan
];

const SignupStepPage: NextPage = () => {
  const client = useApolloClient();
  const router = useRouter();
  const t = useTranslate();
  const wrapRef = React.createRef<HTMLDivElement>();

  const { id: encryptedId, plan: defaultPlan, step } = router.query;

  useEffect(() => {
    router.beforePopState(() => {
      if (step === signupSteps.create) {
        router.push("/");
        return false;
      }
      return true;
    });
    if (encryptedId) {
      setUserId(encryptedId.toString());
      setSignupFlow(EXTERNAL_SIGNUP_FLOW);
    }
  });

  useEffect(() => {
    if (wrapRef && wrapRef.current) {
      wrapRef.current.scrollIntoView();
    }
  }, [step]);

  const memberPlan = plans.filter(p => p.name === "member")[0];
  const teacherPlan = plans.filter(p => p.name === "teacher")[0];

  const [signupFlow, setSignupFlow] = useState<string[]>(NORMAL_SIGNUP_FLOW);
  const [userData, setUserData] = useState<IUserData>({
    birthDate: "",
    country: "ES",
    educationalStage: _.first(educationalStages) || "",
    imTeacherCheck: defaultPlan === teacherPlan.name
  });
  const [userError, setUserError] = useState<ApolloError>();
  const [userId, setUserId] = useState<string>("");
  const [userPlan, setUserPlan] = useState<IPlan>(memberPlan);

  const [
    finishSignup,
    { error: finishSignupError, loading: finishingSignup }
  ] = useMutation(FINISH_SIGNUP_MUTATION);
  const [
    saveBirthDate,
    { error: saveBirthDateError, loading: savingBirthDate }
  ] = useMutation(SAVE_BIRTH_DATE_MUTATION);
  const [
    saveUserData,
    { error: saveUserDataError, loading: savingUserData }
  ] = useMutation(SAVE_USER_DATA_MUTATION);

  const goToNextStep = () => {
    const index = signupFlow.findIndex(s => s === step);
    if (index + 1 < signupFlow.length) {
      router.push("/signup/[step]", `/signup/${signupFlow[index + 1]}`, {
        shallow: true
      });
    }
  };

  const goToPreviousStep = () => {
    const index = signupFlow.findIndex(s => s === step);
    if (index > 0) {
      router.push("/signup/[step]", `/signup/${signupFlow[index - 1]}`, {
        shallow: true
      });
    } else {
      router.push("/");
    }
  };

  const onSaveBirthDate = async (input: IUserBirthDate) => {
    setUserData(input);
    await saveBirthDate({
      variables: {
        id: userId,
        birthDate: input.birthDate
      }
    });
    goToNextStep();
  };

  const onSaveUser = async (input: IUserData) => {
    setUserData(input);
    try {
      const {
        data
      }: ExecutionResult<{ saveUserData: IUserStep1 }> = await saveUserData({
        variables: {
          input: {
            birthDate: input.birthDate,
            centerName: input.imTeacherCheck ? input.centerName : undefined,
            city: input.imTeacherCheck ? input.city : undefined,
            country: input.imTeacherCheck ? input.country : undefined,
            educationalStage: input.imTeacherCheck
              ? input.educationalStage
              : undefined,
            email: input.email,
            imTeacherCheck: input.imTeacherCheck,
            name: input.name,
            notifications: !input.noNotifications,
            password: input.password,
            postCode: input.imTeacherCheck ? input.postCode : undefined,
            surnames: input.surnames
          }
        }
      });
      setUserError(undefined);
      setUserPlan(
        (input.imTeacherCheck || defaultPlan === teacherPlan.name) &&
          getAge(input.birthDate) >= 18
          ? teacherPlan
          : memberPlan
      );
      setUserId(data!.saveUserData.id!);
      goToNextStep();
    } catch (e) {
      if (e.graphQLErrors[0].extensions.code === "USER_EMAIL_EXISTS") {
        setUserError(e);
      }
    }
  };

  const onSignupUser = async (input: IPlan) => {
    setUserPlan(input);
    const {
      data
    }: ExecutionResult<{ finishSignUp?: string }> = await finishSignup({
      variables: {
        id: userId,
        userPlan: input.name
      }
    });
    const token = data!.finishSignUp;
    if (token) {
      client.resetStore();
      setToken(token);
      router.push("/app");
    } else {
      goToNextStep();
    }
  };

  if (
    (saveUserDataError && !userError) ||
    saveBirthDateError ||
    finishSignupError
  ) {
    return (
      <GraphQLErrorMessage
        apolloError={
          (saveUserDataError ||
            saveBirthDateError ||
            finishSignupError) as ApolloError
        }
      />
    );
  }

  if (step === signupSteps.create) {
    return (
      <ModalLayout
        title={t("signup.create-modal.title")}
        modalTitle={t("signup.create-modal.title")}
        text={t("signup.create-modal.content")}
        okButton={
          <CounterButton onClick={() => onSignupUser(userPlan)}>
            {t("signup.create-modal.ok")}
          </CounterButton>
        }
        cancelText={t("signup.create-modal.cancel")}
        onCancel={() => router.push("/")}
        isOpen={true}
      />
    );
  }

  if (step === signupSteps.leave) {
    return (
      <ModalLayout
        title={t("signup.leave-modal.title")}
        modalTitle={t("signup.leave-modal.title")}
        text={
          <p>
            {t("signup.leave-modal.content")}{" "}
            <b>{t("signup.leave-modal.content-highlighted")}</b>.
          </p>
        }
        cancelText={t("signup.leave-modal.cancel")}
        onCancel={goToPreviousStep}
        okText={t("signup.leave-modal.ok")}
        onOk={goToNextStep}
        isOpen={true}
      />
    );
  }

  return (
    <Wrap ref={wrapRef}>
      {step === signupSteps.birthDate ? (
        <AccessLayout
          panelTitle={t(`signup.${step}.title`)}
          size={AccessLayoutSize.MEDIUM}
        >
          <SignupBirthDateForm
            defaultValues={userData}
            loading={savingBirthDate}
            onCancel={goToPreviousStep}
            onSubmit={onSaveBirthDate}
          />
        </AccessLayout>
      ) : (
        <AccessLayout
          panelTitle={t("signup.title")}
          size={AccessLayoutSize.BIG}
        >
          {signupFlow === NORMAL_SIGNUP_FLOW && (
            <StepCounter>
              {t("signup.step", [
                (signupFlow.findIndex(s => s === step) + 1).toString()
              ])}
            </StepCounter>
          )}
          <StepTitle>{t(`signup.${step}.title`)}</StepTitle>
          {step === signupSteps.userData && (
            <>
              {t("signup.login.account-text")}{" "}
              <Link href="/login">
                <a>{t("signup.login.account-link")}</a>
              </Link>
              .
              <LoginWith>
                <div>
                  {t("signup.login.with-text")}
                  <LoginWithLegalInformation>
                    {t("signup.login.with-sub-text-1")}{" "}
                    <a target="_blank" href="/legal/general-conditions">
                      {t("legal.general-conditions").toLowerCase()}
                    </a>{" "}
                    {t("signup.login.with-sub-text-2")}{" "}
                    <a target="_blank" href={privacyPolicyUrl}>
                      {t("legal.privacy-policy").toLowerCase()}
                    </a>
                    .
                  </LoginWithLegalInformation>
                </div>
                <LoginWithButtons>
                  <LoginWithMicrosoftButton />
                  <LoginWithGoogleButton />
                </LoginWithButtons>
              </LoginWith>
              <SignupUserDataForm
                defaultValues={userData}
                error={userError}
                loading={savingUserData}
                onCancel={goToPreviousStep}
                onSubmit={onSaveUser}
              />
            </>
          )}
          {step === signupSteps.plan && (
            <SignupPlanSelector
              defaultValues={userPlan ? userPlan : memberPlan}
              isAMinor={getAge(userData.birthDate) < 18}
              loading={finishingSignup}
              onCancel={goToPreviousStep}
              onSubmit={onSignupUser}
            />
          )}
        </AccessLayout>
      )}
    </Wrap>
  );
};

SignupStepPage.getInitialProps = async (ctx: NextPageContext) => {
  const { asPath } = ctx;
  if (
    asPath &&
    !Object.entries(signupSteps).find(
      item => item[1] === asPath.replace("/signup/", "").split("?id=")[0]
    )
  ) {
    redirect(ctx, `/signup/${signupSteps.userData}`);
  }
  return {};
};

export default withApollo(SignupStepPage, { requiresSession: false });

/* Styled components */

const Wrap = styled.div`
  a {
    color: ${colors.brandBlue};
    font-style: italic;
    font-weight: bold;
    text-decoration: none;
  }
`;

const LoginWith = styled.div`
  display: flex;
  padding: 20px 0;
  width: 50%;
`;

const LoginWithLegalInformation = styled.div`
  font-size: 12px;
  line-height: 18px;
  padding-top: 10px;
`;

const LoginWithButtons = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-left: 15px;
`;

const StepCounter = styled.div`
  color: ${colors.gray4};
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const StepTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 40px;
`;
