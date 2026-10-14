import { User } from '../../user.model.js';

export class UserMapper {
  static toResponse(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
    };
  }
}
