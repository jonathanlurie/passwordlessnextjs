# passwordlessnextjs
A React boilerplate to passwordless secure login with Next.js using refresh tokens and access tokens.

Since this project is using a local LMDB key-value database to store the content (rather than a DB on a server such as MongoDB or MySQL), it requires a persistent storage and makes it not suitable to host on services such as Vercel. That being said, the DB layer of this project can be modified.

# Auth flow
todo

# Stack
- *[Next.js](https://nextjs.org/docs/api-reference/create-next-app)* project backbone for both frontend and backend
- *[Ant Design](https://ant.design/)* for UI components (but this does not really matter)
- *[lmdb-store](https://github.com/DoctorEvidence/lmdb-store)* as a local key-value database
- *[Sendgrid](https://github.com/sendgrid/sendgrid-nodejs/tree/main/packages/mail)* to send email for passwordless login
- *[node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)* to create JWT for both refresh tokens and access tokens
- *[Cookies](https://github.com/jshttp/cookie)* to manage cookies from server-side

# TODO
- backend middleware to get the access token
- create dummy endpoint that uses the access token + with both get and POST/UPDATE
- update last connection date when hitting the /api/refresh endpoint
- add SDK function to get the user data and user extras