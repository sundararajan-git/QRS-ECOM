import mongoose, { Schema } from "mongoose"

const userSchema = Schema({
    email: {
        type: String, required: true, unique: true, trim: true, lowercase: true
    },
    password: { type: String, required: true },
    username: { type: String, default: "", unique: true },
    profilePic: { type: String, default: "https://res.cloudinary.com/dlwe2wlwl/image/upload/v1758980337/Avatar_optimized_gxxtqo.jpg" },
    isVerified: { type: Boolean, default: false },
    isLogin: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationExpireAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpireAt: { type: Date },
    lastLogin: { type: Date },
    lastLogout: { type: Date },
    roles: { type: [String], default: ["user"], enum: ["user", "admin"] },
}, {
    timestamps: true,
    strict: true,
})

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.__v
        delete ret.password;
        delete ret.verificationToken;
        delete ret.verificationExpireAt;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpireAt;
        return ret
    }
})

userSchema.index({ roles: 1 })

const User = mongoose.model("User", userSchema)

export default User
