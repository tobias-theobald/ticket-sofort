import { createDecipheriv, createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

import { Apk } from 'node-apk';

const apkFilePath = process.argv[2];
if (typeof apkFilePath !== 'string' || !apkFilePath.endsWith('.apk')) {
    throw new Error('Invalid APK file. Usage: bun run scripts/decoder.ts <path-to-apk>');
}
const apk = new Apk(apkFilePath);

let flavor: string | undefined = undefined;
let commitHash: string | undefined = undefined;
const manifest = await apk.getManifestInfo();
for (const application of manifest.raw.children.application) {
    for (const metaData of application.children['meta-data']) {
        if (metaData.attributes.name === 'eos_ms_flavor') {
            flavor = metaData.attributes.value;
        } else if (metaData.attributes.name === 'eos_ms_commit_hash') {
            commitHash = metaData.attributes.value;
        }
    }
}
if (flavor === undefined || commitHash === undefined) {
    throw new Error(
        'Invalid APK file or unknown structure. Missing flavor or commit hash. This was tested with Saarfahrplan version 3.5.4 APK',
    );
}

const resources = await apk.getResources();
const lcsFilename = resources.table.stringPool.values.find((value) => value.endsWith('.lcs'));
if (lcsFilename === undefined) {
    throw new Error('Could not find lcs file in resources');
}

const lcsFile = await apk.extract(lcsFilename);
const aesKeySource = flavor + commitHash;
const aesKeySourceHash = createHash('sha512').update(aesKeySource, 'utf-8').digest('hex');
const aesKey = Buffer.from(aesKeySourceHash, 'utf-8').subarray(0, 16);

const decipher = createDecipheriv('AES-128-CBC', aesKey, Buffer.alloc(16));
decipher.setAutoPadding(false);

let decrypted: string = decipher.update(lcsFile, undefined, 'utf-8');
decrypted += decipher.final('utf-8');

const { instances } = JSON.parse(decrypted);
const productionInstance = instances.find((instance: Record<string, unknown>) => instance.backendType === 'live');
const productionInstanceJson = JSON.stringify(productionInstance, null, 2);
writeFileSync('assets/productionInstance.json', productionInstanceJson);
console.info(productionInstanceJson);
