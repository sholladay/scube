'use strict';

const S3 = require('aws-sdk/clients/s3');
const camelcaseKeys = require('camelcase-keys');
const joi = require('joi');

const makeCallback = (resolve, reject) => {
    return (err, data) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(data);
    };
};

const capitalize = (str) => {
    return str[0].toUpperCase() + str.substring(1);
};

// Map object keys to the unconventional format expected by the AWS SDK.
const capKeys = (obj) => {
    if (!obj) {
        return obj;
    }

    const target = {};
    Object.keys(obj).forEach((key) => {
        target[capitalize(key)] = obj[key];
    });

    return target;
};

class Scube {
    constructor(option) {
        const config = joi.attempt(option, joi.object().required().keys({
            region    : joi.string().default('us-east-1'),
            delimiter : joi.string().default('/'),
            bucket    : joi.string().required().hostname().min(1),
            publicKey : joi.string().required().token().min(20),
            secretKey : joi.string().required().base64().min(40)
        }));

        this._service = new S3({
            apiVersion      : '2006-03-01',
            region          : config.region,
            accessKeyId     : config.publicKey,
            secretAccessKey : config.secretKey,
            params          : capKeys({
                bucket    : config.bucket,
                delimiter : config.delimiter
            })
        });
    }

    copyObject(param) {
        return new Promise((resolve, reject) => {
            this._service.copyObject(capKeys(param), makeCallback(resolve, reject));
        });
    }

    createBucket(param) {
        return new Promise((resolve, reject) => {
            this._service.createBucket(capKeys(param), makeCallback(resolve, reject));
        }).then(camelcaseKeys);
    }

    deleteBucket(param) {
        return new Promise((resolve, reject) => {
            this._service.deleteBucket(capKeys(param), makeCallback(resolve, reject));
        });
    }

    deleteObject(param) {
        return new Promise((resolve, reject) => {
            this._service.deleteObject(capKeys(param), makeCallback(resolve, reject));
        });
    }

    deleteObjects(param) {
        return new Promise((resolve, reject) => {
            this._service.deleteObjects(capKeys(param), makeCallback(resolve, reject));
        }).then(camelcaseKeys);
    }

    getObject(param) {
        return new Promise((resolve, reject) => {
            this._service.getObject(capKeys(param), makeCallback(resolve, reject));
        });
    }

    getSignedUrl(operation, param) {
        return new Promise((resolve, reject) => {
            this._service.getSignedUrl(operation, capKeys(param), makeCallback(resolve, reject));
        });
    }

    headBucket(param) {
        return new Promise((resolve, reject) => {
            this._service.headBucket(capKeys(param), makeCallback(resolve, reject));
        });
    }

    headObject(param) {
        return new Promise((resolve, reject) => {
            this._service.headObject(capKeys(param), makeCallback(resolve, reject));
        });
    }

    listBuckets(param) {
        return new Promise((resolve, reject) => {
            this._service.listBuckets(capKeys(param), makeCallback(resolve, reject));
        });
    }

    listObjects(param) {
        return new Promise((resolve, reject) => {
            this._service.listObjectsV2(capKeys(param), makeCallback(resolve, reject));
        }).then(camelcaseKeys);
    }

    putObject(param) {
        return new Promise((resolve, reject) => {
            this._service.putObject(capKeys(param), makeCallback(resolve, reject));
        });
    }

    upload(param, option) {
        return new Promise((resolve, reject) => {
            this._service.upload(capKeys(param), option, makeCallback(resolve, reject));
        }).then(camelcaseKeys);
    }

    // Custom methods.

    async deletePrefix(input) {
        const option = Object.assign({}, input, {
            // List all individual objects under the prefix.
            delimiter : ''
        });

        const loop = async (override) => {
            const config = Object.assign(option, override);

            const list = await this.listObjects(config);

            if (list.contents.length > 0) {
                await this.deleteObjects({
                    delete : capKeys({
                        objects : list.contents.map((obj) => {
                            return capKeys({
                                key : obj.Key
                            });
                        })
                    })
                });
            }

            if (list.isTruncated) {
                return loop({ continuationToken : list.nextContinuationToken });
            }
        };
        await loop();
    }

    deleteDir(option) {
        const config = Object.assign({}, option);

        if (!config.prefix.endsWith('/')) {
            config.prefix += '/';
        }

        return this.deletePrefix(config);
    }

    listDir(option) {
        const config = Object.assign({ prefix : '/' }, option);

        if (!config.prefix.endsWith('/')) {
            config.prefix += '/';
        }

        return this.listObjects(config);
    }
}

module.exports = Scube;
