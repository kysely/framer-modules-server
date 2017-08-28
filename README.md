# Server for Framer Modules
**Small server for communication with the modules registry and data preprocessing.**

Separating this part from the app enables using the registry in more general ways. For more info on the Framer Modules architecture please [read info on the main repo](https://github.com/kysely/framer-modules).

The server is currently running on Heroku Free dyno at [framermodules.herokuapp.com](https://framermodules.herokuapp.com/)

---

## REST API
The server always responds with JSON including `message` `statusCode` `status` and `data` keys.
```javascript
{
  "message": "Cool response from Framer Modules server.",
  "statusCode": 200,
  "status": "OK",
  "data": {...} // Object | Array | null
}
```

### Request Routes
Please note strings passed in URL must be encoded to comply [RFC 3986](http://www.ietf.org/rfc/rfc3986.txt).
In JavaScript, `encodeURIComponent()` will do.

#### GET `/search/:query`
*(statusCode: 200 | 404 | 500)*

*(data: Array)* Returns an array containing found modules' metadata sorted
by search relevancy and number of installations (descending). If no modules are
found, the array passed in `data` key is empty.

Searching for `all` with return all modules in registry. You can also retrieve
exact single module using colon prefix, e.g. `:Collection Component`.

Included keys in the modules objects are: `name` `unique_name` `description`
`author` `require` `install` `example` `github` `dependencies` `installed_count`
and optionally `thumb`

#### GET `/module/:moduleName`
*(statusCode: 200 | 404 | 500)*

*(data: Object | null)* Returns single module's metadata in an object.
If no module is found, `null` is passed in `data` key.

Included keys in the module object are the same as in `/search/:query` route.

#### GET `/preset?modules[]=`
*(statusCode: 200 | 404 | 500)*

*(data: Array)* Returns an array of metadata for modules specified in request query.
If no modules from the query are found, the array passed in `data` key is empty.

Included keys in the modules objects are the same as in `/search/:query` route.

#### GET `/checkName/:moduleName`
*(statusCode: 200 | 404 | 500)*

*(data: Object)* Checks for name availability and returns an object containing results.

Included keys in `data` are:
- `available` *(boolean)* whether the name is available or not
- `name` *(string)* the name you are checking for
- `unique_name` *(string)* a unique name this module would get

#### GET `/tryNew/:gitHubURL`
*(statusCode: 200 | 404 | 500)*

*(data: Object | null)* Fetches `module.json` from specified GitHub repository
and checks its permissions for publishing against the database.

Response `status` options:
- `OK` for a new module that is allowed to publish
- `DUPL_OK` for a module that already exists, but is allowed for update
- `DUPL_DENY` for a module with already existing name coming from different author
- `ERR` if `module.json` was not found

Returned `data` object includes `module.json` contents plus `unique_name`
`github` and `last_updated`.

#### POST `/publishNew`
Takes request in JSON format, will look for `gitHubURL` key.

*(statusCode: 201 | 404 | 500)*

*(data: Object | null)* Fetches module from GitHub and publishes to Framer
Modules database.

Returned `data` object includes all keys in database associated with the module.
Those are specifically `_id` `name` `unique_name` `description` `author`
`require` `install` `example` `dependencies` `(thumb)` `github` `last_updated`
`installed_count` `uninstalled_count`.

#### PUT `/installed/:moduleName`
#### PUT `/uninstalled/:moduleName`
*(statusCode: 201 | 403 | 404 | 500)*

*(data: null)* Updates `installed_count` or `uninstalled_count`
statistics of a single module.

Please note the update is only allowed when requested from within
Framer Modules app. If you try updating stats by requests from browser,
you'll get `{statusCode: 403, status: 'DENY'}`.

---

## Database (NoSQL)
The registry stores `module.json` files containing metadata about individual modules.

The database is currently running on a free *MongoDB Atlas* cluster and the server
uses Mongoose for easier data modeling.

### `Module` Model
`name` (String)

`unique_name` (String)

`description` (String)

`author` (String)

`require` (String)

`install` (String | Array)

`example` (String)

`dependencies` (Array, *optional*, default `[]`)

`github` (String)

`thumb` (String, *optional*)

`installed_count` (Number, default `0`)

`uninstalled_count` (Number, default `0`)

`last_updated` (Date, default `Date.now()`)

#### Indexes
- Ascending *unique index* on `unique_name`
- *Text index* on `name` `description` `author` `github`
- *Descending index* on `installed_count`
- *Ascending index* on `uninstalled_count`

### `Log` Model
`request` (String)

`request_timestamp` (Date, default `Date.now()`)

`request_ip` (String)

`request_ua` (String)

`request_method` (String)

`request_body` (Object)

`response_timestamp` (Date, default `Date.now()`)

`response_status` (Object)

`response_statusCode` (Number)

#### Indexes
- *Descending index* on `request_timestamp`

---

## Contribute
You will need a dump of the database for local development. Until I implement
a public backup download, [e-mail me](mailto:kyselyradek@gmail.com) for the `dump`.

## Main Repository
[Framer Modules](https://github.com/kysely/framer-modules)

## License
MIT
