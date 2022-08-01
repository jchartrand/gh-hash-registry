const { Octokit } = require("@octokit/rest");
//const crypto = require('crypto');
const isoCrypto = require('isomorphic-webcrypto')
const {encode, decode} = require('universal-base64')
const canonicalize = require('canonicalize');


async function getHashesFromGithub(github, owner, repo, path) {
    let doesFileExist = true
    let result = {sha: null, hashes: []}
    try {
        const resp = await github.repos.getContent({owner, repo, path})  
        if (resp && resp.data) {
            //const stringContent = Buffer.from(resp.data.content,'base64').toString('utf-8').trim()
            const stringContent = decode(resp.data.content).trim()
            result.sha = resp.data.sha
            if (stringContent.length) { 
                result.hashes = stringContent.split(',');
            } 
        } else {
            throw 'Something went wrong with the call to github to get the registry file.'
        }
    } catch (e) {
        if (e.response && e.response.status === 404) {
            doesFileExist = false
        } else {
            console.log('error getting hashes from github')
            console.log(e)
            throw (e)
        }
    }
    return result;
}

async function saveHashesToGithub(github, owner, repo, path, hashes, sha) {
    // updates the file if a sha exists, creates a new file otherwise
  //  let content = Buffer.from(hashes.join(',')).toString('base64')
  let content = encode(hashes.join(','))
    let message = "add hash to registry"
    let config = {owner, repo, path, message, content, ...(sha && {sha})}
    await github.rest.repos.createOrUpdateFileContents(config)
        .then(result=>{},
                e=>{console.log(`Problem saving file ${path} back to the Github repository: ${e}`);return e})
}



async function getHash(vc) {
    const canonized = await canonicalize(vc);
    const msgUint8 = new TextEncoder().encode(canonized);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await isoCrypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
  }
  
async function getHashOLD(data) {
    
    await digestMessage(data)
    .then((digestHex) => {
        console.log("The hash as a hex string from isoCrypto:")
        console.log(digestHex);
    })
    const result = crypto
        .createHash('sha256')
        .update(data)
        .digest('hex');
    
}

module.exports = function CredRegistry(owner, repo, authToken) {

    const github = authToken?new Octokit({ auth: authToken }):new Octokit()
    const path = '1.csv'

    return {
        addToRegistry: async (vc) => {
            const hash = await getHash(vc)
            const {sha, hashes} = await getHashesFromGithub(github, owner, repo, path);
            hashes.push(hash)
            await saveHashesToGithub(github, owner, repo, path, hashes, sha)
        },
        
        isInRegistry: async (vc) => {
            const hash = await getHash(vc)
            const {hashes} = await getHashesFromGithub(github, owner, repo, path);
            return hashes.includes(hash)
        },
        
        removeFromRegistry: async (vc) => {
            const hash = await getHash(vc)
            const {sha, hashes} = await getHashesFromGithub(github, owner, repo, path);
            const updatedhashes = hashes.filter(entry => entry!==hash);
            await saveHashesToGithub(github, owner, repo, path, updatedhashes, sha)
        }
    }
}



