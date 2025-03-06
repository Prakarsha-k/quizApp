
### **Project Overview**

The **MERN Stack Quiz App** is a web-based platform where users can create, take, and manage quizzes. The app is built using the **MERN stack** (MongoDB, Express.js, React, Node.js) to provide a seamless and interactive experience for both **admins** and **students**. The app allows **admins** to create and manage quizzes, while **students** can take quizzes by entering a secret key and view their scores after completion.

This README will guide you through the features, setup instructions, and technologies used in the project.

---

## **Features**

### **Admin Features**
- **Admin Login**: Admins can securely log in to the application.
- **Quiz Management**:
  - **Create Quiz**: Admins can create quizzes by specifying a title, questions, time limits, and a secret key.
  - **Update Quiz**: Admins can edit quiz details.
  - **Delete Quiz**: Admins can delete quizzes they have created.
- **View Quizzes**: Admins can view the list of quizzes they have created.

### **Student Features**
- **Student Login**: Students can log in to the app.
- **Quiz List**: Students can view a list of available quizzes.
- **Enter Secret Key**: To access a specific quiz, students must enter a secret key assigned to that quiz.
- **Take Quiz**: Students can take the quiz by answering questions within a time limit.
- **View Scores**: After completing a quiz, students can view their scores.

---

## **Technologies Used**

- **Frontend**:
  - **React**: The user interface is built using React, providing a dynamic and responsive experience.
  - **React Router**: For navigation between different pages (Admin Login, Student Login, Home, Quiz Page, etc.).
  - **Bootstrap**: For responsive and clean UI design.
  - **Axios**: For making HTTP requests to the backend API.

- **Backend**:
  - **Node.js**: The backend server is built using Node.js, providing a fast and scalable environment.
  - **Express.js**: A web framework for building APIs and handling HTTP requests.
  - **MongoDB**: A NoSQL database to store data for quizzes, users (admins and students), scores, and AI-generated questions.
  - **JWT (JSON Web Token)**: Used for secure authentication. Admins and students are authenticated using tokens.

- **Miscellaneous**:
  - **bcryptjs**: For hashing and securing passwords.
  - **dotenv**: For managing environment variables.


---

## **Database Schema**

The app uses a MongoDB database with the following collections:

- **users**: Stores user data (admins and students) with fields such as `username`, `password`, and `role`.
- **quizzes**: Stores quiz details such as `title`, `questions`, `timeLimit`, `secretKey`, and the `adminId` (ID of the creator).


---

## **Setup Instructions**

### **1. Clone the repository:**
```bash
git clone https://github.com/your-username/quiz-app.git
```

### **2. Install dependencies:**

- For **frontend**:
  Navigate to the `frontend` directory and install the dependencies:
  ```bash
  cd frontend
  npm install
  ```

- For **backend**:
  Navigate to the `backend` directory and install the dependencies:
  ```bash
  cd backend
  npm install
  ```

### **3. Set up environment variables:**

- Create a `.env` file in the root of the **backend** directory (`server`):
  
  ```bash
  JWT_SECRET=your_jwt_secret_key
  MONGO_URI=your_mongodb_connection_string
  ```

- Replace `your_jwt_secret_key` and `your_mongodb_connection_string` with your own values.

### **4. Run the project:**

- Start the backend server:
  ```bash
  cd backend
  npm start
  ```

- Start the frontend development server:
  ```bash
  cd frontend
  npm start
  ```

- The frontend will be available at `http://localhost:3000` and the backend will be available at `http://localhost:5000`.

---

## **Usage**

1. **Admin Login**: Go to the Admin Login page, enter the username and password, and log in. Once logged in, you can create, update, and delete quizzes.
   
2. **Student Login**: Go to the Student Login page, enter your credentials, and start exploring the quizzes available. You will need to enter the secret key for each quiz you want to take.

3. **Taking Quizzes**: Once logged in, students can access a list of quizzes, take them, and view their scores.

---

## **Future Enhancements**

- **AI-Generated Quizzes**: Add an AI-based system to generate questions and quizzes dynamically.
- **Real-time Updates**: Implement real-time updates for quiz results and leaderboards.
- **Quiz Timer**: Improve quiz timer functionality to give real-time feedback.

---



### **Conclusion**

This MERN stack quiz app is designed to make it easy for admins to create and manage quizzes while providing a user-friendly interface for students to take quizzes and view their results. The app is highly scalable and can be extended with additional features, such as AI-generated quizzes and real-time leaderboards, in the future.

