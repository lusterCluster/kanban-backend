import { loginUser, registerUser } from "@controller/auth/authControllet";
import { createRole, deleteRole, findRoleById, findRoles, updateRole } from "@controller/roleController";
import { createUser, deleteUser, findUserById, findUsers, updateUser } from "@controller/userController";
import { Application, json, Router } from "express";
import { getPermissions, verifyToken } from "middleware/auth";
import { checkRoles } from "middleware/role";

const router = Router()

export default () => {
    router.get("/health", (req, res) => {
        res.send("Api is Healthy")
    })
    //AUTH
    router.post("/auth/register", checkRoles, registerUser)
    router.post("/auth/login", loginUser)
    //USERS
    router.get("/users",verifyToken, getPermissions, findUsers as Application);
    router.get("/users/:id", verifyToken, getPermissions, findUserById as Application);
    router.post("/users",verifyToken, getPermissions, checkRoles, createUser as Application)
    router.put("/users/:id",verifyToken, getPermissions,updateUser as Application)
    router.delete("/users/:id",verifyToken, getPermissions, deleteUser as Application)

    //ROLES
    router.get("/role",verifyToken, getPermissions, findRoles as Application)
    router.get("/role/:id",verifyToken, getPermissions, findRoleById as Application)
    router.post("/role",verifyToken, getPermissions, createRole as Application)
    router.put("/role/:id",verifyToken, getPermissions, updateRole as Application)
    router.delete("/role/:id",verifyToken, getPermissions, deleteRole as Application)
    
    return router;
}


