import documentResolver from './document';
import exerciseResolver from './exercise';
import folderResolver from './folder';
import submissionResolver from './submission';
import uploadResolver from './upload';
import userResolver from './user';

const jsonType = {
  __parseValue(value: any) {
    return value;
  },
  __parseLiteral(ast: any) {
    return ast.value;
  },
  __serialize(value: any) {
    return value;
  },
};

export const allResolvers = [
  { JSON: jsonType },
  userResolver,
  folderResolver,
  documentResolver,
  exerciseResolver,
  submissionResolver,
  uploadResolver,
];
