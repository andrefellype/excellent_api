export interface UserModel {
    id: number;
    name: string;
    cellphone: string | null;
    is_enabled: boolean;
    is_admin: boolean;
    is_deleted: boolean;
    created_at: string;
}

export interface UserEntity {
    id: number;
    name: string;
    cellphone: string | null;
    isEnabled: boolean;
    isAdmin: boolean;
    created: string;
}

export const UserRequest = (userModel: UserModel): UserEntity => {
    return {
        id: userModel.id,
        name: userModel.name,
        cellphone: userModel.cellphone,
        isEnabled: userModel.is_enabled,
        isAdmin: userModel.is_admin,
        created: userModel.created_at
    }
}