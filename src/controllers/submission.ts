import { SubmissionModel } from '../models/submission';

const SubmissionModelController = {
  createSubmission: newSubmission => {
    return SubmissionModel.create(newSubmission);
  },
  deleteSubmission: SubmissionID => {
    return SubmissionModel.deleteOne({ _id: SubmissionID });
  },
  finishSubmission: SubmissionID => {
    return SubmissionModel.findOneAndUpdate(
      { _id: SubmissionID },
      { $set: { finished: true } },
      { new: true },
    );
  },
  deleteManySubs: (userID: String) => {
    return SubmissionModel.deleteMany({ user: userID }, err => {
      if (err) throw new Error('Error borrando los Submissionos');
    });
  },
  updateSubmission: (existSubmissionID, newSubmission) => {
    return SubmissionModel.findOneAndUpdate(
      { _id: existSubmissionID },
      { $set: newSubmission },
      { new: true },
    );
  },
  findAllSubmissions: () => {
    return SubmissionModel.find({});
  },
  findSubmissionByExercise: exerciseID => {
    return SubmissionModel.find({ exercise_father: exerciseID });
  },
  findSubmissionByID: SubmissionID => {
    return SubmissionModel.findOne({ _id: SubmissionID });
  },
};

export { SubmissionModelController };
