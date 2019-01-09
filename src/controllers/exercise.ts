import { ExerciseModel } from '../models/exercise';

const ExerciseModelController = {
  createExercise: newExercise => {
    return ExerciseModel.create(newExercise);
  },
  deleteExercise: ExerciseID => {
    return ExerciseModel.deleteOne({ _id: ExerciseID });
  },
  deleteManyExs: (userID: String) => {
    return ExerciseModel.deleteMany({ user: userID }, err => {
      if (err) throw new Error('Error borrando los Exerciseos');
    });
  },
  updateExercise: (existExerciseID, newExercise) => {
    return ExerciseModel.findOneAndUpdate(
      { _id: existExerciseID },
      { $set: newExercise },
      { new: true },
    );
  },
  findAllExercises: () => {
    return ExerciseModel.find({});
  },
  findExerciseByDocument: documentID => {
    return ExerciseModel.find({ document_father: documentID });
  },
  findExerciseByID: ExerciseID => {
    return ExerciseModel.findOne({ _id: ExerciseID });
  },
};

export { ExerciseModelController };
