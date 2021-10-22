const express = require('express');
const app = express()
const { ApolloClient, InMemoryCache, HttpLink, gql } = require('@apollo/client');
const fetch = require('node-fetch');

//Fill in the GraphQL endpoint and your Github Secret Access Token inside secrets.

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
  search(query: "topic:gh-extension sort:stars", type: REPOSITORY, first: 10) {
    repositoryCount
    nodes {
      ... on Repository {
        nameWithOwner
        description
        url
        stargazers {
          totalCount
        }
        #updatedAt
        #createdAt
        #diskUsage
      }
    }
  }
}
`})
    .then(r => {
      const repos = r.data.search.nodes;
      const data = JSON.stringify(r, null, 2);
      console.log(data)
      res.render('pages/index',{ repos: repos});
      //res.send(data)
    })
    .catch(error => console.error(error))
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

app.listen(8000, () => console.log(`App listening on port 8000!`))