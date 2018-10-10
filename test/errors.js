const test = require('ava');
const shortid = require('shortid');
const { noop } = require('lodash');
const SnapshotRepositoryS3 = require('..');

test('unexpected s3 errors propogated', async t => {
    const s3Client = {
        putObject: noop,
        getObject: ({ Key: key }) => ({
            promise: () => {
                if (key.match(/book\//)) {
                    const error = new Error('This error should be handled');
                    error.code = 'NoSuchKey';
                    throw error;
                }
                throw new Error('something went wrong');
            },
        }),
    };

    const repo = new SnapshotRepositoryS3({
        s3Client,
        s3Path: 's3://whatever/',
    });

    const bookId = shortid.generate();
    await t.notThrows(
        repo.getSnapshot('book', bookId),
        'NoSuchKey S3 error handled',
    );

    const authorId = shortid.generate();
    await t.throws(
        repo.getSnapshot('author', authorId),
        /something went wrong/,
        'Unexpected S3 error propagated',
    );
});
