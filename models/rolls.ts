import * as mongoose from 'mongoose';

import { RollType } from '../types/roll';

const rollSchema = new mongoose.Schema<RollType>({
    name: String,
    rollType: String,
    images: Number,
    pushPull: {required: false, type: Number},
    camera: {required: false, type: mongoose.Schema.Types.ObjectId, ref: 'cameras'},
    framesList: [{ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'frames' }],
});
    
const Roll: mongoose.Model<RollType> = mongoose.model<RollType>('rolls', rollSchema);

module.exports = Roll;