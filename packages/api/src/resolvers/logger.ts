import { logger, loggerController } from "../controllers/logs";

const loggerResolver = {
  Mutation: {
    /**
     * storeFrontLog: log new information.
     * args: log information
     */
    storeFrontLog: async (root: any, args: any, context: any) => {
      await loggerController.storeInfoLog(
        "FRONT",
        args.input.modelType,
        args.input.action,
        args.input.docType,
        context.user.userID,
        args.input.others
      );
      return "OK";
    }
  }
};

export default loggerResolver;
