export interface ClientUpdateAllByIdUseCase {
    execute(id: number, value: { name: string, email: string }): Promise<void>;
}