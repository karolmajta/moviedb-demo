# MovieDB demo

## Installing

    $ git clone https://github.com/karolmajta/moviedb-demo.git
    $ cd moviedb-demo
    $ npm install

## Building & Running

Before you run the application you need to set an environment variable `MOVIEDB_API_KEY`:

    $ export MOVIEDB_API_KEY=<your MovieDB API key>

Then you can call `npm start` which will build and test the project, eventually running a development static file
server:

    $ npm start

## Development

    The `start` script consists of three different steps

### Building

`npm run build` will in sequence call:

- `npm clean` which removes the `dist` directory
- `npm run build-html` which renders the `src/ejs/index.ejs` to `dist/index.html`
- `npm run build-css` which transpiles less to `dist/css/index.css` using `src/less/index.less` as entrypoint
- `npm run build-js` which trinspiles js/jsx to `dist/js/index.js` using `src/js/index.js` as entrypoint
- `npm run build-assets` which copies all necessary assets to appropriate directories in `dist`

After `npm run build` finishes, the `dist` directory contains a fully functional application that can be served by
any static file server, uploaded to S3, rsynced to remote server etc.

### Testing

`npm test` will just run `jest --coverage`.

### Development server

`npm run server` bootstraps a simple static server that just serves contents of `dist`. It's handy to have it running in
development in one terminal window, while in other you switch between `npm run build` and `npm test`.