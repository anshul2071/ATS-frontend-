# NEXCRUIT

**NEXCRUIT** is a sophisticated, responsive single-page application designed to streamline the entire recruitment lifecycle. From candidate onboarding and resume parsing to assessments, interviews, offer management, background checks, and comprehensive analytics, NEXCRUIT provides a seamless end-to-end recruitment management experience.

Built with modern technologies like React, TypeScript, and Ant Design, NEXCRUIT offers a powerful yet intuitive interface for HR professionals and hiring managers to efficiently manage their recruitment pipeline.



## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#%EF%B8%8F-getting-started)
- [State Management](#%EF%B8%8F-state-management)
- [Services & API](#-services--api)
- [Routing](#-routing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 🚀 Features

### Authentication & User Management
- **Multiple Authentication Methods**:
  - Email/password signup & login with validation
  - Google One-Tap OAuth integration for frictionless authentication
- **Account Recovery**:
  - Comprehensive "Forgot password" workflow
  - OTP (One-Time Password) verification
  - Secure password reset via email links

### Candidate Lifecycle Management
- **Candidate Information Management**:
  - Create, update, and delete candidate profiles
  - Upload and parse resumes (supports PDF, DOCX, DOC, TXT)
  - Automatic extraction of candidate skills, experience, and education
- **Customizable Pipeline Management**:
  - Track candidates through configurable recruitment stages:
    - Application Received
    - Shortlisted
    - HR Screening
    - Technical Interview
    - Managerial Interview
    - Offer Extended
    - Hired
    - Rejected
    - Blacklisted
  - Visual indication of candidate progress and status

### Assessment Module
- **Comprehensive Assessment Capabilities**:
  - Assign assessments to candidates with detailed instructions
  - Support multiple file formats (PDF/DOC/XLS/PNG/GIF up to 10 MB)
  - Set target scores and evaluation criteria
- **Performance Tracking**:
  - Detailed assessment history and results
  - Score distribution statistics and analytics
  - Candidate performance comparison

### Interview Management
- **Efficient Scheduling System**:
  - Integrated interview scheduling with Google Calendar
  - Automatic Google Meet link generation for virtual interviews
  - Email notifications to candidates and interviewers
- **Interview Organization**:
  - Stage-specific interview templates (HR, Technical, Managerial)
  - Filter and view past/upcoming interviews
  - Track interviewer assignments and availability

### Offer & Rejection Management
- **Document Generation**:
  - Create customizable offer letter templates
  - Generate professional rejection letters with feedback options
  - Preview functionality before sending
- **Communication Workflow**:
  - Send offers/rejections via email directly from the platform
  - Track communication history and response rates
  - Automated follow-ups and reminders

### Background Verification
- **Reference Check System**:
  - Configure and send reference check requests
  - Customizable email templates for different reference types
  - Track response status and feedback

### Analytics & Reporting
- **Real-time Recruitment Metrics**:
  - Total candidates in pipeline
  - Interviews scheduled for today/this week
  - Pending offers and acceptances
  - Average time-to-hire and other KPIs
- **Visual Data Representation**:
  - Interactive charts showing pipeline distribution
  - Time-to-hire trends by department and position
  - Technology and skill breakdown of candidate pool
  - Source effectiveness analysis

## 🛠 Tech Stack

### Core Technologies
- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript
- **State Management**: Redux Toolkit

### UI/UX
- **Component Library**: Ant Design 5
- **Animations**: Framer Motion
- **Charts & Visualization**: Recharts
- **Form Handling**: 
  - React Hook Form
  - Ant Design Form components

### Infrastructure
- **Routing**: React Router v6
- **HTTP Client**: Axios with custom interceptors
- **Authentication**: JWT tokens with secure storage
- **Date Handling**: Moment.js

### File Processing
- **Document Parsing**: 
  - Mammoth (DOCX processing)
  - textract (PDF text extraction)
  - xlsx (Spreadsheet processing)

## 📂 Project Structure

```
nexcruit/
├── public/
│   └── index.html            # Single-page HTML shell
│
├── src/
│   ├── assets/               # Static assets
│   │   └── auth.jpg          # Authentication background image
│   │
│   ├── components/           # Reusable UI components
│   │   ├── ResumeParser.tsx  # Resume content extraction
│   │   ├── GoogleOneTap.tsx  # Google authentication component
│   │   ├── GoogleIcon.tsx    # Google icon for OAuth
│   │   ├── Layout.tsx        # Application layout wrapper
│   │   ├── CandidateCard.tsx # Candidate information card
│   │   └── AnalyticsCharts.tsx # Dashboard visualization charts
│   │
│   ├── constants/            # Application constants
│   │   ├── pipelineStages.ts # Recruitment pipeline stage definitions
│   │   └── types.ts          # Type definitions (OfferTemplate, etc.)
│   │
│   ├── pages/                # Route-level page components
│   │   ├── Home.tsx          # Landing page
│   │   ├── Register.tsx      # User registration
│   │   ├── Login.tsx         # Authentication
│   │   ├── ResetPassword.tsx # Password reset request
│   │   ├── VerifyOtp.tsx     # OTP verification
│   │   ├── SetPassword.tsx   # New password creation
│   │   ├── VerifyLink.tsx    # Email verification
│   │   ├── Profile.tsx       # User profile management
│   │   ├── SectionCustomization.tsx # UI customization options
│   │   ├── CVUpload.tsx      # Resume upload interface
│   │   ├── CandidateList.tsx # Candidates overview
│   │   ├── CandidateDetail.tsx # Individual candidate view
│   │   ├── AssessmentPage.tsx # Assessment management
│   │   ├── OfferPage.tsx     # Offer letter creation/management
│   │   ├── BackgroundCheck.tsx # Reference verification
│   │   ├── InterviewSchedule.tsx # Interview scheduling
│   │   ├── InterviewCalendar.tsx # Calendar view for interviews
│   │   ├── InterviewList.tsx # List of scheduled interviews
│   │   └── Dashboard.tsx     # Analytics dashboard
│   │
│   ├── routes/               # Routing configuration
│   │   └── AppRoutes.tsx     # React Router definitions
│   │
│   ├── services/             # API clients & business services
│   │   ├── axiosInstance.ts  # HTTP client with interceptors
│   │   ├── statsService.ts   # Analytics data fetching
│   │   ├── offerService.ts   # Offer management functions
│   │   └── types.ts          # Service type definitions
│   │
│   ├── store/                # Redux state management
│   │   ├── index.ts          # Store configuration
│   │   ├── hooks.ts          # Custom Redux hooks
│   │   └── userSlice.ts      # User authentication state
│   │
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Global styles
│   └── vite-env.d.ts         # Vite environment declarations
│
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or Yarn
- Backend API running at `VITE_API_BASE_URL` (defaults to http://localhost:5000/api)

### Installation

```bash
# Clone the repository
git clone https://github.com/anshul2071/ATS-frontend-.git

# Navigate to project directory
cd ATS-frontend-

# Install dependencies
npm install
# or
yarn install
```

### Environment Variables

Create a `.env` file in the project root:

```ini
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Authentication
VITE_GOOGLE_CLIENT_ID=<Your Google OAuth Client ID>
```

### Available Scripts

```bash
# Start development server with hot module replacement
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🏗️ State Management

NEXCRUIT uses Redux Toolkit for efficient state management:

- **User Authentication**: `userSlice.ts` manages user credentials (token, userId, name, email)
- **Typed Hooks**: Custom hooks in `store/hooks.ts` provide type-safe Redux access:
  - `useAppDispatch`: Typed dispatch function
  - `useAppSelector`: Type-safe state selector
- **Persistence**: Authentication state persists across sessions for seamless user experience

## 🔗 Services & API

### API Configuration

The `axiosInstance.ts` configures a reusable Axios client with:
- Base URL from environment variables (`VITE_API_BASE_URL`)
- Default JSON headers and CORS credentials
- Automatic token injection via interceptors (`Authorization: Bearer <token>`)
- Error handling and response formatting

### Core Services

- **Stats Service**: `statsService.fetchStats()` retrieves dashboard metrics from `/stats` endpoint
- **Offer Service**: 
  - `getOffers(candidateId)`: Retrieves offer history for a candidate
  - `sendOffer(candidateId, payload)`: Creates and sends new offers
  - Endpoints: `/candidates/:id/offers`

## 🔀 Routing

NEXCRUIT implements a secure routing system:

- **Protected Routes**: `AppRoutes.tsx` guards routes requiring authentication
- **Route Guards**: Authentication state verification before route access
- **Nested Layouts**: `Layout.tsx` ensures consistent UI with header/sidebar across protected routes
- **Redirect Logic**: Unauthenticated users are redirected to login

## 📦 Deployment

The application is deployed and accessible at: [https://ats-frontend-dun.vercel.app](https://ats-frontend-dun.vercel.app)

### Deployment Steps

1. Build the application for production:
   ```bash
   npm run build
   ```

2. The compiled assets will be available in the `dist/` directory

3. Deploy the `dist/` contents to any static hosting service:
   - Vercel (current deployment)
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

4. Ensure proper CORS configuration on your API server


### Environment Configuration

For production deployments, configure these environment variables:
- `VITE_API_BASE_URL`: Production API endpoint
- `VITE_GOOGLE_CLIENT_ID`: OAuth client ID for production
- `VITE_GOOGLE_CALENDAR_ID`: Google Calendar ID

## 🤝 Contributing

We welcome contributions to improve NEXCRUIT! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Write clear commit messages following conventional commits format
- Update documentation for any new features
- Add tests where applicable

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anshul Rawal**
- GitHub: [github.com/anshul2071](https://github.com/anshul2071)
- LinkedIn: [linkedin.com/in/anshulrawal](https://linkedin.com/in/anshulrawal)

---

Built with ❤️ using React, TypeScript & Ant Design
