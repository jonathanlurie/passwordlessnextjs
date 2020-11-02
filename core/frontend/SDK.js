export default class SDK {
  static async hasEmail(email) {
    const res = await fetch(`/api/hasemail?email=${encodeURIComponent(email)}`)
    const json = await res.json()
    return json.found
  }

  // TODO: add an account is just adding a record with magic link
}