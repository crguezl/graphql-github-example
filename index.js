const express = require('express');
const app = express()
const { ApolloClient, InMemoryCache, HttpLink, gql } = require('@apollo/client');
const fetch = require('node-fetch');

//Fill in the GraphQL endpoint and your Github Secret Access Token inside secrets.
const numRepos = Number(process.argv[2]) || 10;

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
    .query({
      query: gql`
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
      
`})
    .then(r => {
      const repos = r.data.search.edges;
      console.log(repos.length);
      console.log(repos[repos.length]-1);

      let lastCursor = repos[repos.length-1].cursor;

      console.log(lastCursor)
      const data = JSON.stringify(r, null, 2);
      console.log(data)
      res.render('pages/index',{ repos: repos, lastCursor: lastCursor});
      //res.send(data)
    })
    .catch(error => console.error(error))
});

app.get('/next/:cursor', function(req, res) {
  client
    .query({
      query: gql`
      {
        search(query: "topic:gh-extension sort:stars", type: REPOSITORY, first: ${numRepos}, after: "${req.params.cursor}") {
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
      
`})
    .then(r => {
      const repos = r.data.search.edges;
      const data = JSON.stringify(r, null, 2);
      console.log(repos.length);
      console.log(repos[repos.length]-1);
      let lastCursor = repos[repos.length-1].cursor;

      console.log(lastCursor)
      console.log(data)
      res.render('pages/index',{ repos: repos, lastCursor: lastCursor});
      //res.send(data)
    })
    .catch(error => console.error(error))
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

app.listen(8000, () => console.log(`App listening on port 8000!`))