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
      users: [User]   @authRequired(requires: [ADMIN])
      me: User        @authRequired(requires: [USER])

    MUTATIONS:
      signUpUser(input: UserIn!): String
      activateAccount(token: String): String
      login(email: EmailAddress!, password: String!): String
      resetPasswordEmail(email: EmailAddress!): String
      updatePassword(token: String, newPassword: String): String
      deleteUser(id: ObjectID!): User                             @authRequired(requires: [USER])
      updateUser(id: ObjectID!, input: UserIn!): User             @authRequired(requires: [USER])

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

**_ Las queries y mutations de las carpetas son: _**

    QUERIES:
      folders: [Folder]                                    @authRequired(requires: [USER])
      folder(id: ObjectID!): Folder                       @authRequired(requires: [USER])
      rootFolder: Folder                                   @authRequired(requires: [USER])

    MUTATIONS:
      createFolder(input: FolderIn): Folder                  @authRequired(requires: [USER])
      updateFolder(id: ObjectID!, input: FolderIn): Folder  @authRequired(requires: [USER])
      deleteFolder(id: ObjectID!): Folder                   @authRequired(requires: [USER])

    input FolderIn {
      name: String
      user: ObjectID
      documentsID: [ObjectID] //solo en update
      foldersID: [ObjectID]   //solo en update
      parent: ObjectID
    }

**_ Las queries y mutations de los documentos son: _**

    QUERIES:
      documents: [Document]                @authRequired(requires: [USER])
      document(id: ObjectID!): Document   @authRequired(requires: [USER])

    MUTATIONS:
      createDocument(input: DocumentIn!): Document                       @authRequired(requires: [USER])
      deleteDocument(id: ObjectID!): Document                           @authRequired(requires: [USER])
      updateDocument(id: ObjectID!, input: DocumentIn): Document        @authRequired(requires: [USER])

    SUBSCRIPTIONS:
      documentUpdated: Document   @authRequired(requires: [USER])

    input DocumentIn {
      id: ObjectID
      user: ObjectID
      title: String
      type: String
      folder: ObjectID
      content: String
      geometries: String
      description: String
      version: String
      image: Upload
      imageUrl: String
    }

**_ Las queries y mutations de los ejercicios son: _**

    QUERIES:
      exercises: [Exercise]                                    @authRequired(requires: [USER])
      exercise(id: ObjectID!): Exercise                       @authRequired(requires: [EPHEMERAL, USER])
      exercisesByDocument(document: ObjectID!): [Exercise]     @authRequired(requires: [USER])

    MUTATIONS:
      createExercise(input: ExerciseIn!): Exercise                         @authRequired(requires: [USER])
      changeSubmissionsState(id: ObjectID!, subState: Boolean!): Exercise @authRequired(requires: [USER])
      updateExercise(id: ObjectID!, input: ExerciseIn): Exercise          @authRequired(requires: [USER])
      deleteExercise(id: ObjectID!, code: String!): Exercise              @authRequired(requires: [USER])

    input ExerciseIn {
      document: ObjectID
      title: String
      code: String
      description: String
      acceptSubmissions: Boolean
      expireDate: Date
    }

**_ Las queries y mutations de las entregas son: _**

    QUERIES:
      submissions: [Submission]                                  @authRequired(requires: [USER])
      submission(id: ObjectID): Submission                      @authRequired(requires: [EPHEMERAL, USER])
      submissionsByExercise(exercise: ObjectID!): [Submission]   @authRequired(requires: [USER])

    STUDENT MUTATIONS:
      loginSubmission(exerciseCode: String!, studentNick: String!, password: String!): loginOut
      updateSubmission(input: SubmissionIn): Submission                                      @authRequired(requires:([EPHEMERAL])
      finishSubmission(content: String, cache: String, studentComment: String): Submission   @authRequired(requires: [EPHEMERAL])
      cancelSubmission: Submission                                                           @authRequired(requires: [EPHEMERAL])

    TEACHER MUTATIONS:
      deleteSubmission(submissionID: ObjectID!): Submission                                       @authRequired(requires: [USER])
      gradeSubmission(submissionID: ObjectID, grade: Float, teacherComment: String): Submission   @authRequired(requires: [USER])

    SUBSCRIPTIONS:
      submissionUpdated(exercise: ObjectID!): Submission   @authRequired(requires: [USER])

    input SubmissionIn {
      title: String
      finished: Boolean
      studentComment: String
      studentNick: String
      content: String
      cache: String
      type: String
    }
    type loginOut {
      token: String
      exerciseID: String
      type: String
    }


La mutation createSumission devuelve un token de "login" para que el alumno realice el ejercicio, el ID de la submission creada (submissionid) y el ID del ejercio (exerciseid) al que pertenece. El token guarda el nick del alumno, el id del ejercio al que se refiere la entrega y el id de la propia entrega. Es necesario pasar el token para el resto de mutations de las entregas.
Para ejecutar las queries sin embargo, hay que estar logueado como profesor. En submissionByID puedes ser alumno o profesor para pedir tu propia submission.
