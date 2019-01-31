import userResolver from './user';
import documentResolver from './document';
import exerciseResolver from './exercise';
import submissionResolver from './submission';
import uploadResolver from './upload';

const JSONType = {
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
  { JSON: JSONType },
  userResolver,
  documentResolver,
  exerciseResolver,
  submissionResolver,
  uploadResolver,
];
