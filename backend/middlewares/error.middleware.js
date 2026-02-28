export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode)
    let message = "Internal Server Error"

    if (err.isOperational) {
        message = err.message
    }
    console.error(err)

    const response = {
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    }

    if (Array.isArray(err.errors) && err.errors.length > 0) {
        response.errors = err.errors
    }

    return res.status(statusCode).json(response)
}
