const autoBind = require('auto-bind');
const amazonS3URI = require('amazon-s3-uri');

class SnapshotRepositoryS3 {
    constructor({ s3Client, s3Path }) {
        this.s3Client = s3Client;
        this.s3Path = s3Path;
        const { bucket, key } = amazonS3URI(s3Path);
        this.s3Bucket = bucket;
        this.s3KeyPrefix = key.replace(/\/$/, '');
        autoBind(this);
    }

    getS3Location(aggregateName, aggregateId) {
        return {
            bucket: this.s3Bucket,
            key: `${this.s3KeyPrefix}/${aggregateName}/${aggregateId}.json`,
        };
    }

    async getSnapshot(aggregateName, aggregateId) {
        const { bucket, key } = this.getS3Location(aggregateName, aggregateId);
        const response = await this.s3Client
            .getObject({
                Bucket: bucket,
                Key: key,
            })
            .promise();
        const { Body: body } = response;
        return body ? JSON.parse(body) : undefined;
    }

    async writeSnapshot(aggregateName, aggregateId, snapshot) {
        const { bucket, key } = this.getS3Location(aggregateName, aggregateId);
        await this.s3Client
            .putObject({
                Bucket: bucket,
                Key: key,
                Body: JSON.stringify(snapshot),
            })
            .promise();
        return true;
    }
}

module.exports = SnapshotRepositoryS3;
