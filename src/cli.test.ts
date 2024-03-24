import * as fs from 'fs'
import { ExecException, exec } from 'child_process'
import {
    componentName,
    sandboxDirName,
    targetDirectory,
} from './utils/components/mocks'

const cli = (args: string) => {
    return new Promise<{
        code: number
        error: ExecException | null
        stdout: string
        stderr: string
    }>((resolve) => {
        exec(`ts-node src/index.ts ${args}`, (error, stdout, stderr) => {
            resolve({
                code: error && error.code ? error.code : 0,
                error,
                stdout,
                stderr,
            })
        })
    })
}

describe('Test the cli commands', () => {
    beforeAll(() => {
        fs.rmSync(targetDirectory, { recursive: true, force: true })
    })

    afterAll(() => {
        fs.rmSync(targetDirectory, { recursive: true, force: true })
    })

    it('should execute hi command correctly', async () => {
        const result = await cli('hi')
        expect(result.stdout).toEqual('Hello from react-add-new! 👋\n')
    })

    it('should execute `component` command & arguments correctly', async () => {
        const result = await cli(
            `component -n ${componentName} -p ${sandboxDirName}`
        )

        expect(result.stdout).toEqual(
            `✨ Generating new component ${componentName} in ./${sandboxDirName}...\n` +
                '\n' +
                'Component has been successfully created!\n' +
                '\n' +
                'Happy coding 🎉\n'
        )
    })
})
