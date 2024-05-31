export interface ProductUpdateAllByIdUseCase {
    execute(productId: number, value: { description: string, grossPrice: string | null, salePrice: string | null, statusUpload: number, photo: string | null }): Promise<void>
}