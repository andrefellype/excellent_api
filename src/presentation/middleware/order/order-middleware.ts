import { ClientRepository, OrderRepository, ProductRepository } from "@data/interfaces/repositories";
import { OrderDeleteById, OrderDeleteByIds, OrderOpenAll, OrderRegister } from "@domain/use-cases";
import { OrderRouter } from "@routes";
import { OrderValidation, } from "@validation";

export const orderMiddleWare = (
    orderRepository: OrderRepository,
    productRepository: ProductRepository,
    clientRepository: ClientRepository
) => OrderRouter(
    new OrderValidation(),
    new OrderOpenAll(orderRepository, productRepository, clientRepository),
    new OrderRegister(orderRepository),
    new OrderDeleteById(orderRepository),
    new OrderDeleteByIds(orderRepository)
)