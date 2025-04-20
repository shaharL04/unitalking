
# Unitalking

The **Unitalking** platform is a global chat solution that empowers users to engage in real-time conversations across multiple languages. By leveraging a robust WebSocket-based messaging system alongside LibreTranslate, Unitalking eliminates language barriers, enabling seamless and interactive communication.

## Features

- **Real-Time Messaging**: Experience instantaneous message delivery and interaction through our WebSocket-powered chat system.
- **Multilingual Conversations**: Automatic translation of messages via the LibreTranslate API enables seamless cross-language communication.
- **Interactive Chat Interface**: Enjoy an intuitive and responsive UI designed for both desktop and mobile experiences.
- **User Presence Indicators**: Monitor active user statuses and engage with a dynamic community in real time.

## Technologies Used

- **Frontend**: React.js, JavaScript, CSS
- **Backend**: TypeScript, Express.js, Socket.io, PostgreSQL
- **Real-Time Messaging**: WebSockets (via Socket.io)
- **Translation Integration**: LibreTranslate

## 🚀 Getting Started

Follow these steps to get the Unitalking platform up and running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/shaharL04/unitalking.git
cd unitalking
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 4. Start Redis Using Docker

Make sure Docker is installed and running on your system. Then run:

```bash
docker run --name redis -p 6379:6379 -d redis
```

If Redis is already running, you can skip this step.

### 5. Set Up Environment Variables

Create a `.env` file in the backend directory and add the following environment variables:

```env
DB_USER=USER
DB_PASSWORD=PASSWORD
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=unitalking
```

Update the values according to your setup.

### 6. Run the Backend Server

```bash
cd backend
npm run dev
```


## Demo

<img src="https://github.com/user-attachments/assets/b8eac477-a391-45ec-a2d2-cc3512af8f60" alt="unitalking1" width="300" height="600">
<img src="https://github.com/user-attachments/assets/1406aae2-98fb-4231-a939-02f6e15396b8" alt="unitalking2" width="300" height="600">
<img src="https://github.com/user-attachments/assets/735ce1fb-93e4-42d9-ae7e-1441124275b8" alt="unitalking3" width="300" height="600">
<img src="https://github.com/user-attachments/assets/e9593d8a-7976-4a2d-8039-a6dcc934691e" alt="unitalking4" width="300" height="600">
<img src="https://github.com/user-attachments/assets/e9304e48-7ef3-462b-84c6-dae766750854" alt="unitalking7" width="300" height="600">
<img src="https://github.com/user-attachments/assets/67eb18e5-8757-45df-b9e4-b703fd27e322" alt="unitalking6" width="300" height="600">
<img src="https://github.com/user-attachments/assets/8d94c6b5-6d18-4387-9c13-e67f7da03f31" alt="unitalking5" width="300" height="600">
<img src="https://github.com/user-attachments/assets/8648c487-e418-4ef3-a1d1-86ce04e294cd" alt="unitalking8" width="300" height="600">

