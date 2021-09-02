import file_system from 'fs'
const archiver = require('archiver')
const COMPRESSION_LEVEL = 9

export type PackageCodeInput = {
    location: string
    target: string
    name: string
}

export function packageCode({ location, target, name }: PackageCodeInput) {
    if (!file_system.existsSync(target)) {
        file_system.mkdirSync(target)
    }

    if (target[target.length - 1] !== '/') {
        target = target + '/'
    }

    const archive = archiver('zip', { zlib: { level: COMPRESSION_LEVEL } })
    const stream = file_system.createWriteStream(target + name + '.zip')

    return new Promise((resolve: any, reject) => {
        archive
            .directory(location, false)
            .on('error', (err: any) => reject(err))
            .pipe(stream)

        stream.on('close', () => resolve())
        archive.finalize()
    })
}
