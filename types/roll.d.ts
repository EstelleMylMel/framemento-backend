import { CameraType } from "./camera";
import { FrameType } from "./frame";

export type RollType = Document & {
    _id: string,
    name: string,
    rollType: string,
    images: number,
    pushPull?: number,
    camera?: CameraType,
    framesList?: FrameType[]
};
