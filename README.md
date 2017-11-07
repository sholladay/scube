# scube [![Build status for scube](https://img.shields.io/circleci/project/sholladay/scube/master.svg "Build Status")](https://circleci.com/gh/sholladay/scube "Builds")

> Manage your [S3](https://aws.amazon.com/s3/) buckets

## Why?

 - High-level, [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based API.
 - Uses objects with camelcase keys, unlike the [official SDK](https://github.com/aws/aws-sdk-js).
 - Enforces best practices and sensible defaults.

## Install

```sh
npm install scube --save
```

## Usage

Get it into your program.

```js
const Scube = require('scube');
```

Create a new S3 client.

```js
const myBucket = new Scube({
    bucket    : 'my-bucket',
    publicKey : process.env.AWS_ACCESS_KEY_ID,
    secretKey : process.env.AWS_SECRET_ACCESS_KEY
});
```

Create a bucket.

```js
myBucket.createBucket().then((data) => {
    console.log('Bucket created:', data.location);
});
```

You can also work with directories as first-class citizens.

```js
myBucket.listDir({ prefix : 'foo' }).then((data) => {
    console.log('Directory contents:', data.contents);
})
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

Default configuration for all client actions. You can override its values for specific calls, if needed.

##### bucket

Type: `string`

The default bucket name to use. A bucket is a unique, worldwide namespace to store your data in. Choose it carefully.

##### region

Type: `string`<br>
Default: `us-east-1`

The availability zone for your bucket.

##### delimiter

Type: `string`<br>
Default: `/`

The default delimiter character to use. Helpful to group together keys starting with a `prefix` not followed by a `delimiter`.

##### publicKey

Type: `string`

The public part of your credential keypair for authenticating with AWS.

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

## Related

 - [hapi-s3](https://github.com/sholladay/hapi-s3) - Use Amazon S3 in server routes
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
