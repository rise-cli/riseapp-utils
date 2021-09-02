// IO
import { makeFolders } from './io/packageLambda/makeFolders'
import { packageCode } from './io/packageLambda/package'
import { uploadToS3 } from './io/uploadToS3'
import { setConfig, setCredentials } from './io/awsCredentials'
import {
    createStack,
    updateStack,
    removeStack,
    getStackInfo,
    getStackResourceStatus
} from './io/cloudFormation'
import {
    writeFile,
    getDirectories,
    getFile,
    getJsFile,
    getProjectPath
} from './io/filesystem'
import { writeToTerminal, clearTerminal } from './io/terminal'

// CLI Actions
import { startDeployment } from './cliActions/appDeploy/deploy_stack'
import { getDeployStatus } from './cliActions/appDeploy/get_deploy_status'
import { removeDeployment } from './cliActions/appRemove/remove_stack'
import { getRemoveStatus } from './cliActions/appRemove/get_remove_status'

export default {
    io: {
        s3: { uploadToS3 },
        package: {
            makeFolders,
            packageCode
        },
        credentials: {
            setConfig,
            setCredentials
        },
        cloudFormation: {
            createStack,
            updateStack,
            removeStack,
            getStackInfo,
            getStackResourceStatus
        },
        fileSystem: {
            writeFile,
            getDirectories,
            getFile,
            getJsFile,
            getProjectPath
        },
        terminal: {
            writeToTerminal,
            clearTerminal
        }
    },
    cliActions: {
        startDeployment: async (props: {
            AWS: any
            name: string
            template: string
        }) => {
            await startDeployment({
                io: {
                    create: createStack(props.AWS),
                    update: updateStack(props.AWS)
                },
                name: props.name,
                template: props.template
            })
        },
        getDeployStatus: async (props: {
            AWS: any
            name: string
            minRetryInterval: number
            maxRetryInterval: number
            backoffRate: number
            maxRetries: number
        }) => {
            await getDeployStatus({
                io: {
                    getInfo: async () => getStackInfo(props.AWS)(props.name),
                    getResources: async () =>
                        getStackResourceStatus(props.AWS)(props.name),
                    terminal: {
                        write: writeToTerminal,
                        clear: clearTerminal
                    }
                },
                config: {
                    stackName: props.name,
                    minRetryInterval: 1000,
                    maxRetryInterval: 5000,
                    backoffRate: 1.2,
                    maxRetries: 50
                }
            })
        },
        removeDeployment: async (props: { AWS: any; name: string }) => {
            await removeDeployment({
                io: {
                    remove: removeStack(props.AWS)
                },
                name: props.name
            })
        },
        getRemoveStatus: async (props: {
            AWS: any
            name: string
            minRetryInterval: number
            maxRetryInterval: number
            backoffRate: number
            maxRetries: number
        }) => {
            return await getRemoveStatus({
                io: {
                    getInfo: async () => getStackInfo(props.AWS)(props.name)
                },
                config: {
                    stackName: props.name,
                    minRetryInterval: 1000,
                    maxRetryInterval: 5000,
                    backoffRate: 1.2,
                    maxRetries: 20
                }
            })
        }
    }
}
