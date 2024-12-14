/*
  #### **Middleware for Restricted Access**
  - [ ] Implement middleware in `api/middleware/restricted.js` to restrict access to authenticated users only
  - [ ] Ensure that [GET] `/api/jokes` is protected and requires a valid JWT token for access
*/
module.exports = (req, res, next) => {
  next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
