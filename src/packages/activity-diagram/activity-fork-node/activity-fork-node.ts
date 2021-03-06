import { ActivityElementType } from '..';
import { Element, IElement } from '../../../services/element/element';
import { UMLElement } from '../../../typings';

export class ActivityForkNode extends Element {
  static features = { ...Element.features, editable: false };

  type = ActivityElementType.ActivityForkNode;

  constructor(values?: IElement);
  constructor(values?: UMLElement);
  constructor(values?: IElement | UMLElement);
  constructor(values?: IElement | UMLElement) {
    super(values);

    if (!values) {
      Object.assign(this, { bounds: { ...this.bounds, width: 20, height: 60 } });
    }
  }
}
