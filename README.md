# R2 Software developer home assignment
## How to run
* Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (which includes `docker` and `docker compose` plugin).
* Clone this project.
* In `Terminal`, navigate to the project's root folder and run this command
  ```sh
  docker compose --project-name r2 up --build
  ```
* Open [`http://localhost:8080`](http://localhost:8080) and try the website.

## Assignment
The assignment is divided into phases, don't be fazed (🥁) if you don't complete all of them, they aren't meant to be completed.

### Phase 1
* Add a real backend instead of the `be-demo`, that runs using `nginx`, use whatever high-level programming language as you'd like, such as `Node.js`, `Python`, `C#` and etc.  
Call it `be-high-level`.
* Whatever programming language you chose, connect the backend to the rest of the app by creating a `Docker` image of that backend, and make the necessary to the `docker compose` so they will work together.  
* The backend should implment a rest-api that has 3 endpoints:
    * `/api/login`  
    Example request body:  
    `{ "email": "a@gmail.com", "password": "1234" }`  
    Example response:  
    `{ "token": "MOCK_TOKEN" }`  
    This route should be accessed by `POST` Method.  
    If the email is not valid or the password is different then `"r2isthebest"` then reject the login.  
    If logins correctly, generate a random `token` and store it memory indefinitely for later validation.  
    * `/api/logout`  
    No request body.  
    Request headers:  
    `"Authorization"`: `"Bearer MOCK_TOKEN"`  
    Example response:  
    `"OK"`  
    This route should be accessed by `POST` Method.  
    If the token is not valid, means it's not stored in memory, reject the response with proper status code and error.  
    If token is valid, remove it from memory.  
