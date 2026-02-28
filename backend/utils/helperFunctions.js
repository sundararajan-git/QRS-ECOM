export const sanitize = (collection, allowedKeys) => {
    const safeCollection = {}
    allowedKeys.forEach((key) => {
        if (collection[key] !== undefined) {
            safeCollection[key] = collection[key]
        }
    })
    return safeCollection
}   