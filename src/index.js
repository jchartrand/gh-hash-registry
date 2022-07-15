//import {Octokit} from '@octokit/rest'
const { Octokit } = require("@octokit/rest");

//import crypto from 'crypto'
const crypto = require('crypto');

async function getHashesFromGithub(github, owner, repo, path) {
    let doesFileExist = true
    let result = {sha: null, hashes: []}
    try {
        const resp = await github.repos.getContent({owner, repo, path})  
        if (resp && resp.data) {
            const stringContent = Buffer.from(resp.data.content,'base64').toString('utf-8').trim()
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
    let content = Buffer.from(hashes.join(',')).toString('base64')
    let message = "add hash to registry"
    let config = {owner, repo, path, message, content, ...(sha && {sha})}
    await github.rest.repos.createOrUpdateFileContents(config)
        .then(result=>{},
                e=>{console.log(`Problem saving file ${path} back to the Github repository: ${e}`);return e})
}

function getHash(data) {
    return crypto
        .createHash('sha256')
        .update(data)
        .digest('base64');
}

module.exports = function CredRegistry(owner, repo, authToken) {

    const github = new Octokit({ auth: authToken })
    const path = '1.csv'

    return {
        addToRegistry: async (data) => {
            const hash = getHash(data)
            const {sha, hashes} = await getHashesFromGithub(github, owner, repo, path);
            hashes.push(hash)
            await saveHashesToGithub(github, owner, repo, path, hashes, sha)
        },
        
        isInRegistry: async (data) => {
            const hash = getHash(data)
            const {hashes} = await getHashesFromGithub(github, owner, repo, path);
            return hashes.includes(hash)
        },
        
        removeFromRegistry: async (data) => {
            const hash = getHash(data)
            const {sha, hashes} = await getHashesFromGithub(github, owner, repo, path);
            const updatedhashes = hashes.filter(entry => entry!==hash);
            await saveHashesToGithub(github, owner, repo, path, updatedhashes, sha)
        }
    }
}



