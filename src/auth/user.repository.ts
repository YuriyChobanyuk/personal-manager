import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './auth-credentials.dto';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { promisify } from 'util';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await this.hashPassword(password, salt);

    try {
      const user = new User();

      user.username = username;
      user.password = hashedPassword;
      user.salt = salt;

      await user.save();
    } catch (err) {
      console.log(err.code);
      if (err.code === '23505') {
        throw new ConflictException('Duplicate username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async comparePasswords(authCredentialsDto: AuthCredentialsDto): Promise<string | null> {
    const { username, password } = authCredentialsDto;

    const user = await User.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    let same;
    try {
      same = await promisify(bcrypt.compare)(password, user.password);
    } catch (err) {
      throw new UnauthorizedException('Invalid username or password');
    }

    console.log({ same });

    return same ? user.username : null;
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
