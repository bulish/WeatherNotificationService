import { Injectable } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { INVALID_TOKEN } from "src/common/constants/response.contants";

@Injectable()
export class JwtService {

  constructor(private readonly jwtService: NestJwtService) {}

  async sign(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload); // returns new jwt token
  }

  async verify(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new Error(INVALID_TOKEN);
    }
  }

}
