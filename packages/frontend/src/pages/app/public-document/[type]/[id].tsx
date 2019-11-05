import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import PublicDocument from "../../../../components/PublicDocument";
import withApollo from "../../../../apollo/withApollo";

const PublicDocumentPage = () => {
  const router = useRouter();

  const { id, type } = router.query;

  return <PublicDocument id={id as string} type={type as string} />;
};

export default withApollo(PublicDocumentPage, { requiresSession: false });
