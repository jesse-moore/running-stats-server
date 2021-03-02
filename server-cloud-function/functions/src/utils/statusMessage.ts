import { CallbackError } from 'mongoose';

class statusMessage {
    totalActivities: number = 0;
    validActivities: number = 0;
    failedWeather: number[] = [];
    duplicateActivities: number[] = [];
    validationErrors: CallbackError[] = [];

    addValidationError(error: CallbackError | undefined): void {
        if (error === undefined) return;
        this.validationErrors.push(error);
    }

    logStatus(): void {
        if (this.duplicateActivities.length !== 0) {
            this.duplicateActivities.forEach((id) => {
                console.warn(`Duplicate activity found - id: ${id}`);
            });
        }
        if (this.validationErrors.length !== 0) {
            this.validationErrors.forEach((error) => {
                if (error?.message) {
                    console.error(error.message);
                } else {
                    console.error(`Error: ${error?.name}`);
                }
            });
        }
        if (this.failedWeather.length !== 0) {
            this.failedWeather.forEach((id) => {
                console.error(`Failed to get weather for strava_id: ${id}`);
            });
        }
        console.info(
            `Activities Found: ${this.totalActivities}, Activities Added: ${this.validActivities}`
        );
    }
}

export default statusMessage;
