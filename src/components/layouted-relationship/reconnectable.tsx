import React, { Component, ComponentClass } from 'react';
import { connect } from 'react-redux';
import { RelationshipRepository } from '../../services/relationship/relationship-repository';
import { Point } from '../../utils/geometry/point';
import { ConnectConsumer, ConnectContext } from '../connectable/connect-context';
import { OwnProps, RelationshipComponent } from './relationship-component';

export const reconnectable = (WrappedComponent: typeof RelationshipComponent): ComponentClass<OwnProps> => {
  class Reconnectable extends Component<Props, State> {
    state = {
      isReconnecting: false,
    };

    composePath(path: Point[]): Point[] {
      const distance = 40;
      const v = {
        x: path[1].x - path[0].x,
        y: path[1].y - path[0].y,
      };
      const length = Math.sqrt(v.x * v.x + v.y * v.y);
      const u = { x: v.x / length, y: v.y / length };
      const pointOne = new Point(path[0].x + distance * u.x, path[0].y + distance * u.y);
      return [path[0], pointOne];
    }

    render() {
      const { path } = this.props.element;
      const points: Point[] = path.map(p => new Point(p.x, p.y));
      const handleStart = this.composePath([...points]);
      const handleEnd = this.composePath([...points].reverse());

      return (
        <ConnectConsumer
          children={context =>
            context && (
              <WrappedComponent {...this.props} disabled={context.isDragging} hidden={this.state.isReconnecting}>
                {this.props.children}
                <g>
                  <line
                    x1={handleStart[0].x}
                    y1={handleStart[0].y}
                    x2={handleStart[1].x}
                    y2={handleStart[1].y}
                    stroke="white"
                    strokeWidth={15}
                    strokeOpacity={0}
                    onPointerDown={this.onPointerDown('target', context)}
                    style={{ cursor: 'move' }}
                  />
                  <line
                    x1={handleEnd[0].x}
                    y1={handleEnd[0].y}
                    x2={handleEnd[1].x}
                    y2={handleEnd[1].y}
                    stroke="white"
                    strokeWidth={15}
                    strokeOpacity={0}
                    onPointerDown={this.onPointerDown('source', context)}
                    style={{ cursor: 'move' }}
                  />
                </g>
              </WrappedComponent>
            )
          }
        />
      );
    }

    private onPointerDown = (position: 'source' | 'target', context: ConnectContext) => async (
      event: React.PointerEvent,
    ) => {
      this.setState({ isReconnecting: true });
      const change = position === 'source' ? 'target' : 'source';
      try {
        const endpoints = await context.onStartConnect(this.props.element[position])(event.nativeEvent);
        this.props.connect(this.props.element.id, {
          [change]: endpoints.target,
        });
      } catch (error) {
      } finally {
        this.setState({ isReconnecting: false });
      }
    };
  }

  type StateProps = {};

  type DispatchProps = {
    connect: typeof RelationshipRepository.connect;
  };

  type Props = OwnProps & StateProps & DispatchProps;

  type State = {
    isReconnecting: boolean;
  };

  return connect<StateProps, DispatchProps, OwnProps>(
    null,
    { connect: RelationshipRepository.connect },
  )(Reconnectable);
};
