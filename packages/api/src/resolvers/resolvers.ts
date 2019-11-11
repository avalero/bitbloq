import documentResolver from "./document";
import exerciseResolver from "./exercise";
import folderResolver from "./folder";
import submissionResolver from "./submission";
import uploadResolver from "./upload";
import userResolver from "./user";

export const allResolvers = [
  userResolver,
  folderResolver,
  documentResolver,
  exerciseResolver,
  submissionResolver,
  uploadResolver
];
