import * as mongoose from 'mongoose';

import { CameraType } from "../types/camera";
import { CategoryType } from "../types/category";
import { CommentaryType } from "../types/commentary";
import { FrameType } from "../types/frame";
import { LensType } from "../types/lens";
import { LikeType } from "../types/like";

const frameSchema = new mongoose.Schema<FrameType>({
    numero: Number,
    shutterSpeed: Number,
    aperture: Number,
    exposureValue: { required: false, type: Number }, 
    location: String,
    date: Date,
    weather: String,
    camera: { required: false, type: mongoose.Schema.Types.ObjectId, ref: 'cameras' },
    lens: { required: false, type: mongoose.Schema.Types.ObjectId, ref: 'lenses' },
    title: { required: false, type: String },
    comment: { required: false, type: String },
    favorite: { required: false, type: Boolean },
    shared: { required: false, type: Boolean },
    categories: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'categories' }],
    likes: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'likes' }],
    commentaries: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'commentaries' }],
    phonePhoto: { required: false, type: String },
    argenticPhoto: { required: false, type: String },
})

const Frame: mongoose.Model<FrameType> = mongoose.model<FrameType>('frames', frameSchema);

module.exports = Frame;