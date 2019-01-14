***BITBLOQ API***

Apollo - GraphQL - Koa - Mongoose

La interacción con la API se hace a través de QUERIES y MUTATIONS.


*** Para darse de alta en la plataforma hay que realizar dos pasos: ***

1) Mandar la siguiente mutation:

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

2) Para activar la cuenta es necesario mandar la siguiente mutation con el token recibido como parámetro:

        mutation{
            activateAccount(token: "aaaaaaaaa")
        }

Esta devuelve el token de inicio de sesión. Para acceder a las demás funciones hay que mandar este token en la cabecera de la petición (como Bearer Token).


*** Para iniciar sesión en la plataforma: ***

Hay que mandar la siguiente mutation: 

        mutation{
            login(email: "email", password: "pass")
        }

Esta devuelve un String con el token de inicio de sesión. Para acceder a las demás funciones hay que mandar este token en la cabecera de la petición (como Bearer Token).


*** Las queries y mutations del usuario son: ***

    QUERIES:
      me: User
      users: [User]

    MUTATIONS:
      activateAccount(token: String): String
      signUpUser(input: UserIn!): String
      login(email: String!, password: String!): String
      deleteUser(id: String!): User
      updateUser(id: String!, input: UserIn!): User


*** Las queries y mutations de los documentos son: ***   

    QUERIES:
      documents: [Document]
      documentsByUser: [Document]
      documentByID(id: String!): Document
    
    MUTATIONS:
      createDocument(input: DocumentIn!): Document
      deleteDocument(id: String!): Document
      updateDocument(id: String!, input: DocumentIn!): Document



*** Las queries y mutations de los ejercicios son: ***   

    QUERIES:
      exercises: [Exercise]
      exercisesByDocument(document_father: String!): [Exercise]
      exerciseByID(id: String!): Exercise
    
    MUTATIONS:
      createExercise(input: ExerciseIn!): Exercise
      updateExercise(id: String!, input: ExerciseIn!): Exercise
      deleteExercise(id: String!, code: String!): Exercise


*** Las queries y mutations de las entregas son: ***   

    QUERIES:
      submissions: [Submission]
      submissionsByExercise(exercise_father: String!): [Submission]
      submissionByID(id: String!): Submission
    
    MUTATIONS:
      createSubmission(exercise_code: String, student_nick: String): String
      updateSubmission(input: SubmissionIn): Submission
      finishSubmission(comment: String): Submission
      deleteSubmission: Submission

La mutation createSumission devuelve un token de "login" para que el alumno realice el ejercicio. El token guarda el nick del alumno, el id del ejercio al que se refiere la entrega y el id de la propia entrega. Es necesario pasar el token para el resto de mutations de las entregas.
Para ejecutar las queries sin embargo hay que estar logueado como profesor.





