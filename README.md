# Bitbloq Space API

## Despliegue

Para desplegar la API desde la carpeta de `api` hacer

    npm install

Establecer las siguientes variables de entorno

    MONGO_URL=mongodb://localhost/back_bitbloq_db
    JWT_SECRET=averyveryverylongandrandompassword
    PORT=4000
    FRONTEND_URL=http://localhost:8000
    MAILER_HOST=smtp.gmail.com
    MAILER_PORT=587
    MAILER_USER=myuser@gmail.com
    MAILER_PASSWORD=mygmailpassword
    MAILER_FROM=from_address@domain.com
    GCLOUD_PROJECT_ID=gcloud
    GCLOUD_STORAGE_BUCKET=bitbloq-dev
    GOOGLE_APPLICATION_CREDENTIALS=/home/alda/Documentos/bitbloq-dev-bq-contacts.json

Y arrancar con

    npm start

## Uso API

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
      users: [User]
      me: User

    MUTATIONS:
      activateAccount(token: String): String
      signUpUser(input: UserIn!): String
      login(email: EmailAddress!, password: String!): String
      deleteUser(id: ObjectID!): User
      updateUser(id: ObjectID!, input: UserIn!): User

      input UserIn {
        email: EmailAddress
        password: String
        name: String
        center: String
        active: Boolean
        signUpToken: String
        authToken: String
        notifications: Boolean
        signUpSurvey: JSON
      }

**_ Las queries y mutations de los documentos son: _**

    QUERIES:
      documents: [Document]
      document(id: ObjectID!): Document

    MUTATIONS:
      createDocument(input: DocumentIn!): Document
      deleteDocument(id: ObjectID!): Document
      updateDocument(id: ObjectID!, input: DocumentIn): Document

    SUBSCRIPTIONS:
        documentUpdated: Document

    input DocumentIn {
      id: ObjectID
      user: ObjectID
      title: String
      type: String
      content: String
      description: String
      image: Upload
    }

**_ Las queries y mutations de los ejercicios son: _**

    QUERIES:
      exercises: [Exercise]
      exercise(id: ObjectID!): Exercise
      exercisesByDocument(document: ObjectID!): [Exercise]

    MUTATIONS:
      createExercise(input: ExerciseIn!): Exercise
      changeSubmissionsState(id: ObjectID!, subState: Boolean!): Exercise
      updateExercise(id: ObjectID!, input: ExerciseIn): Exercise
      deleteExercise(id: ObjectID!, code: String!): Exercise

    input ExerciseIn {
        document: ObjectID
        title: String
        code: String
        description: String
        acceptSubmissions: Boolean
        versions: Version
        expireDate: Date
    }

**_ Las queries y mutations de las entregas son: _**

    QUERIES:
      submissions: [Submission]
      submission(id: ObjectID!): Submission
      submissionsByExercise(exercise: String!): [Submission]

    STUDENT MUTATIONS:
      createSubmission(exerciseCode: String!, studentNick: String!): createOut
      updateSubmission(input: SubmissionIn): Submission
      finishSubmission(content: String, studentComment: String): Submission
      cancelSubmission: Submission

    TEACHER MUTATIONS:
      deleteSubmission(submissionID: String): Submission
      gradeSubmission(submissionID: ObjectID, grade: Float, teacherComment: String): Submission

    SUBSCRIPTIONS:
      submissionUpdated(exercise: ObjectID!): Submission

    input SubmissionIn {
      title: String
      finished: Boolean
      comment: String
      studentNick: String
    }

La mutation createSumission devuelve un token de "login" para que el alumno realice el ejercicio, el ID de la submission creada (submission_id) y el ID del ejercio (exercise_id) al que pertenece. El token guarda el nick del alumno, el id del ejercio al que se refiere la entrega y el id de la propia entrega. Es necesario pasar el token para el resto de mutations de las entregas.
Para ejecutar las queries sin embargo, hay que estar logueado como profesor. En submissionByID puedes ser alumno o profesor para pedir tu propia submission.
