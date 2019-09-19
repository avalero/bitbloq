import gql from "graphql-tag";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      admin
    }
  }
`;

export const DOCUMENT_QUERY = gql`
  query Document($id: ObjectID!) {
    document(id: $id) {
      id
      type
      title
      description
      content
      image
      public
      example
    }
  }
`;

export const OPEN_PUBLIC_DOCUMENT_QUERY = gql`
  query OpenPublicDocument($id: ObjectID!) {
    openPublicDocument(id: $id) {
      id
      type
      title
      description
      content
      image
      public
    }
  }
`;

export const DOCUMENTS_QUERY = gql`
  query Documents {
    documents {
      id
      type
      title
      createdAt
      image
    }
  }
`;

export const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument(
    $type: String!
    $title: String!
    $description: String
    $content: String
    $image: String
  ) {
    createDocument(
      input: {
        type: $type
        title: $title
        description: $description
        content: $content
        imageUrl: $image
      }
    ) {
      id
      type
    }
  }
`;

export const UPDATE_DOCUMENT_MUTATION = gql`
  mutation UpdateDocument(
    $id: ObjectID!
    $title: String!
    $content: String
    $description: String
    $image: Upload
  ) {
    updateDocument(
      id: $id
      input: {
        title: $title
        content: $content
        description: $description
        image: $image
      }
    ) {
      id
      type
      content
      image
    }
  }
`;

export const DELETE_DOCUMENT_MUTATION = gql`
  mutation DeleteDocument($id: ObjectID!) {
    deleteDocument(id: $id) {
      id
    }
  }
`;

export const DOCUMENT_UPDATED_SUBSCRIPTION = gql`
  subscription OnDocumentUpdated {
    documentUpdated {
      id
    }
  }
`;

export const EXERCISE_QUERY = gql`
  query Exercise($id: ObjectID!) {
    exercise(id: $id) {
      id
      type
      title
      code
      teacherName
      content
      description
      image
    }
  }
`;

export const EXERCISE_BY_CODE_QUERY = gql`
  query ExerciseByCode($code: String!) {
    exerciseByCode(code: $code) {
      id
      type
      teacherName
    }
  }
`;

export const STUDENT_SUBMISSION_QUERY = gql`
  query Submission {
    submission {
      id
      content
    }
  }
`;

export const UPDATE_SUBMISSION_MUTATION = gql`
  mutation UpdateSubmission($content: String!) {
    updateSubmission(input: { content: $content }) {
      id
    }
  }
`;

export const FINISH_SUBMISSION_MUTATION = gql`
  mutation FinishSubmission($content: String!) {
    finishSubmission(content: $content) {
      id
    }
  }
`;

export const UPLOAD_STL_MUTATION = gql`
  mutation uploadSTLFile($file: Upload!, $documentId: ObjectID) {
    uploadSTLFile(file: $file, documentID: $documentId) {
      id
      filename
      mimetype
      publicUrl
      document
    }
  }
`;

export const PUBLISH_DOCUMENT_MUTATION = gql`
  mutation publishDocument(
    $id: ObjectID!
    $public: Boolean
    $example: Boolean
  ) {
    publishDocument(id: $id, public: $public, example: $example) {
      id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: EmailAddress!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const RENEW_TOKEN_MUTATION = gql`
  mutation RenewToken {
    renewToken
  }
`;

export const START_SUBMISSION_MUTATION = gql`
  mutation StartSubmission(
    $studentNick: String!
    $exerciseCode: String!
    $password: String!
  ) {
    startSubmission(
      studentNick: $studentNick
      exerciseCode: $exerciseCode
      password: $password
    ) {
      token
      exerciseID
      type
    }
  }
`;

export const LOGIN_SUBMISSION_MUTATION = gql`
  mutation LoginSubmission(
    $studentNick: String!
    $exerciseCode: String!
    $password: String!
  ) {
    loginSubmission(
      studentNick: $studentNick
      exerciseCode: $exerciseCode
      password: $password
    ) {
      token
      exerciseID
      type
    }
  }
`;
