# Movie Management Web App

# Steps to run this repo on your local

1. Clone this repository from the url https://github.com/Jabidabdul/movie-management.git.
2. Install npm packages using the command `npm install` if it gives any waring or version related issue please use the same command nad append `--legacy-peer-deps` key into it.
   - `npm install --legacy-peer-deps`
3. Start the backend server using the command `npm start` it will run a server on the port 3000, or at http://localhost:3000/
4. Once the server is started, open http://localhost:3000/ on a browser tab, it will redirect you lo login ( http://localhost:3000/login )route.
5. Try to login using your email and password, if not yet registered then please move to http://localhost:3000/register to create an account using your email and password.
6. If you find any connection related error with the database, please try to reinitiate the connection by the command

   - npx prisma migrate dev --name init

   - **If you get further more error related to connection with database using Prisma ORM, please follow this link (https://www.prisma.io/docs/concepts/components/prisma-client) to get it connected successfully**

   - Once connection create, It will show you database is successfully synced

7. Once you create/register your account get back to /login to get into your account.
8. On successful login you will be redirect to /movies ( http://localhost:3000/movies ) route where you can add, delete or edit your movies.

- **Add a Movie**: Click on the "Add Movie" button, fill in the required details, and click "Add Movie" to save.
- **Delete Movie**: Click the "Delete" button next to a movie to remove it from the list.
- **Edit Movie**: Click the "Edit" button next to a movie to edit it in the list.

9. Their is a logout button to get your account logged out successfully, then you will not be able to access /movies route if don't login again.
