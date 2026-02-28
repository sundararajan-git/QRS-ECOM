import User from "./user.model.js"

const findById = async (id) => User.findById(id)

const updateById = async (id, payload) =>
    User.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

const deleteById = async (id) => User.findByIdAndDelete(id)

const userRepository = {
    findById,
    updateById,
    deleteById,
}

export default userRepository
