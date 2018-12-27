/*import exerciseController from '../controllers/exercise.controller';

const exerciseResolver = {
  Mutation: {
    createExercise(root: any, args: any) {
      return exerciseController.createExercise(root, args);
    },
    createSubmission(root: any, args: any) {
      return exerciseController.createSubmission(root, args);
    },
    updateSubmission(root: any, args: any) {
      return exerciseController.updateSubmission(root, args);
    },
    finishSubmission(root: any, args: any) {
      return exerciseController.finishSubmission(root, args);
    },
    deleteExercise(root: any, args: any) {
      return exerciseController.deleteExercise(root, args);
    },
  },
  Query: {
    allExercises() {
      return exerciseController.findAllExercises();
    },
  },
};

export default exerciseResolver;
*/

const helloResolver = {
	Query: {
		hello: () => {
			return "Hello world!";
		}
	}
};

export default helloResolver;