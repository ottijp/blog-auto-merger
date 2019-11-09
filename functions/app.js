module.exports= class App {
  constructor(apiClient) {
    this.apiClient = apiClient
  }

  async mergeReservedPosts() {
    console.log('start merging')
    const pulls = await this.apiClient.getPulls()
    console.log('pulls', JSON.stringify(pulls.data.map(pull => pull.title)))
    const targets = pulls.data.filter(pull => {
      return App._shouldMergePull(pull.title, new Date())
    })
    console.log('target pulls', JSON.stringify(targets.map(target => target.title)))
    await this.apiClient.mergePulls(targets.map(t => t.number))
    console.log('completed merging')
  }

  /**
   * returns if PR should merge
   *
   * returns true if reserved date is before `currentDate`.
   * PR title must be `reserve-YYYYMMMDD-hhmmss` based on reserved date.
   */
  static _shouldMergePull (prName, currentDate) {
    const m = prName.match(/reserve-([0-9]{4})([0-9]{2})([0-9]{2})-([0-9]{2})([0-9]{2})([0-9]{2})/)
    if (!m) return false

    const reservedDate = Date.parse(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}+09:00`)

    return reservedDate <= currentDate
  }
}
