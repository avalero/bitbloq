import React from 'react';
import {connect} from 'react-redux';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {Select} from '@bitbloq/ui';
import EventShape from './EventShape';
import StatementShape from './StatementShape';
import CodeBlockShape from './CodeBlockShape';
import BooleanShape from './BooleanShape';

const shapeComponents = {
  event: EventShape,
  statement: StatementShape,
  codeblock: CodeBlockShape,
  boolean: BooleanShape,
};

const Container = styled.div`
  height: ${props => props.shapeHeight}px;
  width: ${props => props.contentWidth}px;
  cursor: grab;
  ${props =>
    props.isDragging &&
    css`
      cursor: grabbing;
      filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.5));
    `};
`;

const BloqShape = styled.svg`
  margin: -20px 0px 0px -20px;
  height: ${props => props.shapeHeight + 40}px;
  width: ${props => props.contentWidth + 40}px;
  pointer-events: none;
`;

const BloqShapeWrap = styled.g`
  opacity: ${props => (props.isGhost ? 0.4 : 1)};
  transform: translate(20px, 20px);
`;

const BloqPlaceholder = styled.svg`
  width: 80px;
  height: ${props => props.shapeHeight}px;
`;

const Content = styled.div`
  position: absolute;
  top: 10px;
  left: 0px;
  height: 30px;
  display: flex;
  color: white;
  user-select: none;
  align-items: center;
  padding: 0px 6px;

  & > * {
    margin: 0px 6px;
  }
`;

const Label = styled.span`
  white-space: nowrap;
`;

const Input = styled.input`
  width: 80px;
  font-family: Jua;
  height: 26px;
  padding: 0px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  border: 1px solid hsl(0, 0%, 80%);
`;

const ContentBloq = styled.div`
  position: relative;
`;

function BloqFactory(getType, getOptions = () => []) {
  const ContentItem = ({type, bloq, onChange, ...props}) => {
    const value = bloq.data && bloq.data[props.dataField];

    switch (type) {
      case 'label':
        return <Label>{props.text}</Label>;

      case 'select':
        return (
          <Select
            options={getOptions(props)}
            value={value}
            onMouseDown={e => e.stopPropagation()}
            onChange={onChange}
          />
        );

      case 'input':
        return (
          <Input
            type="text"
            value={value || ''}
            onMouseDown={e => e.stopPropagation()}
            onChange={e => onChange(e.target.value)}
          />
        );

      case 'bloq':
        const shapeComponent = shapeComponents[props.bloqType];

        if (value) {
          return (
            <ContentBloq>
              <Bloq bloq={value} />
            </ContentBloq>
          );
        } else {
          return (
            <BloqPlaceholder shapeHeight={shapeComponent.getHeight()}>
              {React.createElement(shapeComponent, {isPlaceholder: true})}
            </BloqPlaceholder>
          );
        }

      default:
        return null;
    }
  };

  class Bloq extends React.Component {
    state = {
      contentWidth: 0,
    };
    contentRef = React.createRef();

    static getHeight(bloq, nextIncluded) {
      const bloqType = getType(bloq.type) || {};
      const shapeComponent = shapeComponents[bloqType.type];
      const {children = []} = bloq;
      const childrenHeight =
        children.length > 0 ? Bloq.getHeight(children[0], true) : 0;
      const height = shapeComponent.getHeight(childrenHeight);

      if (nextIncluded && bloq.next) {
        return height + Bloq.getHeight(bloq.next, true);
      } else {
        return height;
      }
    }

    componentDidMount() {
      this.updateContentWidth();
    }

    componentDidUpdate(prevProps) {
      const {bloq = {}} = this.props;
      const {bloq: prevBloq = {}} = prevProps;

      if (bloq.type !== prevBloq.type || bloq.data !== prevBloq.data) {
        this.updateContentWidth();
      }
    }

    getContentRects() {
      if (this.contentRef.current) {
        return Array.from(this.contentRef.current.children).map(item =>
          item.getBoundingClientRect(),
        );
      } else {
        return [];
      }
    }

    updateContentWidth() {
      if (this.contentRef.current) {
        const {width} = this.contentRef.current.getBoundingClientRect();
        if (width !== this.state.contentWidth) {
          this.setState(state => ({...state, contentWidth: width}));
        }
      }
    }

    render() {
      const {contentWidth} = this.state;
      const {
        className,
        bloq,
        onChange,
        isDragging,
        getChildrenHeight,
      } = this.props;
      const {children = []} = bloq;
      const bloqType = getType(bloq.type) || {};
      const {content = []} = bloqType;

      return (
        <Container
          className={className}
          shapeHeight={Bloq.getHeight(bloq)}
          isDragging={isDragging}
          contentWidth={contentWidth}>
          <BloqShape
            shapeHeight={Bloq.getHeight(bloq)}
            contentWidth={contentWidth}>
            <BloqShapeWrap isGhost={bloq.isGhost}>
              {React.createElement(shapeComponents[bloqType.type], {
                width: contentWidth,
                childrenHeight: children[0]
                  ? Bloq.getHeight(children[0], true)
                  : 0,
              })}
            </BloqShapeWrap>
          </BloqShape>
          <Content innerRef={this.contentRef}>
            {content.map((item, i) => (
              <ContentItem
                {...item}
                key={i}
                bloq={bloq}
                onChange={value =>
                  onChange({
                    ...bloq,
                    data: {...bloq.data, [item.dataField]: value},
                  })
                }
              />
            ))}
          </Content>
        </Container>
      );
    }
  }

  return Bloq;
}

export default BloqFactory;
