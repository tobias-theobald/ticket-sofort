import { describe, expect, it } from '@jest/globals';

import { encode, sha1, sha512 } from './hashAlgorithms';
import { parseEncoded } from './hashAlgorithms';

describe('parseEncoded', () => {
    it('should correctly parse a UTF-8 string', () => {
        const input = 'hello';
        const encoding = 'utf-8';
        const expectedOutput = new Uint8Array([104, 101, 108, 108, 111]);
        expect(parseEncoded(input, encoding)).toEqual(expectedOutput);
    });

    it('should correctly parse a hex string', () => {
        const input = '68656c6c6f';
        const encoding = 'hex';
        const expectedOutput = new Uint8Array([104, 101, 108, 108, 111]);
        expect(parseEncoded(input, encoding)).toEqual(expectedOutput);
    });

    it('should correctly parse an ArrayBuffer', () => {
        const input = new Uint8Array([104, 101, 108, 108, 111]).buffer;
        const encoding = 'raw';
        const expectedOutput = new Uint8Array([104, 101, 108, 108, 111]);
        expect(parseEncoded(input, encoding)).toEqual(expectedOutput);
    });

    it('should throw an error for invalid input type', () => {
        const input = 12345;
        const encoding = 'utf-8';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => parseEncoded(input as any, encoding)).toThrow('Invalid input');
    });

    it('should throw an error for invalid encoding type', () => {
        const input = 'hello';
        const encoding = 'invalid-encoding';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => parseEncoded(input, encoding as any)).toThrow('Invalid encoding');
    });
});

describe('encode', () => {
    it('should correctly encode an ArrayBuffer to hex string', () => {
        const input = new Uint8Array([104, 101, 108, 108, 111]);
        const encoding = 'hex';
        const expectedOutput = '68656c6c6f';
        expect(encode(input, encoding)).toBe(expectedOutput);
    });

    it('should correctly return the raw ArrayBuffer', () => {
        const input = new Uint8Array([104, 101, 108, 108, 111]);
        const encoding = 'raw';
        const expectedOutput = input;
        expect(encode(input, encoding)).toBe(expectedOutput);
    });

    it('should throw an error for invalid encoding type', () => {
        const input = new Uint8Array([104, 101, 108, 108, 111]);
        const encoding = 'invalid-encoding';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => encode(input, encoding as any)).toThrow('Invalid encoding');
    });
});

// These tests do not seem to work in the test environment :thumbsup:
describe('hashAlgorithms', () => {
    it('should return the correct hash', async () => {
        const message = 'message';
        const expectedSha1 = '6f9b9af3cd6e8b8a73c2cdced37fe9f59226e27d';
        const expectedSha512 =
            'f8daf57a3347cc4d6b9d575b31fe6077e2cb487f60a96233c08cb479dbf31538cc915ec6d48bdbaa96ddc1a16db4f4f96f37276cfcb3510b8246241770d5952c';

        expect(await sha1(message, 'utf-8', 'hex')).toBe(expectedSha1);
        expect(await sha512(message, 'utf-8', 'hex')).toBe(expectedSha512);
    });
});
