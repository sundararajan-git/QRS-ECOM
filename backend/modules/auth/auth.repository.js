import User from "../user/user.model.js"

const create = async (data) => User.create(data)

const findByEmail = async (email) => User.findOne({ email })

const findById = async (id) => User.findById(id)

const updateById = async (id, payload) =>
    User.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

const deleteById = async (id) => User.findByIdAndDelete(id)

const findByResetToken = async (token) =>
    User.findOne({
        resetPasswordToken: token,
        resetPasswordExpireAt: { $gt: Date.now() },
    })

const authRepository = {
    create,
    findByEmail,
    findById,
    updateById,
    deleteById,
    findByResetToken,
}

export default authRepository
