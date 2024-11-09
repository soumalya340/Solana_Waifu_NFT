import {
  createNft,
  fetchDigitalAsset,
  findMetadataPda,
  mplTokenMetadata,
  verifyCollection,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";

import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
);

console.log("Loader user", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);

umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

umi.use(keypairIdentity(umiUser));

console.log("SetUp up Umi instance for user");

const collectionAddress = publicKey(
  "CvBMs2LEp8KbfCvPNMawR5cFyQ1k9ac7xrtCoxu1Y2gH"
);

const nftAddress = publicKey("J6z4CRJv8tDwVeTHaY8zXXKLvsfeBFz4hGCzRjckL72t");

// const transaction = await verifyCollection(umi,{
//     metadata: findMetadataPda(umi, {mint: nftAddress}),
//     collectionMint: collectionAddress,
//     authority: umi.identity    
// });

const transaction = await verifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint: nftAddress }),
  collectionMint: collectionAddress,
  authority: umi.identity,
});


transaction.sendAndConfirm(umi);

console.log(`✅ NFT ${nftAddress} verified as member of collection ${collectionAddress}! 
    See Explorer at ${getExplorerLink("address",nftAddress,"devnet")}`);
