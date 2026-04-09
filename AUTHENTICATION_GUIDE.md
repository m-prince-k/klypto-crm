# Klypto CRM - RBAC Authentication Implementation Guide

## Overview

This document explains the new role-based access control (RBAC) authentication system integrated with the NestJS backend. The system allows users to sign up with an organization, login, and access features based on their assigned roles.

## Architecture

### Backend (NestJS)

The backend provides JWT-based authentication with the following endpoints:

- **POST /auth/signup** - Register a new user with organization
- **POST /auth/login** - Authenticate with email and password
- **POST /auth/logout** - Logout and invalidate refresh token
- **POST /auth/refresh** - Refresh access token
- **GET /auth/me** - Get authenticated user profile

### Frontend (React + Redux)

The frontend uses Redux Toolkit with async thunks for state management:

- **signupUser** - Thunk for user registration
- **loginUser** - Thunk for user login
- **logoutUser** - Thunk for user logout
- **refreshAccessToken** - Thunk for token refresh
- **fetchUserProfile** - Thunk to retrieve user profile with roles

## Authentication Flow

### 1. Signup (Registration)

**Process:**

1. User fills out signup form with:
   - Email
   - Password (minimum 6 characters)
   - Full Name
   - Organization Name
   - Preferred Role (SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE)

2. Frontend validates form and sends to backend
3. Backend creates:
   - Organization (if doesn't exist)
   - User account
   - Assigns roles (first user becomes SUPER_ADMIN)
4. Backend returns JWT tokens (accessToken, refreshToken)
5. Frontend stores tokens in localStorage
6. User is redirected to dashboard

**Code Location:**

- Form: `/src/pages/Signup.jsx`
- Thunk: `/src/store/auth/authSlice.js` (signupUser)
- Service: `/src/store/auth/authService.js`

### 2. Login

**Process:**

1. User enters email and password
2. Frontend validates and sends credentials
3. Backend verifies credentials
4. Backend retrieves user roles from RBAC system
5. Backend returns JWT tokens
6. Frontend stores tokens and user roles
7. User is redirected to dashboard

**Code Location:**

- Form: `/src/pages/Login.jsx`
- Thunk: `/src/store/auth/authSlice.js` (loginUser)
- Service: `/src/store/auth/authService.js`

### 3. Token Management

**Access Token:**

- Short-lived JWT token (typically 15-30 minutes)
- Used in Authorization header for API requests
- Stored in localStorage
- Automatically attached to all requests via axios interceptor

**Refresh Token:**

- Long-lived JWT token (typically 7-30 days)
- Used to obtain new access tokens when expired
- Stored in localStorage
- Automatically handled by response interceptor (401 errors)

**Token Refresh Process:**

1. Request fails due to 401 (Unauthorized)
2. Response interceptor attempts to refresh token
3. Uses refreshToken from localStorage
4. Calls `/auth/refresh` endpoint
5. Updates localStorage with new tokens
6. Re-attempts original request
7. Process is queued to handle concurrent requests

**Code Location:**

- API Client: `/src/api/apiClient.js` (interceptors)
- Thunk: `/src/store/auth/authSlice.js` (refreshAccessToken)

### 4. Logout

**Process:**

1. User clicks "Log out" button in navigation
2. Frontend calls logout endpoint (optional)
3. Frontend clears tokens from localStorage
4. Redux state is reset
5. User is redirected to login page

**Code Location:**

- Button: `/src/components/layout/Navbar.jsx`
- Thunk: `/src/store/auth/authSlice.js` (logoutUser)

## Redux State Management

### Auth Slice Structure

```javascript
{
  auth: {
    accessToken: string | null,        // JWT access token
    refreshToken: string | null,       // JWT refresh token
    user: object | null,               // User profile data
    roles: string[],                   // Array of user roles
    primaryRole: string | null,        // First/primary role
    isAuthenticated: boolean,          // Whether user is logged in
    loading: boolean,                  // Loading state for async operations
    error: string | null,              // Error message
  }
}
```

### Reducers

- **logout()** - Clear auth state and localStorage
- **clearError()** - Clear error message
- **restoreAuth()** - Restore auth from localStorage on app startup

### Async Thunks

All thunks follow this pattern:

1. Pending state → set loading: true, clear errors
2. Fulfilled → update state with data, set loading: false
3. Rejected → set error, set loading: false

## Protected Routes

The `ProtectedRoute` component ensures only authenticated users can access certain pages:

```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute
      Component={Dashboard}
      requiredRoles={["ADMIN", "MANAGER"]}
    />
  }
/>
```

**Features:**

- Checks if user is authenticated
- Verifies role-based access if specified
- Shows loading spinner while fetching profile
- Redirects to login if not authenticated
- Shows access denied if user lacks required role

**Code Location:**

- Component: `/src/components/auth/ProtectedRoute.jsx`

## Role-Based Access Control (RBAC)

### Available Roles

1. **SUPER_ADMIN** - Full system access, can manage all users and settings
2. **ADMIN** - Can manage organization users and settings
3. **MANAGER** - Can oversee team members and projects
4. **EMPLOYEE** - Basic access to core features

### Role Assignment

- **First User:** Automatically assigned SUPER_ADMIN role
- **Subsequent Users:** Can be assigned roles through admin panel (future feature)
- **User Profile:** Contains `roles` array with all assigned roles

### Checking User Roles

In components:

```javascript
const { primaryRole, roles } = useSelector((state) => state.auth);

// Check if user has specific role
if (roles.includes("ADMIN")) {
  // Show admin features
}
```

## Configuration

### Environment Variables

Create `.env` file in frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

### Development Setup

1. **Backend Requirements:**
   - NestJS server running on `http://localhost:5000`
   - Prisma database configured
   - RBAC system initialized

2. **Frontend Requirements:**
   - Install dependencies: `npm install`
   - Create `.env` file with backend URL
   - Run development server: `npm run dev`

## API Integration

### Authentication Service

Located at: `/src/store/auth/authService.js`

Methods:

- `signup(signupData)` - Register new user
- `login(credentials)` - User login
- `logout()` - User logout
- `refreshTokens()` - Refresh access token
- `getProfile()` - Fetch user profile

### API Client

Located at: `/src/api/apiClient.js`

Features:

- Automatic token injection in request headers
- Automatic token refresh on 401 errors
- Request/response interceptor pattern
- Error handling and formatting

## UI Components

### Login Page

- Location: `/src/pages/Login.jsx`
- Features:
  - Email and password validation
  - Loading spinner during auth
  - Error messages display
  - Link to signup page
  - Forgot password link (future)

### Signup Page

- Location: `/src/pages/Signup.jsx`
- Features:
  - Multi-step validation
  - Role selection with visual cards
  - Organization creation
  - Error handling
  - Password confirmation
  - Link to login page

### Protected App Layout

- Only shown to authenticated users
- Includes Sidebar and Navbar
- Navbar has logout button
- Role-based content rendering (future feature)

## Styling

### Auth Styles

Located at: `/src/styles/auth.css`

Features:

- Modern dark theme with gradient accents
- Responsive design (mobile-first)
- Form validation visual feedback
- Loading and error states
- Role card selection with animations

## Error Handling

### Common Error Scenarios

1. **Invalid Credentials**
   - Error: "Invalid credentials"
   - Action: Show error message, allow retry

2. **Email Already Exists**
   - Error: "User already exists"
   - Action: Show error message, link to login

3. **Network Error**
   - Error: "Network Error"
   - Action: Show retry option

4. **Token Expired**
   - Action: Automatic refresh attempt
   - Fallback: Redirect to login

5. **Unauthorized (401)**
   - After multiple failures: Clear auth and redirect to login

## Security Considerations

1. **Token Storage:** Tokens stored in localStorage (vulnerable to XSS, but acceptable for this app)
2. **HTTPS:** Use HTTPS in production
3. **CORS:** Configure backend CORS to accept frontend origin
4. **Password:** Backend handles bcrypt hashing (10 rounds)
5. **Refresh Token:** Tokens include user ID and email for verification

### Security Improvements (Future)

- HttpOnly cookies for token storage
- CSRF protection
- Rate limiting on auth endpoints
- Two-factor authentication
- OAuth/SSO integration

## Troubleshooting

### Issue: Login fails with "Network Error"

**Solution:**

1. Check backend is running on correct port
2. Verify `VITE_API_URL` in `.env` file
3. Check browser console for actual error
4. Ensure CORS is properly configured on backend

### Issue: Tokens not persisting after page refresh

**Solution:**

1. Check localStorage is enabled in browser
2. Verify tokens are being stored by checking DevTools Storage
3. Ensure `restoreAuth()` is called on app mount

### Issue: Cannot access protected pages after login

**Solution:**

1. Verify user has required roles in database
2. Check `requireRoles` prop in ProtectedRoute component
3. Ensure `fetchUserProfile()` thunk is being called
4. Check Redux state in DevTools

## Future Enhancements

1. **Advanced RBAC:**
   - Permission-based access control
   - Dynamic role assignment UI
   - Role template management

2. **Authentication:**
   - OAuth/SSO integration (Google, GitHub, Microsoft)
   - Two-factor authentication
   - Social login options
   - Password reset flow

3. **User Management:**
   - User profile management
   - Organization member management
   - Activity logging
   - Session management

4. **Security:**
   - HttpOnly cookie tokens
   - CSRF protection
   - Rate limiting
   - Audit logs

5. **UX:**
   - Remember me functionality
   - Biometric authentication
   - Passwordless login
   - Account recovery options

## Testing

### Manual Testing Checklist

- [ ] User can sign up with email/password
- [ ] User can login with credentials
- [ ] User is redirected to dashboard after login
- [ ] User can logout and is redirected to login
- [ ] Tokens are stored in localStorage
- [ ] Token refresh works when accessing content
- [ ] Invalid email shows error
- [ ] Password mismatch on signup shows error
- [ ] User cannot access protected routes without login
- [ ] Role-based features show/hide correctly

### API Testing

Use Postman or similar tool to test:

```bash
# Signup
POST http://localhost:5000/api/auth/signup
{
  "email": "user@example.com",
  "password": "Password123!",
  "fullName": "John Doe",
  "organizationName": "Klypto Corp"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "user@example.com",
  "password": "Password123!"
}

# Get Profile (with Authorization header)
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer <accessToken>
```

## Code Examples

### Using Auth in a Component

```javascript
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/auth/authSlice";

function MyComponent() {
  const { user, roles, primaryRole, isAuthenticated } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      <p>Role: {primaryRole}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### Creating Role-Restricted Content

```javascript
import { useSelector } from "react-redux";

function AdminPanel() {
  const { roles } = useSelector((state) => state.auth);
  const isAdmin = roles?.includes("ADMIN") || roles?.includes("SUPER_ADMIN");

  if (!isAdmin) {
    return <div>You don't have permission to view this</div>;
  }

  return <div>Admin Panel Content</div>;
}
```

## References

- NestJS Authentication: https://docs.nestjs.com/security/authentication
- Redux Toolkit: https://redux-toolkit.js.org/
- JWT: https://jwt.io/
- React Router: https://reactrouter.com/
- Axios: https://axios-http.com/

## Support

For issues or questions about the authentication system, please refer to the backend documentation or create an issue in the repository.
