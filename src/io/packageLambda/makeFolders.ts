import file_system from 'fs'

type MakeFoldersInput = {
    start: string
    folders: string[]
}

export function makeFolders(props: MakeFoldersInput) {
    let path = props.start

    for (const folder of props.folders) {
        path = path + '/' + folder

        try {
            file_system.mkdirSync(path)
        } catch (e: any) {
            if (!e.message.startsWith('EEXIST')) {
                throw new Error(e)
            }
        }
    }
}
