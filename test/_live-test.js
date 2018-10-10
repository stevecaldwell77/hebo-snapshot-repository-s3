/*

node _live-test.js --s3-path s3://path/to/somewhere

*/
const AWS = require('aws-sdk');
const assert = require('assert');
const amazonS3URI = require('amazon-s3-uri');
const hardRejection = require('hard-rejection');
const parseArgs = require('minimist');
const shortid = require('shortid');
const SnapshotRepositoryS3 = require('..');

hardRejection();

const argv = parseArgs(process.argv);
const s3Path = argv['s3-path'];
assert(s3Path, 'must specify --s3-path');

try {
    amazonS3URI(s3Path);
} catch (err) {
    throw new Error(`Invalid s3Path ${s3Path}`);
}

const runTest = async s3Path => {
    const s3Client = new AWS.S3();

    const repo = new SnapshotRepositoryS3({
        s3Client,
        s3Path,
    });

    const snapshot = {
        version: 4,
        state: {
            bookName: 'Ulysses',
            author: 'Joyce',
            yearPublished: 1922,
        },
    };

    const bookId = shortid.generate();
    const fetched1 = await repo.getSnapshot('book', bookId);
    assert(fetched1 === undefined);

    await repo.writeSnapshot('book', bookId, snapshot);

    const fetched2 = await repo.getSnapshot('book', bookId);
    assert.deepStrictEqual(fetched2, snapshot, 'fetched result matches input');

    return repo.getS3Location('book', bookId);
};

const stringifyLocation = ({ bucket, key }) => `s3://${bucket}/${key}`;

runTest(s3Path).then(s3Location =>
    console.log(`check ${stringifyLocation(s3Location)}`),
);
