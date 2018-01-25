import test from 'ava';
import Scube from '.';

test('basics', (t) => {
    const client = new Scube({
        bucket    : 'my-bucket',
        publicKey : 'anythingjustaslongasitworks',
        secretKey : 'c29vb29vb29vb29vb29vb29vb29vb29vb29sb25n'
    });
    t.is(typeof client.upload, 'function');
    t.is(typeof client.deletePrefix, 'function');
    t.is(typeof client.deleteDir, 'function');
    t.is(typeof client.listDir, 'function');
    t.is(typeof client.s3.upload, 'function');
});

test('throws if credentials are valid but wrong', async (t) => {
    const s3 = new Scube({
        bucket    : 'my-bucket',
        publicKey : 'anythingjustaslongasitworks',
        secretKey : 'c29vb29vb29vb29vb29vb29vb29vb29vb29sb25n'
    });
    const error = await t.throws(s3.listDir());
    t.is(error.message, 'The AWS Access Key Id you provided does not exist in our records.');
});
