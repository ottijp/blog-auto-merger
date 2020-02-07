const axios = require('axios')

const BASE_URL = 'https://api.github.com'

module.exports = class ApiClient {
  constructor(owner, repo, token) {
    this.owner = owner
    this.repo = repo
    this.token = token
  }

  async getPulls () {
    return await axios.get(`${BASE_URL}/repos/${this.owner}/${this.repo}/pulls`, {
      headers: {
        Authorization: `token ${this.token}`,
      }
    })
  }

  async mergePulls (numbers) {
    await Promise.all(numbers.map(number => {
      return axios.put(`${BASE_URL}/repos/${this.owner}/${this.repo}/pulls/${number}/merge`, {
        headers: {
          Authorization: `token ${this.token}`,
        }
      })
    }))
  }
}
