# scube [![Build status for Scube](https://travis-ci.com/sholladay/scube.svg?branch=master "Build Status")](https://travis-ci.com/sholladay/scube "Builds")

> Manage your [S3](https://aws.amazon.com/s3/) buckets

Scube is just a thin convenience wrapper around the [AWS SDK](https://github.com/aws/aws-sdk-js), specifically for S3.

## Why?

 - Easier to use with [`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#Description) & [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). All methods return a `Promise`, without the need to call `.promise()` every time, so your code remains [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).
 - Uses idiomatic, camel case JavaScript property names (e.g. `bucket`), unlike the official SDK, which uses Pascal case names (e.g. `Bucket`).
 - Encourages best practices, like hostname compliant bucket names, by requiring and validating certain configuration in the constructor, while still allowing you to override these for each request.
 - Provides helpful utilities and default configuration for simulating directories on S3 with `/` as a separator.

## Install

```sh
npm install scube
```

## Usage

Scube uses the philosophy that apps generally want to perform actions on a single bucket, so we force you to set that bucket as the default and then use the Scube instance to represent the bucket.

Below, we create `my-bucket` on S3.

```js
const Scube = require('scube');

const myBucket = new Scube({
    bucket    : 'my-bucket',
    publicKey : process.env.AWS_ACCESS_KEY_ID,
    secretKey : process.env.AWS_SECRET_ACCESS_KEY
});
myBucket.createBucket().then((data) => {
    console.log('Bucket created:', data.location);
});
```
_Note that you can always pass `bucket` to each call to override the default bucket, but we encourage you to make a new Scube instance instead.

You can also work with directories as first-class citizens.

```js
myBucket.listDir({ prefix : 'foo' }).then((data) => {
    console.log('Directory contents:', data.contents);
});
```

Delete a directory.

```js
myBucket.deleteDir({ prefix : 'foo' }).then((data) => {
    console.log('Directory deleted:', data.prefix);
});
```

## API

Please see Amazon's [API documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html) for details on the option and response properties.

### new Scube(option)

Returns a new [instance](#instance).

#### option

Type: `object`

The default configuration for all client actions. You can override its values for specific calls, if needed.

##### bucket

Type: `string`

The bucket name to use. A bucket is a unique, worldwide namespace to store your data in. Choose it carefully.

##### delimiter

Type: `string`<br>
Default: `/`

The delimiter character to use. Helpful to group together keys starting with a `prefix` not followed by a `delimiter`.

##### forcePathStyle

Type: `boolean`<br>
Default: `false`

Whether to use path style requests, as in `s3.amazonaws.com/<bucket>` instead of `<bucket>.s3.amazonaws.com`.

##### publicKey

Type: `string`

The public part of your credential keypair for authenticating with AWS.

##### region

Type: `string`<br>
Default: `us-east-1`

The availability zone for your bucket.

##### secretKey

Type: `string`

The private part of your credential keypair for authenticating with AWS.

### Instance

Most of the official SDK methods are exposed via an equivalent `Promise`-based counterpart. The ones below are unique to this library.

#### .listDir(option)

List all keys within the `option.prefix` directory.

#### .deletePrefix(option)

Delete all keys that start with `option.prefix`.

#### .deleteDir(option)

Delete all keys within the `option.prefix` directory.

#### .s3

The underlying AWS SDK being used. This is useful when you want to use streams instead of Promises. Note that if you use streams a lot, you are probably better off just using the AWS SDK directly instead of via Scube.

## Related

 - [hapi-s3](https://github.com/sholladay/hapi-s3) - Use [Amazon S3](https://aws.amazon.com/s3/) in your [hapi](https://hapijs.com) server
 - [delivr](https://github.com/sholladay/delivr) - Build your code and ship it to S3
 - [build-files](https://github.com/sholladay/build-files) - Read the files from your build
 - [build-keys](https://github.com/sholladay/build-keys) - Get the paths of files from your build

## Contributing

See our [contributing guidelines](https://github.com/sholladay/scube/blob/master/CONTRIBUTING.md "Guidelines for participating in this project") for more details.

1. [Fork it](https://github.com/sholladay/scube/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/scube/compare "Submit code to this project for review").

## License

[MPL-2.0](https://github.com/sholladay/scube/blob/master/LICENSE "License for scube") © [Seth Holladay](https://seth-holladay.com "Author of scube")

Go make something, dang it.
