const CredRegistry = require('./index.js')
//import 'dotenv/config'  // adds env variables from the .env file to the node 'process' object
require('dotenv').config()

const SAMPLE_VC = {
	"@context": ["https://www.w3.org/2018/credentials/v1"],
	"type": ["VerifiablePresentation"],
	"verifiableCredential": [{
		"@context": ["https://www.w3.org/2018/credentials/v1", "https://w3id.org/dcc/v1", "https://w3id.org/security/suites/ed25519-2020/v1"],
		"id": "9bb9f1b5-78a0-469e-82fa-765e9c1cd356",
		"type": ["VerifiableCredential"],
		"issuer": "did:web:credentials.mcmaster.ca",
		"issuanceDate": "2022-07-28T14:25:02.717Z",
		"credentialSubject": {
			"name": "Degree Awarded",
			"description": "Hishmat Salehi graduated from McMaster University "
		},
		"proof": {
			"type": "Ed25519Signature2020",
			"created": "2022-07-28T14:25:02Z",
			"verificationMethod": "did:web:credentials.mcmaster.ca#z6MkjF4EkZhsP8QfRjtUuQyJeMTWTKJJngTUh3ntNA6JpErC",
			"proofPurpose": "assertionMethod",
			"proofValue": "z2huyp32ME7BEZ9yAFGHM5naj1Addtb5e8u7AxmdqU4wgbKEtWizUseFveZAFJa6oGCxRjmXEakeUC166S1E6EbUn"
		}
	}]
}

DIFFERENT_SAMPLE_VC = {
	"@context": ["https://www.w3.org/2018/credentials/v1"],
	"type": ["VerifiablePresentation"],
	"verifiableCredential": [{
		"@context": ["https://www.w3.org/2018/credentials/v1", "https://w3id.org/dcc/v1", "https://w3id.org/security/suites/ed25519-2020/v1"],
		"id": "9bb9f1b5-78a0-469e-82fa-765e9c1cd356",
		"type": ["VerifiableCredential"],
		"issuer": "did:web:credentials.mcmaster.ca",
		"issuanceDate": "2022-07-28T14:25:02.717Z",
		"credentialSubject": {
			"name": "Degree NOT Awarded",
			"description": "JAMES CHARTRAND DID NOT graduate from McMaster University "
		},
		"proof": {
			"type": "Ed25519Signature2020",
			"created": "2022-07-28T14:25:02Z",
			"verificationMethod": "did:web:credentials.mcmaster.ca#z6MkjF4EkZhsP8QfRjtUuQyJeMTWTKJJngTUh3ntNA6JpErC",
			"proofPurpose": "assertionMethod",
			"proofValue": "z2huyp32ME7BEZ9yAFGHM5naj1Addtb5e8u7AxmdqU4wgbKEtWizUseFveZAFJa6oGCxRjmXEakeUC166S1E6EbUn"
		}
	}]
}

//let credReg = CredRegistry(process.env.GITHUB_OWNER, process.env.GITHUB_REPO, process.env.GITHUB_TOKEN)

describe('index.js', () => {
    test.skip('debugging', async ()=> {
      await credReg.addToRegistry(SAMPLE_VC);
      expect(true)
    })
    test('adds hash to the registry', async () => {
      await credReg.addToRegistry(SAMPLE_VC);
      const result = await credReg.isInRegistry(SAMPLE_VC);
      expect(result).toEqual(true)
    })
    test('isInRegistry returns false if hash not added', async () => {
      await credReg.addToRegistry(SAMPLE_VC);
      const result = await credReg.isInRegistry(DIFFERENT_SAMPLE_VC);
      expect(result).toEqual(false)
    })
    test('removes hash from the registry', async () => {
      await credReg.addToRegistry(SAMPLE_VC);
      await credReg.removeFromRegistry(SAMPLE_VC);
      const result = await credReg.isInRegistry(SAMPLE_VC);
      expect(result).toEqual(false)
    })
    test('does not remove wrong hash from the registry', async () => {
      await credReg.addToRegistry(SAMPLE_VC);
      await credReg.removeFromRegistry(DIFFERENT_SAMPLE_VC);
      const result = await credReg.isInRegistry(SAMPLE_VC);
      expect(result).toEqual(true)
    })

    test.only('get reg with no auth', async ()=> {
      credReg = CredRegistry(process.env.GITHUB_OWNER, process.env.GITHUB_REPO)
      const result = await credReg.isInRegistry(SAMPLE_VC);
      expect(result).toEqual(true)
    })

});



