import { MongoError } from 'mongodb';
import { CallbackError } from 'mongoose';

type StatusObject = {
    validationErrors: { id: number; error: CallbackError }[];
    databaseErrors: MongoError[];
    init(): void;
    addValidationError(id: number, error: CallbackError): void;
    addDatabaseError(error: MongoError): void;
    logStatus(): void;
};

const statusObject: StatusObject = {
    validationErrors: [],
    databaseErrors: [],
    init(): void {
        this.validationErrors = [];
        this.databaseErrors = [];
    },
    addValidationError(id, error) {
        if (error === undefined) return;
        this.validationErrors.push({ id, error });
    },

    addDatabaseError(error) {
        if (error === undefined) return;
        this.databaseErrors.push(error);
    },
    logStatus(): void {
        this.validationErrors.forEach((error) => {
            if (error.error?.message) {
                console.error(error.error.message);
            } else {
                console.error(`Error: ${error.error?.name}`);
            }
        });

        this.databaseErrors.forEach((error) => {
            console.error(`Database Error: ${error.message}`);
        });
    },
};

export default statusObject;
