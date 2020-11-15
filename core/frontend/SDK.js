export default class SDK {
  static async hasEmail(email) {
    const res = await fetch(`/api/hasemail?email=${encodeURIComponent(email)}`)
    const json = await res.json()
    return json.found
  }


  static async hasUsername(username) {
    const res = await fetch(`/api/hasusername?username=${encodeURIComponent(username)}`)
    const json = await res.json()
    return json.found
  }


  static async hasEmailOrUsername(emailOrUsername) {
    const res = await fetch(`/api/hasemailorusername?emailorusername=${encodeURIComponent(emailOrUsername)}`)
    const json = await res.json()
    return json.found
  }

}