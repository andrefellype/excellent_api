import { ClientOpenInformationByCnpjUseCase } from "@domain/interfaces/use-cases";
import axios from "axios";

export class ClientOpenInformationByCnpj implements ClientOpenInformationByCnpjUseCase {
    execute(cnpj: string): Promise<{ name: string; email: string; foundation: string; addressCodePostal: string; addressStreet: string; addressNumber: string; addressDistrict: string; }> {
        return new Promise((resolve, reject) => {
            const api = axios.create({ baseURL: "https://publica.cnpj.ws/" })
            api.get(`cnpj/${cnpj}/`).then(response => {
                const information: {
                    name: string | null, email: string | null, foundation: string | null,
                    addressCodePostal: string | null, addressStreet: string | null, addressNumber: string | null,
                    addressDistrict: string | null
                } | null = {
                    name: response.data.estabelecimento.nome_fantasia,
                    email: response.data.estabelecimento.email,
                    foundation: response.data.estabelecimento.data_inicio_atividade,
                    addressCodePostal: response.data.estabelecimento.cep,
                    addressStreet: response.data.estabelecimento.logradouro,
                    addressNumber: response.data.estabelecimento.numero,
                    addressDistrict: response.data.estabelecimento.bairro
                }
                resolve(information)
            }).catch((err) => {
                if (typeof err.response != "undefined" && typeof err.response.data != "undefined" && typeof err.response.data.detalhes != "undefined")
                    reject(err.response.data.detalhes)
                else reject(err)
            })
        })
    }
}