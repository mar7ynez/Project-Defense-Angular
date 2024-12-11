import { MongooseError } from "mongoose";

export const getErrorMsg = (error) => {
    if (error instanceof MongooseError) {
        return;
    }

    return error.message;
}