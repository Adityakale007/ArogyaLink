# 🏥 **ArogyaLink - Healthcare Connectivity Platform**

*A comprehensive healthcare ecosystem connecting Patients, ASHA Workers, PHC Doctors, and Pharmacies*

---

## 🚀 **Overview**

ArogyaLink is a **production-grade healthcare platform** that bridges the gap between rural communities and healthcare providers. The platform enables:

* **Multi-role user management** (Patients, ASHA Workers, PHC Doctors, Pharmacy)
* **Real-time communication** via Socket.IO chat
* **Health record management** and tracking
* **Emergency SOS** functionality
* **Specialized health modules** (Child Health, Women's Health)
* **Pharmacy inventory management**
* **Role-based dashboards** with personalized features
* **Cross-platform mobile app** (iOS, Android, Web)

This system demonstrates a complete healthcare ecosystem similar to platforms like **Practo, 1mg, and Apollo 24/7**, with a focus on rural healthcare connectivity.

---

## 🧠 **System Architecture**

```
React Native Mobile App (Expo)
    ↓
    ├── Patient Dashboard
    ├── ASHA Worker Dashboard  
    ├── PHC Doctor Dashboard
    └── Pharmacy Dashboard
         ↓
    Express.js Backend API
         ↓
    ├── MongoDB (User Data, Chat Messages)
    ├── Redis (Real-time Socket Management)
    └── Socket.IO (Real-time Chat)
```

---

## ✨ **Key Features**

### 🔹 **1. Multi-Role Healthcare Platform**

* **Patients**: Access health records, chat with doctors, request consultations, emergency SOS
* **ASHA Workers**: Home visit tracking, patient record uploads, real-time doctor collaboration
* **PHC Doctors**: Patient management, consultations, health record reviews, prescriptions
* **Pharmacy**: Inventory management, stock tracking, order management

---

### 🔹 **2. Real-Time Communication (Socket.IO)**

* **Instant messaging** between patients, workers, and doctors
* **Typing indicators** for better UX
* **Offline message queuing** using Redis
* **Persistent chat history** stored in MongoDB
* **User presence tracking** via Redis socket mapping

---

### 🔹 **3. Specialized Health Modules**

#### **Child Health Dashboard**
* Vaccination tracker with schedules
* Growth milestones tracking
* Symptom & illness logging
* Wellness library
* Safety & SOS features

#### **Women's Health Dashboard**
* Period tracker
* Private consultations
* Wellness resources
* Safety features

---

### 🔹 **4. Emergency SOS System**

* Quick emergency contact access
* Direct communication with healthcare providers
* Safety features for vulnerable populations

---

### 🔹 **5. Pharmacy Management**

* Stock management
* Inventory tracking
* Order management
* Reports and analytics

---

### 🔹 **6. Health Record Management**

* Digital health records
* Past reports access
* Patient data uploads by ASHA workers
* Doctor access to complete patient history

---

### 🔹 **7. Modern UI/UX**

* **Theme support** (Light/Dark mode)
* **Responsive design** for all screen sizes
* **NativeWind** (TailwindCSS for React Native)
* **Smooth animations** and gestures
* **Accessibility features**

---

## 🛠️ **Tech Stack**

### **Frontend (Mobile App)**

* **React Native** (0.81.4) - Cross-platform mobile framework
* **Expo** (~54.0.10) - Development platform and tooling
* **React Navigation** (v7) - Navigation library
  * Stack Navigator
  * Bottom Tab Navigator
  * Material Top Tabs
* **React Native Paper** (v5.14.5) - Material Design components
* **NativeWind** (v4.2.1) - TailwindCSS for React Native
* **Socket.IO Client** (v4.7.2) - Real-time communication
* **React Native Chart Kit** (v6.12.0) - Data visualization
* **Expo Image Picker** - Image selection and upload
* **AsyncStorage** - Local data persistence
* **React Context API** - State management (Auth, Theme)

### **Backend**

* **Node.js** - Runtime environment
* **Express.js** (v4.21.1) - Web framework
* **MongoDB** - NoSQL database
* **Mongoose** (v8.7.1) - MongoDB ODM
* **Socket.IO** (v4.7.2) - WebSocket server
* **Redis** (v4.6.12) / **ioredis** (v5.3.2) - Caching and real-time data
* **bcryptjs** (v2.4.3) - Password hashing
* **CORS** - Cross-origin resource sharing
* **dotenv** - Environment variable management

### **DevOps / Deployment**

* **Expo** - Mobile app deployment
* **MongoDB Atlas** - Cloud database
* **Redis Cloud / Upstash** - Cloud Redis
* **GitHub** - Version control

---

## 📁 **Project Structure**

```
ArogyaLink/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema (Patient, Worker, Doctor)
│   │   └── ChatMessage.js       # Chat message schema
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   └── chat.js              # Chat API endpoints
│   ├── server.js                # Express server + Socket.IO
│   └── package.json
│
├── components/
│   ├── auth/
│   │   ├── StartPage.js         # Landing page
│   │   ├── signin/
│   │   └── signup/
│   ├── patient/                 # Patient dashboard & features
│   ├── asha_worker/             # ASHA Worker dashboard & features
│   ├── doctor/                  # Doctor dashboard & screens
│   ├── pharma/                  # Pharmacy management
│   ├── child/                   # Child health module
│   ├── women/                   # Women's health module
│   ├── settings/                # App settings
│   └── profile/                 # User profile
│
├── contexts/
│   ├── AuthContext.js           # Authentication state
│   └── ThemeContext.js          # Theme state (Light/Dark)
│
├── utils/
│   ├── socket.js                # Socket.IO client utilities
│   └── logout.js                # Logout utility
│
├── config/
│   └── api.js                   # API configuration
│
├── App.js                       # Main app component
├── package.json
└── app.json                     # Expo configuration
```

---

## ⚙️ **Backend: API Workflow**

### **1. Authentication**

`POST /api/auth/signup`
* Register new user (Patient, ASHA Worker, PHC Doctor)
* Password hashing with bcrypt
* Role-based user creation

`POST /api/auth/signin`
* User login (email/mobile + password)
* Returns user data and authentication token

---

### **2. Real-Time Chat**

`POST /api/chat/messages`
* Send chat messages
* Store in MongoDB
* Real-time delivery via Socket.IO

**Socket.IO Events:**
* `join` - User joins their personal room
* `send_message` - Send message to another user
* `receive_message` - Receive incoming message
* `typing` - Typing indicator
* `user_typing` - Receive typing status

---

### **3. Health Check**

`GET /api/health`
* Server status check

---

## 🧪 **Frontend Features**

### ✔ Role-Based Navigation

* Dynamic dashboard based on user role
* Separate navigators for each role
* Protected routes with authentication

### ✔ Real-Time Chat

* Socket.IO integration for instant messaging
* Message persistence
* Typing indicators
* Offline message queuing

### ✔ Health Tracking

* Symptom logging
* Vaccination schedules
* Growth milestones
* Period tracking

### ✔ Emergency Features

* SOS functionality
* Quick contact access
* Safety features

### ✔ Theme Support

* Light/Dark mode toggle
* Persistent theme preference
* System theme detection

---

## 🧪 **Run Locally**

## **1. Clone Repository**

```bash
git clone https://github.com/<username>/ArogyaLink.git
cd ArogyaLink
```

---

## 🖥️ **Backend Setup**

```bash
cd backend
npm install
```

Create `.env` file in `backend/`:

```env
MONGODB_URI=mongodb://localhost:27017/arogyalink
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arogyalink

REDIS_HOST=localhost
REDIS_PORT=6379
# OR for Redis Cloud:
# REDIS_URL=redis://default:password@host:port

PORT=4000
NODE_ENV=development
```

**Start Backend Server:**

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:4000`

---

## 📱 **Frontend Setup**

```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on specific platform
npm run android    # Android
npm run ios        # iOS
npm run web        # Web browser
```

**Configure API Base URL:**

Update `config/api.js`:
```javascript
// For iOS Simulator
export const API_BASE_URL = 'http://localhost:4000/api';

// For Android Emulator
export const API_BASE_URL = 'http://10.0.2.2:4000/api';

// For Physical Device (use your computer's IP)
export const API_BASE_URL = 'http://192.168.1.100:4000/api';
```

---

## 🔐 **Environment Variables**

### **Backend (.env)**

```env
MONGODB_URI=<your-mongodb-connection-string>
REDIS_HOST=<redis-host>
REDIS_PORT=<redis-port>
PORT=4000
NODE_ENV=development
```

### **Frontend (config/api.js)**

Update `API_BASE_URL` based on your deployment:
- Local development: `http://localhost:4000/api`
- Production: `https://your-backend-domain.com/api`

---

## 🎯 **Core Skills Demonstrated**

### 🔥 **System Design**

* Multi-role architecture
* Real-time communication system
* Scalable backend with Redis caching
* Role-based access control

### 🔥 **Backend Engineering**

* RESTful API design
* WebSocket implementation (Socket.IO)
* Database modeling with Mongoose
* Redis for real-time features
* Password security with bcrypt

### 🔥 **Frontend Engineering**

* React Native cross-platform development
* Complex navigation structures
* Real-time state management
* Context API for global state
* Theme system implementation
* Responsive UI design

### 🔥 **Mobile Development**

* Expo framework
* Native module integration
* Image picker functionality
* Push notifications (Expo Notifications)
* Platform-specific optimizations

### 🔥 **DevOps**

* Environment configuration
* Database connection management
* Socket.IO deployment
* Cross-platform deployment

---

## 📱 **User Roles & Features**

### **👤 Patient**
- Health dashboard
- Chat with doctors
- Request consultations
- View past reports
- Emergency SOS
- Child health tracking
- Women's health tracking

### **👩‍⚕️ ASHA Worker**
- Patient management
- Upload patient records
- Chat with patients and doctors
- Schedule management
- Home visit tracking
- Private consultations

### **👨‍⚕️ PHC Doctor**
- Patient list and management
- Real-time consultations
- Health record reviews
- Prescription management
- Notifications
- Reports and analytics

### **💊 Pharmacy**
- Inventory management
- Stock tracking
- Order management
- Reports and analytics

---

## 🔄 **Real-Time Features**

### **Socket.IO Implementation**

* **User Presence**: Track online/offline status
* **Message Delivery**: Instant message delivery
* **Typing Indicators**: Real-time typing status
* **Offline Queue**: Messages queued in Redis for offline users
* **Room Management**: Personal rooms per user

---

## 🎨 **UI/UX Features**

* **Material Design** components (React Native Paper)
* **TailwindCSS** styling (NativeWind)
* **Dark/Light Theme** support
* **Smooth Animations** (React Native Reanimated)
* **Gesture Handling** (React Native Gesture Handler)
* **Safe Area** handling for notched devices

---

## 📊 **Database Schema**

### **User Model**
```javascript
{
  name: String (required),
  email: String (optional),
  mobile: String (required, 10 digits),
  password: String (hashed with bcrypt),
  role: Enum ['Patient', 'Asha Worker', 'PHC Doctor'],
  isApproved: Boolean,
  profilePhoto: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **ChatMessage Model**
```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  message: String,
  chatRoomId: String,
  createdAt: Date
}
```

---

## 🚀 **Deployment**

### **Backend**
- Deploy to **Render**, **Heroku**, or **AWS**
- Set environment variables
- Configure MongoDB Atlas
- Set up Redis Cloud

### **Frontend**
- Build with **Expo EAS Build**
- Deploy to **App Store** and **Google Play**
- Or use **Expo Go** for development

---

## 📝 **Future Enhancements**

* [ ] Push notifications for messages
* [ ] Video consultation support
* [ ] File sharing in chat
* [ ] Advanced analytics dashboard
* [ ] Multi-language support
* [ ] Offline mode with sync
* [ ] Appointment scheduling
* [ ] Prescription digital signatures
* [ ] Integration with health devices
* [ ] AI-powered health recommendations

---

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

---


## 👤 **Author**

**Aditya Kale**

---

## 🙏 **Acknowledgments**

* Built with React Native and Expo
* Inspired by healthcare platforms like Practo, 1mg, and Apollo 24/7
* Designed for rural healthcare connectivity in India

---

## 📞 **Support**

For support, email [your-email] or open an issue in the repository.

---

**Made with ❤️ for better healthcare connectivity**
