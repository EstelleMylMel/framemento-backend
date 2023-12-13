import { CameraType } from "./camera";
import { CategoryType } from "./category";
import { CommentaryType } from "./commentary";
import { LensType } from "./lens";
import { LikeType } from "./like";

export type FrameType = Document & {
    _id: String,
    numero: Number,
    shutterSpeed: Number,
    aperture: Number,
    exposureValue?: Number, 
    location: String, // voir ce qui est envoyé depuis le front (locapic-part4 - MapScreen - ligne 25)
    date: Date,  // heure importante pour les réglages
    weather: String,  // voir ce que nous renvoie l'API
    camera?: CameraType,
    lens?: LensType,
    title?: String,
    comment?: String,
    favorite?: Boolean,
    shared: Boolean,
    categories?: CategoryType[],
    likes?: LikeType[],
    commentaries?: CommentaryType[],
    phonePhoto?: String,  // uri
    argenticPhoto?: String,  // uri
};