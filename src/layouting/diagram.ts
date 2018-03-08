import { computeBoundingBox } from "./boundingBox";
import { computeRelationshipPath } from "./relationship";
import { Point, Rect, Size } from "../geometry";
import { ClassDiagram, Entity, Relationship } from "../uml";
import { flatten } from "../utils/array";
import { UUID } from "../uuid";

export interface LayoutedDiagram {
    size: Size;
    entities: Entity[];
    relationships: LayoutedRelationship[];
}

export interface LayoutedRelationship {
    relationship: Relationship;
    path: Point[];
}

export function layout(diagram: ClassDiagram, outerPadding: number): LayoutedDiagram {
    const { entities, relationships } = diagram;

    const relationshipPaths = computeRelationshipPaths(diagram);
    const boundingBox = computeDiagramBoundingBox(diagram, relationshipPaths);

    const translateWithinBoundingBox = (point: Point): Point => ({
        x: point.x - boundingBox.x + outerPadding,
        y: point.y - boundingBox.y + outerPadding
    });

    return {
        size: {
            width: boundingBox.width + 2 * outerPadding,
            height: boundingBox.height + 2 * outerPadding
        },
        entities: entities.map(entity => ({
            ...entity,
            position: translateWithinBoundingBox(entity.position)
        })),
        relationships: relationships.map(relationship => ({
            relationship,
            path: relationshipPaths.get(relationship.id)!.map(translateWithinBoundingBox)
        }))
    };
}

export function computeDiagramBoundingBox(
    diagram: ClassDiagram,
    relationshipPaths: Map<UUID, Point[]>
): Rect {
    const { entities, relationships } = diagram;

    const points = flatten([
        flatten(entities.map(getEntityBoundingPoints)),
        flatten(relationships.map(relationship => relationshipPaths.get(relationship.id)!))
    ]);

    return computeBoundingBox(points);
}

function getEntityBoundingPoints(entity: Entity): Point[] {
    const { x, y } = entity.position;
    const { width, height } = entity.size;

    const topLeftCorner: Point = { x, y };

    const bottomRightCorner: Point = {
        x: x + width,
        y: y + height
    };

    return [topLeftCorner, bottomRightCorner];
}

export function computeRelationshipPaths(diagram: ClassDiagram): Map<UUID, Point[]> {
    const relationshipPaths = diagram.relationships.map<[UUID, Point[]]>(relationship => {
        const source = diagram.entities.find(e => e.id === relationship.source.entityId)!;
        const target = diagram.entities.find(e => e.id === relationship.target.entityId)!;

        const sourceRect = { ...source.position, ...source.size };
        const targetRect = { ...target.position, ...target.size };

        const relationshipPath = computeRelationshipPath(
            sourceRect,
            relationship.source.edge,
            relationship.source.edgeOffset,
            targetRect,
            relationship.target.edge,
            relationship.target.edgeOffset,
            relationship.straightLine
        );

        return [relationship.id, relationshipPath];
    });

    return new Map(relationshipPaths);
}