# Alpo App Texts 

### 1. Navigation & Tab Labels

| Key | English | Finnish | Location | Notes |
|-----|---------|---------|----------|-------|
| `tab.alpo` | Alpo | Alpo | [`TabNavigator.tsx:48`](../src/navigation/TabNavigator.tsx:48) | Brand name - no translation needed |
| `tab.news` | Uutiset | Uutiset | [`TabNavigator.tsx:51`](../src/navigation/TabNavigator.tsx:51) | Already in Finnish |
| `tab.settings` | Asetukset | Asetukset | [`TabNavigator.tsx:52`](../src/navigation/TabNavigator.tsx:52) | Already in Finnish |

### 2. Authentication & Login

| Key | English | Finnish | Location | Notes |
|-----|---------|---------|----------|-------|
| `auth.welcome_title` | Welcome to Alpo | Tervetuloa Alpo-sovellukseen! | [`LockScreen.tsx:53`](../src/screens/LockScreen.tsx:53) | Main welcome message |
| `auth.welcome_subtitle` | Enter your access code to continue | Syötä pääsykoodisi ja paina 'Kirjaudu' | [`LockScreen.tsx:54`](../src/screens/LockScreen.tsx:54) | Instructions |
| `auth.access_code_placeholder` | Access Code | Pääsykoodi | [`LockScreen.tsx:58`](../src/screens/LockScreen.tsx:58) | Input placeholder |
| `auth.login_button` | Login | Kirjaudu | [`LockScreen.tsx:76`](../src/screens/LockScreen.tsx:76) | Primary action button |

### 3. Error Messages

| Key | English | Finnish | Location | Notes |
|-----|---------|---------|----------|-------|
| `error.generic_title` | Error | Virhe | [`LockScreen.tsx:27`](../src/screens/LockScreen.tsx:27) | Generic error dialog title |
| `error.empty_access_code` | Please enter an access code | Syötä pääsykoodi | [`LockScreen.tsx:27`](../src/screens/LockScreen.tsx:27) | Validation error |
| `error.login_failed_title` | Login Failed | Kirjautuminen epäonnistui | [`LockScreen.tsx:36`](../src/screens/LockScreen.tsx:36) | Login error dialog title |
| `error.invalid_access_code` | Invalid access code | Virheellinen pääsykoodi | [`LockScreen.tsx:36`](../src/screens/LockScreen.tsx:36) | Authentication error |
| `error.unexpected_error` | An unexpected error occurred | Odottamaton virhe tapahtui | [`LockScreen.tsx:41`](../src/screens/LockScreen.tsx:41) | Generic fallback error |

### 4. Loading States

| Key | English | Finnish | Location | Notes |
|-----|---------|---------|----------|-------|
| `loading.user_data` | Loading user data... | Ladataan käyttäjätietoja... | [`UutisetScreen.tsx:38`](../src/screens/UutisetScreen.tsx:38) | User authentication loading |
| `loading.news` | Loading news... | Ladataan uutisia... | [`UutisetScreen.tsx:49`](../src/screens/UutisetScreen.tsx:49) | News content loading |

### 5. User Information & Profile

| Key | English | Finnish | Location | Notes |
|-----|---------|---------|----------|-------|
| `user.welcome_message` | Welcome, {user?.email \|\| 'User'} | Tervetuloa, {user?.email \|\| 'Käyttäjä'} | [`AlpoScreen.tsx:16`](../src/screens/AlpoScreen.tsx:16) | Dynamic welcome with fallback |
| `user.role_label` | Role: {user?.role \|\| 'Unknown'} | Rooli: {user?.role \|\| 'Tuntematon'} | [`AlpoScreen.tsx:17`](../src/screens/AlpoScreen.tsx:17) | Role display with fallback |
| `user.default_name` | User | Käyttäjä | [`AlpoScreen.tsx:16`](../src/screens/AlpoScreen.tsx:16) | Fallback username |
| `user.unknown_role` | Unknown | Tuntematon | [`AlpoScreen.tsx:17`](../src/screens/AlpoScreen.tsx:17) | Fallback role |

### 6. Settings & Preferences

| Key | English | Finnish | Location | Notes |
|-----|---------|---------|----------|-------|
| `settings.title` | Asetukset | Asetukset | [`AsetuksetScreen.tsx:79`](../src/screens/AsetuksetScreen.tsx:79) | Already in Finnish |
| `settings.user_info_section` | User Information | Käyttäjätiedot | [`AsetuksetScreen.tsx:82`](../src/screens/AsetuksetScreen.tsx:82) | Section header |
| `settings.email_label` | Email: | Sähköposti: | [`AsetuksetScreen.tsx:84`](../src/screens/AsetuksetScreen.tsx:84) | Field label |
| `settings.role_label` | Role: | Rooli: | [`AsetuksetScreen.tsx:88`](../src/screens/AsetuksetScreen.tsx:88) | Field label |
| `settings.not_available` | Not available | Ei saatavilla | [`AsetuksetScreen.tsx:85`](../src/screens/AsetuksetScreen.tsx:85) | Fallback text |
| `settings.preferences_section` | Preferences | Asetukset | [`AsetuksetScreen.tsx:94`](../src/screens/AsetuksetScreen.tsx:94) | Section header |
| `settings.dark_mode` | Dark Mode | Tumma tila | [`AsetuksetScreen.tsx:97`](../src/screens/AsetuksetScreen.tsx:97) | Toggle label |
| `settings.notifications` | Notifications | Ilmoitukset | [`AsetuksetScreen.tsx:107`](../src/screens/AsetuksetScreen.tsx:107) | Toggle label |
| `settings.analytics` | Analytics | Analytiikka | [`AsetuksetScreen.tsx:117`](../src/screens/AsetuksetScreen.tsx:117) | Toggle label |

### 7. Action Buttons

| Key | English | Finnish | Location | Notes |
|-----|---------|---------|----------|-------|
| `button.logout` | Logout | Kirjaudu ulos | [`AsetuksetScreen.tsx:131`](../src/screens/AsetuksetScreen.tsx:131) | Primary logout button |
| `button.cancel` | Cancel | Peruuta | [`AsetuksetScreen.tsx:34`](../src/screens/AsetuksetScreen.tsx:34) | Dialog cancel action |

### 8. Content & Messages

| Key | English | Finnish | Location | Notes |
|-----|---------|---------|----------|-------|
| `content.main_area_title` | Main Content Area | Pääsisältöalue | [`AlpoScreen.tsx:20`](../src/screens/AlpoScreen.tsx:20) | Section title |
| `content.main_area_description` | This is the primary content area for the Alpo tab. Content here will be based on user role and permissions. | Tämä on Alpo-välilehden pääsisältöalue. Sisältö täällä perustuu käyttäjän rooliin ja käyttöoikeuksiin. | [`AlpoScreen.tsx:21-24`](../src/screens/AlpoScreen.tsx:21) | Descriptive text |
| `content.login_required` | Please log in to view news | Kirjaudu sisään nähdäksesi uutiset | [`UutisetScreen.tsx:69`](../src/screens/UutisetScreen.tsx:69) | Authentication prompt |
| `content.no_news` | No news available for your housing companies | Taloyhtiöllesi ei ole tällä hetkellä uutisia saatavilla | [`UutisetScreen.tsx:80`](../src/screens/UutisetScreen.tsx:80) | Empty state message |

### 9. Dialog Messages

| Key | English | Finnish | Location | Notes |
|-----|---------|---------|----------|-------|
| `dialog.logout_title` | Logout | Kirjaudu ulos | [`AsetuksetScreen.tsx:30`](../src/screens/AsetuksetScreen.tsx:30) | Confirmation dialog title |
| `dialog.logout_message` | Are you sure you want to logout? | Haluatko varmasti kirjautua ulos? | [`AsetuksetScreen.tsx:31`](../src/screens/AsetuksetScreen.tsx:31) | Confirmation question |

### 10. App Branding

| Key | English | Finnish | Location | Notes |
|-----|---------|---------|----------|-------|
| `app.name` | Alpo App | Alpo-sovellus | [`SplashScreen.tsx:23`](../src/screens/SplashScreen.tsx:23) | Application name |
| `app.news_placeholder` | Alpo tiedottaa | Alpo tiedottaa | [`NewsCard.tsx:59`](../src/components/NewsCard.tsx:59) | Already in Finnish |
