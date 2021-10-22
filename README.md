# GraphQL and Github Example: Most Starred GitHub Extensions

Run `npm i`and then `npm start`. Visit <localhost:8000>

## EJS

* [EJS tutorial](https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application)

## Related Links

* [Graphql Pagination gist](https://gist.github.com/obahareth/d974afa16ac84182abc293b306e25928): GitHub GraphQL API Starred Repositories Examples With Pagination
* Watch the tutorial [video](https://youtu.be/YxgNZgOKBzQ).


## Offset branch 

* [How to search specific page through GitHub API V4](https://stackoverflow.com/questions/64115904/how-to-search-specific-page-through-github-api-v4)

```
➜  express-web-app-graphql-client-showing-gh-extensions git:(offset) ✗ node
Welcome to Node.js v16.0.0.
Type ".help" for more information.
> base64 = require('base-64');
{
  encode: [Function: encode],
  decode: [Function: decode],
  version: '1.0.0'
}
> base64.decode("Y3Vyc29yOjEwMA==")
'cursor:100'
> base64.encode("cursor:100")
'Y3Vyc29yOjEwMA=='
```