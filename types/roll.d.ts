import { CameraType } from "./camera";
import { FrameType } from "./frame";

export type RollType = Document & {
    _id: String,
    name: String,
    rollType: String,
    images: Number,
    pushPull?: Number,
    camera?: CameraType,
    framesList?: FrameType[]
};

// Ajout de _id pour être conforme avec TS