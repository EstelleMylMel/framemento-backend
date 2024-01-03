import { CameraType } from "./camera";
import { CategoryType } from "./category";
import { CommentaryType } from "./commentary";
import { LensType } from "./lens";
import { LikeType } from "./like";

export type FrameType = Document & {
    _id: string,
    numero: number,
    shutterSpeed: string,
    aperture: string,
    exposureValue?: number, 
    location: string, 
    date: Date,  
    weather: string,  
    camera?: CameraType,
    lens?: LensType,
    title?: string,
    comment?: string,
    favorite?: boolean,
    shared: boolean,
    categories?: string[],
    likes?: string[],
    commentaries?: CommentaryType[],
    phonePhoto?: string,  // uri
    argenticPhoto?: string,  // uri
};