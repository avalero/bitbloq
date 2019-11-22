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
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ObjectID: string;
  EmailAddress: string;
  Date: Date;
  Number: number;
  Upload: File;
}

export interface ICloudResourcesResult {
  __typename?: "CloudResourcesResult";
  resources?: Maybe<Array<Maybe<IResource>>>;
  pagesNumber?: Maybe<Scalars["Number"]>;
}

export interface IDocImage {
  __typename?: "DocImage";
  image?: Maybe<Scalars["String"]>;
  isSnapshot?: Maybe<Scalars["Boolean"]>;
}

export interface IDocImageIn {
  image?: Maybe<Scalars["String"]>;
  isSnapshot?: Maybe<Scalars["Boolean"]>;
}

export interface IDocsAndFolders {
  __typename?: "DocsAndFolders";
  result?: Maybe<Array<Maybe<IResult>>>;
  pagesNumber?: Maybe<Scalars["Number"]>;
  nFolders?: Maybe<Scalars["Number"]>;
  parentsPath?: Maybe<Array<Maybe<IFolder>>>;
}

export interface IDocument {
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
  image?: Maybe<IDocImage>;
  public?: Maybe<Scalars["Boolean"]>;
  example?: Maybe<Scalars["Boolean"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  exercises?: Maybe<Array<Maybe<IExercise>>>;
  images?: Maybe<Array<Maybe<IFile>>>;
  parentsPath?: Maybe<Array<Maybe<IFolder>>>;
  resources?: Maybe<Array<Maybe<IResource>>>;
  exercisesResources?: Maybe<Array<Maybe<IResource>>>;
}

export interface IDocumentIn {
  user?: Maybe<Scalars["ObjectID"]>;
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  folder?: Maybe<Scalars["ObjectID"]>;
  content?: Maybe<Scalars["String"]>;
  advancedMode?: Maybe<Scalars["Boolean"]>;
  cache?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  version?: Maybe<Scalars["String"]>;
  image?: Maybe<IDocImageIn>;
}

export interface IExercise {
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
  submissions?: Maybe<Array<Maybe<ISubmission>>>;
  resources?: Maybe<Array<Maybe<IResource>>>;
}

export interface IExerciseIn {
  document?: Maybe<Scalars["ObjectID"]>;
  title?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  acceptSubmissions?: Maybe<Scalars["Boolean"]>;
  expireDate?: Maybe<Scalars["Date"]>;
}

export interface IFile {
  __typename?: "File";
  id: Scalars["ID"];
  filename?: Maybe<Scalars["String"]>;
  mimetype?: Maybe<Scalars["String"]>;
  publicUrl?: Maybe<Scalars["String"]>;
  document?: Maybe<Scalars["ObjectID"]>;
  size?: Maybe<Scalars["Number"]>;
  storageName?: Maybe<Scalars["String"]>;
}

export interface IFolder {
  __typename?: "Folder";
  id?: Maybe<Scalars["ObjectID"]>;
  name?: Maybe<Scalars["String"]>;
  user?: Maybe<Scalars["ObjectID"]>;
  documentsID?: Maybe<Array<Maybe<Scalars["ObjectID"]>>>;
  foldersID?: Maybe<Array<Maybe<Scalars["ObjectID"]>>>;
  parent?: Maybe<Scalars["ObjectID"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  documents?: Maybe<Array<Maybe<IDocument>>>;
  folders?: Maybe<Array<Maybe<IFolder>>>;
  parentsPath?: Maybe<Array<Maybe<IFolder>>>;
}

export interface IFolderIn {
  name?: Maybe<Scalars["String"]>;
  user?: Maybe<Scalars["ObjectID"]>;
  documentsID?: Maybe<Array<Maybe<Scalars["ObjectID"]>>>;
  foldersID?: Maybe<Array<Maybe<Scalars["ObjectID"]>>>;
  parent?: Maybe<Scalars["ObjectID"]>;
}

export interface ILoginOut {
  __typename?: "loginOut";
  token?: Maybe<Scalars["String"]>;
  exerciseID?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
}

export interface IMsLogin {
  __typename?: "MSLogin";
  id?: Maybe<Scalars["ObjectID"]>;
  finishedSignUp?: Maybe<Scalars["Boolean"]>;
  token?: Maybe<Scalars["String"]>;
}

export interface IMutation {
  __typename?: "Mutation";
  saveUserData?: Maybe<IUserStep1>;
  finishSignUp?: Maybe<Scalars["String"]>;
  activateAccount?: Maybe<Scalars["String"]>;
  login?: Maybe<Scalars["String"]>;
  loginWithGoogle?: Maybe<IMsLogin>;
  loginWithMicrosoft?: Maybe<IMsLogin>;
  renewToken?: Maybe<Scalars["String"]>;
  resetPasswordEmail?: Maybe<Scalars["String"]>;
  checkResetPasswordToken?: Maybe<Scalars["Boolean"]>;
  updatePassword?: Maybe<Scalars["String"]>;
  deleteUser?: Maybe<IUser>;
  updateUser?: Maybe<IUser>;
  createDocument?: Maybe<IDocument>;
  deleteDocument?: Maybe<IDocument>;
  updateDocument?: Maybe<IDocument>;
  setDocumentImage?: Maybe<IDocument>;
  updateDocumentContent?: Maybe<IDocument>;
  publishDocument?: Maybe<IDocument>;
  createExercise?: Maybe<IExercise>;
  changeSubmissionsState?: Maybe<IExercise>;
  updateExercise?: Maybe<IExercise>;
  deleteExercise?: Maybe<IExercise>;
  createFolder?: Maybe<IFolder>;
  updateFolder?: Maybe<IFolder>;
  deleteFolder?: Maybe<IFolder>;
  startSubmission?: Maybe<ILoginOut>;
  loginSubmission?: Maybe<ILoginOut>;
  updateSubmission?: Maybe<ISubmission>;
  finishSubmission?: Maybe<ISubmission>;
  cancelSubmission?: Maybe<ISubmission>;
  deleteSubmission?: Maybe<ISubmission>;
  gradeSubmission?: Maybe<ISubmission>;
  updatePasswordSubmission?: Maybe<ISubmission>;
  setActiveSubmission?: Maybe<ISubmission>;
  singleUpload?: Maybe<IFile>;
  uploadCloudResource?: Maybe<IFile>;
  addResourceToDocument?: Maybe<IFile>;
  addResourceToExercises?: Maybe<IFile>;
  deleteResourceFromExercises?: Maybe<IFile>;
  uploadSTLFile?: Maybe<IFile>;
  uploadImageFile?: Maybe<IFile>;
  deleteUserFile?: Maybe<IFile>;
  moveToTrash?: Maybe<IFile>;
  restoreResource?: Maybe<IFile>;
}

export interface IMutationSaveUserDataArgs {
  input: IUserIn;
}

export interface IMutationFinishSignUpArgs {
  id: Scalars["ObjectID"];
  userPlan: Scalars["String"];
}

export interface IMutationActivateAccountArgs {
  token?: Maybe<Scalars["String"]>;
}

export interface IMutationLoginArgs {
  email: Scalars["EmailAddress"];
  password: Scalars["String"];
}

export interface IMutationLoginWithGoogleArgs {
  token: Scalars["String"];
}

export interface IMutationLoginWithMicrosoftArgs {
  token: Scalars["String"];
}

export interface IMutationResetPasswordEmailArgs {
  email: Scalars["EmailAddress"];
}

export interface IMutationCheckResetPasswordTokenArgs {
  token?: Maybe<Scalars["String"]>;
}

export interface IMutationUpdatePasswordArgs {
  token?: Maybe<Scalars["String"]>;
  newPassword?: Maybe<Scalars["String"]>;
}

export interface IMutationDeleteUserArgs {
  id: Scalars["ObjectID"];
}

export interface IMutationUpdateUserArgs {
  id: Scalars["ObjectID"];
  input: IUserIn;
}

export interface IMutationCreateDocumentArgs {
  input: IDocumentIn;
}

export interface IMutationDeleteDocumentArgs {
  id: Scalars["ObjectID"];
}

export interface IMutationUpdateDocumentArgs {
  id: Scalars["ObjectID"];
  input?: Maybe<IDocumentIn>;
}

export interface IMutationSetDocumentImageArgs {
  id?: Maybe<Scalars["ObjectID"]>;
  image?: Maybe<Scalars["Upload"]>;
  isSnapshot?: Maybe<Scalars["Boolean"]>;
}

export interface IMutationUpdateDocumentContentArgs {
  id?: Maybe<Scalars["ObjectID"]>;
  content?: Maybe<Scalars["String"]>;
  cache?: Maybe<Scalars["String"]>;
  advancedMode?: Maybe<Scalars["Boolean"]>;
}

export interface IMutationPublishDocumentArgs {
  id: Scalars["ObjectID"];
  public?: Maybe<Scalars["Boolean"]>;
  example?: Maybe<Scalars["Boolean"]>;
}

export interface IMutationCreateExerciseArgs {
  input: IExerciseIn;
}

export interface IMutationChangeSubmissionsStateArgs {
  id: Scalars["ObjectID"];
  subState: Scalars["Boolean"];
}

export interface IMutationUpdateExerciseArgs {
  id: Scalars["ObjectID"];
  input?: Maybe<IExerciseIn>;
}

export interface IMutationDeleteExerciseArgs {
  id: Scalars["ObjectID"];
}

export interface IMutationCreateFolderArgs {
  input?: Maybe<IFolderIn>;
}

export interface IMutationUpdateFolderArgs {
  id: Scalars["ObjectID"];
  input?: Maybe<IFolderIn>;
}

export interface IMutationDeleteFolderArgs {
  id: Scalars["ObjectID"];
}

export interface IMutationStartSubmissionArgs {
  exerciseCode: Scalars["String"];
  studentNick: Scalars["String"];
  password: Scalars["String"];
}

export interface IMutationLoginSubmissionArgs {
  exerciseCode: Scalars["String"];
  studentNick: Scalars["String"];
  password: Scalars["String"];
}

export interface IMutationUpdateSubmissionArgs {
  input?: Maybe<ISubmissionIn>;
}

export interface IMutationFinishSubmissionArgs {
  content?: Maybe<Scalars["String"]>;
  cache?: Maybe<Scalars["String"]>;
  studentComment?: Maybe<Scalars["String"]>;
}

export interface IMutationDeleteSubmissionArgs {
  submissionID: Scalars["ObjectID"];
}

export interface IMutationGradeSubmissionArgs {
  submissionID?: Maybe<Scalars["ObjectID"]>;
  grade?: Maybe<Scalars["Float"]>;
  teacherComment?: Maybe<Scalars["String"]>;
}

export interface IMutationUpdatePasswordSubmissionArgs {
  submissionID: Scalars["ObjectID"];
  password: Scalars["String"];
}

export interface IMutationSetActiveSubmissionArgs {
  submissionID: Scalars["ObjectID"];
  active: Scalars["Boolean"];
}

export interface IMutationSingleUploadArgs {
  file: Scalars["Upload"];
  documentID?: Maybe<Scalars["ObjectID"]>;
}

export interface IMutationUploadCloudResourceArgs {
  file: Scalars["Upload"];
  thumbnail?: Maybe<Scalars["Upload"]>;
}

export interface IMutationAddResourceToDocumentArgs {
  resourceID: Scalars["ID"];
  documentID: Scalars["ID"];
}

export interface IMutationAddResourceToExercisesArgs {
  resourceID: Scalars["ID"];
  documentID: Scalars["ID"];
}

export interface IMutationDeleteResourceFromExercisesArgs {
  resourceID: Scalars["ID"];
  documentID: Scalars["ID"];
}

export interface IMutationUploadStlFileArgs {
  file: Scalars["Upload"];
  documentID?: Maybe<Scalars["ObjectID"]>;
}

export interface IMutationUploadImageFileArgs {
  file: Scalars["Upload"];
  documentID?: Maybe<Scalars["ObjectID"]>;
}

export interface IMutationDeleteUserFileArgs {
  filename: Scalars["String"];
}

export interface IMutationMoveToTrashArgs {
  id?: Maybe<Scalars["ObjectID"]>;
}

export interface IMutationRestoreResourceArgs {
  id?: Maybe<Scalars["ObjectID"]>;
}

export interface IQuery {
  __typename?: "Query";
  users?: Maybe<Array<Maybe<IUser>>>;
  me?: Maybe<IUser>;
  documents?: Maybe<Array<Maybe<IDocument>>>;
  document?: Maybe<IDocument>;
  documentsAndFolders?: Maybe<IDocsAndFolders>;
  hasExercises?: Maybe<Scalars["Boolean"]>;
  openPublicDocument?: Maybe<IDocument>;
  examples?: Maybe<Array<Maybe<IDocument>>>;
  exercises?: Maybe<Array<Maybe<IExercise>>>;
  exercise?: Maybe<IExercise>;
  exercisesByDocument?: Maybe<Array<Maybe<IExercise>>>;
  exerciseByCode?: Maybe<IExercise>;
  folders?: Maybe<Array<Maybe<IFolder>>>;
  folder?: Maybe<IFolder>;
  rootFolder?: Maybe<IFolder>;
  submissions?: Maybe<Array<Maybe<ISubmission>>>;
  submission?: Maybe<ISubmission>;
  submissionsByExercise?: Maybe<Array<Maybe<ISubmission>>>;
  uploads?: Maybe<Array<Maybe<IFile>>>;
  cloudResources?: Maybe<ICloudResourcesResult>;
}

export interface IQueryDocumentArgs {
  id: Scalars["ObjectID"];
}

export interface IQueryDocumentsAndFoldersArgs {
  currentLocation?: Maybe<Scalars["ObjectID"]>;
  currentPage?: Maybe<Scalars["Number"]>;
  itemsPerPage?: Maybe<Scalars["Number"]>;
  order?: Maybe<Scalars["String"]>;
  searchTitle?: Maybe<Scalars["String"]>;
}

export interface IQueryHasExercisesArgs {
  id: Scalars["ObjectID"];
  type?: Maybe<Scalars["String"]>;
}

export interface IQueryOpenPublicDocumentArgs {
  id: Scalars["ObjectID"];
}

export interface IQueryExerciseArgs {
  id: Scalars["ObjectID"];
}

export interface IQueryExercisesByDocumentArgs {
  document: Scalars["ObjectID"];
}

export interface IQueryExerciseByCodeArgs {
  code: Scalars["String"];
}

export interface IQueryFolderArgs {
  id: Scalars["ObjectID"];
}

export interface IQuerySubmissionArgs {
  id?: Maybe<Scalars["ObjectID"]>;
}

export interface IQuerySubmissionsByExerciseArgs {
  exercise: Scalars["ObjectID"];
}

export interface IQueryCloudResourcesArgs {
  type?: Maybe<Array<Maybe<Scalars["String"]>>>;
  currentPage?: Maybe<Scalars["Number"]>;
  order?: Maybe<Scalars["String"]>;
  searchTitle?: Maybe<Scalars["String"]>;
  deleted?: Maybe<Scalars["Boolean"]>;
}

export interface IResource {
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
  documents?: Maybe<Array<Maybe<IDocument>>>;
}

export interface IResult {
  __typename?: "Result";
  id?: Maybe<Scalars["ObjectID"]>;
  title?: Maybe<Scalars["String"]>;
  image?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  parent?: Maybe<Scalars["ObjectID"]>;
}

export enum IRole {
  User = "USER",
  Admin = "ADMIN",
  Publisher = "PUBLISHER",
  Teacher = "TEACHER",
  Teacherpro = "TEACHERPRO",
  Student = "STUDENT",
  Family = "FAMILY"
}

export interface ISubmission {
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
}

export interface ISubmissionIn {
  title?: Maybe<Scalars["String"]>;
  finished?: Maybe<Scalars["Boolean"]>;
  studentComment?: Maybe<Scalars["String"]>;
  studentNick?: Maybe<Scalars["String"]>;
  content?: Maybe<Scalars["String"]>;
  cache?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  active?: Maybe<Scalars["Boolean"]>;
}

export interface ISubscription {
  __typename?: "Subscription";
  documentUpdated?: Maybe<IDocument>;
  folderUpdated?: Maybe<IFolder>;
  submissionUpdated?: Maybe<ISubmission>;
  submissionActive?: Maybe<ISubmission>;
}

export interface ISubscriptionSubmissionUpdatedArgs {
  exercise: Scalars["ObjectID"];
}

export interface IUser {
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
  surnames?: Maybe<Scalars["String"]>;
  birthDate?: Maybe<Scalars["Date"]>;
  active?: Maybe<Scalars["Boolean"]>;
  signUpToken?: Maybe<Scalars["String"]>;
  authToken?: Maybe<Scalars["String"]>;
  notifications?: Maybe<Scalars["Boolean"]>;
  imTeacherCheck?: Maybe<Scalars["Boolean"]>;
  centerName?: Maybe<Scalars["String"]>;
  educationalStage?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  postCode?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  updatedAt?: Maybe<Scalars["Date"]>;
  lastLogin?: Maybe<Scalars["Date"]>;
  rootFolder?: Maybe<Scalars["ObjectID"]>;
  documents?: Maybe<Array<Maybe<IDocument>>>;
  folders?: Maybe<Array<Maybe<IFolder>>>;
}

export interface IUserIn {
  email?: Maybe<Scalars["EmailAddress"]>;
  password?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  surnames?: Maybe<Scalars["String"]>;
  birthDate?: Maybe<Scalars["Date"]>;
  active?: Maybe<Scalars["Boolean"]>;
  signUpToken?: Maybe<Scalars["String"]>;
  authToken?: Maybe<Scalars["String"]>;
  notifications?: Maybe<Scalars["Boolean"]>;
  imTeacherCheck?: Maybe<Scalars["Boolean"]>;
  centerName?: Maybe<Scalars["String"]>;
  educationalStage?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  postCode?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
}

export interface IUserStep1 {
  __typename?: "UserStep1";
  id?: Maybe<Scalars["ObjectID"]>;
  email?: Maybe<Scalars["EmailAddress"]>;
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

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
export type IResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<IUser>;
  ObjectID: ResolverTypeWrapper<Scalars["ObjectID"]>;
  EmailAddress: ResolverTypeWrapper<Scalars["EmailAddress"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
  Document: ResolverTypeWrapper<IDocument>;
  DocImage: ResolverTypeWrapper<IDocImage>;
  Exercise: ResolverTypeWrapper<IExercise>;
  Submission: ResolverTypeWrapper<ISubmission>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  Resource: ResolverTypeWrapper<IResource>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Number: ResolverTypeWrapper<Scalars["Number"]>;
  File: ResolverTypeWrapper<IFile>;
  Folder: ResolverTypeWrapper<IFolder>;
  DocsAndFolders: ResolverTypeWrapper<IDocsAndFolders>;
  Result: ResolverTypeWrapper<IResult>;
  CloudResourcesResult: ResolverTypeWrapper<ICloudResourcesResult>;
  Mutation: ResolverTypeWrapper<{}>;
  UserIn: IUserIn;
  UserStep1: ResolverTypeWrapper<IUserStep1>;
  MSLogin: ResolverTypeWrapper<IMsLogin>;
  DocumentIn: IDocumentIn;
  DocImageIn: IDocImageIn;
  Upload: ResolverTypeWrapper<Scalars["Upload"]>;
  ExerciseIn: IExerciseIn;
  FolderIn: IFolderIn;
  loginOut: ResolverTypeWrapper<ILoginOut>;
  SubmissionIn: ISubmissionIn;
  Subscription: ResolverTypeWrapper<{}>;
  Role: IRole;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = ResolversObject<{
  Query: {};
  User: IUser;
  ObjectID: Scalars["ObjectID"];
  EmailAddress: Scalars["EmailAddress"];
  String: Scalars["String"];
  Boolean: Scalars["Boolean"];
  Date: Scalars["Date"];
  Document: IDocument;
  DocImage: IDocImage;
  Exercise: IExercise;
  Submission: ISubmission;
  Float: Scalars["Float"];
  Resource: IResource;
  ID: Scalars["ID"];
  Number: Scalars["Number"];
  File: IFile;
  Folder: IFolder;
  DocsAndFolders: IDocsAndFolders;
  Result: IResult;
  CloudResourcesResult: ICloudResourcesResult;
  Mutation: {};
  UserIn: IUserIn;
  UserStep1: IUserStep1;
  MSLogin: IMsLogin;
  DocumentIn: IDocumentIn;
  DocImageIn: IDocImageIn;
  Upload: Scalars["Upload"];
  ExerciseIn: IExerciseIn;
  FolderIn: IFolderIn;
  loginOut: ILoginOut;
  SubmissionIn: ISubmissionIn;
  Subscription: {};
  Role: IRole;
}>;

export type IAuthRequiredDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = { requires?: Maybe<Maybe<Array<Maybe<IRole>>>> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ICloudResourcesResultResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["CloudResourcesResult"] = IResolversParentTypes["CloudResourcesResult"]
> = ResolversObject<{
  resources?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Resource"]>>>,
    ParentType,
    ContextType
  >;
  pagesNumber?: Resolver<
    Maybe<IResolversTypes["Number"]>,
    ParentType,
    ContextType
  >;
}>;

export interface IDateScalarConfig
  extends GraphQLScalarTypeConfig<IResolversTypes["Date"], any> {
  name: "Date";
}

export type IDocImageResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["DocImage"] = IResolversParentTypes["DocImage"]
> = ResolversObject<{
  image?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  isSnapshot?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
}>;

export type IDocsAndFoldersResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["DocsAndFolders"] = IResolversParentTypes["DocsAndFolders"]
> = ResolversObject<{
  result?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Result"]>>>,
    ParentType,
    ContextType
  >;
  pagesNumber?: Resolver<
    Maybe<IResolversTypes["Number"]>,
    ParentType,
    ContextType
  >;
  nFolders?: Resolver<
    Maybe<IResolversTypes["Number"]>,
    ParentType,
    ContextType
  >;
  parentsPath?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
}>;

export type IDocumentResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["Document"] = IResolversParentTypes["Document"]
> = ResolversObject<{
  id?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  user?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  title?: Resolver<IResolversTypes["String"], ParentType, ContextType>;
  type?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  folder?: Resolver<
    Maybe<IResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  content?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  advancedMode?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  cache?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  version?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  image?: Resolver<Maybe<IResolversTypes["DocImage"]>, ParentType, ContextType>;
  public?: Resolver<Maybe<IResolversTypes["Boolean"]>, ParentType, ContextType>;
  example?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  exercises?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Exercise"]>>>,
    ParentType,
    ContextType
  >;
  images?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["File"]>>>,
    ParentType,
    ContextType
  >;
  parentsPath?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
  resources?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Resource"]>>>,
    ParentType,
    ContextType
  >;
  exercisesResources?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Resource"]>>>,
    ParentType,
    ContextType
  >;
}>;

export interface IEmailAddressScalarConfig
  extends GraphQLScalarTypeConfig<IResolversTypes["EmailAddress"], any> {
  name: "EmailAddress";
}

export type IExerciseResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["Exercise"] = IResolversParentTypes["Exercise"]
> = ResolversObject<{
  id?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  document?: Resolver<
    Maybe<IResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  user?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  content?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  cache?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  code?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  teacherName?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  acceptSubmissions?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  image?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  expireDate?: Resolver<
    Maybe<IResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  submissions?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Submission"]>>>,
    ParentType,
    ContextType
  >;
  resources?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Resource"]>>>,
    ParentType,
    ContextType
  >;
}>;

export type IFileResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["File"] = IResolversParentTypes["File"]
> = ResolversObject<{
  id?: Resolver<IResolversTypes["ID"], ParentType, ContextType>;
  filename?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  mimetype?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  publicUrl?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  document?: Resolver<
    Maybe<IResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  size?: Resolver<Maybe<IResolversTypes["Number"]>, ParentType, ContextType>;
  storageName?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
}>;

export type IFolderResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["Folder"] = IResolversParentTypes["Folder"]
> = ResolversObject<{
  id?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  user?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  documentsID?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["ObjectID"]>>>,
    ParentType,
    ContextType
  >;
  foldersID?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["ObjectID"]>>>,
    ParentType,
    ContextType
  >;
  parent?: Resolver<
    Maybe<IResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  documents?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Document"]>>>,
    ParentType,
    ContextType
  >;
  folders?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
  parentsPath?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
}>;

export type ILoginOutResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["loginOut"] = IResolversParentTypes["loginOut"]
> = ResolversObject<{
  token?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  exerciseID?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
}>;

export type IMsLoginResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["MSLogin"] = IResolversParentTypes["MSLogin"]
> = ResolversObject<{
  id?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  finishedSignUp?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  token?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
}>;

export type IMutationResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["Mutation"] = IResolversParentTypes["Mutation"]
> = ResolversObject<{
  saveUserData?: Resolver<
    Maybe<IResolversTypes["UserStep1"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationSaveUserDataArgs, "input">
  >;
  finishSignUp?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationFinishSignUpArgs, "id" | "userPlan">
  >;
  activateAccount?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType,
    IMutationActivateAccountArgs
  >;
  login?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationLoginArgs, "email" | "password">
  >;
  loginWithGoogle?: Resolver<
    Maybe<IResolversTypes["MSLogin"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationLoginWithGoogleArgs, "token">
  >;
  loginWithMicrosoft?: Resolver<
    Maybe<IResolversTypes["MSLogin"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationLoginWithMicrosoftArgs, "token">
  >;
  renewToken?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  resetPasswordEmail?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationResetPasswordEmailArgs, "email">
  >;
  checkResetPasswordToken?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    IMutationCheckResetPasswordTokenArgs
  >;
  updatePassword?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType,
    IMutationUpdatePasswordArgs
  >;
  deleteUser?: Resolver<
    Maybe<IResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationDeleteUserArgs, "id">
  >;
  updateUser?: Resolver<
    Maybe<IResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationUpdateUserArgs, "id" | "input">
  >;
  createDocument?: Resolver<
    Maybe<IResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationCreateDocumentArgs, "input">
  >;
  deleteDocument?: Resolver<
    Maybe<IResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationDeleteDocumentArgs, "id">
  >;
  updateDocument?: Resolver<
    Maybe<IResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationUpdateDocumentArgs, "id">
  >;
  setDocumentImage?: Resolver<
    Maybe<IResolversTypes["Document"]>,
    ParentType,
    ContextType,
    IMutationSetDocumentImageArgs
  >;
  updateDocumentContent?: Resolver<
    Maybe<IResolversTypes["Document"]>,
    ParentType,
    ContextType,
    IMutationUpdateDocumentContentArgs
  >;
  publishDocument?: Resolver<
    Maybe<IResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationPublishDocumentArgs, "id">
  >;
  createExercise?: Resolver<
    Maybe<IResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationCreateExerciseArgs, "input">
  >;
  changeSubmissionsState?: Resolver<
    Maybe<IResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationChangeSubmissionsStateArgs, "id" | "subState">
  >;
  updateExercise?: Resolver<
    Maybe<IResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationUpdateExerciseArgs, "id">
  >;
  deleteExercise?: Resolver<
    Maybe<IResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationDeleteExerciseArgs, "id">
  >;
  createFolder?: Resolver<
    Maybe<IResolversTypes["Folder"]>,
    ParentType,
    ContextType,
    IMutationCreateFolderArgs
  >;
  updateFolder?: Resolver<
    Maybe<IResolversTypes["Folder"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationUpdateFolderArgs, "id">
  >;
  deleteFolder?: Resolver<
    Maybe<IResolversTypes["Folder"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationDeleteFolderArgs, "id">
  >;
  startSubmission?: Resolver<
    Maybe<IResolversTypes["loginOut"]>,
    ParentType,
    ContextType,
    RequireFields<
      IMutationStartSubmissionArgs,
      "exerciseCode" | "studentNick" | "password"
    >
  >;
  loginSubmission?: Resolver<
    Maybe<IResolversTypes["loginOut"]>,
    ParentType,
    ContextType,
    RequireFields<
      IMutationLoginSubmissionArgs,
      "exerciseCode" | "studentNick" | "password"
    >
  >;
  updateSubmission?: Resolver<
    Maybe<IResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    IMutationUpdateSubmissionArgs
  >;
  finishSubmission?: Resolver<
    Maybe<IResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    IMutationFinishSubmissionArgs
  >;
  cancelSubmission?: Resolver<
    Maybe<IResolversTypes["Submission"]>,
    ParentType,
    ContextType
  >;
  deleteSubmission?: Resolver<
    Maybe<IResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationDeleteSubmissionArgs, "submissionID">
  >;
  gradeSubmission?: Resolver<
    Maybe<IResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    IMutationGradeSubmissionArgs
  >;
  updatePasswordSubmission?: Resolver<
    Maybe<IResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    RequireFields<
      IMutationUpdatePasswordSubmissionArgs,
      "submissionID" | "password"
    >
  >;
  setActiveSubmission?: Resolver<
    Maybe<IResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationSetActiveSubmissionArgs, "submissionID" | "active">
  >;
  singleUpload?: Resolver<
    Maybe<IResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationSingleUploadArgs, "file">
  >;
  uploadCloudResource?: Resolver<
    Maybe<IResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationUploadCloudResourceArgs, "file">
  >;
  addResourceToDocument?: Resolver<
    Maybe<IResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<
      IMutationAddResourceToDocumentArgs,
      "resourceID" | "documentID"
    >
  >;
  addResourceToExercises?: Resolver<
    Maybe<IResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<
      IMutationAddResourceToExercisesArgs,
      "resourceID" | "documentID"
    >
  >;
  deleteResourceFromExercises?: Resolver<
    Maybe<IResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<
      IMutationDeleteResourceFromExercisesArgs,
      "resourceID" | "documentID"
    >
  >;
  uploadSTLFile?: Resolver<
    Maybe<IResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationUploadStlFileArgs, "file">
  >;
  uploadImageFile?: Resolver<
    Maybe<IResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationUploadImageFileArgs, "file">
  >;
  deleteUserFile?: Resolver<
    Maybe<IResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<IMutationDeleteUserFileArgs, "filename">
  >;
  moveToTrash?: Resolver<
    Maybe<IResolversTypes["File"]>,
    ParentType,
    ContextType,
    IMutationMoveToTrashArgs
  >;
  restoreResource?: Resolver<
    Maybe<IResolversTypes["File"]>,
    ParentType,
    ContextType,
    IMutationRestoreResourceArgs
  >;
}>;

export interface INumberScalarConfig
  extends GraphQLScalarTypeConfig<IResolversTypes["Number"], any> {
  name: "Number";
}

export interface IObjectIdScalarConfig
  extends GraphQLScalarTypeConfig<IResolversTypes["ObjectID"], any> {
  name: "ObjectID";
}

export type IQueryResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["Query"] = IResolversParentTypes["Query"]
> = ResolversObject<{
  users?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
  me?: Resolver<Maybe<IResolversTypes["User"]>, ParentType, ContextType>;
  documents?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Document"]>>>,
    ParentType,
    ContextType
  >;
  document?: Resolver<
    Maybe<IResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<IQueryDocumentArgs, "id">
  >;
  documentsAndFolders?: Resolver<
    Maybe<IResolversTypes["DocsAndFolders"]>,
    ParentType,
    ContextType,
    IQueryDocumentsAndFoldersArgs
  >;
  hasExercises?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<IQueryHasExercisesArgs, "id">
  >;
  openPublicDocument?: Resolver<
    Maybe<IResolversTypes["Document"]>,
    ParentType,
    ContextType,
    RequireFields<IQueryOpenPublicDocumentArgs, "id">
  >;
  examples?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Document"]>>>,
    ParentType,
    ContextType
  >;
  exercises?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Exercise"]>>>,
    ParentType,
    ContextType
  >;
  exercise?: Resolver<
    Maybe<IResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<IQueryExerciseArgs, "id">
  >;
  exercisesByDocument?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Exercise"]>>>,
    ParentType,
    ContextType,
    RequireFields<IQueryExercisesByDocumentArgs, "document">
  >;
  exerciseByCode?: Resolver<
    Maybe<IResolversTypes["Exercise"]>,
    ParentType,
    ContextType,
    RequireFields<IQueryExerciseByCodeArgs, "code">
  >;
  folders?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
  folder?: Resolver<
    Maybe<IResolversTypes["Folder"]>,
    ParentType,
    ContextType,
    RequireFields<IQueryFolderArgs, "id">
  >;
  rootFolder?: Resolver<
    Maybe<IResolversTypes["Folder"]>,
    ParentType,
    ContextType
  >;
  submissions?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Submission"]>>>,
    ParentType,
    ContextType
  >;
  submission?: Resolver<
    Maybe<IResolversTypes["Submission"]>,
    ParentType,
    ContextType,
    IQuerySubmissionArgs
  >;
  submissionsByExercise?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Submission"]>>>,
    ParentType,
    ContextType,
    RequireFields<IQuerySubmissionsByExerciseArgs, "exercise">
  >;
  uploads?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["File"]>>>,
    ParentType,
    ContextType
  >;
  cloudResources?: Resolver<
    Maybe<IResolversTypes["CloudResourcesResult"]>,
    ParentType,
    ContextType,
    IQueryCloudResourcesArgs
  >;
}>;

export type IResourceResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["Resource"] = IResolversParentTypes["Resource"]
> = ResolversObject<{
  id?: Resolver<Maybe<IResolversTypes["ID"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  thumbnail?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  preview?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  size?: Resolver<Maybe<IResolversTypes["Number"]>, ParentType, ContextType>;
  file?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  deleted?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  documents?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Document"]>>>,
    ParentType,
    ContextType
  >;
}>;

export type IResultResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["Result"] = IResolversParentTypes["Result"]
> = ResolversObject<{
  id?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  image?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  parent?: Resolver<
    Maybe<IResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
}>;

export type ISubmissionResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["Submission"] = IResolversParentTypes["Submission"]
> = ResolversObject<{
  id?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  exercise?: Resolver<
    Maybe<IResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  user?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  document?: Resolver<
    Maybe<IResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  studentNick?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  password?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  content?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  cache?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  submissionToken?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  finished?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  studentComment?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  finishedAt?: Resolver<
    Maybe<IResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  grade?: Resolver<Maybe<IResolversTypes["Float"]>, ParentType, ContextType>;
  teacherComment?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  gradedAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  active?: Resolver<Maybe<IResolversTypes["Boolean"]>, ParentType, ContextType>;
}>;

export type ISubscriptionResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["Subscription"] = IResolversParentTypes["Subscription"]
> = ResolversObject<{
  documentUpdated?: SubscriptionResolver<
    Maybe<IResolversTypes["Document"]>,
    "documentUpdated",
    ParentType,
    ContextType
  >;
  folderUpdated?: SubscriptionResolver<
    Maybe<IResolversTypes["Folder"]>,
    "folderUpdated",
    ParentType,
    ContextType
  >;
  submissionUpdated?: SubscriptionResolver<
    Maybe<IResolversTypes["Submission"]>,
    "submissionUpdated",
    ParentType,
    ContextType,
    RequireFields<ISubscriptionSubmissionUpdatedArgs, "exercise">
  >;
  submissionActive?: SubscriptionResolver<
    Maybe<IResolversTypes["Submission"]>,
    "submissionActive",
    ParentType,
    ContextType
  >;
}>;

export interface IUploadScalarConfig
  extends GraphQLScalarTypeConfig<IResolversTypes["Upload"], any> {
  name: "Upload";
}

export type IUserResolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["User"] = IResolversParentTypes["User"]
> = ResolversObject<{
  id?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  email?: Resolver<
    Maybe<IResolversTypes["EmailAddress"]>,
    ParentType,
    ContextType
  >;
  password?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  admin?: Resolver<Maybe<IResolversTypes["Boolean"]>, ParentType, ContextType>;
  publisher?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  teacher?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  teacherPro?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  family?: Resolver<Maybe<IResolversTypes["Boolean"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  surnames?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  birthDate?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  active?: Resolver<Maybe<IResolversTypes["Boolean"]>, ParentType, ContextType>;
  signUpToken?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  authToken?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  notifications?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  imTeacherCheck?: Resolver<
    Maybe<IResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  centerName?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  educationalStage?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  city?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  postCode?: Resolver<
    Maybe<IResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  country?: Resolver<Maybe<IResolversTypes["String"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  lastLogin?: Resolver<Maybe<IResolversTypes["Date"]>, ParentType, ContextType>;
  rootFolder?: Resolver<
    Maybe<IResolversTypes["ObjectID"]>,
    ParentType,
    ContextType
  >;
  documents?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Document"]>>>,
    ParentType,
    ContextType
  >;
  folders?: Resolver<
    Maybe<Array<Maybe<IResolversTypes["Folder"]>>>,
    ParentType,
    ContextType
  >;
}>;

export type IUserStep1Resolvers<
  ContextType = any,
  ParentType extends IResolversParentTypes["UserStep1"] = IResolversParentTypes["UserStep1"]
> = ResolversObject<{
  id?: Resolver<Maybe<IResolversTypes["ObjectID"]>, ParentType, ContextType>;
  email?: Resolver<
    Maybe<IResolversTypes["EmailAddress"]>,
    ParentType,
    ContextType
  >;
}>;

export type IResolvers<ContextType = any> = ResolversObject<{
  CloudResourcesResult?: ICloudResourcesResultResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DocImage?: IDocImageResolvers<ContextType>;
  DocsAndFolders?: IDocsAndFoldersResolvers<ContextType>;
  Document?: IDocumentResolvers<ContextType>;
  EmailAddress?: GraphQLScalarType;
  Exercise?: IExerciseResolvers<ContextType>;
  File?: IFileResolvers<ContextType>;
  Folder?: IFolderResolvers<ContextType>;
  loginOut?: ILoginOutResolvers<ContextType>;
  MSLogin?: IMsLoginResolvers<ContextType>;
  Mutation?: IMutationResolvers<ContextType>;
  Number?: GraphQLScalarType;
  ObjectID?: GraphQLScalarType;
  Query?: IQueryResolvers<ContextType>;
  Resource?: IResourceResolvers<ContextType>;
  Result?: IResultResolvers<ContextType>;
  Submission?: ISubmissionResolvers<ContextType>;
  Subscription?: ISubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: IUserResolvers<ContextType>;
  UserStep1?: IUserStep1Resolvers<ContextType>;
}>;

export type IDirectiveResolvers<ContextType = any> = ResolversObject<{
  authRequired?: IAuthRequiredDirectiveResolver<any, any, ContextType>;
}>;
