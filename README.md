# scube [![Build status for scube](https://img.shields.io/circleci/project/sholladay/scube/master.svg "Build Status")](https://circleci.com/gh/sholladay/scube "Builds")

> Manage your S3 buckets

## Why?

 - High-level, [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based API.
 - Fixes the quirks of the [official SDK](https://github.com/aws/aws-sdk-js).
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
    bucket : 'my-bucket'
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

### Scube(option)

#### option

Type: `object`

Default configuration for all client actions.

##### bucket

Type: `string`

The default bucket name to use. This is a global (worldwide) namespace to store your data in.

##### delimiter

Type: `string`<br>
Default: `/`

The default delimiter character to use. Helpful to group together keys starting with a `prefix` not followed by a `delimiter`.

### Instance

Most of the official SDK methods are exposed via an equivalent `Promise`-based counterpart. The ones below are unique to this library.

#### .listDir(option)

List all keys within the `option.prefix` directory.

#### .deletePrefix(option)

Delete all keys that start with `option.prefix`.

#### .deleteDir(option)

Delete all keys within the `option.prefix` directory.

## Related

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
