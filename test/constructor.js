const test = require('ava');
const { noop } = require('lodash');
const SnapshotRepositoryS3 = require('..');
const makeS3Client = require('./helpers/s3-client');

test('constructor - no params', t => {
    t.throws(() => new SnapshotRepositoryS3(), Error, 'no params throws error');

    t.throws(
        () => new SnapshotRepositoryS3({}),
        Error,
        'empty params throws error',
    );
});

test('constructor - s3Client', t => {
    const s3Path = 's3://mybucket/foo';
    t.throws(
        () => new SnapshotRepositoryS3({ s3Path }),
        /s3Client required/,
        's3Client required',
    );

    t.throws(
        () =>
            new SnapshotRepositoryS3({ s3Path, s3Client: { putObject: noop } }),
        /s3Client must provide getObject()/,
        'getObject required',
    );

    t.throws(
        () =>
            new SnapshotRepositoryS3({ s3Path, s3Client: { getObject: noop } }),
        /s3Client must provide putObject()/,
        'putObject required',
    );

    t.notThrows(
        () =>
            new SnapshotRepositoryS3({
                s3Path,
                s3Client: { getObject: noop, putObject: noop },
            }),
        'valid params lives',
    );
});

test('constructor - s3Path', t => {
    const s3Client = makeS3Client();

    t.throws(
        () => new SnapshotRepositoryS3({ s3Client }),
        /s3Path required/,
        's3Path required',
    );

    t.throws(
        () =>
            new SnapshotRepositoryS3({
                s3Client,
                s3Path: 'asdfasdf',
            }),
        /invalid s3Path asdfasdf/,
        's3Path validated',
    );

    t.notThrows(
        () =>
            new SnapshotRepositoryS3({
                s3Client,
                s3Path: 's3://mybucket',
            }),
        's3Path can be root of bucket',
    );

    t.notThrows(
        () =>
            new SnapshotRepositoryS3({
                s3Client,
                s3Path: 's3://mybucket/mykey',
            }),
        's3Path can have key',
    );
});
