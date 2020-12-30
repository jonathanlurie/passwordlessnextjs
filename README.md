# passwordlessnextjs
A React boilerplate to passwordless secure login with Next.js using refresh tokens and access tokens.



# Auth flow
todo

# Stack
- *[Next.js](https://nextjs.org/docs/api-reference/create-next-app)* project backbone for both frontend and backend
- *[Ant Design](https://ant.design/)* for UI components (but this does not really matter)
- *[MongoDB](https://www.mongodb.com/)* for storing users' data
- *[Sendgrid](https://github.com/sendgrid/sendgrid-nodejs/tree/main/packages/mail)* to send email for passwordless login
- *[node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)* to create JWT for both refresh tokens and access tokens (and some other such as login and register)
- *[Cookies](https://github.com/jshttp/cookie)* to manage cookies from server-side
