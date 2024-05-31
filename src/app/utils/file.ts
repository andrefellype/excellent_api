import fs from 'fs'
import sharp from 'sharp'

export const VerifyExistsFile = async (urlFile: string): Promise<boolean> => await fs.existsSync(urlFile)

export const CreateDirectory = (directory: string) => { fs.mkdirSync(directory) }

export const CopyFileOriginInNewSize = async (fileOrigin: string, nameFileOrigin: string, fileDestiny: string, nameFileDestiny: string, widthValue: number, heightValue: number) => {
    let statusOrigin = true
    await VerifyExistsFile(`${fileOrigin}/${nameFileOrigin}`).then(async valueVerifyOrigin => { statusOrigin = valueVerifyOrigin })
    if (statusOrigin) {
        await VerifyExistsFile(fileDestiny).then(async statusDestiny => {
            if (!statusDestiny) await fs.mkdirSync(fileDestiny);
            await fs.readFile(`${fileOrigin}/${nameFileOrigin}`, async (err, data) => {
                if (err) {
                    console.error('Erro ao ler o arquivo original:', err);
                    return;
                }

                await sharp(data).resize(widthValue, heightValue).toBuffer().then(async resizedData => {
                    await fs.writeFile(`${fileDestiny}${nameFileDestiny}`, resizedData, err => {
                        if (err) {
                            console.error('Erro ao escrever o arquivo redimensionado:', err);
                            return;
                        }
                    });
                }).catch(err => {
                    console.error('Erro ao redimensionar a imagem:', err);
                });
            });
        })
    }
}

export const ResizeImage = (urlImage: { original: string, miniature: string, thumbnail: string, portrait: string, landscape: string } | null, nameFile: string): Promise<void> => {
    return new Promise(async (resolve, _) => {
        if (urlImage != null) {
            await CopyFileOriginInNewSize(`public/upload${urlImage.original}`, nameFile, `public/upload${urlImage.miniature}`, nameFile, 100, 100)
            await CopyFileOriginInNewSize(`public/upload${urlImage.original}`, nameFile, `public/upload${urlImage.thumbnail}`, nameFile, 400, 400)
            await CopyFileOriginInNewSize(`public/upload${urlImage.original}`, nameFile, `public/upload${urlImage.portrait}`, nameFile, 750, 750)
            await CopyFileOriginInNewSize(`public/upload${urlImage.original}`, nameFile, `public/upload${urlImage.landscape}`, nameFile, 1250, 1250)
        }
        resolve()
    })
}

export const CopyFileOrigin = async (fileOrigin: string, nameFileOrigin: string, fileDestiny: string, nameFileDestiny: string) => {
    let statusOrigin = true
    await VerifyExistsFile(`${fileOrigin}/${nameFileOrigin}`).then(async valueVerifyOrigin => { statusOrigin = valueVerifyOrigin })
    if (statusOrigin) {
        let statusDestiny = true
        await VerifyExistsFile(fileDestiny).then(async valuesVeryfyDestiny => { statusDestiny = valuesVeryfyDestiny })
        if (!statusDestiny) await fs.mkdirSync(fileDestiny)
        await fs.copyFileSync(`${fileOrigin}/${nameFileOrigin}`, `${fileDestiny}/${nameFileDestiny}`)
    }
}

export const DestroyFile = async (urlFile: string) => { await fs.unlinkSync(urlFile) }

export const DestroyFileByArrayLocalStorage = async (urlFileStorage: string[], nameFile: string) => {
    for (let u = 0; u < urlFileStorage.length; u++)
        if (await VerifyExistsFile(`${urlFileStorage[u]}/${nameFile}`)) await DestroyFile(`${urlFileStorage[u]}/${nameFile}`)
}

export const GetListFilesInUrl = async (urlFile: string): Promise<string[]> => (await VerifyExistsFile(urlFile)) ? await fs.readdirSync(urlFile) : []