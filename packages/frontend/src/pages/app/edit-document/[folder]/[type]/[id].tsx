import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const EditDocument = dynamic(
  () => import("../../../../../components/EditDocument"),
  {
    ssr: false
  }
);
import withApollo from "../../../../../apollo/withApollo";

const EditDocumentPage = () => {
  const router = useRouter();

  const { id, folder, type } = router.query;

  return (
    <EditDocument
      id={id as string}
      folder={folder as string}
      type={type as string}
    />
  );
};

export default withApollo(EditDocumentPage);
