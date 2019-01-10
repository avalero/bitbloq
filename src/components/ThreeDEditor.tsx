import * as React from 'react';
import styled from '@emotion/styled';
import {Query, Mutation} from 'react-apollo';
import debounce from 'lodash.debounce';
import {ThreeD} from '@bitbloq/3d';
import {
  colors,
  Document,
  Icon,
  Input,
  TextArea,
  withTranslate,
} from '@bitbloq/ui';
import gql from 'graphql-tag';

const DOCUMENT_QUERY = gql`
  query Document($id: String!) {
    documentByID(id: $id) {
      id
      type
      title
      description
      content
    }
  }
`;

const UPDATE_DOCUMENT_MUTATION = gql`
  mutation UpdateDocument(
    $id: String!
    $title: String!
    $content: String!
    $description: String!
  ) {
    updateDocument(
      id: $id
      title: $title
      content: $content
      description: $description
    ) {
      content
    }
  }
`;

class ThreeDEditor extends React.Component {
  renderInfoTab(document) {
    const {t} = this.props;
    const {id, title, content, description} = document;

    return (
      <Document.Tab
        key="info"
        icon={<Icon name="info" />}
        label={t('tab-project-info')}>
        <InfoContainer>
          <InfoPanel>
            <InfoHeader>Información del documento</InfoHeader>
            <InfoForm>
              <FormRow>
                <FormLabel>
                  <label>Título del ejercicio</label>
                </FormLabel>
                <FormInput>
                  <Input value={title} placeholder="Título del ejercicio" />
                </FormInput>
              </FormRow>
              <FormRow>
                <FormLabel>
                  <label>Descripción del ejercicio</label>
                </FormLabel>
                <FormInput>
                  <TextArea
                    value={description}
                    placeholder="Descripción del ejercicio"
                    rows="3"
                  />
                </FormInput>
              </FormRow>
            </InfoForm>
          </InfoPanel>
        </InfoContainer>
      </Document.Tab>
    );
  }

  render() {
    const {id, updateDocument} = this.props;

    return (
      <Query query={DOCUMENT_QUERY} variables={{id}}>
        {({loading, error, data}) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          const document = data.documentByID;
          const {id, title} = document;
          let content = [];
          try {
            content = JSON.parse(document.content);
          } catch (e) {
            console.warn('Error parsing document content', e);
          }

          return (
            <ThreeD
              initialContent={content}
              onContentChange={content =>
                updateDocument({
                  variables: {
                    id,
                    title,
                    content: JSON.stringify(content),
                  },
                })
              }>
              {mainTab => [mainTab, this.renderInfoTab(document)]}
            </ThreeD>
          );
        }}
      </Query>
    );
  }
}

const withUpdateDocument = Component => props => (
  <Mutation mutation={UPDATE_DOCUMENT_MUTATION}>
    {mutate => <Component updateDocument={debounce(mutate, 1000)} {...props} />}
  </Mutation>
);

export default withTranslate(withUpdateDocument(ThreeDEditor));

/* styled components */

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  justify-content: center;
  padding: 40px;
  background-color: ${colors.gray1};
`;

const InfoPanel = styled.div`
  align-self: flex-start;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 3px 0 #c7c7c7;
  background-color: white;
  width: 100%;
  max-width: 900px;
`;

const InfoHeader = styled.div`
  border-bottom: 1px solid ${colors.gray2};
  font-size: 16px;
  font-weight: bold;
  padding: 0px 30px;
  height: 50px;
  display: flex;
  align-items: center;
`;

const InfoForm = styled.div`
  padding: 20px 30px;
`;

const FormRow = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const FormLabel = styled.div`
  flex: 1;
  font-size: 14px;
  margin-right: 30px;

  label {
    min-height: 35px;
    display: flex;
    align-items: center;
    line-height: 1.4;
  }
`;

const FormInput = styled.div`
  flex: 2;
`;
