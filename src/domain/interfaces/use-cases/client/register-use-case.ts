export interface ClientRegisterUseCase {
    execute(value: { name: string, documentNumber: string, email: string }): Promise<void>;
}