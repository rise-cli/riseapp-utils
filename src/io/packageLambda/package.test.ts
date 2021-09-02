import { packageCode } from './package'
import file_system from 'fs'

test('package works', () => {
    packageCode({
        location: __dirname + '/_test/exampleFunction',
        target: __dirname + '/_test/',
        name: 'myFunction'
    })

    const x = file_system.readdirSync(__dirname + '/_test')
    expect(x.includes('myFunction.zip')).toBeTruthy()

    file_system.rmSync(__dirname + '/_test/myFunction.zip')
})
