import { Connection, Schema, SchemaTypes } from "mongoose";
import { ICollection } from "../interfaces";

const docSchema = new Schema<ICollection>({
    Data: {
        required: false,
        type: SchemaTypes.Mixed,
    },
    ID: {
        required: true,
        type: SchemaTypes.String,
        unique: true,
    },
});

export function modelSchema<T = any>(
    connection: Connection,
    name = "JSON"
) {
    const model = connection.model<ICollection<T>>(name, docSchema);

    return model;
}
