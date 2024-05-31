import { ClientRepository, OrderRepository, ProductRepository } from "@data/interfaces/repositories"
import { OrderOpenAllUseCase } from "@domain/interfaces/use-cases"
import { ClientEntity, ClientRequest } from "@domain/models/client"
import { OrderEntity, OrderRequest } from "@domain/models/order"
import { ProductEntity, ProductRequest } from "@domain/models/product"

export class OrderOpenAll implements OrderOpenAllUseCase {
    private orderRepository: OrderRepository
    private productRepository: ProductRepository
    private clientRepository: ClientRepository
    constructor(orderRepository: OrderRepository, productRepository: ProductRepository, clientRepository: ClientRepository) {
        this.orderRepository = orderRepository
        this.productRepository = productRepository
        this.clientRepository = clientRepository
    }

    execute(): Promise<OrderEntity[]> {
        return new Promise((resolve, reject) => {
            this.orderRepository.findAll().then(async valuesOrder => {
                const orders: OrderEntity[] = []
                for (let o = 0; o < valuesOrder.length; o++) {
                    let product: ProductEntity | null = null
                    await this.productRepository.findOneById(valuesOrder[o].product_id).then(async valueProduct => {
                        product = ProductRequest(valueProduct)
                    })
                    let client: ClientEntity | null = null
                    await this.clientRepository.findOneById(valuesOrder[o].client_id).then(async valueClient => {
                        client = ClientRequest(valueClient)
                    })
                    orders.push(OrderRequest(valuesOrder[o], product, client))
                }
                resolve(orders)
            }).catch(err => reject(err))
        })
    }
}