export interface CategoryProductUpdateAllByIdUseCase {
    execute(categoryId: number, value: { name: string, statusUpload: number, icon: string | null }): Promise<void>
}