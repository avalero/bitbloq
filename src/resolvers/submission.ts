import { SubmissionModelController } from '../controllers/submission';
import { AuthenticationError } from 'apollo-server-koa';
import { UserModel } from '../models/user';
import { SubmissionModel } from '../models/submission';
import { DocumentModel } from '../models/document';
import { ObjectId } from 'bson';
import { ExerciseModel } from '../models/exercise';

const submissionResolver = {
  Mutation: {
    //registrar nueva entrega: alumno que se une al aula
    async createSubmission(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const exFather = await ExerciseModel.findOne({
        code: args.input.exercise_code,
        acceptSubmissions: true
      });
      if (!exFather)
        throw new Error(
          'Error creating submission, check your exercise code',
        );
      if(!exFather.acceptSubmissions){
        throw new Error(
          'This exercise doesnt accept submissions now',
        );
      }
      const submissionNew = new SubmissionModel({
        id: ObjectId,
        exercise_father: exFather._id,
        user: exFather.user,
        title: args.input.title,
        student_nick: args.input.student_nick,
        comment: args.input.comment,
      });
      return SubmissionModelController.createSubmission(submissionNew);
    },
    async updateSubmission(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existSubmission = await SubmissionModel.findOne({
        _id: args.id,
        user: context.user.id,
      });
      if (!existSubmission)
        throw new Error(
          'Error updating submission, it should part of one of your exercises',
        );
      if (existSubmission) {
        return SubmissionModelController.updateSubmission(
          existSubmission._id,
          args,
        );
      } else {
        return new Error('Exercise doesnt exist');
      }
    },
    async finishSubmission(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existSubmission = await SubmissionModel.findOne({
        _id: args.id,
        user: context.user.id,
      });        
      if (!existSubmission){
        throw new Error(
          'Error finishing submission, it doesnt exist',
        );}
      
      const exFather= await ExerciseModel.findOne({_id: existSubmission.exercise_father, user: context.user.id});
      //check if the exercise accepts submissions
      if(!exFather.acceptSubmissions){
        throw new Error(
          'This exercise doesnt accept submissions now',
        );
      }
      //check if the submission is in time
      const timeNow: Date= new Date();
      if(timeNow>(exFather.expireDate)){
        throw new Error('Your submission is late');
      }
      return SubmissionModelController.finishSubmission(existSubmission._id);
    },
    async deleteSubmission(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existSubmission = await SubmissionModel.findOne({
        _id: args.id,
        user: context.user.id,
      });
      if (!existSubmission)
        throw new Error(
          'Error updating submission, it should part of one of your exercises',
        );
      return SubmissionModelController.deleteSubmission(existSubmission._id);
    },
  },
  Query: {
    async submissionsByExercise(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const exerciseFound = await ExerciseModel.findOne({
        _id: args.exercise_father,
        user: context.user.id,
      });
      if (!exerciseFound) throw new Error('exercise doesnt exist');
      return SubmissionModelController.findSubmissionByExercise(
        exerciseFound._id,
      );
    },
    async submissionByID(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      //const userFound = await UserModel.findOne({ email: context.user.email });
      return SubmissionModelController.findSubmissionByID(args.id);
    },
    submissions(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return SubmissionModelController.findAllSubmissions();
    },
  },
};

export default submissionResolver;
