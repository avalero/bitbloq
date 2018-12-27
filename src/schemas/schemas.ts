import UserSchema from './user.schema';
import documentGraphSchema from './document.schema';
import typeDefSub from './submission.schema';
import exerciseSchema from './exercise.schema';
import typeDefVer from './version.schema';

export const allSchemas = [
  UserSchema,
  exerciseSchema,
  documentGraphSchema,
  //typeDefSub,
  //typeDefVer,
];

