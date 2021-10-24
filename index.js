const base64 = require("base-64")
const express = require('express');
const app = express()
const { ApolloClient, InMemoryCache, HttpLink, gql } = require('@apollo/client');
const fetch = require('node-fetch');
const numRepos = Number(process.argv[2]) || 10;

const handler = (res, r) => {
  //console.log(r);
  const repos = r.data.search.edges;
  const repoCount = r.data.search.repositoryCount
  if (repos.length) {
    let lastCursor = repos[repos.length-1].cursor;
    const data = JSON.stringify(r, null, 2);
    console.log(data)
    console.log(`lastCursor: <${lastCursor}>`)
    console.log(`base64.decode(lastCursor): <${base64.decode(lastCursor)}>`)
    // Tricky!! See [How to search specific page through GitHub API V4](https://stackoverflow.com/questions/64115904/how-to-search-specific-page-through-github-api-v4) in StackOverflow
    let offset = Number(base64.decode(lastCursor).replace(/^cursor:/,''))-repos.length+1
    console.log(`offset=${offset}`)
    console.log(`base64.encode('cursor:'+numRepos+repos.length-1): ${base64.encode('cursor:'+(numRepos+repos.length-1))}`)
  
    res.render('pages/index',{ repos: repos, lastCursor: lastCursor, offset: offset });
    console.log(`repoCount=${repoCount}`)
  } else {
      console.log('No more repos found!');
      console.log(`Array came empty repoCount=${repoCount}`)
  }
}


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

app.listen(7000, () => console.log(`App listening on port 7000!`))