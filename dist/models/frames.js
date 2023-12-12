"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const frameSchema = new mongoose.Schema({
    numero: Number,
    shutterSpeed: Number,
    aperture: Number,
    exposureValue: { required: false, Number },
    location: String,
    date: Date,
    weather: String,
    camera: { required: false, String },
    lens: { required: false, String },
    title: { required: false, String },
    comment: { required: false, String },
    favorite: { required: false, Boolean },
    share: { required: false, Boolean },
    categories: [{ required: false, String }],
    nbLikes: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'likes' }],
    commentaries: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'commentaries' }],
    phonePhoto: { required: false, String },
    argenticPhoto: { required: false, String },
});
const Frame = mongoose.model('frames', frameSchema);
module.exports = Frame;
