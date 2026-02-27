export type ErrorToastType = {
    response?: {
        data?: {
            message?: string;
        };
        status?: number;
    };
    message?: string;
    name?: string;
    stack?: string;
};
