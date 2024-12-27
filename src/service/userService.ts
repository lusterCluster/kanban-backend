import { IUserRepository, IUserService, User } from "types/UsersTypes";

export class UserService implements IUserService {
    private userRepository: IUserRepository
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }
    async createUser(user: User): Promise<User> {
        return this.userRepository.create(user)        
    }
    async findUser(): Promise<User[]> {
        return this. userRepository.find()
    }
}