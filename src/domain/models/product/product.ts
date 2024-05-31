import { FILES_UPLOAD_PRODUCT } from "./constants";

export interface ProductModel {
    id: number;
    description: string;
    gross_price: string | null;
    sale_price: string | null;
    photo: string | null;
}

export interface ProductEntity {
    id: number;
    description: string;
    grossPrice: string | null;
    salePrice: string | null;
    photo: string | null;
    photoMiniature: string | null;
    photoPortrait: string | null;
}

export const ProductRequest = (productModel: ProductModel): ProductEntity => {
    const dataReturn: ProductEntity = {
        id: productModel.id,
        description: productModel.description,
        grossPrice: productModel.gross_price,
        salePrice: productModel.sale_price,
        photo: productModel.photo,
        photoMiniature: productModel.photo != null ? `${FILES_UPLOAD_PRODUCT.miniature}${productModel.photo}` : null,
        photoPortrait: productModel.photo != null ? `${FILES_UPLOAD_PRODUCT.portrait}${productModel.photo}` : null
    }
    return dataReturn
}