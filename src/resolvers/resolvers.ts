import userResolver from './user';
import documentResolver from './document';
import exerciseResolver from './exercise';
import submissionResolver from './submission';

export const allResolvers = [
  userResolver,
  documentResolver,
  exerciseResolver,
  submissionResolver,
];
