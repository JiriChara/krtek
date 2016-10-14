# krtek

JavaScript on demand

![Krtek](https://raw.github.com/JiriChara/krtek/master/public/images/krtek.jpg)

## Usage

```javascript
import Krtek from './src/Krtek';

const krtek = new Krtek();

krtek.on('started', () => {
  console.log(`Krtek is running on ${krtek.host}:${krtek.port}`);
});

krtek.on('configure-js', (req) => {
  krtek.jsCode = `
    import React from 'react';
    import { render } from 'react-dom';

    import { Hello } from './components';

    render(${req.query.js}, document.getElementById("${req.query.id}"));
  `;
});

krtek.on('bundle-complete', (k, req, res, err, data) => {
  res.write(data);
  res.end();
});

krtek.start();
```

Now navigate to `localhost:3000/bundle?id=app&js=<Hello />` and you will get a bundled JavaScript that will render Hello component in your `div#app`.

Copyright © 2016 Jiri Chara. All Rights Reserved.
