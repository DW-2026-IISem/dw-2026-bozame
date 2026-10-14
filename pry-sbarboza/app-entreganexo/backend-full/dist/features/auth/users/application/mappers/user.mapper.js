export class UserMapper {
    static toResponse(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            status: user.status,
        };
    }
}
//# sourceMappingURL=user.mapper.js.map