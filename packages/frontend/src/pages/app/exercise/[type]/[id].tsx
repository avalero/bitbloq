import { useRouter } from "next/router";

import ErrorPage from "../../../_error";
import EditExercise from "../../../../components/EditExercise";
import withApollo from "../../../../apollo/withApollo";
import { documentTypes } from "../../../../config";

const EditExercisePage = () => {
  const router = useRouter();

  const { id, type } = router.query;

  const documentType = documentTypes[type];
  if (!documentType || !documentType.supported) {
    return <ErrorPage statusCode={404} />
  }

  return <EditExercise id={id as string} type={type as string} />;
};

EditExercisePage.getInitialProps = async () => {
  return {
    tempSession: "exercise-team"
  };
};

export default withApollo(EditExercisePage, { tempSession: "exercise-team" });
