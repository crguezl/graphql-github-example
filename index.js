const express = require('express');
const app = express()
const { ApolloClient, InMemoryCache, HttpLink, gql } = require('@apollo/client');
const fetch = require('node-fetch');
let counter = 1;

const handler = (res, r) => {
  const repos = r.data.search.edges;
  if (repos.length) {
    let lastCursor = repos[repos.length-1].cursor;
    const data = JSON.stringify(r, null, 2);
    console.log(data)
    console.log(`lastCursor: s<${lastCursor}>`)
    res.render('pages/index',{ repos: repos, lastCursor: lastCursor, start: counter});
    counter += repos.length;
  } else {
    console.log('No more repos found!')
  }
}

//Fill in the GraphQL endpoint and your Github Secret Access Token inside secrets.
const numRepos = Number(process.argv[2]) || 10;

const firstQuery = gql`
{
  search(query: "topic:gh-extension sort:stars", type: REPOSITORY, first: ${numRepos} ) {
    repositoryCount
    edges {
      cursor
      node {
        ... on Repository {
          nameWithOwner
          description
          url
          stargazers {
            totalCount
          }
        }
      }
    }
  }
}
`;

const subsequentQueries = (cursor) => gql`
      {
        search(query: "topic:gh-extension sort:stars", type: REPOSITORY, first: ${numRepos}, after: "${cursor}") {
          repositoryCount
          edges {
            cursor
            node {
              ... on Repository {
                nameWithOwner
                description
                url
                stargazers {
                  totalCount
                }
              }
            }
          }
        }
      }
`

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.github.com/graphql", fetch, headers: {
      'Authorization': `Bearer ${process.env['GITHUB_TOKEN']}`,
    },
  }),
  cache
});

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  client
    .query({query: firstQuery})
    .then(r => handler(res,r))
    .catch(error => console.error(error))
});

app.get('/next/:cursor', function(req, res) {
  client
    .query({ query: subsequentQueries(req.params.cursor)})
    .then(r => handler(res,r))
    .catch(error => console.error(error))
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

app.listen(8000, () => console.log(`App listening on port 8000!`))