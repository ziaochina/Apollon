import React, { Component, ComponentClass } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Element } from '../../services/element/element';
import { ElementRepository } from '../../services/element/element-repository';
import { Point } from '../../utils/geometry/point';
import { CanvasContext, withCanvas } from '../canvas/canvas-context';
import { DropEvent } from '../draggable/drop-event';
import { Droppable as DragDroppable } from '../draggable/droppable';
import { ModelState } from '../store/model-state';
import { ElementComponent, OwnProps } from './element-component';

export const droppable = (WrappedComponent: typeof ElementComponent) => {
  class Droppable extends Component<Props> {
    onDrop = (event: DropEvent) => {
      if (!event.action) return;
      const element = event.action.element;
      element.owner = this.props.element.id;
      const offset = this.props.coordinateSystem.offset();
      const position = this.props.coordinateSystem.screenToPoint(event.position.x, event.position.y);
      element.bounds.x = position.x - offset.x;
      element.bounds.y = position.y - offset.y;
      const relativePosition = this.props.getRelativePosition(element.owner, new Point(element.bounds.x, element.bounds.y));
      element.bounds.x = relativePosition.x;
      element.bounds.y = relativePosition.y;

      this.props.create(element);
    };

    render() {
      return (
        <DragDroppable onDrop={this.onDrop}>
          <WrappedComponent {...this.props} />
        </DragDroppable>
      );
    }
  }

  type StateProps = {
    getRelativePosition: (owner: string, position: Point) => Point;
  };

  type DispatchProps = {
    create: typeof ElementRepository.create;
  };

  type Props = OwnProps & StateProps & DispatchProps & CanvasContext;

  return compose<ComponentClass<OwnProps>>(
    withCanvas,
    connect<StateProps, DispatchProps, OwnProps, ModelState>(
      state => ({ getRelativePosition: ElementRepository.getRelativePosition(state.elements) }),
      { create: ElementRepository.create },
    ),
  )(Droppable);
};
