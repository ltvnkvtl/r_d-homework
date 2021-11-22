import Token from '../models/token';
import * as jwt from 'jsonwebtoken';
import {GeneratedTokens} from "../models/iToken";
import {UserDto} from "../dto/UserDto";

class TokenService {
  generateTokens(payload: UserDto): GeneratedTokens {
    const accessToken = jwt.sign(payload, `${process.env.JWT_ACCESS_SECRET}`, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, `${process.env.JWT_REFRESH_SECRET}`, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await Token.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await Token.create({ user: userId, refreshToken });

    return token;
  }
}

export default new TokenService();
