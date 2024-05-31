export interface ClientOpenInformationByCnpjUseCase {
    execute(cnpj: string): Promise<{
        name: string | null, email: string | null, foundation: string | null,
        addressCodePostal: string | null, addressStreet: string | null, addressNumber: string | null,
        addressDistrict: string | null
    }>
}