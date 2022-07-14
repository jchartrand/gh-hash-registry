# gh-hash-registry

Publish hashes (of credentials, but really could be anything) to a GitHub repository for later verification and audit.

This is effectively a 'shadow' or 'mirror' registry of of all know 'issuances' of a credential. The shadow registry mirrors the 'real' records, but using hashes, which don't reveal any private data, yet still provide a unique 'fingerprint' of the record that can be published freely without compromising privacy.

This registry could be used on its own to verify credentials, but is meant to be used in combination with a cryptographic signature on the credential itself.  The cryptograpic signature provides the fundamental guarantee of authenticity, and the shadow registry provides an additional guarantee, but more importantly provides a way to audit all known credential issuances, comparing what's in the shadow registry to the records in the canoncical database (like a university registrar's list of known diplomas), to thereby discover fraudulent issuances.

## Development

We're following the process for testing and releasing NPM packages that is described here:

[https://cheatcode.co/tutorials/how-to-write-test-and-publish-an-npm-package](https://cheatcode.co/tutorials/how-to-write-test-and-publish-an-npm-package)

So note that in particular you'll want to install the Verdaccio tool that runs a mock NPM repository locally on your laptop thereby letting you test the developmen version of your NPM package within another project, without having to publish the package to the 'real' NPM repository.

To install Verdaccio:

npm install -g verdaccio

To run it:

verdaccio

Once running  - at [http://localhost:4873](http://localhost:4873) - you'll have to login to it with your npm account, as described by the Verdaccio welcome screen at that url.

Verdaccio is used by the release script in [release.js](./release.js), which is in turn invoked from the release scripts (release.development and release.production) defined in [package.json](./package.json)

