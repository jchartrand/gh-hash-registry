const CredRegistry = require('./index.js')
//import 'dotenv/config'  // adds env variables from the .env file to the node 'process' object
require('dotenv').config()

const credReg = CredRegistry(process.env.GITHUB_OWNER, process.env.GITHUB_REPO, process.env.GITHUB_TOKEN)

describe('index.js', () => {
    test.skip('debugging', async ()=> {
      await credReg.addToRegistry('lkjdlks');
      expect(true)
    })
    test('adds hash to the registry', async () => {
      await credReg.addToRegistry('lkjdlks');
      const result = await credReg.isInRegistry('lkjdlks');
      expect(result).toEqual(true)
    })
    test('isInRegistry returns false if hash not added', async () => {
      await credReg.addToRegistry('lkjdlks');
      const result = await credReg.isInRegistry('lkjdddlks');
      expect(result).toEqual(false)
    })
    test('removes hash from the registry', async () => {
      await credReg.addToRegistry('lkjdlks');
      await credReg.removeFromRegistry('lkjdlks');
      const result = await credReg.isInRegistry('lkjdlks');
      expect(result).toEqual(false)
    })
    test('does not remove wrong hash from the registry', async () => {
      await credReg.addToRegistry('lkjdlks');
      await credReg.removeFromRegistry('lkjdlkss');
      const result = await credReg.isInRegistry('lkjdlks');
      expect(result).toEqual(true)
    })
});
