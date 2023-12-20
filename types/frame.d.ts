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
    location: string, // voir ce qui est envoyé depuis le front (locapic-part4 - MapScreen - ligne 25)
    date: Date,  // heure importante pour les réglages
    weather: string,  // voir ce que nous renvoie l'API
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