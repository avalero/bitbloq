import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ObjectID: string;
  EmailAddress: string;
  Date: Date;
  JSON: any;
  Number: number;
  Upload: File;
};

export type CloudResourcesResult = {
  __typename?: "CloudResourcesResult";
  resources?: Maybe<Array<Maybe<Resource>>>;
  pagesNumber?: Maybe<Scalars["Number"]>;
};

export type DocImage = {
  __typename?: "DocImage";
  image?: Maybe<Scalars["String"]>;
  isSnapshot?: Maybe<Scalars["Boolean"]>;
};

export type DocImageIn = {
  image?: Maybe<Scalars["String"]>;
  isSnapshot?: Maybe<Scalars["Boolean"]>;
};

export type DocsAndFolders = {
  __typename?: "DocsAndFolders";
  result?: Maybe<Array<Maybe<Result>>>;
  pagesNumber?: Maybe<Scalars["Number"]>;
  nFolders?: Maybe<Scalars["Number"]>;
  parentsPath?: Maybe<Array<Maybe<Folder>>>;
};

export type Document = {
  __typename?: "Document";
  id?: Maybe<Scalars["ObjectID"]>;
  user?: Maybe<Scalars["ObjectID"]>;
  title: Scalars["String"];
  type?: Maybe<Scalars["String"]>;
  folder?: Maybe<Scalars["ObjectID"]>;
  content?: Maybe<Scalars["String"]>;
  advancedMode?: Maybe<Scalars["Boolean"]>;
  cache?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
  image?: Maybe<DocImage>;
  public?: Maybe<Scalars["Boolean"]>;
  example?: Maybe<Scalars["Boolean"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  exercises?: Maybe<Array<Maybe<Exercise>>>;
  images?: Maybe<Array<Maybe<File>>>;
  parentsPath?: Maybe<Array<Maybe<Folder>>>;
  resources?: Maybe<Array<Maybe<Resource>>>;
};

export type DocumentIn = {
  user?: Maybe<Scalars["ObjectID"]>;
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  folder?: Maybe<Scalars["ObjectID"]>;
  content?: Maybe<Scalars["String"]>;
  advancedMode?: Maybe<Scalars["Boolean"]>;
  cache?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
  image?: Maybe<DocImageIn>;
};

export type Exercise = {
  __typename?: "Exercise";
  id?: Maybe<Scalars["ObjectID"]>;
  document?: Maybe<Scalars["ObjectID"]>;
  user?: Maybe<Scalars["ObjectID"]>;
  title?: Maybe<Scalars["String"]>;
  content?: Maybe<Scalars["String"]>;
  cache?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  teacherName?: Maybe<Scalars["String"]>;
  acceptSubmissions?: Maybe<Scalars["Boolean"]>;
  image?: Maybe<Scalars["String"]>;
  expireDate?: Maybe<Scalars["Date"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  submissions?: Maybe<Array<Maybe<Submission>>>;
};

export type ExerciseIn = {
  document?: Maybe<Scalars["ObjectID"]>;
  title?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  acceptSubmissions?: Maybe<Scalars["Boolean"]>;
  expireDate?: Maybe<Scalars["Date"]>;
};

export type File = {
  __typename?: "File";
  id: Scalars["ID"];
  filename?: Maybe<Scalars["String"]>;
  mimetype?: Maybe<Scalars["String"]>;
  publicUrl?: Maybe<Scalars["String"]>;
  document?: Maybe<Scalars["ObjectID"]>;
  size?: Maybe<Scalars["Number"]>;
  storageName?: Maybe<Scalars["String"]>;
};

export type Folder = {
  __typename?: "Folder";
  id?: Maybe<Scalars["ObjectID"]>;
  name?: Maybe<Scalars["String"]>;
  user?: Maybe<Scalars["ObjectID"]>;
  documentsID?: Maybe<Array<Maybe<Scalars["ObjectID"]>>>;
  foldersID?: Maybe<Array<Maybe<Scalars["ObjectID"]>>>;
  parent?: Maybe<Scalars["ObjectID"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  documents?: Maybe<Array<Maybe<Document>>>;
  folders?: Maybe<Array<Maybe<Folder>>>;
  parentsPath?: Maybe<Array<Maybe<Folder>>>;
};

export type FolderIn = {
  name?: Maybe<Scalars["String"]>;
  user?: Maybe<Scalars["ObjectID"]>;
  documentsID?: Maybe<Array<Maybe<Scalars["ObjectID"]>>>;
  foldersID?: Maybe<Array<Maybe<Scalars["ObjectID"]>>>;
  parent?: Maybe<Scalars["ObjectID"]>;
};

export type LoginOut = {
  __typename?: "loginOut";
  token?: Maybe<Scalars["String"]>;
  exerciseID?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  signUpUser?: Maybe<Scalars["String"]>;
  activateAccount?: Maybe<Scalars["String"]>;
  login?: Maybe<Scalars["String"]>;
  renewToken?: Maybe<Scalars["String"]>;
  resetPasswordEmail?: Maybe<Scalars["String"]>;
  checkResetPasswordToken?: Maybe<Scalars["Boolean"]>;
  updatePassword?: Maybe<Scalars["String"]>;
  deleteUser?: Maybe<User>;
  updateUser?: Maybe<User>;
  createDocument?: Maybe<Document>;
  deleteDocument?: Maybe<Document>;
  updateDocument?: Maybe<Document>;
  setDocumentImage?: Maybe<Document>;
  updateDocumentContent?: Maybe<Document>;
  publishDocument?: Maybe<Document>;
  createExercise?: Maybe<Exercise>;
  changeSubmissionsState?: Maybe<Exercise>;
  updateExercise?: Maybe<Exercise>;
  deleteExercise?: Maybe<Exercise>;
  createFolder?: Maybe<Folder>;
  updateFolder?: Maybe<Folder>;
  deleteFolder?: Maybe<Folder>;
  startSubmission?: Maybe<LoginOut>;
  loginSubmission?: Maybe<LoginOut>;
  updateSubmission?: Maybe<Submission>;
  finishSubmission?: Maybe<Submission>;
  cancelSubmission?: Maybe<Submission>;
  deleteSubmission?: Maybe<Submission>;
  gradeSubmission?: Maybe<Submission>;
  updatePasswordSubmission?: Maybe<Submission>;
  setActiveSubmission?: Maybe<Submission>;
  singleUpload?: Maybe<File>;
  uploadCloudResource?: Maybe<File>;
  addResourceToDocument?: Maybe<File>;
  uploadSTLFile?: Maybe<File>;
  uploadImageFile?: Maybe<File>;
  deleteUserFile?: Maybe<File>;
  moveToTrash?: Maybe<File>;
  restoreResource?: Maybe<File>;
};

export type MutationSignUpUserArgs = {
  input: UserIn;
};

export type MutationActivateAccountArgs = {
  token?: Maybe<Scalars["String"]>;
};

export type MutationLoginArgs = {
  email: Scalars["EmailAddress"];
  password: Scalars["String"];
};

export type MutationResetPasswordEmailArgs = {
  email: Scalars["EmailAddress"];
};

export type MutationCheckResetPasswordTokenArgs = {
  token?: Maybe<Scalars["String"]>;
};

export type MutationUpdatePasswordArgs = {
  token?: Maybe<Scalars["String"]>;
  newPassword?: Maybe<Scalars["String"]>;
};

export type MutationDeleteUserArgs = {
  id: Scalars["ObjectID"];
};

export type MutationUpdateUserArgs = {
  id: Scalars["ObjectID"];
  input: UserIn;
};

export type MutationCreateDocumentArgs = {
  input: DocumentIn;
};

export type MutationDeleteDocumentArgs = {
  id: Scalars["ObjectID"];
};

export type MutationUpdateDocumentArgs = {
  id: Scalars["ObjectID"];
  input?: Maybe<DocumentIn>;
};

export type MutationSetDocumentImageArgs = {
  id?: Maybe<Scalars["ObjectID"]>;
  image?: Maybe<Scalars["Upload"]>;
  isSnapshot?: Maybe<Scalars["Boolean"]>;
};

export type MutationUpdateDocumentContentArgs = {
  id?: Maybe<Scalars["ObjectID"]>;
  content?: Maybe<Scalars["String"]>;
  cache?: Maybe<Scalars["String"]>;
  advancedMode?: Maybe<Scalars["Boolean"]>;
};

export type MutationPublishDocumentArgs = {
  id: Scalars["ObjectID"];
  public?: Maybe<Scalars["Boolean"]>;
  example?: Maybe<Scalars["Boolean"]>;
};

export type MutationCreateExerciseArgs = {
  input: ExerciseIn;
};

export type MutationChangeSubmissionsStateArgs = {
  id: Scalars["ObjectID"];
  subState: Scalars["Boolean"];
};

export type MutationUpdateExerciseArgs = {
  id: Scalars["ObjectID"];
  input?: Maybe<ExerciseIn>;
};

export type MutationDeleteExerciseArgs = {
  id: Scalars["ObjectID"];
};

export type MutationCreateFolderArgs = {
  input?: Maybe<FolderIn>;
};

export type MutationUpdateFolderArgs = {
  id: Scalars["ObjectID"];
  input?: Maybe<FolderIn>;
};

export type MutationDeleteFolderArgs = {
  id: Scalars["ObjectID"];
};

export type MutationStartSubmissionArgs = {
  exerciseCode: Scalars["String"];
  studentNick: Scalars["String"];
  password: Scalars["String"];
};

export type MutationLoginSubmissionArgs = {
  exerciseCode: Scalars["String"];
  studentNick: Scalars["String"];
  password: Scalars["String"];
};

export type MutationUpdateSubmissionArgs = {
  input?: Maybe<SubmissionIn>;
};

export type MutationFinishSubmissionArgs = {
  content?: Maybe<Scalars["String"]>;
  cache?: Maybe<Scalars["String"]>;
  studentComment?: Maybe<Scalars["String"]>;
};

export type MutationDeleteSubmissionArgs = {
  submissionID: Scalars["ObjectID"];
};

export type MutationGradeSubmissionArgs = {
  submissionID?: Maybe<Scalars["ObjectID"]>;
  grade?: Maybe<Scalars["Float"]>;
  teacherComment?: Maybe<Scalars["String"]>;
};

export type MutationUpdatePasswordSubmissionArgs = {
  submissionID: Scalars["ObjectID"];
  password: Scalars["String"];
};

export type MutationSetActiveSubmissionArgs = {
  submissionID: Scalars["ObjectID"];
  active: Scalars["Boolean"];
};

export type MutationSingleUploadArgs = {
  file: Scalars["Upload"];
  documentID?: Maybe<Scalars["ObjectID"]>;
};

export type MutationUploadCloudResourceArgs = {
  file: Scalars["Upload"];
};

export type MutationAddResourceToDocumentArgs = {
  resourceID: Scalars["ID"];
  documentID: Scalars["ID"];
};

export type MutationUploadStlFileArgs = {
  file: Scalars["Upload"];
  documentID?: Maybe<Scalars["ObjectID"]>;
};

export type MutationUploadImageFileArgs = {
  file: Scalars["Upload"];
  documentID?: Maybe<Scalars["ObjectID"]>;
};

export type MutationDeleteUserFileArgs = {
  filename: Scalars["String"];
};

export type MutationMoveToTrashArgs = {
  id?: Maybe<Scalars["ObjectID"]>;
};

export type MutationRestoreResourceArgs = {
  id?: Maybe<Scalars["ObjectID"]>;
};

export type Query = {
  __typename?: "Query";
  users?: Maybe<Array<Maybe<User>>>;
  me?: Maybe<User>;
  documents?: Maybe<Array<Maybe<Document>>>;
  document?: Maybe<Document>;
  documentsAndFolders?: Maybe<DocsAndFolders>;
  hasExercises?: Maybe<Scalars["Boolean"]>;
  openPublicDocument?: Maybe<Document>;
  examples?: Maybe<Array<Maybe<Document>>>;
  exercises?: Maybe<Array<Maybe<Exercise>>>;
  exercise?: Maybe<Exercise>;
  exercisesByDocument?: Maybe<Array<Maybe<Exercise>>>;
  exerciseByCode?: Maybe<Exercise>;
  folders?: Maybe<Array<Maybe<Folder>>>;
  folder?: Maybe<Folder>;
  rootFolder?: Maybe<Folder>;
  submissions?: Maybe<Array<Maybe<Submission>>>;
  submission?: Maybe<Submission>;
  submissionsByExercise?: Maybe<Array<Maybe<Submission>>>;
  uploads?: Maybe<Array<Maybe<File>>>;
  getUserFiles?: Maybe<Array<Maybe<File>>>;
  cloudResources?: Maybe<CloudResourcesResult>;
};

export type QueryDocumentArgs = {
  id: Scalars["ObjectID"];
};

export type QueryDocumentsAndFoldersArgs = {
  currentLocation?: Maybe<Scalars["ObjectID"]>;
  currentPage?: Maybe<Scalars["Number"]>;
  itemsPerPage?: Maybe<Scalars["Number"]>;
  order?: Maybe<Scalars["String"]>;
  searchTitle?: Maybe<Scalars["String"]>;
};

export type QueryHasExercisesArgs = {
  id: Scalars["ObjectID"];
  type?: Maybe<Scalars["String"]>;
};

export type QueryOpenPublicDocumentArgs = {
  id: Scalars["ObjectID"];
};

export type QueryExerciseArgs = {
  id: Scalars["ObjectID"];
};

export type QueryExercisesByDocumentArgs = {
  document: Scalars["ObjectID"];
};

export type QueryExerciseByCodeArgs = {
  code: Scalars["String"];
};

export type QueryFolderArgs = {
  id: Scalars["ObjectID"];
};

export type QuerySubmissionArgs = {
  id?: Maybe<Scalars["ObjectID"]>;
};

export type QuerySubmissionsByExerciseArgs = {
  exercise: Scalars["ObjectID"];
};

export type QueryCloudResourcesArgs = {
  type?: Maybe<Array<Maybe<Scalars["String"]>>>;
  currentPage?: Maybe<Scalars["Number"]>;
  order?: Maybe<Scalars["String"]>;
  searchTitle?: Maybe<Scalars["String"]>;
  deleted?: Maybe<Scalars["Boolean"]>;
};

export type Resource = {
  __typename?: "Resource";
  id?: Maybe<Scalars["ID"]>;
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  thumbnail?: Maybe<Scalars["String"]>;
  preview?: Maybe<Scalars["String"]>;
  size?: Maybe<Scalars["Number"]>;
  file?: Maybe<Scalars["String"]>;
  deleted?: Maybe<Scalars["Boolean"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  documents?: Maybe<Array<Maybe<Document>>>;
};

export type Result = {
  __typename?: "Result";
  id?: Maybe<Scalars["ObjectID"]>;
  title?: Maybe<Scalars["String"]>;
  image?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  parent?: Maybe<Scalars["ObjectID"]>;
};

export enum Role {
  User = "USER",
  Admin = "ADMIN",
  Publisher = "PUBLISHER",
  Teacher = "TEACHER",
  Teacherpro = "TEACHERPRO",
  Student = "STUDENT",
  Family = "FAMILY"
}

export type Submission = {
  __typename?: "Submission";
  id?: Maybe<Scalars["ObjectID"]>;
  title?: Maybe<Scalars["String"]>;
  exercise?: Maybe<Scalars["ObjectID"]>;
  user?: Maybe<Scalars["ObjectID"]>;
  document?: Maybe<Scalars["ObjectID"]>;
  studentNick?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  content?: Maybe<Scalars["String"]>;
  cache?: Maybe<Scalars["String"]>;
  submissionToken?: Maybe<Scalars["String"]>;
  finished?: Maybe<Scalars["Boolean"]>;
  studentComment?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  finishedAt?: Maybe<Scalars["Date"]>;
  grade?: Maybe<Scalars["Float"]>;
  teacherComment?: Maybe<Scalars["String"]>;
  gradedAt?: Maybe<Scalars["Date"]>;
  active?: Maybe<Scalars["Boolean"]>;
};

export type SubmissionIn = {
  title?: Maybe<Scalars["String"]>;
  finished?: Maybe<Scalars["Boolean"]>;
  studentComment?: Maybe<Scalars["String"]>;
  studentNick?: Maybe<Scalars["String"]>;
  content?: Maybe<Scalars["String"]>;
  cache?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  active?: Maybe<Scalars["Boolean"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  documentUpdated?: Maybe<Document>;
  folderUpdated?: Maybe<Folder>;
  submissionUpdated?: Maybe<Submission>;
  submissionActive?: Maybe<Submission>;
};

export type SubscriptionSubmissionUpdatedArgs = {
  exercise: Scalars["ObjectID"];
};

export type User = {
  __typename?: "User";
  id?: Maybe<Scalars["ObjectID"]>;
  email?: Maybe<Scalars["EmailAddress"]>;
  password?: Maybe<Scalars["String"]>;
  admin?: Maybe<Scalars["Boolean"]>;
  publisher?: Maybe<Scalars["Boolean"]>;
  teacher?: Maybe<Scalars["Boolean"]>;
  teacherPro?: Maybe<Scalars["Boolean"]>;
  family?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  center?: Maybe<Scalars["String"]>;
  active?: Maybe<Scalars["Boolean"]>;
  signUpToken?: Maybe<Scalars["String"]>;
  authToken?: Maybe<Scalars["String"]>;
  notifications?: Maybe<Scalars["Boolean"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  lastLogin?: Maybe<Scalars["Date"]>;
  signUpSurvey?: Maybe<Scalars["JSON"]>;
  rootFolder?: Maybe<Scalars["ObjectID"]>;
  documents?: Maybe<Array<Maybe<Document>>>;
  folders?: Maybe<Array<Maybe<Folder>>>;
};

export type UserIn = {
  email?: Maybe<Scalars["EmailAddress"]>;
  password?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  center?: Maybe<Scalars["String"]>;
  active?: Maybe<Scalars["Boolean"]>;
  signUpToken?: Maybe<Scalars["String"]>;
  authToken?: Maybe<Scalars["String"]>;
  notifications?: Maybe<Scalars["Boolean"]>;
  signUpSurvey?: Maybe<Scalars["JSON"]>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  ObjectID: ResolverTypeWrapper<Scalars["ObjectID"]>;
  EmailAddress: ResolverTypeWrapper<Scalars["EmailAddress"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
  JSON: ResolverTypeWrapper<Scalars["JSON"]>;
  Document: ResolverTypeWrapper<Document>;
  DocImage: ResolverTypeWrapper<DocImage>;
  Exercise: ResolverTypeWrapper<Exercise>;
  Submission: ResolverTypeWrapper<Submission>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  File: ResolverTypeWrapper<File>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Number: ResolverTypeWrapper<Scalars["Number"]>;
  Folder: ResolverTypeWrapper<Folder>;
  Resource: ResolverTypeWrapper<Resource>;
  DocsAndFolders: ResolverTypeWrapper<DocsAndFolders>;
  Result: ResolverTypeWrapper<Result>;
  CloudResourcesResult: ResolverTypeWrapper<CloudResourcesResult>;
  Mutation: ResolverTypeWrapper<{}>;
  UserIn: UserIn;
  DocumentIn: DocumentIn;
  DocImageIn: DocImageIn;
  Upload: ResolverTypeWrapper<Scalars["Upload"]>;
  ExerciseIn: ExerciseIn;
  FolderIn: FolderIn;
  loginOut: ResolverTypeWrapper<LoginOut>;
  SubmissionIn: SubmissionIn;
  Subscription: ResolverTypeWrapper<{}>;
  Role: Role;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  User: User;
  ObjectID: Scalars["ObjectID"];
  EmailAddress: Scalars["EmailAddress"];
  String: Scalars["String"];
  Boolean: Scalars["Boolean"];
  Date: Scalars["Date"];
  JSON: Scalars["JSON"];
  Document: Document;
  DocImage: DocImage;
  Exercise: Exercise;
  Submission: Submission;
  Float: Scalars["Float"];
  File: File;
  ID: Scalars["ID"];
  Number: Scalars["Number"];
  Folder: Folder;
  Resource: Resource;
  DocsAndFolders: DocsAndFolders;
  Result: Result;
  CloudResourcesResult: CloudResourcesResult;
  Mutation: {};
  UserIn: UserIn;
  DocumentIn: DocumentIn;
  DocImageIn: DocImageIn;
  Upload: Scalars["Upload"];
  ExerciseIn: ExerciseIn;
  FolderIn: FolderIn;
  loginOut: LoginOut;
  SubmissionIn: SubmissionIn;
  Subscription: {};
  Role: Role;
};

export type AuthRequiredDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = { requires?: Maybe<Maybe<Array<Maybe<Role>>>> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CloudResourcesResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["CloudResourcesResult"] = ResolversParentTypes["CloudResourcesResult"]
> = {
  resources?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Resource"]>>>,
    ParentType,
    ContextType
  >;
  pagesNumber?: Resolver<
    Maybe<ResolversTypes["Number"]>,
    ParentType,
    ContextType
  >;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export type DocImageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["DocImage"] = ResolversParentTypes["DocImage"]
> = {
  image?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  isSnapshot?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
};

export type DocsAndFoldersResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["DocsAndFolders"] = ResolversParentTypes["DocsAndFolders"]
> = {
  result?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Result"]>>>,
    ParentType,
    ContextType
  >;
  pagesNumber?: Resolver<
    Maybe<ResolversTypes["Number"]>,
    ParentType,
    ContextType
  >;
  nFolders?: Resolver<Maybe<ResolversTypes["Number"]>, ParentType, ContextType>;
  parentsPath?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
};

export type DocumentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Document"] = ResolversParentTypes["Document"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  folder?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  advancedMode?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  cache?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  version?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes["DocImage"]>, ParentType, ContextType>;
  public?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  example?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  exercises?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Exercise"]>>>,
    ParentType,
    ContextType
  >;
  images?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["File"]>>>,
    ParentType,
    ContextType
  >;
  parentsPath?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
  resources?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Resource"]>>>,
    ParentType,
    ContextType
  >;
};

export interface EmailAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["EmailAddress"], any> {
  name: "EmailAddress";
}

export type ExerciseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Exercise"] = ResolversParentTypes["Exercise"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  document?: Resolver<
    Maybe<ResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  user?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  cache?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  teacherName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  acceptSubmissions?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  image?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  expireDate?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  submissions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Submission"]>>>,
    ParentType,
    ContextType
  >;
};

export type FileResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["File"] = ResolversParentTypes["File"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  filename?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  mimetype?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  publicUrl?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  document?: Resolver<
    Maybe<ResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  size?: Resolver<Maybe<ResolversTypes["Number"]>, ParentType, ContextType>;
  storageName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type FolderResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Folder"] = ResolversParentTypes["Folder"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  documentsID?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ObjectID"]>>>,
    ParentType,
    ContextType
  >;
  foldersID?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ObjectID"]>>>,
    ParentType,
    ContextType
  >;
  parent?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  documents?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Document"]>>>,
    ParentType,
    ContextType
  >;
  folders?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
  parentsPath?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
};

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["JSON"], any> {
  name: "JSON";
}

export type LoginOutResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["loginOut"] = ResolversParentTypes["loginOut"]
> = {
  token?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  exerciseID?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  signUpUser?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType,
    RequireFields<MutationSignUpUserArgs, "input">
  >;
  activateAccount?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType,
    MutationActivateAccountArgs
  >;
  login?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "email" | "password">
  >;
  renewToken?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  resetPasswordEmail?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType,
    RequireFields<MutationResetPasswordEmailArgs, "email">
  >;
  checkResetPasswordToken?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    MutationCheckResetPasswordTokenArgs
  >;
  updatePassword?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType,
    MutationUpdatePasswordArgs
  >;
  deleteUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteUserArgs, "id">
  >;
  updateUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, "id" | "input">
  >;
  createDocument?: Resolver<
    Maybe<ResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateDocumentArgs, "input">
  >;
  deleteDocument?: Resolver<
    Maybe<ResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteDocumentArgs, "id">
  >;
  updateDocument?: Resolver<
    Maybe<ResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateDocumentArgs, "id">
  >;
  setDocumentImage?: Resolver<
    Maybe<ResolversTypes["Document"]>,
    ParentType,
    ContextType,
    MutationSetDocumentImageArgs
  >;
  updateDocumentContent?: Resolver<
    Maybe<ResolversTypes["Document"]>,
    ParentType,
    ContextType,
    MutationUpdateDocumentContentArgs
  >;
  publishDocument?: Resolver<
    Maybe<ResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<MutationPublishDocumentArgs, "id">
  >;
  createExercise?: Resolver<
    Maybe<ResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateExerciseArgs, "input">
  >;
  changeSubmissionsState?: Resolver<
    Maybe<ResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<MutationChangeSubmissionsStateArgs, "id" | "subState">
  >;
  updateExercise?: Resolver<
    Maybe<ResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateExerciseArgs, "id">
  >;
  deleteExercise?: Resolver<
    Maybe<ResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteExerciseArgs, "id">
  >;
  createFolder?: Resolver<
    Maybe<ResolversTypes["Folder"]>,
    ParentType,
    ContextType,
    MutationCreateFolderArgs
  >;
  updateFolder?: Resolver<
    Maybe<ResolversTypes["Folder"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateFolderArgs, "id">
  >;
  deleteFolder?: Resolver<
    Maybe<ResolversTypes["Folder"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteFolderArgs, "id">
  >;
  startSubmission?: Resolver<
    Maybe<ResolversTypes["loginOut"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationStartSubmissionArgs,
      "exerciseCode" | "studentNick" | "password"
    >
  >;
  loginSubmission?: Resolver<
    Maybe<ResolversTypes["loginOut"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationLoginSubmissionArgs,
      "exerciseCode" | "studentNick" | "password"
    >
  >;
  updateSubmission?: Resolver<
    Maybe<ResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    MutationUpdateSubmissionArgs
  >;
  finishSubmission?: Resolver<
    Maybe<ResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    MutationFinishSubmissionArgs
  >;
  cancelSubmission?: Resolver<
    Maybe<ResolversTypes["Submission"]>,
    ParentType,
    ContextType
  >;
  deleteSubmission?: Resolver<
    Maybe<ResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteSubmissionArgs, "submissionID">
  >;
  gradeSubmission?: Resolver<
    Maybe<ResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    MutationGradeSubmissionArgs
  >;
  updatePasswordSubmission?: Resolver<
    Maybe<ResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdatePasswordSubmissionArgs,
      "submissionID" | "password"
    >
  >;
  setActiveSubmission?: Resolver<
    Maybe<ResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    RequireFields<MutationSetActiveSubmissionArgs, "submissionID" | "active">
  >;
  singleUpload?: Resolver<
    Maybe<ResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<MutationSingleUploadArgs, "file">
  >;
  uploadCloudResource?: Resolver<
    Maybe<ResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUploadCloudResourceArgs, "file">
  >;
  addResourceToDocument?: Resolver<
    Maybe<ResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationAddResourceToDocumentArgs,
      "resourceID" | "documentID"
    >
  >;
  uploadSTLFile?: Resolver<
    Maybe<ResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUploadStlFileArgs, "file">
  >;
  uploadImageFile?: Resolver<
    Maybe<ResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUploadImageFileArgs, "file">
  >;
  deleteUserFile?: Resolver<
    Maybe<ResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteUserFileArgs, "filename">
  >;
  moveToTrash?: Resolver<
    Maybe<ResolversTypes["File"]>,
    ParentType,
    ContextType,
    MutationMoveToTrashArgs
  >;
  restoreResource?: Resolver<
    Maybe<ResolversTypes["File"]>,
    ParentType,
    ContextType,
    MutationRestoreResourceArgs
  >;
};

export interface NumberScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Number"], any> {
  name: "Number";
}

export interface ObjectIdScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["ObjectID"], any> {
  name: "ObjectID";
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  users?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
  me?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  documents?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Document"]>>>,
    ParentType,
    ContextType
  >;
  document?: Resolver<
    Maybe<ResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<QueryDocumentArgs, "id">
  >;
  documentsAndFolders?: Resolver<
    Maybe<ResolversTypes["DocsAndFolders"]>,
    ParentType,
    ContextType,
    QueryDocumentsAndFoldersArgs
  >;
  hasExercises?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<QueryHasExercisesArgs, "id">
  >;
  openPublicDocument?: Resolver<
    Maybe<ResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<QueryOpenPublicDocumentArgs, "id">
  >;
  examples?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Document"]>>>,
    ParentType,
    ContextType
  >;
  exercises?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Exercise"]>>>,
    ParentType,
    ContextType
  >;
  exercise?: Resolver<
    Maybe<ResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<QueryExerciseArgs, "id">
  >;
  exercisesByDocument?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Exercise"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryExercisesByDocumentArgs, "document">
  >;
  exerciseByCode?: Resolver<
    Maybe<ResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<QueryExerciseByCodeArgs, "code">
  >;
  folders?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
  folder?: Resolver<
    Maybe<ResolversTypes["Folder"]>,
    ParentType,
    ContextType,
    RequireFields<QueryFolderArgs, "id">
  >;
  rootFolder?: Resolver<
    Maybe<ResolversTypes["Folder"]>,
    ParentType,
    ContextType
  >;
  submissions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Submission"]>>>,
    ParentType,
    ContextType
  >;
  submission?: Resolver<
    Maybe<ResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    QuerySubmissionArgs
  >;
  submissionsByExercise?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Submission"]>>>,
    ParentType,
    ContextType,
    RequireFields<QuerySubmissionsByExerciseArgs, "exercise">
  >;
  uploads?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["File"]>>>,
    ParentType,
    ContextType
  >;
  getUserFiles?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["File"]>>>,
    ParentType,
    ContextType
  >;
  cloudResources?: Resolver<
    Maybe<ResolversTypes["CloudResourcesResult"]>,
    ParentType,
    ContextType,
    QueryCloudResourcesArgs
  >;
};

export type ResourceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Resource"] = ResolversParentTypes["Resource"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  thumbnail?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  preview?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes["Number"]>, ParentType, ContextType>;
  file?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  deleted?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  documents?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Document"]>>>,
    ParentType,
    ContextType
  >;
};

export type ResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Result"] = ResolversParentTypes["Result"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
};

export type SubmissionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Submission"] = ResolversParentTypes["Submission"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  exercise?: Resolver<
    Maybe<ResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  user?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  document?: Resolver<
    Maybe<ResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  studentNick?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  password?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  cache?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  submissionToken?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  finished?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  studentComment?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  finishedAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  grade?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  teacherComment?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  gradedAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  active?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"]
> = {
  documentUpdated?: SubscriptionResolver<
    Maybe<ResolversTypes["Document"]>,
    "documentUpdated",
    ParentType,
    ContextType
  >;
  folderUpdated?: SubscriptionResolver<
    Maybe<ResolversTypes["Folder"]>,
    "folderUpdated",
    ParentType,
    ContextType
  >;
  submissionUpdated?: SubscriptionResolver<
    Maybe<ResolversTypes["Submission"]>,
    "submissionUpdated",
    ParentType,
    ContextType,
    RequireFields<SubscriptionSubmissionUpdatedArgs, "exercise">
  >;
  submissionActive?: SubscriptionResolver<
    Maybe<ResolversTypes["Submission"]>,
    "submissionActive",
    ParentType,
    ContextType
  >;
};

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Upload"], any> {
  name: "Upload";
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ObjectID"]>, ParentType, ContextType>;
  email?: Resolver<
    Maybe<ResolversTypes["EmailAddress"]>,
    ParentType,
    ContextType
  >;
  password?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  admin?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  publisher?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  teacher?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  teacherPro?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  family?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  center?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  active?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  signUpToken?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  authToken?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  notifications?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  lastLogin?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  signUpSurvey?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  rootFolder?: Resolver<
    Maybe<ResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  documents?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Document"]>>>,
    ParentType,
    ContextType
  >;
  folders?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
};

export type Resolvers<ContextType = any> = {
  CloudResourcesResult?: CloudResourcesResultResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DocImage?: DocImageResolvers<ContextType>;
  DocsAndFolders?: DocsAndFoldersResolvers<ContextType>;
  Document?: DocumentResolvers<ContextType>;
  EmailAddress?: GraphQLScalarType;
  Exercise?: ExerciseResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  Folder?: FolderResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  loginOut?: LoginOutResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Number?: GraphQLScalarType;
  ObjectID?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Resource?: ResourceResolvers<ContextType>;
  Result?: ResultResolvers<ContextType>;
  Submission?: SubmissionResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  authRequired?: AuthRequiredDirectiveResolver<any, any, ContextType>;
};

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<
  ContextType
>;
