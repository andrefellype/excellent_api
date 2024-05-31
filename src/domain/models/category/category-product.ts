import { FILES_UPLOAD_CATEGORY_PRODUCT } from "./constants";

export interface CategoryProductModel {
    id: number;
    name: string;
    icon: string | null;
}

export interface CategoryProductEntity {
    id: number;
    name: string;
    icon: string | null;
    iconMiniature: string | null;
    iconPortrait: string | null;
}

export const CategoryProductRequest = (categoryModel: CategoryProductModel): CategoryProductEntity => {
    const dataReturn: CategoryProductEntity = {
        id: categoryModel.id,
        name: categoryModel.name,
        icon: categoryModel.icon,
        iconMiniature: categoryModel.icon != null ? `${FILES_UPLOAD_CATEGORY_PRODUCT.miniature}${categoryModel.icon}` : null,
        iconPortrait: categoryModel.icon != null ? `${FILES_UPLOAD_CATEGORY_PRODUCT.portrait}${categoryModel.icon}` : null
    }
    return dataReturn
}