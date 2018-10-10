const noSuchKeyError = () => {
    const error = new Error('NoSuchKey: The specified key does not exist.');
    error.code = 'NoSuchKey';
    return error;
};

const makeS3Client = () => {
    const buckets = {};
    const initBucket = bucket => {
        buckets[bucket] = buckets[bucket] || {};
    };
    return {
        buckets: {},
        putObject: ({ Body: body, Bucket: bucket, Key: key }) => ({
            promise: () => {
                initBucket(bucket);
                buckets[bucket][key] = body;
                return Promise.resolve({});
            },
        }),
        getObject: ({ Bucket: bucket, Key: key }) => ({
            promise: () => {
                initBucket(bucket);
                const body = buckets[bucket][key];
                return body
                    ? Promise.resolve({ Body: body })
                    : Promise.reject(noSuchKeyError());
            },
        }),
    };
};

module.exports = makeS3Client;
