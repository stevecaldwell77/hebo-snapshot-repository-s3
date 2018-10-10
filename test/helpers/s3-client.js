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
                return Promise.resolve({
                    Body: buckets[bucket][key],
                });
            },
        }),
    };
};

module.exports = makeS3Client;
