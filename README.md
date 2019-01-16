**_BITBLOQ API_**

Apollo - GraphQL - Koa - Mongoose

La interacción con la API se hace a través de QUERIES y MUTATIONS.

**_ Para darse de alta en la plataforma hay que realizar dos pasos: _**

1.  Mandar la siguiente mutation:

         mutation {
             signUpUser(input:{
                 email: "email",
                 password: "pass",
                 name: "name",
                 center: "center",
                 notifications: true
             })
         }

Esta devuelve un String con el Token de registro en la plataforma.

2.  Para activar la cuenta es necesario mandar la siguiente mutation con el token recibido como parámetro:

         mutation{
             activateAccount(token: "aaaaaaaaa")
         }

Esta devuelve el token de inicio de sesión. Para acceder a las demás funciones hay que mandar este token en la cabecera de la petición (como Bearer Token).

**_ Para iniciar sesión en la plataforma: _**

Hay que mandar la siguiente mutation:

        mutation{
            login(email: "email", password: "pass")
        }

Esta devuelve un String con el token de inicio de sesión. Para acceder a las demás funciones hay que mandar este token en la cabecera de la petición (como Bearer Token).

**_ Las queries y mutations del usuario son: _**

    QUERIES:
      me: User
      users: [User]

    MUTATIONS:
      activateAccount(token: String): String
      signUpUser(input: UserIn!): String
      login(email: EmailAdress!, password: String!): String
      deleteUser(id: ObjectID!): User
      updateUser(id: ObjectID!, input: UserIn!): User

**_ Las queries y mutations de los documentos son: _**

    QUERIES:
      documents: [Document]
      documentsByUser: [Document]
      documentByID(id: ObjectID!): Document

    MUTATIONS:
      createDocument(input: DocumentIn!): Document
      deleteDocument(id: ObjectID!): Document
      updateDocument(id: ObjectID!, input: DocumentIn): Document

**_ Las queries y mutations de los ejercicios son: _**

    QUERIES:
      exercises: [Exercise]
      exercisesByDocument(document: ObjectID!): [Exercise]
      exerciseByID(id: ObjectID!): Exercise

    MUTATIONS:
      createExercise(input: ExerciseIn!): Exercise
      changeSubmissionsState(id: ObjectID!, subState: Boolean!): Exercise
      updateExercise(id: ObjectID!, input: ExerciseIn): Exercise
      deleteExercise(id: ObjectID!, code: String!): Exercise

**_ Las queries y mutations de las entregas son: _**

    QUERIES:
      submissions: [Submission]
      submissionsByExercise(exercise: String!): [Submission]
      submissionByID(id: ObjectID!): Submission

    MUTATIONS:
      createSubmission(exercise_code: String!, student_nick: String!): createOut
      updateSubmission(input: SubmissionIn): Submission
      finishSubmission(comment: String): Submission
      deleteSubmission: Submission

La mutation createSumission devuelve un token de "login" para que el alumno realice el ejercicio, el ID de la submission creada (submission_id) y el ID del ejercio (exercise_id) al que pertenece. El token guarda el nick del alumno, el id del ejercio al que se refiere la entrega y el id de la propia entrega. Es necesario pasar el token para el resto de mutations de las entregas.
Para ejecutar las queries sin embargo, hay que estar logueado como profesor. En submissionByID puedes ser alumno o profesor para pedir tu propia submission.
