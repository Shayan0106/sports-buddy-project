# Sports Buddy ⚽🏀🎾

Sports Buddy is a full-stack web application designed for sports enthusiasts to find, create, and join local sporting events. It provides a platform for users to connect with teammates and manage their activities, with a separate administrative dashboard for managing site-wide data.

**Live Demo:** [Link to your deployed site will go here]

---

## Features

- **User Authentication:** Secure user registration, login, and logout functionality using Firebase Authentication.
- **Role-Based Access Control:** Differentiates between regular users and admins, with a protected dashboard accessible only to admins.
- **Event Management (CRUD):** Logged-in users can Create, Read, Update, and Delete their own sports events.
- **Admin Dashboard:** Admins can centrally manage the site's core data, including sports categories, cities, and areas.
- **Dynamic Event Creation:** User forms are dynamically populated with dropdowns using data managed by the admin in Firestore.
- **Real-time Search:** Users can instantly filter events on the home page by title, sport, or location.
- **User Profiles:** A personalized profile page for users to view a list of all the events they have created.
- **Modern UI/UX:** Features a responsive design with a hero image slider and styled components for a clean user experience.

---

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS
- **Backend & Database:** Firebase (Authentication, Firestore, Storage)
- **Routing:** React Router DOM

---

## Local Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/sports-buddy-project.git](https://github.com/your-username/sports-buddy-project.git)
    cd sports-buddy-project
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Firebase:**

    - Create a new project at the [Firebase Console](https://console.firebase.google.com/).
    - Create a new Web App within the project.
    - Enable **Authentication** (Email/Password), **Firestore Database**, and **Storage**.
    - Copy your `firebaseConfig` object from your Firebase project settings.
    - In the project, create a file at `src/config/firebase.js`.
    - Paste your `firebaseConfig` object into it and export the initialized services. **(Important: This file is in `.gitignore` and should not be committed with your keys).**
  
4.  To connect the "SPORTS_BUDDY" application to its backend services, you will need to add a Firebase configuration file. This file contains the necessary API keys and is not included in the main repository for security reasons.

Please follow these steps carefully:

Navigate to the project's root directory (e.g., sports-buddy-project-main).

Inside the src folder, create a new folder named config.

Inside this new src/config folder, create a file named firebase.js.

Open the newly created firebase.js file and paste the API you are getting from your own firebase console after creating your own one in the firebase.

[Paste the entire firebase.js code block that you are sending them here]
After creating and saving the file with the code, you can proceed to run the project from your terminal using the npm run dev command. It should now connect to Firebase successfully.

5.  **Run the application:**
    `bash
    npm run dev
    `
    The application will be available at `http://localhost:5173`.
