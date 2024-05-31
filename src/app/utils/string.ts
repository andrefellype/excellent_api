export const RemoveSpecialCaracter = (value: string) =>
    (value.length > 0) ? value.replace(/[áàãâä]/ui, 'a').replace(/[éèêë]/ui, 'e').replace(/[íìîï]/ui, 'i')
        .replace(/[óòõôö]/ui, 'o').replace(/[úùûü]/ui, 'u').replace(/[ç]/ui, 'c').replace(/_+/, '_') : ""