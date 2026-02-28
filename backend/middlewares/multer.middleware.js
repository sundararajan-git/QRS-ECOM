import fs from "fs"
import path from "path"
import multer from "multer"

const uploadDir = path.resolve("uploads")
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
    },
})

const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        return cb(null, true)
    }
    return cb(new Error("Only image files are allowed"), false)
}

export const upload = multer({ storage, fileFilter })
