[![Build Status](https://travis-ci.org/JiriChara/krtek.svg?branch=master)](https://travis-ci.org/JiriChara/krtek)

# krtek

<img src="https://raw.github.com/JiriChara/krtek/master/public/images/krtek.jpg" alt="Krtek" align="right">

Krtek is a simple node server that allows you to bundle and minify JavaScript on the fly. Krtek can be used as a core of CMS systems or for applications that require dynamic code compilation. Krtek has built in support for ES2015 and React JSX.

:warning: **WARNING** Krtek can be evil :japanese_goblin:, because `eval()` is evil. Krtek doesn't use `eval()`, but it accepts JavaScript code as a string, so it can possibly open a gate to your server for hackers! In order to reduce the risk of being hacked make sure all code that is coming from unknown source is executed in the sandbox (you can use for example: [vm.runInContext](https://nodejs.org/api/vm.html#vm_script_runincontext_contextifiedsandbox_options) or [sandbox](https://github.com/gf3/sandbox)). It's also good idea to encrypt the JavaScript code in the browser and decrypt it on krtek server (see. [CryptoJS](https://github.com/brix/crypto-js)) using some secret key. Just make sure that you have a really good reason before you start using Krtek and also be aware of security risks!

## Usage

```javascript
import Krtek from 'krtek';

const krtek = new Krtek();

krtek.on('start', () => {
  console.log(
    `Krtek is running on ${krtek.host}:${krtek.port}`
  );
});

krtek.app.get('/magic', (req, res) => {
  krtek.bundle(req, res);
});

krtek.on('bundle', (req) => {
  krtek.setJsCode(`
    import React from 'react';
    import { render } from 'react-dom';

    import { Hello } from './components';

    render(${req.query.js}, document.getElementById("${req.query.id}"));
  `);
});

krtek.on('done', (req, res, data) => {
  res.write(data);
  res.end();
});

krtek.on('error', (req, res, error) => {
  res.write(error);
  res.end();
});

krtek.start();
```

Now navigate to `localhost:3000/magic?id=app&js=<Hello />` and you will get a bundled JavaScript that will render Hello component in your `div#app`.

Copyright © 2016 Jiri Chara. All Rights Reserved.
