'use strict';

const S3 = require('aws-sdk/clients/s3');
const camelcaseKeys = require('camelcase-keys');
const joi = require('@hapi/joi');

const capitalize = (str) => {
    return str && str[0].toUpperCase() + str.slice(1);
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
            region         : joi.string().optional().default('us-east-1'),
            delimiter      : joi.string().optional().default('/'),
            bucket         : joi.string().required().hostname().min(1),
            publicKey      : joi.string().optional().token().min(20),
            secretKey      : joi.string().optional().base64().min(40),
            endpoint       : joi.string().optional(),
            forcePathStyle : joi.boolean().optional().default(false)
        }));

        const clientConfig = {
            apiVersion : '2006-03-01',
            endpoint   : config.endpoint,
            params     : capKeys({
                bucket    : config.bucket,
                delimiter : config.delimiter
            }),
            region           : config.region,
            s3ForcePathStyle : config.forcePathStyle
        };

        if (config.publicKey) {
            clientConfig.accessKeyId = config.publicKey;
        }

        if (config.secretKey) {
            clientConfig.secretAccessKey = config.secretKey;
        }

        this.s3 = new S3(clientConfig);
    }
    copyObject(param) {
        return this.s3.copyObject(capKeys(param)).promise();
    }
    async createBucket(param) {
        const bucket = await this.s3.createBucket(capKeys(param)).promise();
        return camelcaseKeys(bucket);
    }
    deleteBucket(param) {
        return this.s3.deleteBucket(capKeys(param)).promise();
    }
    deleteObject(param) {
        return this.s3.deleteObject(capKeys(param)).promise();
    }
    async deleteObjects(param) {
        const response = await this.s3.deleteObjects(capKeys(param)).promise();
        return camelcaseKeys(response);
    }
    getObject(param) {
        return this.s3.getObject(capKeys(param)).promise();
    }
    getSignedUrl(operation, param) {
        return this.s3.getSignedUrl(operation, capKeys(param));
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
    async listObjects(param) {
        const objects = await this.s3.listObjectsV2(capKeys(param)).promise();
        return camelcaseKeys(objects);
    }
    putObject(param) {
        return this.s3.putObject(capKeys(param)).promise();
    }
    async upload(param, option) {
        const response = await this.s3.upload(capKeys(param), option).promise();
        return camelcaseKeys(response);
    }
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
