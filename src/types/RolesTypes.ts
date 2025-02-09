import { Document } from "mongoose"
import { Query, Repository } from "./RepositoryTypes"

export interface Role extends Document {    
    name:string
    permissions: string[]
}

export interface IRoleRepository extends Repository<Role>{}

export interface IRoleService {
    createRole(role: Role): Promise<Role>
    findRoles(query?:Query): Promise<Role[]>
    findRoleById(id:string): Promise<Role | null>
    deleteRole(id:string): Promise<boolean>
    updateRole(id:string, role: Partial<Role>): Promise<Role | null>
}