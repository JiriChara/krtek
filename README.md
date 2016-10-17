[![Build Status](https://travis-ci.org/JiriChara/krtek.svg?branch=master)](https://travis-ci.org/JiriChara/krtek)

# krtek

Krtek is a simple node server that allows you to bundle and minify JavaScript on the fly.

![Krtek](https://raw.github.com/JiriChara/krtek/master/public/images/krtek.jpg)

## Usage

```javascript
import Krtek from 'krtek';

const krtek = new Krtek({
  cache: true,
  minify: true,
  cacheFolder: '/tmp',
  contentType: 'text/plain',
  origin: 'localhost',
  host: 'localhost',
  port: 3000
});

krtek.on('start', () => {
  console.log(`Krtek is running on ${krtek.host}:${krtek.port}`);
});

krtek.on('configure', (req) => {
  krtek.jsCode = `
    import React from 'react';
    import { render } from 'react-dom';

    import { Hello } from './components';

    render(${req.query.js}, document.getElementById("${req.query.id}"));
  `;
});

krtek.on('done', (k, req, res, err, data) => {
  res.write(data);
  res.end();
});

krtek.start();
```

Now navigate to `localhost:3000/bundle?id=app&js=<Hello />` and you will get a bundled JavaScript that will render Hello component in your `div#app`.

Copyright © 2016 Jiri Chara. All Rights Reserved.
