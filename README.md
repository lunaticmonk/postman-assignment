# Postman Assignment

> Postman twitter REST API

To have an easy access, the API is deployed here: [https://postman.lunaticmonk.space](https://postman.lunaticmonk.space).

<!-- [![Video](https://img.youtube.com/vi/Rf6KgfpUHfg/0.jpg)](https://youtu.be/Rf6KgfpUHfg) -->

<!-- [Video](https://youtu.be/Rf6KgfpUHfg) -->

---

- [Requirements](#requirements)
- [Setup](#setup)

---

## Requirements

- Node.js (v8.11.3 preferable)
- MongoDB
- Yarn (`npm install -g yarn`)

## Setup

- Create a .env and copy the contents of .env.default in .env. Do it at both locations i.e at `/`.
- Set the `API_BASE` config in `src/client/configs/app.js`.
- Create a MongoDB user and give it `dbOwner` access to the database. Set the credentials in .env as well.

```shell
$ npm install -g yarn
$ git clone https://github.com/lunaticmonk/postman-assignment.git
$ cd postman-assignment
$ yarn
$ yarn dev
```

- The API server will start at the given port in the .env. ex. `localhost:8000`.

## Endpoints

The endpoints can be found at this public url: [https://documenter.getpostman.com/view/4519825/S1TbRZEY?version=latest](https://documenter.getpostman.com/view/4519825/S1TbRZEY?version=latest).

## Tests

Mocha and Chai.js was used for the testing. Being a CRUD app with a very less business logic involved, only integration tests are written.

To run the tests:

`yarn test`

## License

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2019
