import { RoleRepository } from "@repository/roleRepository";
import { RoleService } from "@service/roleService";
import { Request, Response } from "express";

const repository = new RoleRepository ()
const service = new RoleService(repository)

export const findRoles = async(req:Request, res:Response) => {

    try {
        const roles = await service.findRoles
        if(roles.length === 0) return res.status(404).json({message:"no roles found"})
            return res.json(roles)
        
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json(error)
    }
}

export const findRoleById = async(req:Request, res:Response) => {
    try {
        const role = await service.findRoleById(req.params.id)
        if(!role) return res.status(404).json({message: "no role found"})
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json(error)
    }
}
export const createRole = async(req:Request, res:Response) => {
    try {
        const result = await service.createRole(req.body)

        return res.status(201).json(result)
    } catch (error) {
        console.log("error: ", error)
        res.status(400).json(error)
    }
}
export const updateRole = async(req:Request, res:Response) => {
    try {
        const role = await service.updateRole(req.params.id, req.body)
        if(!role) return res.status(404).json({message: "no role found"})
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json(error)
    }
}
export const deleteRole = async(req:Request, res:Response) => {
    try {
        const role = await service.deleteRole(req.params.id)
        if(!role) return res.status(404).json({message: "no role found"})
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json(error)
    }
}