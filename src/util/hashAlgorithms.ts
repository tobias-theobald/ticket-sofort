import { CryptoDigestAlgorithm } from 'expo-crypto';
import * as Crypto from 'expo-crypto';

const encoder = new TextEncoder();

const BLOCK_SIZES = {
    [CryptoDigestAlgorithm.SHA512]: 128,
} as const;

const utf8StringToUint8Array = (str: string): Uint8Array => {
    return encoder.encode(str);
};

const xorBuffers = (buffer1: Uint8Array, buffer2: Uint8Array): Uint8Array => {
    if (buffer1.length !== buffer2.length) {
        throw new Error('Buffers must be of the same length to be xor-ed');
    }
    const result = new Uint8Array(buffer1.length);
    for (let i = 0; i < buffer1.length; i++) {
        result[i] = buffer1[i] ^ buffer2[i];
    }
    return result;
};

const arrayBufferToHexString = (buffer: ArrayBuffer): string => {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
};

const hexStringToUint8Array = (hex: string): Uint8Array => {
    const buffer = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        buffer[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return buffer;
};

export type SupportedInputStringEncodings = 'hex' | 'utf-8';
export type SupportedInputBufferEncodings = 'raw';
export type SupportedInputEncodings = SupportedInputStringEncodings | SupportedInputBufferEncodings;
export function parseEncoded(encoded: string, encoding: SupportedInputStringEncodings): Uint8Array;
export function parseEncoded(encoded: ArrayBuffer, encoding: SupportedInputBufferEncodings): Uint8Array;
export function parseEncoded(encoded: ArrayBuffer | string, encoding: SupportedInputEncodings): Uint8Array;
export function parseEncoded(encoded: ArrayBuffer | string, encoding: SupportedInputEncodings): Uint8Array {
    if (typeof encoded !== 'string') {
        // noinspection SuspiciousTypeOfGuard
        if (!(encoded instanceof ArrayBuffer)) {
            throw new Error('Invalid input');
        }
        return new Uint8Array(encoded);
    } else if (encoding === 'utf-8') {
        return utf8StringToUint8Array(encoded);
    } else if (encoding === 'hex') {
        return hexStringToUint8Array(encoded);
    } else {
        throw new Error('Invalid encoding');
    }
}

export type SupportedOutputStringEncodings = 'hex';
export type SupportedOutputBufferEncodings = 'raw';
export type SupportedOutputEncodings = SupportedOutputStringEncodings | SupportedOutputBufferEncodings;
export function encode(encoded: ArrayBuffer, encoding: 'hex'): string;
export function encode(encoded: ArrayBuffer, encoding: 'raw'): ArrayBuffer;
export function encode(encoded: ArrayBuffer, encoding: SupportedOutputEncodings | 'raw'): string | ArrayBuffer;
export function encode(encoded: ArrayBuffer, encoding: SupportedOutputEncodings | 'raw'): string | ArrayBuffer {
    if (encoding === 'raw') {
        return encoded;
    } else if (encoding === 'hex') {
        return arrayBufferToHexString(encoded);
    } else {
        throw new Error('Invalid encoding');
    }
}

// This is not recommended for cryptographic use, as it is not secure.
// However, it's only used in the SVV app to calculate the device identifier
// and for that it is fine
export function sha512(
    input: string,
    inputEncoding: SupportedInputStringEncodings,
    outputEncoding: SupportedOutputStringEncodings,
): Promise<string>;
export function sha512(
    input: ArrayBuffer,
    inputEncoding: SupportedInputBufferEncodings,
    outputEncoding: SupportedOutputStringEncodings,
): Promise<string>;
export function sha512(
    input: string,
    inputEncoding: SupportedInputStringEncodings,
    outputEncoding: SupportedOutputBufferEncodings,
): Promise<ArrayBuffer>;
export function sha512(
    input: ArrayBuffer,
    inputEncoding: SupportedInputBufferEncodings,
    outputEncoding: SupportedOutputBufferEncodings,
): Promise<ArrayBuffer>;
export async function sha512(
    input: string | ArrayBuffer,
    inputEncoding: SupportedInputEncodings,
    outputEncoding: SupportedOutputEncodings,
): Promise<string | ArrayBuffer> {
    return encode(
        await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA512, parseEncoded(input, inputEncoding)),
        outputEncoding,
    );
}

export async function sha1(
    input: string | ArrayBuffer,
    inputEncoding: SupportedInputEncodings,
    outputEncoding: SupportedOutputEncodings,
): Promise<string | ArrayBuffer> {
    const inputArrayBuffer = parseEncoded(input, inputEncoding);
    const hash = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA1, inputArrayBuffer);
    return encode(hash, outputEncoding);
}

export function hmac(
    algo: keyof typeof BLOCK_SIZES,
    input: string,
    inputEncoding: SupportedInputStringEncodings,
    key: string,
    keyEncoding: SupportedInputStringEncodings,
    outputEncoding: SupportedOutputStringEncodings,
): Promise<string>;
export function hmac(
    algo: keyof typeof BLOCK_SIZES,
    input: ArrayBuffer,
    inputEncoding: SupportedInputBufferEncodings,
    key: string,
    keyEncoding: SupportedInputStringEncodings,
    outputEncoding: SupportedOutputStringEncodings,
): Promise<string>;
export function hmac(
    algo: keyof typeof BLOCK_SIZES,
    input: string,
    inputEncoding: SupportedInputStringEncodings,
    key: ArrayBuffer,
    keyEncoding: SupportedInputBufferEncodings,
    outputEncoding: SupportedOutputStringEncodings,
): Promise<string>;
export function hmac(
    algo: keyof typeof BLOCK_SIZES,
    input: ArrayBuffer,
    inputEncoding: SupportedInputBufferEncodings,
    key: ArrayBuffer,
    keyEncoding: SupportedInputBufferEncodings,
    outputEncoding: SupportedOutputStringEncodings,
): Promise<string>;
export function hmac(
    algo: keyof typeof BLOCK_SIZES,
    input: string,
    inputEncoding: SupportedInputStringEncodings,
    key: string,
    keyEncoding: SupportedInputStringEncodings,
    outputEncoding: SupportedOutputBufferEncodings,
): Promise<ArrayBuffer>;
export function hmac(
    algo: keyof typeof BLOCK_SIZES,
    input: ArrayBuffer,
    inputEncoding: SupportedInputBufferEncodings,
    key: string,
    keyEncoding: SupportedInputStringEncodings,
    outputEncoding: SupportedOutputBufferEncodings,
): Promise<ArrayBuffer>;
export function hmac(
    algo: keyof typeof BLOCK_SIZES,
    input: string,
    inputEncoding: SupportedInputStringEncodings,
    key: ArrayBuffer,
    keyEncoding: SupportedInputBufferEncodings,
    outputEncoding: SupportedOutputBufferEncodings,
): Promise<ArrayBuffer>;
export function hmac(
    algo: keyof typeof BLOCK_SIZES,
    input: ArrayBuffer,
    inputEncoding: SupportedInputBufferEncodings,
    key: ArrayBuffer,
    keyEncoding: SupportedInputBufferEncodings,
    outputEncoding: SupportedOutputBufferEncodings,
): Promise<ArrayBuffer>;
export function hmac(
    algo: keyof typeof BLOCK_SIZES,
    input: string | ArrayBuffer,
    inputEncoding: SupportedInputEncodings,
    key: string | ArrayBuffer,
    keyEncoding: SupportedInputEncodings,
    outputEncoding: SupportedOutputEncodings,
): Promise<string | ArrayBuffer>;
export async function hmac(
    algo: keyof typeof BLOCK_SIZES,
    input: string | ArrayBuffer,
    inputEncoding: SupportedInputEncodings,
    key: string | ArrayBuffer,
    keyEncoding: SupportedInputEncodings,
    outputEncoding: SupportedOutputEncodings,
): Promise<string | ArrayBuffer> {
    const blockSize = BLOCK_SIZES[algo];
    if (!blockSize) {
        throw new Error('Unsupported algorithm');
    }
    const keyBuffer = parseEncoded(key, keyEncoding);
    const inputBuffer = parseEncoded(input, inputEncoding);

    // If key is longer than block size, hash it
    let processedKey = keyBuffer;
    if (keyBuffer.length > blockSize) {
        processedKey = new Uint8Array(await Crypto.digest(algo, keyBuffer));
    }

    // Pad the key to the block size
    const paddedKey = new Uint8Array(blockSize);
    paddedKey.set(processedKey);

    // Create ipad and opad
    const ipad = xorBuffers(paddedKey, new Uint8Array(blockSize).fill(0x36));
    const opad = xorBuffers(paddedKey, new Uint8Array(blockSize).fill(0x5c));

    // Perform inner hash
    const innerHash = new Uint8Array(await Crypto.digest(algo, new Uint8Array([...ipad, ...inputBuffer])));

    // Perform outer hash
    const finalHash = new Uint8Array(await Crypto.digest(algo, new Uint8Array([...opad, ...innerHash])));

    return encode(finalHash, outputEncoding);
}

export const hmacSha512FromUtf8InputAsHex = async (input: string, key: string): Promise<string> => {
    return hmac(CryptoDigestAlgorithm.SHA512, input, 'utf-8', key, 'utf-8', 'hex');
};
