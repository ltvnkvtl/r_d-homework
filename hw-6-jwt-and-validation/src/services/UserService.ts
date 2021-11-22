import User from "../models/user";
import ApiError from "../exceptions/ApiErrors";

class UserService {
  async getAllUsers() {
    return await User.find();
  }

  async getUserById(id: string) {
    const user = await User.findById(id);

    if (!user) {
      throw ApiError.NotFoundError('User not found');
    }

    return user;
  }
}

export default new UserService();
