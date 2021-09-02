import { makeFolders } from './makeFolders'
import file_system from 'fs'

test('makeFolders works as expected', () => {
    // make folders
    makeFolders({
        start: __dirname,
        folders: ['.rise', 'two', 'three']
    })

    // confirm folder result
    const x = file_system.readdirSync(__dirname + '/.rise/two')
    expect(x).toEqual(['three'])

    // run again and confirm no error occurs
    makeFolders({
        start: __dirname,
        folders: ['.rise', 'two', 'three']
    })

    // cleanup
    file_system.rmdirSync(__dirname + '/.rise/two/three')
    file_system.rmdirSync(__dirname + '/.rise/two')
    file_system.rmdirSync(__dirname + '/.rise')
})
