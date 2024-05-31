import { VALUES_APP } from '@utils';
import server from '@/server'
import { createConnection } from 'mysql2/promise';
import { categoryProductMiddleWare, clientMiddleWare, orderMiddleWare, productMiddleWare, userAuthMiddleWare, userMiddleWare } from '@middleware';
import { CategoryProductRepositoryImpl, ClientRepositoryImpl, OrderRepositoryImpl, ProductRepositoryImpl, UserRepositoryImpl } from '@data/repositories';
import { CategoryProductDataSourceImpl, ClientDataSourceImpl, ProductDataSourceImpl, UserDataSourceImpl } from '@data/data-sources/mysql';
import { OrderDataSourceImpl } from '@data/data-sources/mysql/order/order-data-source';

async function getConnectionMysql() {
    const conDatabase = await createConnection({
        host: VALUES_APP().CONFIGURATION_DATABASE.HOST, port: VALUES_APP().CONFIGURATION_DATABASE.PORT, user: VALUES_APP().CONFIGURATION_DATABASE.USER,
        password: VALUES_APP().CONFIGURATION_DATABASE.PASSWORD, database: VALUES_APP().CONFIGURATION_DATABASE.DATABASE
    })
    return conDatabase
}

(async () => {
    const dataSourceMysqlDatabase = await getConnectionMysql();

    const userRepository = new UserRepositoryImpl(new UserDataSourceImpl(dataSourceMysqlDatabase))
    const clientRepository = new ClientRepositoryImpl(new ClientDataSourceImpl(dataSourceMysqlDatabase))
    const categoryProductRepository = new CategoryProductRepositoryImpl(new CategoryProductDataSourceImpl(dataSourceMysqlDatabase))
    const productRepository = new ProductRepositoryImpl(new ProductDataSourceImpl(dataSourceMysqlDatabase))
    const orderRepository = new OrderRepositoryImpl(new OrderDataSourceImpl(dataSourceMysqlDatabase))

    server.use("/user", userAuthMiddleWare(userRepository))
    server.use("/user", userMiddleWare(userRepository))

    server.use("/client", clientMiddleWare(clientRepository))

    server.use("/category/product", categoryProductMiddleWare(categoryProductRepository))

    server.use("/product", productMiddleWare(productRepository))

    server.use("/order", orderMiddleWare(orderRepository, productRepository, clientRepository))

    server.listen(VALUES_APP().API.PORT)
})()