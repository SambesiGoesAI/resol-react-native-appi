# Alpo App

A React Native multi-platform application with Supabase authentication, featuring a splash screen, secure lock screen with role-based access control, and tab-based navigation.

## Features

- 🚀 Cross-platform support (iOS, Android, Web)
- 🔐 Secure authentication with access codes
- 👥 Role-based access control
- 📱 Tab navigation with three main sections
- 💾 Persistent authentication state
- 🎨 Clean and modern UI

## Tech Stack

- React Native with TypeScript
- Expo for development
- React Navigation for routing
- Supabase for authentication and database
- AsyncStorage for local data persistence

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account and project

## Installation

1. Clone the repository and navigate to the project:
```bash
cd AlpoApp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your Supabase credentials to `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Database Setup

Create a `users` table in your Supabase project with the following schema:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  access_code TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on access_code for faster lookups
CREATE INDEX idx_users_access_code ON users(access_code);

-- Insert sample users
INSERT INTO users (email, access_code, role) VALUES
  ('admin@example.com', 'ADMIN123', 'admin'),
  ('user@example.com', 'USER456', 'user'),
  ('guest@example.com', 'GUEST789', 'guest');
```

### Row Level Security (RLS)

Enable RLS on the users table:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Create a policy for access code authentication (public read for login)
CREATE POLICY "Public can read for authentication" ON users
  FOR SELECT USING (true);
```

## Running the App

### Development

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Testing Without Supabase

The app includes a mock authentication service for testing without Supabase configuration. When Supabase credentials are not provided, the app will automatically use mock authentication with these test access codes:

- **Admin**: `ADMIN123` (admin role)
- **User**: `USER456` (user role)
- **Guest**: `GUEST789` (guest role)

To enable mock authentication, simply run the app without configuring Supabase credentials.

### Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for web
expo build:web
```

## Project Structure

```
AlpoApp/
├── src/
│   ├── components/      # Reusable components
│   ├── screens/         # Screen components
│   │   ├── SplashScreen.tsx
│   │   ├── LockScreen.tsx
│   │   ├── AlpoScreen.tsx
│   │   ├── UutisetScreen.tsx
│   │   └── AsetuksetScreen.tsx
│   ├── navigation/      # Navigation configuration
│   │   └── TabNavigator.tsx
│   ├── services/        # External services
│   │   ├── supabase.ts
│   │   └── auth.ts
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── assets/             # Images and other assets
├── App.tsx            # Main application component
├── app.json           # Expo configuration
├── package.json       # Dependencies
└── tsconfig.json      # TypeScript configuration
```

## Authentication Flow

1. App launches and shows splash screen
2. Checks for existing authentication in AsyncStorage
3. If not authenticated, shows lock screen
4. User enters access code
5. App queries Supabase to validate access code
6. On success, stores user data and shows main tabs
7. User role determines accessible content

## Customization

### Adding New Tabs

1. Create a new screen component in `src/screens/`
2. Import and add it to `src/navigation/TabNavigator.tsx`
3. Configure icon and navigation options

### Modifying Authentication

The authentication logic is in `src/services/auth.ts`. You can modify it to:
- Use email/password authentication
- Implement OAuth providers
- Add two-factor authentication

### Styling

The app uses inline StyleSheet objects. To customize the theme:
- Modify color values in screen components
- Create a theme configuration file for consistency
- Use React Context for global theme management

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **iOS build errors**: Ensure you have Xcode installed and updated
3. **Android build errors**: Check Android Studio and SDK installations
4. **Supabase connection errors**: Verify your credentials and network connection

### Debug Mode

Enable debug logging by setting:
```javascript
// In src/services/supabase.ts
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true, // Add this line
    // ... other options
  },
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.