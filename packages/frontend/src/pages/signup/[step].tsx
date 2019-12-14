import { ApolloError } from "apollo-client";
import _ from "lodash";
import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { useMutation, ExecutionResult, useApolloClient } from "react-apollo";
import { colors, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import {
  FINISH_SIGNUP_MUTATION,
  SAVE_USER_DATA_MUTATION
} from "../../apollo/queries";
import withApollo from "../../apollo/withApollo";
import AccessLayout, { AccessLayoutSize } from "../../components/AccessLayout";
import CounterButton from "../../components/CounterButton";
import GraphQLErrorMessage from "../../components/GraphQLErrorMessage";
import LoginWithGoogleButton from "../../components/LoginWithGoogleButton";
import LoginWithMicrosoftButton from "../../components/LoginWithMicrosoftButton";
import ModalLayout from "../../components/ModalLayout";
import SignupPlanSelection from "../../components/SignupPlanSelection";
import SignupUserData from "../../components/SignupUserData";
import {
  educationalStages,
  plans,
  privacyPolicyUrl,
  signupSteps
} from "../../config";
import redirect from "../../lib/redirect";
import { setToken } from "../../lib/session";
import { IPlan } from "../../types";
import { getAge } from "../../util";
import { IUserStep1 } from "../../../../api/src/api-types";

interface IUserData {
  acceptTerms: boolean;
  birthDate: string;
  centerName: string;
  city: string;
  country: string;
  day: number;
  educationalStage: string;
  email: string;
  imTeacherCheck: boolean;
  month: number;
  name: string;
  noNotifications: boolean;
  password: string;
  postCode: number;
  surnames: string;
  year: number;
}

interface ISaveUserResult {
  saveUserData: IUserStep1;
}

interface ISignupUserResult {
  finishSignUp?: string;
}

const SignupStepPage: NextPage = () => {
  const client = useApolloClient();
  const router = useRouter();
  const t = useTranslate();
  const wrapRef = React.createRef<HTMLDivElement>();

  const { id: externalProfileId, plan: defaultPlan, step } = router.query;

  useEffect(() => {
    if (wrapRef && wrapRef.current) {
      wrapRef.current.scrollIntoView();
    }
    if (step === signupSteps.create) {
      router.beforePopState(() => {
        router.push("/");
        return false;
      });
    }
  }, [step]);

  const memberPlan = plans.filter(p => p.name === "member")[0];
  const teacherPlan = plans.filter(p => p.name === "teacher")[0];

  const [error, setError] = useState<ApolloError>();
  const [userError, setUserError] = useState<ApolloError>();
  const [userData, setUserData] = useState({
    acceptTerms: false,
    birthDate: "",
    country: "ES",
    educationalStage: _.first(educationalStages),
    imTeacherCheck: defaultPlan === teacherPlan.name,
    noNotifications: false
  });
  const [userId, setUserId] = useState();
  const [userPlan, setUserPlan] = useState();

  const [finishSignup, { loading: finishingSignup }] = useMutation(
    FINISH_SIGNUP_MUTATION
  );
  const [saveUserData, { loading: savingUserData }] = useMutation(
    SAVE_USER_DATA_MUTATION
  );

  const onSaveUser = async (input: IUserData) => {
    setUserData(input);
    try {
      const { data }: ExecutionResult<ISaveUserResult> = await saveUserData({
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
      setUserId(data!.saveUserData.id);
      router.push("/signup/[step]", `/signup/${signupSteps.planSelection}`, {
        shallow: true
      });
    } catch (e) {
      e.graphQLErrors[0].extensions.code === "USER_EMAIL_EXISTS"
        ? setUserError(e)
        : setError(e);
    }
  };

  const onSignupUser = async (input: IPlan) => {
    setUserPlan(input);
    try {
      const { data }: ExecutionResult<ISignupUserResult> = await finishSignup({
        variables: {
          id: externalProfileId || userId,
          userPlan: input.name
        }
      });
      const token = data!.finishSignUp;
      if (token) {
        client.resetStore();
        setToken(token);
        router.push("/app");
      } else {
        router.push("/signup/[step]", `/signup/${signupSteps.create}`, {
          shallow: true
        });
      }
    } catch (e) {
      setError(e);
    }
  };

  if (error) {
    return <GraphQLErrorMessage apolloError={error} />;
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

  return (
    <Wrap ref={wrapRef}>
      <AccessLayout panelTitle={t("signup.title")} size={AccessLayoutSize.BIG}>
        {step === signupSteps.userData && (
          <>
            <StepCounter>{t("signup.step", ["1"])}</StepCounter>
            <StepTitle>{t(`signup.${step}.title`)}</StepTitle>
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
            <SignupUserData
              defaultValues={userData}
              error={userError}
              loading={savingUserData}
              onSubmit={onSaveUser}
            />
          </>
        )}
        {step === signupSteps.planSelection && (
          <>
            <StepCounter>{t("signup.step", ["2"])}</StepCounter>
            <StepTitle>{t(`signup.${step}.title`)}</StepTitle>
            <SignupPlanSelection
              defaultValues={userPlan ? userPlan : memberPlan}
              isAMinor={userData ? getAge(userData.birthDate) < 18 : false}
              loading={finishingSignup}
              onSubmit={onSignupUser}
            />
          </>
        )}
        {step === signupSteps.birthdate && (
          <>
            <StepTitle>{t(`signup.${step}.title`)}</StepTitle>
          </>
        )}
      </AccessLayout>
    </Wrap>
  );
};

SignupStepPage.getInitialProps = async (ctx: NextPageContext) => {
  const { asPath } = ctx;
  if (
    asPath &&
    !Object.entries(signupSteps).find(
      item => item[1] === asPath.replace("/signup/", "")
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
