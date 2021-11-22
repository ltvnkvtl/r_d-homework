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

    return { ...tokens, user: userDto };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest(`User with email ${email} not found`);
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw ApiError.BadRequest(`Wrong password`);
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken: string) {
    return await TokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findById((userData as UserDto).id);
    const userDto = new UserDto((user as IUser));
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    return await User.find();;
  }
}

export default new UserService();
