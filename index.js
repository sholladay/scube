'use strict';

const S3 = require('aws-sdk/clients/s3');
const camelcaseKeys = require('camelcase-keys');
const joi = require('joi');

const capitalize = (str) => {
    return str[0].toUpperCase() + str.substring(1);
};

// Map object keys to the unconventional format expected by the AWS SDK.
const capKeys = (obj) => {
    return obj && Object.keys(obj).reduce((target, key) => {
        target[capitalize(key)] = obj[key];
        return target;
    }, {});
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

        this.s3 = new S3({
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
        return this.s3.copyObject(capKeys(param)).promise();
    }

    createBucket(param) {
        return this.s3.createBucket(capKeys(param)).promise().then(camelcaseKeys);
    }

    deleteBucket(param) {
        return this.s3.deleteBucket(capKeys(param)).promise();
    }

    deleteObject(param) {
        return this.s3.deleteObject(capKeys(param)).promise();
    }

    deleteObjects(param) {
        return this.s3.deleteObjects(capKeys(param)).promise().then(camelcaseKeys);
    }

    getObject(param) {
        return this.s3.getObject(capKeys(param)).promise();
    }

    getSignedUrl(operation, param) {
        return this.s3.getSignedUrl(operation, capKeys(param)).promise();
    }

    headBucket(param) {
        return this.s3.headBucket(capKeys(param)).promise();
    }

    headObject(param) {
        return this.s3.headObject(capKeys(param)).promise();
    }

    listBuckets(param) {
        return this.s3.listBuckets(capKeys(param)).promise();
    }

    listObjects(param) {
        return this.s3.listObjectsV2(capKeys(param)).promise().then(camelcaseKeys);
    }

    putObject(param) {
        return this.s3.putObject(capKeys(param)).promise();
    }

    upload(param, option) {
        return this.s3.upload(capKeys(param), option).promise().then(camelcaseKeys);
    }

    // Custom methods.

    async deletePrefix(input) {
        const option = {
            ...input,
            // List all individual objects under the prefix.
            delimiter : ''
        };

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
        const config = { ...option };

        if (!config.prefix.endsWith('/')) {
            config.prefix += '/';
        }

        return this.deletePrefix(config);
    }

    listDir(option) {
        const config = {
            prefix : '/',
            ...option
        };

        if (!config.prefix.endsWith('/')) {
            config.prefix += '/';
        }

        return this.listObjects(config);
    }
}

module.exports = Scube;
