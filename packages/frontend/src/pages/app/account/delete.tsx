import { useTranslate, DialogModal } from "@bitbloq/ui";
import withApollo from "../../../apollo/withApollo";
import { logout } from "../../../lib/session";

const DeletePage = () => {
  const t = useTranslate();

  return (
    <DialogModal
      cancelText={t("account.user-data.delete.confirmation.button")}
      isOpen={true}
      onCancel={logout}
      text={t("account.user-data.delete.confirmation.text")}
      title={t("account.user-data.delete.confirmation.title")}
      transparentOverlay={true}
    />
  );
};

export default withApollo(DeletePage, { requiresSession: false });
