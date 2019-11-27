import { ApolloError } from "apollo-client";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { useMutation, ExecutionResult, useApolloClient } from "react-apollo";
import { colors, HorizontalRule, Panel, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import {
  FINISH_SIGNUP_MUTATION,
  SAVE_USER_DATA_MUTATION
} from "../../apollo/queries";
import withApollo from "../../apollo/withApollo";
import CounterButton from "../../components/CounterButton";
import GraphQLErrorMessage from "../../components/GraphQLErrorMessage";
import LoginWithGoogleButton from "../../components/LoginWithGoogleButton";
import LoginWithMicrosoftButton from "../../components/LoginWithMicrosoftButton";
import ModalLayout from "../../components/ModalLayout";
import SignupPlanSelection from "../../components/SignupPlanSelection";
import SignupUserData from "../../components/SignupUserData";
import logoBetaImage from "../../images/logo-beta.svg";
import { educationalStages, plans, signupSteps } from "../../config";
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

const SignupStepPage: FC = () => {
  const client = useApolloClient();
  const router = useRouter();
  const t = useTranslate();
  const wrapRef = React.createRef<HTMLDivElement>();

  const { id: externalProfileId, plan: defaultPlan, step } = router.query;

  useEffect(() => {
    if (wrapRef && wrapRef.current) {
      wrapRef.current.scrollIntoView();
    }
    if (!signupSteps.includes(step as string)) {
      router.push("/signup/[step]", `/signup/${_.first(signupSteps)}`, {
        shallow: true
      });
    }
    if (step === _.last(signupSteps)) {
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
      router.push("/signup/[step]", `/signup/${signupSteps[1]}`, {
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
        router.push("/signup/[step]", `/signup/${signupSteps[2]}`, {
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

  if (step === _.last(signupSteps)) {
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
      <Container>
        <Logo src={logoBetaImage} alt="Bitbloq Beta" />
        <SignupPanel>
          <Header>{t("signup.title")}</Header>
          <HorizontalRule small />
          <Content>
            <StepCounter>
              {t("signup.step", [
                (signupSteps.findIndex(s => s === step) + 1).toLocaleString()
              ])}
            </StepCounter>
            <Title>{t(`signup.${step}.title`)}</Title>
            {step === signupSteps[0] && (
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
                      <a target="_blank" href="https://bitbloq.bq.com/#">
                        {t("signup.login.general-conditions-link")}
                      </a>{" "}
                      {t("signup.login.with-sub-text-2")}{" "}
                      <a
                        target="_blank"
                        href="https://bitbloq.bq.com/#/cookies"
                      >
                        {t("signup.login.privacy-policy-link")}
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
            {step === signupSteps[1] && (
              <SignupPlanSelection
                defaultValues={userPlan ? userPlan : memberPlan}
                isAMinor={userData ? getAge(userData.birthDate) < 18 : false}
                loading={finishingSignup}
                onSubmit={onSignupUser}
              />
            )}
          </Content>
        </SignupPanel>
      </Container>
    </Wrap>
  );
};

export default withApollo(SignupStepPage, { requiresSession: false });

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

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  a {
    color: ${colors.brandBlue};
    font-style: italic;
    font-weight: bold;
    text-decoration: none;
  }
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

const SignupPanel = styled(Panel)`
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  height: 105px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
`;

const Content = styled.div`
  font-size: 14px;
  line-height: 22px;
  padding: 40px;
`;

const StepCounter = styled.div`
  color: ${colors.gray4};
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 40px;
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
