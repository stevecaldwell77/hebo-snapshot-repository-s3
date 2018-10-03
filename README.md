# hebo-snapshot-repository-s3

[![build status](https://img.shields.io/travis/stevecaldwell77/hebo-snapshot-repository-s3.svg)](https://travis-ci.org/stevecaldwell77/hebo-snapshot-repository-s3)
[![code coverage](https://img.shields.io/codecov/c/github/stevecaldwell77/hebo-snapshot-repository-s3.svg)](https://codecov.io/gh/stevecaldwell77/hebo-snapshot-repository-s3)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/stevecaldwell77/hebo-snapshot-repository-s3.svg)](LICENSE)

> Snapshot Repository implementation for hebo-js that uses AWS S3


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install hebo-snapshot-repository-s3
```

[yarn][]:

```sh
yarn add hebo-snapshot-repository-s3
```


## Usage

```js
const HeboSnapshotRepositoryS3 = require('hebo-snapshot-repository-s3');

const heboSnapshotRepositoryS3 = new HeboSnapshotRepositoryS3();

console.log(heboSnapshotRepositoryS3.renderName());
// script
```


## Contributors

| Name               |
| ------------------ |
| **Steve Caldwell** |


## License

[MIT](LICENSE) © Steve Caldwell


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/
