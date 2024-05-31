import { ClientRepository } from "@data/interfaces/repositories";
import { ClientDeleteById, ClientDeleteByIds, ClientOpenAll, ClientOpenById, ClientOpenInformationByCnpj, ClientRegister, ClientUpdateAllById } from "@domain/use-cases";
import { ClientRouter } from "@routes";
import { ClientValidation } from "@validation";

export const clientMiddleWare = (clientRepository: ClientRepository) => ClientRouter(
    clientRepository, new ClientValidation(),
    new ClientRegister(clientRepository),
    new ClientOpenAll(clientRepository),
    new ClientOpenById(clientRepository),
    new ClientUpdateAllById(clientRepository),
    new ClientDeleteById(clientRepository),
    new ClientDeleteByIds(clientRepository),
    new ClientOpenInformationByCnpj()
)