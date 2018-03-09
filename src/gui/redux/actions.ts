import { EditorAction } from "./editor/actions";
import { EntitiesAction } from "./entities/actions";
import { InteractiveElementsAction } from "./interactiveElements/actions";
import { RelationshipsAction } from "./relationships/actions";
import { UndoRedoAction } from "./undoRedo/actions";

export * from "./editor/actions";
export * from "./entities/actions";
export * from "./interactiveElements/actions";
export * from "./relationships/actions";
export * from "./undoRedo/actions";

export type ReduxAction =
    | EditorAction
    | EntitiesAction
    | InteractiveElementsAction
    | RelationshipsAction
    | UndoRedoAction;