import React from 'react';
import {connect} from 'react-redux';
import styled, {css} from '@emotion/styled';
import {Transition} from 'react-spring';

const Container = styled.div`
  position: absolute;
  top: 72px;
  display: flex;
  justify-content: center;
  z-index: 3;
  left: 0px;
  right: 0px;
`;

const Bar = styled.div`
  background: white;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.2);
  padding: 12px 24px;
`;

class NotificationsBar extends React.Component {
  render() {
    const notifications = Object.values(this.props.notifications);

    return (
      <Transition
        keys={notifications.map(({key}) => key)}
        from={{y: -100}}
        enter={{y: 0}}
        leave={{y: -100}}>
        {notifications.map(notification => ({y}) => (
          <Container>
            <Bar style={{transform: `translate(0, ${y}%)`}}>
              {notification.content}
            </Bar>
          </Container>
        ))}
      </Transition>
    );
  }
}

const mapDispatchToProps = ({ui}) => ({
  notifications: ui.notifications,
});

const mapStateToProps = {};

export default connect(
  mapDispatchToProps,
  mapStateToProps,
)(NotificationsBar);
