/* eslint-disable eqeqeq */
import {IPaginationOptions, Pagination} from 'nestjs-typeorm-paginate';
import * as CryptoJS from 'crypto-js';
import {Causes} from '../config/exception/causes';
import axios from 'axios';
import {fromBuffer} from 'file-type';
import {BigNumber} from 'bignumber.js';
import {randomBytes} from 'crypto';
import {HttpException, HttpStatus} from '@nestjs/common';
const NodeCache = require('node-cache');
const nodeCache = new NodeCache({stdTTL: 2, checkperiod: 2});
const CryptoJS = require('crypto-js');

export function nowInMillis(): number {
  return Date.now();
}

// Alias for nowInMillis
export function now(): number {
  return nowInMillis();
}

export function nowInSeconds(): number {
  return (nowInMillis() / 1000) | 0;
}

export function compareDate(dateSecond1: number, dateSecond2: number): number {
  const dateTime1 = new Date(dateSecond1 * 1000);
  const dateTime2 = new Date(dateSecond2 * 1000);
  const dateCompare1 = Date.parse(
    `${dateTime1.getFullYear()}-${dateTime1.getMonth()}-${dateTime1.getDate()}`
  );
  const dateCompare2 = Date.parse(
    `${dateTime2.getFullYear()}-${dateTime2.getMonth()}-${dateTime2.getDate()}`
  );
  if (dateCompare1 == dateCompare2) {
    return 0;
  } else if (dateCompare1 > dateCompare2) {
    return 1;
  } else {
    return -1;
  }
}

export function addHttps(url: string) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

export function checkIPaginationOptions(options: IPaginationOptions): boolean {
  if (options.limit == 0 || options.page == 0) {
    return false;
  }
  return true;
}

export function encrypt(data: string) {
  return CryptoJS.MD5(data).toString();
}

export function randomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function randomNumberCode(length: number) {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function convertToSlug(Text: string) {
  return Text.toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

export function convertToString(value: any) {
  return typeof value === 'string' ? value : '';
}

export function isNumber(value: any) {
  if (value.match(/^\d+$/)) {
    ///^[+-]?\d+(\.\d+)?$/
    return true;
  } else {
    return false;
  }
}

export function isFloat(value: any) {
  if (value.match(/^[+-]?\d+(\.\d+)?$/)) {
    return true;
  } else {
    return false;
  }
}

export function isPhoneNumber(inputtxt) {
  const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (inputtxt.match(phoneno)) {
    return true;
  } else {
    return false;
  }
}

export function checkCsv(file) {
  console.log('file: ', file);
  const type = 'csv';

  const csvType = file.mimetype.split('/')[1].toUpperCase();
  const csvSize = file.size;

  console.log('csv size: ', csvSize);
  console.log('csv type: ', csvType);

  if (csvSize > 100 * 1000 * 1000) throw Causes.FILE_SIZE_OVER;

  if (csvType.toLowerCase() !== type) throw Causes.FILE_TYPE_INVALID;

  return true;
}

export async function checkImage(file) {
  console.log('file: ', file);
  const listType = [
    'JPG',
    'JPEG',
    'PNG',
    'GIF',
    'SVG',
    'MP4',
    'WEBM',
    'MP3',
    'MPEG',
    'WAV',
    'OGG',
    'GLB',
    'GLTF',
    'SVG+XML',
    'OCTET-STREAM',
    'STL',
    '3MF',
    '3DS',
    'MAX',
    'OBJ',
    'COLLADA',
    'VRML',
    'X3D',
    'STP',
    'FBX',
    'GLTF-BINARY',
  ];
  console.log('file.mimetype', file.mimetype);
  const imgType = file.mimetype.split('/')[1].toUpperCase();
  const imgSize = file.size;
  if (imgSize > 100 * 1000 * 1000) throw Causes.FILE_SIZE_OVER;
  if (!Buffer.isBuffer(file.buffer)) throw Causes.FILE_TYPE_INVALID;
  const checkFileType = await fromBuffer(file.buffer);
  console.log('checkFileType: ', checkFileType);
  if (
    !checkFileType ||
    !(
      listType.includes(checkFileType.ext.toUpperCase()) ||
      checkFileType.mime.includes('image/')
    ) ||
    !listType.includes(imgType)
  )
    throw Causes.FILE_TYPE_INVALID;

  return true;
}

export function convertToObject(value: any) {
  return typeof value === 'object' ? value : {};
}

export function getArrayPagination<T>(
  totalItems: any[],
  options: any
): Pagination<T> {
  const {limit, page} = options;

  const selectedItems = totalItems.slice((page - 1) * limit, page * limit);
  const pagination = {
    totalItems: totalItems.length,
    itemCount: selectedItems.length,
    itemsPerPage: limit,
    totalPages: Math.ceil(totalItems.length / limit),
    currentPage: page,
  };

  return new Pagination(selectedItems, pagination, null);
}

export function getArrayPaginationBuildTotal<T>(
  totalItems: any[],
  totalData: any[],
  options: any
): Pagination<T> {
  const {limit, page} = options;

  const selectedItems = totalItems;
  let totalRecord = 0;
  if (totalData.length > 0) {
    totalRecord = totalData[0].Total;
  }
  const pagination = {
    totalItems: Number(totalRecord),
    itemCount: Number(totalRecord),
    itemsPerPage: Number(limit),
    totalPages: Math.ceil(Number(totalRecord) / limit),
    currentPage: Number(page),
  };

  return new Pagination(selectedItems, pagination, null);
}

export function existValueInEnum(type: any, value: any): boolean {
  return (
    Object.keys(type)
      .filter(k => isNaN(Number(k)))
      .filter(k => type[k] === value).length > 0
  );
}

export function getOffset(paginationOptions: IPaginationOptions) {
  let offset = 0;
  if (paginationOptions.page && paginationOptions.limit) {
    if (Number(paginationOptions.page) > 0) {
      offset =
        (Number(paginationOptions.page) - 1) * Number(paginationOptions.limit);
    }
  }
  return offset;
}

export function convertBigNumberToDecimal(bigNum: string, decimal: number) {
  // currency * 10^18
  const preZero = [];

  if (bigNum.length > decimal) {
    bigNum =
      bigNum.slice(0, bigNum.length - decimal) +
      '.' +
      bigNum.slice(bigNum.length - decimal, bigNum.length);
  } else if (bigNum.length == decimal) {
    bigNum = '0.' + bigNum;
  } else {
    for (let i = 0; i < decimal - bigNum.length; i++) {
      preZero[i] = '0';
    }
    bigNum = '0.' + preZero.join('') + bigNum;
  }

  return bigNum;
}

//NOTE: objectArray must be sorted by key property by asc
export function binarySearch(
  objectArray,
  objectFind,
  objectKeyFind,
  objectKeyArray
) {
  let start = 0,
    end = objectArray.length - 1;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    if (objectArray[mid][objectKeyArray] == objectFind[objectKeyFind]) {
      return objectArray[mid];
    } else if (objectArray[mid][objectKeyArray] < objectFind[objectKeyFind]) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return false;
}

export function getContentTypeByURL(link: string) {
  return axios.get(link).then(async response => {
    return response.headers['content-type'];
  });
}

export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function nativeCoin(chain: string) {
  chain = chain.toLowerCase();
  switch (chain) {
    case 'eth':
      return 'ETH';
    case 'bsc':
      return 'BNB';
    case 'polygon':
      return 'MATIC';

    default:
      return chain.toUpperCase();
  }
}

export function convertTokenBalance(balance: BigNumber, decimals: number) {
  return balance.div(new BigNumber(10).pow(decimals));
}

export function genExchangeSignature(
  userId: number,
  sequenceId: number,
  type: 'increase' | 'decrease',
  amount: string
) {
  return JSON.stringify({
    'user-id': Number(userId),
    'sequence-id': Number(sequenceId),
    type: type,
    amount: amount,
  });
}

export function aesEncrypt(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

export function aesDecrypt(cipherText, key) {
  return CryptoJS.AES.decrypt(cipherText, key).toString(CryptoJS.enc.Utf8);
}
//convert time
//timestamp to DD-MM-YYYY
export const convertMillisToDateString = async (
  createdAt: number,
  timeType: string
) => {
  const date = new Date(Number(createdAt));
  if (timeType === 'DAY') {
    return date.toLocaleString('es-CL').slice(0, 10);
  } else if (timeType === 'MONTH') {
    return date.toLocaleString('es-CL').slice(3, 10);
  } else if (timeType === 'YEAR') {
    return date.toLocaleString('es-CL').slice(6, 10);
  } else {
    throw new HttpException('Invalid time type', HttpStatus.BAD_REQUEST);
  }
};

// chuyển string schedule thành time stamp cùng ngày
export const convertScheduleStringToTimeStampSameDay = (hourString: string) => {
  const hour = Number(hourString.substring(0, 2));
  const minute = Number(hourString.substring(3, 5));
  console.log(`hour: ${hour} - minute: ${minute}`);
  const date = new Date();
  const res = date.setHours(hour, minute, 0, 0);
  console.log('res: ', res);
  return res;
};

// chuyển string schedule thành time stamp của ngày cùng với day(arg)
export const convertScheduleStringToTimeStampForADay = (
  hourString: string,
  day: number
) => {
  const hour = Number(hourString.substring(0, 2));
  const minute = Number(hourString.substring(3, 5));
  console.log(`hour: ${hour} - minute: ${minute}`);
  const date = new Date(Number(day));
  console.log('date: ', date);
  const res = date.setHours(hour, minute, 0, 0);
  console.log('res: ', res);
  return res;
};
