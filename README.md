***BITBLOQ API***

Apollo - GraphQL - Koa - Mongoose

La interacción con la API se hace a través de QUERIES y MUTATIONS.


*** Para darse de alta en la plataforma hay que realizar dos pasos: ***

1)mandar la siguiente mutation:

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

2) Para activar la cuenta es necesario mandar la siguiente query con el token recibido en la cabecera de la petición (como Bearer Token).

    query{
        activateAccount
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
        users: [User]
        activateAccount: String

    MUTATIONS:
        signUpUser(input: UserIn!): String
        login(email: String!, password: String!): String
        deleteUser(id: String!): User
        updateUser(id: String!, input: UserIn!): User

*** Las queries y mutations de los documentos son: ***   

    QUERIES:
        documents: [Document]
        documentByID(id: String!): [Document]   
    
    MUTATIONS:
        createDocument(type: String!, title: String!): Document
        deleteDocument(id: String): Document
        updateDocument(
            id: String
            user: String
            title: String!
            type: String
            content: String
            description: String
        ): Document
        createExercise(document_father: String, expireDate: String): Document
        deleteExercise(code: String!): Document




