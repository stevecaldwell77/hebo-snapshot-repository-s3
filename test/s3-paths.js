const test = require('ava');
const shortid = require('shortid');
const SnapshotRepositoryS3 = require('..');
const makeS3Client = require('./helpers/s3-client');

const runTest = async (s3Path, t) => {
    const bookId = shortid.generate();
    const repo = new SnapshotRepositoryS3({
        s3Client: makeS3Client(),
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

    t.true(
        await repo.writeSnapshot('book', bookId, snapshot),
        `writeSnapshot returns true after writing snapshot`,
    );

    t.deepEqual(
        await repo.getSnapshot('book', bookId),
        snapshot,
        `getSnapshot() finds snapshot stored by writeSnapshot()`,
    );
};

test('bucket only, no trailing slash', async t => {
    await runTest('s3://mybucket', t);
});

test('bucket only, with trailing slash', async t => {
    await runTest('s3://mybucket/', t);
});

test('with key, no trailing slash', async t => {
    await runTest('s3://mybucket/mykey', t);
});

test('with key, with trailing slash', async t => {
    await runTest('s3://mybucket/mykey/', t);
});
