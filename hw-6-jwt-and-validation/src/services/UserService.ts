import User from '../models/user';
import * as bcrypt from 'bcrypt';
import {IUser} from "../models/iUser";
import TokenService from "./TokenService";
import {UserDto} from "../dto/UserDto";
import ApiError from "../exceptions/ApiErrors";

class UserService {
  async registration(user: IUser) {
    const candidate = await User.findOne({ email: user.email });

    if (candidate) {
      throw ApiError.BadRequest(`User with email ${user.email} already exist`);
    }

    const hashPassword = await bcrypt.hash(user.password, 3)
    const newUser = await User.create( { ...user, password: hashPassword });

    const userDto = new UserDto(newUser); // id, email
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    }
  }
}

export default new UserService();
