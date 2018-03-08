import * as React from "react";
import EntityMemberList from "./EntityMemberList";
import EntityMembersHeading from "./EntityMembersHeading";
import { Entity, EntityMember, EntityRenderMode } from "../../../../../uml";
import { UUID } from "../../../../../uuid";

export default class EntityAttributes extends React.Component<Props> {
    handleShowAttributesChange = (showAttributes: boolean) => {
        this.props.updateEntityRenderMode({
            ...this.props.entity.renderMode,
            showAttributes
        });
    };

    render() {
        const { entity } = this.props;

        return (
            <div>
                <EntityMembersHeading
                    heading="Attributes"
                    renderMembers={entity.renderMode.showAttributes}
                    onShowMembersChange={this.handleShowAttributesChange}
                />

                {entity.renderMode.showAttributes && (
                    <EntityMemberList
                        entityMembers={entity.attributes}
                        addNewMemberPlaceholder="New attribute"
                        deleteEntityMemberButtonTitle="Delete attribute"
                        createEntityMember={this.props.createEntityAttribute}
                        updateEntityMember={this.props.updateEntityAttribute}
                        deleteEntityMember={this.props.deleteEntityAttribute}
                    />
                )}
            </div>
        );
    }
}

interface Props {
    entity: Entity;
    updateEntityRenderMode: (renderMode: EntityRenderMode) => void;
    createEntityAttribute: (attribute: EntityMember) => void;
    updateEntityAttribute: (attribute: EntityMember) => void;
    deleteEntityAttribute: (memberId: UUID) => void;
}