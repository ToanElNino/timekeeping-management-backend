/* eslint-disable no-process-exit */
/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Injectable, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';
import {Repository} from 'typeorm';

import {Causes} from '../../config/exception/causes';
import {CurrencyConfig, KmsCmk, KmsDataKey} from '../../database/entities';
import {getLogger} from '../../shared/logger';

import AwaitLock from 'await-lock';
import * as web3_types from 'web3-core/types';

const lock = new AwaitLock();
const Web3 = require('web3');

const DUMMY_DATA_KEY = 'crueltycommentshaft';
const ENCRYPT_ALGORITHM = 'aes256';
const logger = getLogger('KMSService');
let count = 0;

@Injectable()
export class KmsService implements OnModuleInit {
  constructor(
    @InjectRepository(KmsDataKey)
    private kmsDataKeyRepository: Repository<KmsDataKey>,

    @InjectRepository(KmsCmk)
    private kmsCmkRepository: Repository<KmsCmk>,

    @InjectRepository(CurrencyConfig)
    private currencyConfigRepository: Repository<CurrencyConfig>
  ) {
    this.LOCAL_CACHED_RECORDS = {};
  }

  onModuleInit() {
    this.setup();
  }

  private LOCAL_CACHED_RECORDS;
  private awsCredentials = null;

  async _getCachedRecordById(tableName: string, id: string) {
    if (!this.LOCAL_CACHED_RECORDS[tableName]) {
      this.LOCAL_CACHED_RECORDS[tableName] = {};
    }

    if (this.LOCAL_CACHED_RECORDS[tableName][id]) {
      return this.LOCAL_CACHED_RECORDS[tableName][id];
    }

    let record;
    if (tableName === 'kms_cmk') {
      record = await this.kmsCmkRepository.findOne({
        where: {
          id,
        },
      });
    }
    if (tableName === 'kms_data_key') {
      record = await this.kmsDataKeyRepository.findOne({
        where: {
          id: parseInt(id),
        },
      });
    }

    if (!record) {
      logger.error(`Not found record: table=${tableName}, id=${id}`);
      throw Causes.KMS_CMK_INVALID;
    }

    this.LOCAL_CACHED_RECORDS[tableName][id] = JSON.parse(
      JSON.stringify(record)
    );
    return this.LOCAL_CACHED_RECORDS[tableName][id];
  }

  async _getKMSInstanceByKeyId(cmkId: string) {
    const cmk = await this._getCachedRecordById('kms_cmk', cmkId);
    if (!this.awsCredentials) {
      this.awsCredentials = await KmsService.getAWSCredentials();
    }
    return new AWS.KMS({
      region: cmk.region,
      credentials: this.awsCredentials,
    });
  }

  // Get details of CMK for provided KeyId
  // async getMasterKey(cmkId: string) {
  //   const kms = await this._getKMSInstanceByKeyId(cmkId);
  //   const result = await kms.describeKey({ KeyId: cmkId }).promise();
  //   return result;
  // }

  // Generate a new random data key with provided KeyId
  // Use this practice: https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html
  async generateDataKey(cmkId: string) {
    if (!cmkId) {
      logger.error(`Cannot generate data key with invalid cmk id: ${cmkId}`);
      throw Causes.KMS_CMK_INVALID;
    }

    const kms = await this._getKMSInstanceByKeyId(cmkId);
    const {Plaintext, CiphertextBlob} = await kms
      .generateDataKey({KeyId: cmkId, KeySpec: 'AES_256'})
      .promise();
    return {
      plain: Plaintext.toString('base64'),
      cipher: CiphertextBlob.toString('base64'),
    };
  }

  // Get plain text data key from encrypted data key
  // Suppose the KeyId that was used to generate the data key is still exists
  async getDataKey(dataKeyId: string) {
    const dataKeyRecord = await this._getCachedRecordById(
      'kms_data_key',
      dataKeyId
    );
    const encryptedDataKey = dataKeyRecord.encryptedDataKey;
    const kms = await this._getKMSInstanceByKeyId(dataKeyRecord.cmkId);
    const {Plaintext} = await kms
      .decrypt({CiphertextBlob: Buffer.from(encryptedDataKey, 'base64')})
      .promise();
    return Plaintext.toString('base64');
  }

  // Encrypt arbitrary data, using the data key that is defined in environment variable
  async encrypt(plainText: string, dataKeyId: string) {
    if (typeof plainText !== 'string') {
      throw Causes.ONLY_SUPPORT_STRING;
    }

    let dataKey = DUMMY_DATA_KEY;
    if (dataKeyId && dataKeyId !== '') {
      dataKey = await this.getDataKey(dataKeyId);
    }
    // else if (process.env.NODE_ENV.startsWith('prod')) {
    //   // production environment requires data key id
    //   throw Causes.KMS_DATA_KEY_NOT_FOUND;
    // }
    // The IV is usually passed along with the ciphertext.
    const iv = Buffer.alloc(16, 0); // Initialization vector.
    const key = crypto.scryptSync(Buffer.from(dataKey, 'base64'), 'salt', 32);
    const cipher = crypto.createCipheriv(ENCRYPT_ALGORITHM, key, iv);
    let crypted = cipher.update(plainText, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  // Decrypt data, using the data key that is defined in environment variable
  async decrypt(cipherText: string, dataKeyId: string) {
    let dataKey = DUMMY_DATA_KEY;
    console.log('dataKeyId', dataKeyId);
    if (dataKeyId && dataKeyId !== '') {
      dataKey = await this.getDataKey(dataKeyId);
      console.log('dataKey', dataKey);
    }
    // else if (process.env.NODE_ENV.startsWith('prod')) {
    //   // production environment requires data key id
    //   throw Causes.KMS_DATA_KEY_NOT_FOUND;
    // }
    // The IV is usually passed along with the ciphertext.
    const iv = Buffer.alloc(16, 0); // Initialization vector.
    const key = crypto.scryptSync(Buffer.from(dataKey, 'base64'), 'salt', 32);
    const decipher = crypto.createDecipheriv(ENCRYPT_ALGORITHM, key, iv);
    let decrypted = decipher.update(cipherText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async _combineData(plainText: string, dataKeyId: string) {
    const dataKey = await this.getDataKey(dataKeyId);
    return `${plainText}:${dataKey}`;
  }

  private static async getAWSCredentials(): Promise<AWS.Credentials> {
    const providers = [];
    // read from ~/.aws/credentials
    const fileProvider = new AWS.SharedIniFileCredentials({
      profile: process.env.AWS_PROFILE_NAME || 'default',
    });
    providers.push(fileProvider);
    // read from ec2 instance
    const ec2MetadataProvider = new AWS.EC2MetadataCredentials();
    providers.push(ec2MetadataProvider);
    // read from esc instance
    const escMetadataProvider = new AWS.ECSCredentials();
    providers.push(escMetadataProvider);

    const chain = new AWS.CredentialProviderChain(providers);
    // make credentials
    return await chain.resolvePromise();
  }

  // Make sure there's always at least 1 record in kms_data_key table
  setup() {
    this._setup()
      .then(async dataKey => {
        //NOTE: uncomment and run first time init app
        // logger.info(`Generated master wallet address:: address=${address.address}, note=${address.note}`);
      })
      .catch(e => {
        logger.error('Setup data key failed with error:');
        logger.error(e);
        // console.log(e);
      });
  }

  // Generate a new wallet address without inserting to database yet
  async generateOneWalletAddress(
    currency: CurrencyConfig,
    dataKey: KmsDataKey
  ) {
    const web3 = new Web3(currency.rpcEndpoint);
    const account: web3_types.Account = web3.eth.accounts.create();

    let kmsDataKeyId: string;
    let privateKeyHandled: string;

    if (!dataKey?.id) {
      kmsDataKeyId = '';
    } else {
      kmsDataKeyId = dataKey.id.toString();
    }
    privateKeyHandled = account.privateKey;
    privateKeyHandled = await this.encrypt(account.privateKey, kmsDataKeyId);

    if (privateKeyHandled.length > 250) {
      throw Causes.ENCRYPT_PRIVATE_KEY_ERROR;
    }

    return {address: account.address, privateKeyHandled, kmsDataKeyId};
  }

  async _setup() {
    if (count === 0) {
      count++;
      const existedKey = await this.kmsDataKeyRepository.findOne({
        where: {
          isEnabled: 1,
        },
      });
      if (existedKey) {
        return existedKey;
      }
      logger.info(
        'There is no key in database yet. Will try to create a new default one.'
      );
      const cmk = await this.kmsCmkRepository.findOne({
        where: {
          isEnabled: true,
        },
      });
      if (!cmk) {
        logger.warn('Could not find the default CMK');
        if (process.env.NODE_ENV.startsWith('prod')) {
          process.exit(1);
        }
        return;
      }

      const newKey = await this.generateDataKey(cmk.id);
      let dataKey = this.kmsDataKeyRepository.create({
        cmkId: cmk.id,
        encryptedDataKey: newKey.cipher,
      });
      dataKey = await this.kmsDataKeyRepository.save(dataKey);
      logger.info(
        `Created new kms data key successfully: id=${dataKey.id}, cmkId=${cmk.id}, encrypted=${newKey.cipher}`
      );
      return dataKey;
    }
  }
}
