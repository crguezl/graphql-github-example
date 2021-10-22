# GraphQL and Github Example: Most Starred GitHub Extensions

Run `npm i`and then `npm start`. Visit <localhost:8000>

## EJS

* [EJS tutorial](https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application)

## Pagination in GraphQL

* [Graphql Pagination gist](https://gist.github.com/obahareth/d974afa16ac84182abc293b306e25928): GitHub GraphQL API Starred Repositories Examples With Pagination
* [How to search specific page through GitHub API V4](https://stackoverflow.com/questions/64115904/how-to-search-specific-page-through-github-api-v4) in StackOverflow

See branch `offset` in this repo  for a demo of how GitHub

```
➜  express-web-app-graphql-client-showing-gh-extensions git:(offset) npm start

> graphql@1.0.0 start
> node index.js $@

App listening on port 8000!
{
  "data": {
    "search": {
      "__typename": "SearchResultItemConnection",
      "edges": [
        {
          "__typename": "SearchResultItemEdge",
          "cursor": "Y3Vyc29yOjE=",
          "node": {
            "__typename": "Repository",
            "description": "GitHub CLI extension for fuzzy finding, quickly switching between and deleting branches.",
            "nameWithOwner": "mislav/gh-branch",
            "stargazers": {
              "__typename": "StargazerConnection",
              "totalCount": 115
            },
            "url": "https://github.com/mislav/gh-branch"
          }
        },
        {
          "__typename": "SearchResultItemEdge",
          "cursor": "Y3Vyc29yOjI=",
          "node": {
            "__typename": "Repository",
            "description": "full terminal animations",
            "nameWithOwner": "vilmibm/gh-screensaver",
            "stargazers": {
              "__typename": "StargazerConnection",
              "totalCount": 57
            },
            "url": "https://github.com/vilmibm/gh-screensaver"
          }
        },
        ...
        {
          "__typename": "SearchResultItemEdge",
          "cursor": "Y3Vyc29yOjEw",
          "node": {
            "__typename": "Repository",
            "description": "Small gh extension that suggests issues to work on in a given GitHub repository",
            "nameWithOwner": "vilmibm/gh-contribute",
            "stargazers": {
              "__typename": "StargazerConnection",
              "totalCount": 15
            },
            "url": "https://github.com/vilmibm/gh-contribute"
          }
        }
      ],
      "repositoryCount": 97
    }
  },
  "loading": false,
  "networkStatus": 7
}
lastCursor: <Y3Vyc29yOjEw>
base64.decode(lastCursor): <cursor:10>
base64.encode('cursor:'+counter+repos.length-1): Y3Vyc29yOjEw
```

Observe how the GitHub implementation of the cursor is the base64 encode of the expression `"count:<number>"`

## References

* Watch the tutorial [video](https://youtu.be/YxgNZgOKBzQ).

