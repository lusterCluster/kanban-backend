import mongoose, { Schema } from "mongoose";
import { Role } from "types/RolesTypes";

const RoleSchema: Schema = new Schema<Role>(
    {
        name:{
            type: String,
            required: true,
            unique: true
        },                
        permissions: {
            type: [String],
            default: []
        }

    }, {
        timestamps:true,
        versionKey:false
    }
)
export const RoleModel = mongoose.model<Role>("Role", RoleSchema)
