export enum METHOTS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
export enum SCOPE {
    Read = "read",
    Write = "write",
    Delete = "delete",
    Update = "update"
}
export interface Permission {
    method: METHOTS;
    scope: SCOPE;
    permissions: string[];
}
export const permissions:Permission[] = [
    {
        method: METHOTS.GET,
        scope: SCOPE.Read,
        permissions: ["admin_granted"]
    },
    {
        method: METHOTS.POST,
        scope: SCOPE.Write,
        permissions: ["admin_granted"]
    },
    {
        method: METHOTS.PUT,
        scope: SCOPE.Update,
        permissions: ["admin_granted"]
    },
    {
        method: METHOTS.DELETE,
        scope: SCOPE.Delete,
        permissions: ["admin_granted"]
    }
]