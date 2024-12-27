import { UserRepository } from "@repository/userRepository";
import { UserService } from "@service/userService";
import { json, Router } from "express";
import { IUserRepository, IUserService, User } from "types/UsersTypes";
const router = Router()

const userRepository:IUserRepository = new UserRepository()
const userService:IUserService = new UserService(userRepository)

export default () => {
    router.get("/health", (req, res) => {
        res.send("Api is Healthy")
    })

    router.get("/users", async(req, res) => {
        const users = await userService.findUser()
        res.json(users)
    })
    router.post("/users", async(req, res) => {
        const newUser:User = req.body
        const result = await userService.createUser(newUser)

        res.json(result)
    })
    return router;
}