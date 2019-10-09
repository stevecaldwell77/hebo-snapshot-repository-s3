const assert = require('assert');
const isFunction = require('lodash/isFunction');
const autoBind = require('auto-bind');
const amazonS3URI = require('amazon-s3-uri');

const addTrailingSlash = str => (str.match(/\/$/) ? str : `${str}/`);

class SnapshotRepositoryS3 {
    constructor({ s3Client, s3Path } = {}) {
        assert(s3Client, 'SnapshotRepositoryS3: s3Client required');
        assert(
            isFunction(s3Client.getObject),
            'SnapshotRepositoryS3: s3Client must provide getObject()',
        );
        assert(
            isFunction(s3Client.putObject),
            'SnapshotRepositoryS3: s3Client must provide putObject()',
        );
        assert(s3Path, 'SnapshotRepositoryS3: s3Path required');

        let bucket;
        let key;
        try {
            const parsedUri = amazonS3URI(s3Path);
            bucket = parsedUri.bucket;
            key = parsedUri.key;
        } catch {
            throw new Error(`SnapshotRepositoryS3: invalid s3Path ${s3Path}`);
        }

        this.s3Client = s3Client;
        this.s3Path = s3Path;
        this.s3Bucket = bucket;
        this.s3Key = key;
        autoBind(this);
    }

    getS3Location(aggregateName, aggregateId) {
        const key = this.s3Key;
        const keyPrefix = key ? addTrailingSlash(key) : '';
        return {
            bucket: this.s3Bucket,
            key: `${keyPrefix}${aggregateName}/${aggregateId}.json`,
        };
    }

    async getSnapshot(aggregateName, aggregateId) {
        const { bucket, key } = this.getS3Location(aggregateName, aggregateId);
        let response;
        try {
            response = await this.s3Client
                .getObject({
                    Bucket: bucket,
                    Key: key,
                })
                .promise();
        } catch (error) {
            if (error.code === 'NoSuchKey') return undefined;
            throw error;
        }

        const { Body: body } = response;
        return JSON.parse(body);
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
