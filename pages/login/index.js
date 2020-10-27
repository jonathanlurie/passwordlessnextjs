import React from 'react'

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }


  onClick = async () => {
    const res = await fetch('/api/login',
    {
      method: 'POST',
      body: JSON.stringify({firstname: 'Johnny', lastname: 'Bravo'})
    })

    const resObj = await res.json()
    console.log('resObj:', resObj)
  }


  render() {
    return (
      <div>
        This is the login page
        
        <div onClick={this.onClick}>
          click here
        </div>
      </div>
    )
  }
}