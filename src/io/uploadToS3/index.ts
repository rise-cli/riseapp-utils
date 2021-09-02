type UploadInput = {
    AWS: any
    file: any
    bucket: string
    key: string
}

type UploadOutput = {
    status: 'success' | 'no-bucket' | 'error'
    message?: string
}

async function upload(props: UploadInput): Promise<UploadOutput> {
    const s3 = new props.AWS.S3()
    const params = {
        Body: props.file,
        Bucket: props.bucket,
        Key: props.key
    }

    try {
        await s3.putObject(params).promise()
        return {
            status: 'success'
        }
    } catch (e: any) {
        if (e.message === 'The specified bucket does not exist') {
            return {
                status: 'no-bucket'
            }
        }

        return {
            status: 'error',
            message: e.message
        }
    }
}

type CreateInput = {
    AWS: any
    bucket: string
    region: string
}

async function createBucket(props: CreateInput) {
    const s3 = new props.AWS.S3()
    let createParams = {}
    if (props.region !== 'us-east-1') {
        createParams = {
            Bucket: props.bucket,
            CreateBucketConfiguration: {
                LocationConstraint: props.region
            }
        }
    } else {
        createParams = {
            Bucket: props.bucket
        }
    }
    await s3.createBucket(createParams).promise()
}

export type UploadToS3Input = {
    file: any
    bucket: string
    key: string
    region: string
}

export const uploadToS3 = (AWS: any) => async (props: UploadToS3Input) => {
    const result = await upload({
        AWS: AWS,
        file: props.file,
        bucket: props.bucket,
        key: props.key
    })

    if (result.status === 'no-bucket') {
        await createBucket({
            AWS: AWS,
            bucket: props.bucket,
            region: props.region
        })

        await upload({
            AWS: AWS,
            file: props.file,
            bucket: props.bucket,
            key: props.key
        })
    }
}
