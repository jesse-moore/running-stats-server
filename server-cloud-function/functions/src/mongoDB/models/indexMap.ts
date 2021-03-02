import { Schema, model } from 'mongoose';
import { IndexMapModel } from '../../types';

const indexMapSchema = new Schema({
    of: String,
    index: { type: Map, of: { type: Schema.Types.ObjectId, ref: 'Activity' } },
});

export default model<IndexMapModel>('IndexMap', indexMapSchema);
