import { NextPage } from "next";
import { useRouter } from "next/router";

import ErrorPage from "../../../../_error";
import EditDocument from "../../../../../components/EditDocument";
import withApollo from "../../../../../apollo/withApollo";
import { documentTypes } from "../../../../../config";

const EditDocumentPage: NextPage = () => {
  const router = useRouter();

  const { id, folder, type } = router.query;

  const documentType = documentTypes[type];
  if (!documentType || !documentType.supported) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <EditDocument
      id={id as string}
      folder={folder as string}
      type={type as string}
    />
  );
};

export default withApollo(EditDocumentPage, { requiresSession: false });
