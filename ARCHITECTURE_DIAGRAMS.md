# RBAC Authentication System - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            React Application (Frontend)                 │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                          │   │
│  │  ┌─────────────┐         ┌───────────────────────────┐  │   │
│  │  │  Pages      │         │   Redux Store (Auth)      │  │   │
│  │  │  - Login    │◄────────├─ accesToken              │  │   │
│  │  │  - Signup   │         │ refreshToken             │  │   │
│  │  │  - Main App │         │ roles, user data         │  │   │
│  │  └─────────────┘         └───────────────────────────┘  │   │
│  │         ▲                           ▲                    │   │
│  │         │                           │                    │   │
│  │         └──────────────┬────────────┘                    │   │
│  │                        │                                 │   │
│  │  ┌─────────────────────┴──────────────────────────────┐  │   │
│  │  │      ApiClient + Interceptors                      │  │   │
│  │  │ - Request: Add Authorization header                │  │   │
│  │  │ - Response: Handle 401 & refresh token             │  │   │
│  │  └──────────────┬──────────────────────────────────────┘  │   │
│  │                 │                                          │   │
│  └─────────────────┼──────────────────────────────────────────┘   │
│                    │                                              │
│                    │ HTTP/CORS                                    │
│                    │                                              │
└────────────────────┼──────────────────────────────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────┐
    │  NestJS Backend (API Server)           │
    ├────────────────────────────────────────┤
    │                                        │
    │  ┌──────────────────────────────────┐  │
    │  │  Auth Controller                 │  │
    │  │  - POST /auth/signup             │  │
    │  │  - POST /auth/login              │  │
    │  │  - POST /auth/logout             │  │
    │  │  - POST /auth/refresh            │  │
    │  │  - GET /auth/me                  │  │
    │  └──────────────────────────────────┘  │
    │                 ▲                       │
    │                 │                       │
    │  ┌──────────────┴──────────────────┐   │
    │  │  Auth Service + RBAC            │   │
    │  │  - JWT Token Generation         │   │
    │  │  - Password Hashing             │   │
    │  │  - Role Assignment              │   │
    │  │  - Token Validation             │   │
    │  └──────────────┬──────────────────┘   │
    │                 │                       │
    │  ┌──────────────┴──────────────────┐   │
    │  │  Prisma ORM                      │   │
    │  │  - User Model                    │   │
    │  │  - Organization Model            │   │
    │  │  - Role & Permission Models      │   │
    │  └──────────────┬──────────────────┘   │
    │                 │                       │
    └─────────────────┼───────────────────────┘
                      │
                      ▼
           ┌──────────────────────────┐
           │  PostgreSQL Database     │
           │  (with Prisma)           │
           │  - Users                 │
           │  - Organizations         │
           │  - Roles                 │
           │  - Permissions           │
           │  - RoleAssignments       │
           └──────────────────────────┘
```

## Authentication Flow - Signup

```
User
 │
 ├─ Navigate to /signup
 ▼
┌─────────────────────────────┐
│   Signup Page Loads         │
│   - Form with 5 fields      │
│   - 4 Role cards            │
│   - Validation rules        │
└─────────────────────────────┘
 │
 ├─ Fill form (email, password, name, organization, role)
 │
 └─ Click "Create Account"
    │
    ▼
┌─────────────────────────────────────────────────┐
│   Form Validation                               │
│   ✓ Email format check                          │
│   ✓ Password strength (min 6 chars)             │
│   ✓ Password confirmation match                 │
│   ✓ All fields required                         │
└─────────────────────────────────────────────────┘
    │
    ├─ Validation passes?
    ├─ Yes ──────────┐
    └─ No ────┐      │
             │      │
             ▼      │
        Show Error ─┼─ Wait for fix
                    │
                    │
                    ▼
        ┌─────────────────────────────────────┐
        │   Dispatch signupUser Thunk         │
        │   - Set loading: true               │
        │   - Clear previous errors           │
        └─────────────────────────────────────┘
             │
             ▼
        ┌─────────────────────────────────────┐
        │   Post to /auth/signup              │
        │   POST /api/auth/signup             │
        │   {                                 │
        │    email, password,                 │
        │    fullName, organizationName       │
        │   }                                 │
        └─────────────────────────────────────┘
             │
             ├─ Error? ─Yes──────┐
             │                   │
             │                   ▼
             │            Show error in UI
             │            Clear password field
             │            Set loading: false
             │            Show "Create Account" button
             │
             │
             └─ Success!
                │
                ▼
        ┌─────────────────────────────────────┐
        │   Backend Response (201 Created)    │
        │   {                                 │
        │     accessToken: "jwt...",          │
        │     refreshToken: "jwt...",         │
        │     role: "SUPER_ADMIN" (first)     │
        │   }                                 │
        └─────────────────────────────────────┘
             │
             ▼
        ┌──────────────────────────────────────┐
        │   Store Tokens in localStorage       │
        │   - localStorage.setItem(accessTok  │
        │   - localStorage.setItem(refreshTok │
        └──────────────────────────────────────┘
             │
             ▼
        ┌──────────────────────────────────────┐
        │   Update Redux State                 │
        │   - isAuthenticated: true            │
        │   - roles: ['SUPER_ADMIN']           │
        │   - accessToken set                  │
        │   - refreshToken set                 │
        │   - loading: false                   │
        └──────────────────────────────────────┘
             │
             ▼
        ┌──────────────────────────────────────┐
        │   Redirect to Dashboard              │
        │   navigate('/')                      │
        └──────────────────────────────────────┘
             │
             ▼
        ┌──────────────────────────────────────┐
        │   Dashboard Loads                    │
        │   - User now has access              │
        │   - Can see navbar + sidebar         │
        │   - Logout button available          │
        └──────────────────────────────────────┘
```

## Authentication Flow - Login

```
User
 │
 ├─ Navigate to /login
 ▼
┌─────────────────────────────┐
│   Login Page Loads          │
│   - Email & Password fields │
│   - Validation              │
│   - Error display           │
└─────────────────────────────┘
 │
 ├─ Enter credentials
 │
 └─ Click "Sign In"
    │
    ▼
┌─────────────────────────────────────────────────┐
│   Form Validation                               │
│   ✓ Email format check                          │
│   ✓ Password not empty                          │
│   ✓ Required fields present                     │
└─────────────────────────────────────────────────┘
    │
    ├─ Validation passes?
    ├─ Yes ──────────┐
    └─ No ────┐      │
             │      │
             ▼      │
        Show Error ─┼─ Wait for fix
                    │
                    │
                    ▼
        ┌─────────────────────────────────────┐
        │   Dispatch loginUser Thunk          │
        │   - Set loading: true               │
        │   - Clear previous errors           │
        └─────────────────────────────────────┘
             │
             ▼
        ┌─────────────────────────────────────┐
        │   Post to /auth/login               │
        │   POST /api/auth/login              │
        │   {                                 │
        │     email,                          │
        │     password                        │
        │   }                                 │
        └─────────────────────────────────────┘
             │
             ├─ Invalid Credentials? (401/403)
             │  │
             │  ▼
             │ Show "Invalid credentials" error
             │ Clear password field
             │ Set loading: false
             │ Show "Sign In" button
             │
             │
             └─ Valid Credentials!
                │
                ▼
        ┌──────────────────────────────────────┐
        │   Backend Response (200 OK)          │
        │   {                                  │
        │     accessToken: "jwt...",           │
        │     refreshToken: "jwt...",          │
        │     roles: ["ADMIN", "MANAGER"]      │
        │   }                                  │
        └──────────────────────────────────────┘
             │
             ▼
        ┌──────────────────────────────────────┐
        │   Store Tokens in localStorage       │
        │   - localStorage.setItem(accessTok  │
        │   - localStorage.setItem(refreshTok │
        └──────────────────────────────────────┘
             │
             ▼
        ┌──────────────────────────────────────┐
        │   Update Redux State                 │
        │   - isAuthenticated: true            │
        │   - roles: received roles array      │
        │   - primaryRole: roles[0]            │
        │   - accessToken set                  │
        │   - refreshToken set                 │
        │   - loading: false                   │
        └──────────────────────────────────────┘
             │
             ▼
        ┌──────────────────────────────────────┐
        │   Redirect to Dashboard              │
        │   navigate('/')                      │
        └──────────────────────────────────────┘
             │
             ▼
        ┌──────────────────────────────────────┐
        │   Dashboard Loads with Roles         │
        │   - Show role-based UI               │
        │   - Grant permissions per role       │
        │   - Restrict admin features if no    │
        │     admin role                       │
        └──────────────────────────────────────┘
```

## Token Refresh Flow

```
User makes API request to protected endpoint
 │
 ▼
┌──────────────────────────────────────────┐
│   Request Interceptor                    │
│   - Get accessToken from localStorage    │
│   - Add Authorization: Bearer token      │
│   - Send request to backend              │
└──────────────────────────────────────────┘
 │
 ▼
Backend processes request
 │
 ├─ accessToken valid?
 │
 ├─ Yes ──────────────┐
 │                    │
 │                    ▼
 │            ┌─────────────────┐
 │            │  Return 200 OK  │
 │            │  with response   │
 │            └─────────────────┘
 │                    │
 │                    ▼
 │            Response received
 │            Request completed ✓
 │
 │
 └─ No (Expired) - Return 401 Unauthorized
    │
    ▼
┌────────────────────────────────────────────────┐
│   Response Interceptor Detects 401            │
│   - Check if refresh already in progress      │
│   - If not, start refresh process             │
└────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│   Get refreshToken from localStorage         │
│   Dispatch refreshAccessToken thunk         │
│   POST /auth/refresh                        │
│   {                                         │
│     refreshToken: "..."                     │
│   }                                         │
└─────────────────────────────────────────────┘
    │
    ├─ Refresh failed?
    │  │
    │  ▼
    │ Clear tokens from localStorage
    │ Clear Redux state
    │ Redirect to /login
    │ Reject original request
    │
    │
    └─ Refresh successful!
       │
       ▼
    ┌────────────────────────────────┐
    │   Backend Returns              │
    │   {                            │
    │     accessToken: "new_jwt..."  │
    │     refreshToken: "new_jwt..." │
    │   }                            │
    └────────────────────────────────┘
       │
       ▼
    ┌────────────────────────────────┐
    │   Update localStorage          │
    │   - setItem(accessToken)       │
    │   - setItem(refreshToken)      │
    └────────────────────────────────┘
       │
       ▼
    ┌────────────────────────────────────────┐
    │   Update Authorization Header         │
    │   - Use new accessToken               │
    │   - Retry original request             │
    │   - Queue other requests while         │
    │     refresh in progress                │
    └────────────────────────────────────────┘
       │
       ▼
    Original request retried with new token
       │
       ▼
    Backend processes with valid token
       │
       ▼
    Return 200 OK ✓
```

## Logout Flow

```
User clicks "Log out" button in navbar
 │
 ▼
┌──────────────────────────────┐
│   handleLogout() triggered   │
│   - Close settings menu      │
│   - Dispatch logoutUser()    │
└──────────────────────────────┘
 │
 ▼
┌──────────────────────────────────────────┐
│   logoutUser Thunk Executes              │
│   - POST /api/auth/logout                │
│   - Include current accessToken in header│
└──────────────────────────────────────────┘
 │
 ├─ Server-side logout call succeeds?
 │  │
 │  ├─ Yes: Invalidate refresh token on backend
 │  │       (Future logins work fine)
 │  │
 │  └─ No: Error (but continue anyway)
 │
 ▼
┌──────────────────────────────────────────┐
│   Clear localStorage                     │
│   - removeItem('accessToken')            │
│   - removeItem('refreshToken')           │
└──────────────────────────────────────────┘
 │
 ▼
┌──────────────────────────────────────────┐
│   Reset Redux State                      │
│   {                                      │
│     accessToken: null,                   │
│     refreshToken: null,                  │
│     user: null,                          │
│     roles: [],                           │
│     isAuthenticated: false,              │
│     error: null                          │
│   }                                      │
└──────────────────────────────────────────┘
 │
 ▼
┌──────────────────────────────────────────┐
│   Redirect to /login                     │
│   - Navigate using react-router          │
└──────────────────────────────────────────┘
 │
 ▼
┌──────────────────────────────────────────┐
│   Login Page Shows                       │
│   - All form fields cleared              │
│   - Ready for next login                 │
└──────────────────────────────────────────┘
```

## Protected Route Access Flow

```
User navigates to protected route (e.g., /dashboard)
 │
 ▼
┌─────────────────────────────────────┐
│   React Router Renders Route        │
│   <Route path="/*" element={app}/>  │
│   (Protected by isAuthenticated)    │
└─────────────────────────────────────┘
 │
 ▼
┌────────────────────────────────────────┐
│   App.jsx Checks Redux State           │
│   - isAuthenticated?                   │
│   - accessToken exists?                │
└────────────────────────────────────────┘
 │
 ├─ Not authenticated?
 │  │
 │  ▼
 │  <Navigate to="/login" />
 │  User redirected to login page
 │
 │
 └─ Authenticated!
    │
    ▼
┌────────────────────────────────────────┐
│   AppLayout Component Renders          │
│   - Sidebar loaded                     │
│   - Navbar loaded with logout button   │
│   - Main content area ready            │
└────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────┐
│   Inner Route Processing                   │
│   - Dashboard / HRMS / ERP / etc           │
│   - Render requested page                  │
│   - Optional: Check roles for permissions  │
└────────────────────────────────────────────┘
    │
    ├─ Role-based access required?
    │  │
    │  ├─ If yes: ProtectedRoute component
    │  │          checks user.roles
    │  │          against requiredRoles
    │  │
    │  └─ Role match?
    │     │
    │     ├─ Yes: Render component
    │     │
    │     └─ No: Show "Access Denied"
    │
    │
    └─ Page renders normally
       │
       ▼
    User interacts with page
    All API requests include token header
    Feature available to user ✓
```

## Redux State Changes Timeline

```
Initial State
├─ accessToken: null
├─ refreshToken: null
├─ user: null
├─ roles: []
├─ primaryRole: null
├─ isAuthenticated: false
├─ loading: false
└─ error: null

│
├─► User Signup Initiated
│   └─ loading: true
│      error: null
│
├─► Signup Response Received
│   ├─ accessToken: "jwt..."
│   ├─ refreshToken: "jwt..."
│   ├─ roles: ["SUPER_ADMIN"]
│   ├─ primaryRole: "SUPER_ADMIN"
│   ├─ isAuthenticated: true
│   ├─ loading: false
│   └─ error: null
│
├─► User Profile Fetched
│   ├─ user: { id, email, fullName, roles, org }
│   ├─ roles: ["SUPER_ADMIN"]
│   └─ primaryRole: "SUPER_ADMIN"
│
├─► API Request (token gets injected automatically)
│
├─► Token Refresh Triggered (401 response)
│   ├─ New accessToken obtained
│   ├─ New refreshToken obtained
│   └─ isAuthenticated: still true
│
├─► User Logout Initiated
│   ├─ loading: true
│   └─ POST /auth/logout sent
│
├─► Logout Complete
│   ├─ accessToken: null
│   ├─ refreshToken: null
│   ├─ user: null
│   ├─ roles: []
│   ├─ primaryRole: null
│   ├─ isAuthenticated: false
│   ├─ loading: false
│   └─ error: null
│
└─► Back to Initial State
```

## Role Hierarchy

```
┌─────────────────────────────────────────┐
│           System Roles                  │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐   │
│  │      SUPER_ADMIN                 │   │
│  │  • Full system access            │   │
│  │  • Manage all users              │   │
│  │  • Configure settings            │   │
│  │  • Assign roles                  │   │
│  │  • View audit logs               │   │
│  │  • Highest privileges            │   │
│  └──────────────────────────────────┘   │
│                  ▲                      │
│                  │                      │
│  ┌───────────────┴────────────────────┐ │
│  │                                     │ │
│  ▼                                     ▼ │
│ ┌─────────────────┐          ┌───────────────┐
│ │     ADMIN       │          │    MANAGER     │
│ │ • Org settings  │          │ • Team lead    │
│ │ • User mgmt     │          │ • Project mgmt │
│ │ • Report gen    │          │ • Task assign  │
│ │ • Moderate acc  │          │ • Performance  │
│ │ • Mid privileges│          │ • Mid-Low priv │
│ └────────┬────────┘          └────────┬──────┘
│          │                           │
│          └───────────────┬───────────┘
│                          ▼
│               ┌──────────────────────┐
│               │     EMPLOYEE         │
│               │ • Basic access       │
│               │ • Self-service       │
│               │ • My tasks/projects  │
│               │ • Profile mgmt       │
│               │ • Lowest privileges  │
│               └──────────────────────┘
│                                         │
└─────────────────────────────────────────┘
```

## Error Handling Flow

```
API Request
 │
 ▼
┌─────────────────────────┐
│   Response Interceptor  │
├─────────────────────────┤
│ Status Code Check       │
└─────────────────────────┘
 │
 ├─ 2xx (Success)
 │  │
 │  ▼
 │  Return response ✓
 │
 │
 ├─ 401 (Unauthorized)
 │  │
 │  ├─ First occurrence?
 │  │  └─ Try token refresh
 │  │
 │  └─ After refresh still fails?
 │     ├─ Clear tokens
 │     ├─ Clear Redux state
 │     ├─ Set error: "Session expired"
 │     └─ Redirect to /login
 │
 │
 ├─ 403 (Forbidden)
 │  │
 │  ▼
 │  Set error from backend message
 │  Show "Access Denied" to user
 │
 │
 ├─ 4xx (Client Error)
 │  │
 │  ▼
 │  Extract error message from response
 │  Show error in UI
 │
 │
 ├─ 5xx (Server Error)
 │  │
 │  ▼
 │  Show generic error message
 │  Log detailed error
 │
 │
 └─ Network Error
    │
    ▼
    Show "Network Error" message
    Allow retry
```

---

This architecture ensures secure, scalable, and user-friendly authentication with role-based access control.
