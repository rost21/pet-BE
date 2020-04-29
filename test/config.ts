const EasyGraphQLLoadTester = require('easygraphql-load-tester')
const fs = require('fs')
const path = require('path')

const schema = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8')

const args = {
  getProject: {
    id: '5e6ebd9e1a20ee76c8664296'
  }
}

const loadTester = new EasyGraphQLLoadTester([schema], args);

const testCases = loadTester.artillery({
  selectedQueries: ['tasks'],
  withMutations: false
});

module.exports = {
  testCases
}