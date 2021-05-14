# ra-laravel-client

A laravel-focused JSONAPI dataprovider for [react-admin](https://github.com/marmelab/react-admin). This package is still in development. Currently only supports:

- `getList`
- `getMany`
- `getManyReference`
- `getOne`
- `create`
- `update`
- `delete`
- `get`: Custom wrapper for axios.get() method
- `post`: Custom wrapper for axios.post() method

## Usage

1. Install the package `npm i -D ra-laravel-client`.
2. Import and set the base url, and pass it as the dataprovider for react-admin.

``` javascript
//in app.js
import React from "react";
import { Admin, Resource } from "react-admin";
import apiClient from "ra-laravel-client";

const dataProvider = apiClient('http://dev.project.loc/api');

const App = () => (
  <Admin dashboard={Dashboard} dataProvider={dataProvider}>
    ...
  </Admin>
);

export default App;
```

## Credits

I must give a huge thanks to [@henvo](https://github.com/henvo/ra-jsonapi-client). I literally copy-pasted his original repo and adapted to my own codebase.
