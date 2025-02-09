import { UserRepository } from "@repository/userRepository";
import { UserService } from "@service/userService";
import { Request, Response } from "express";

const repository = new UserRepository ()
const service = new UserService(repository)

export const findUsers = async(req:Request, res:Response) => {  
    console.log("current user: ", req.currentUser)
    try {
        const users = await service.findUser()
        if(users.length === 0) return res.status(404).json({message:"no users found"})
            return res.json(users)
        
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json(error)
    }
}

export const findUserById = async(req:Request, res:Response) => {
    
    try {
        const user = await service.findUsersById(req.params.id)
        if(!user) return res.status(404).json({message: "no user found"})
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json(error)
    }
}
export const createUser = async(req:Request, res:Response) => {
    try {
        const result = await service.createUser(req.body)

        return res.status(201).json(result)
    } catch (error) {
        console.log("error: ", error)
        res.status(400).json(error)
    }
}
export const updateUser = async(req:Request, res:Response) => {
    try {
        const {id} = req.params        
        console.log("Updating user with ID:", id); // Log the ID
        console.log("Update data:", req.body); // Log the update data
        const user = await service.updateUser(req.params.id, req.body)
        if(!user) return res.status(404).json({message: "no user found"})
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json(error)
    }
}
export const deleteUser = async(req:Request, res:Response) => {
    try {
        const user = await service.deleteUser(req.params.id)
        if(!user) return res.status(404).json({message: "no user found"})
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json(error)
    }
}