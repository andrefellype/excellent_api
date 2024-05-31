export const ValidateEmail = (emailValue: string): boolean => {
    if (emailValue.split(".").length > 3) return false
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!emailValue) return false
    if (emailValue.length > 254) return false
    var valid = emailRegex.test(emailValue)
    if (!valid) return false
    var parts = emailValue.split("@")
    if (parts[0].length > 64) return false
    var domainParts = parts[1].split(".")
    if (domainParts.some(function (part) { return part.length > 63; })) return false
    return true
}

export const ValidateCellphone = (cellphoneValue: string): boolean => { return !(cellphoneValue.length != 11 || cellphoneValue.replace(/[^\d]+/g, '').length != cellphoneValue.length) }

export const ValidateCnpj = (cnpj: String): boolean => {
    cnpj = cnpj.replace(/[^\d]+/g, '')
    if (cnpj == '') return false
    if (cnpj.length != 14) return false
    if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222"
        || cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555"
        || cnpj == "66666666666666" || cnpj == "77777777777777" || cnpj == "88888888888888"
        || cnpj == "99999999999999") return false
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    let digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7
    for (let i = tamanho; i >= 1; i--) {
        soma += parseFloat(numeros.charAt(tamanho - i)) * pos--
        if (pos < 2) pos = 9
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado != parseFloat(digitos.charAt(0))) return false

    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7
    for (let i = tamanho; i >= 1; i--) {
        soma += parseFloat(numeros.charAt(tamanho - i)) * pos--
        if (pos < 2) pos = 9
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado != parseFloat(digitos.charAt(1))) return false
    return true
}