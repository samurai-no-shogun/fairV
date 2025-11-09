# fairV 🎴

> Fair Value - Professional TCG pricing tool for instant market analysis and negotiation

A mobile-first web application that helps TCG buyers and sellers instantly price cards using AI image recognition and real-time market data.

## 🎯 Key Features

### For Users
- 📸 **Instant Card Scanning** - Point camera at any TCG card
- 💰 **3-Tier Pricing** - Trending, Average, and Low market prices
- 📊 **Price Reference Table** - See values at 10%-100% increments for negotiation
- 📦 **Bundle Calculator** - Price multiple cards together with flexible strategies
- 📱 **Mobile-First** - Optimized for iPhone and all devices
- 💾 **History Tracking** - Save and review previous scans

### For Admin
- 🗄️ **Market Research Database** - Automatic collection of scan data (admin only)
- 📈 **Market Insights** - Analyze trends across thousands of scans
- 📊 **Analytics Dashboard** - View top cards, pricing trends, statistics
- 📥 **Data Export** - Export research data to CSV for analysis

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Backend:** Firebase
  - Authentication (Anonymous + Email)
  - Firestore (Database)
  - Storage (Images)
  - Hosting (Deployment)
- **AI:** OpenAI GPT-4o Vision
- **Pricing:** eBay Finding API
- **Code Quality:** ESLint + Prettier
- **Testing:** Jest + React Testing Library

## 📁 Project Structure

```
fairV/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home: Camera capture
│   ├── results/           # Scan results display
│   ├── history/           # Saved scans
│   ├── bundles/           # Bundle creator
│   └── admin/             # Admin dashboard (hidden)
│
├── components/            # Reusable UI components
│   ├── camera/           # Camera capture
│   ├── cards/            # Card display & price table
│   ├── bundles/          # Bundle management
│   └── admin/            # Admin components
│
├── services/             # Business logic
│   ├── ai/              # OpenAI integration
│   ├── pricing/         # eBay & price calculations
│   ├── firebase/        # Firebase operations
│   └── admin/           # Admin features
│
├── types/               # TypeScript definitions
│   ├── tcg.types.ts    # TCG card types
│   ├── bundle.types.ts # Bundle types
│   └── ...             # Other types
│
├── hooks/              # Custom React hooks
├── lib/                # Utilities & helpers
└── styles/            # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase project set up
- OpenAI API key
- eBay Developer API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fairV

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create `.env.local` with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI API
OPENAI_API_KEY=sk-your_openai_key

# eBay API
EBAY_APP_ID=your_ebay_app_id

# Admin Configuration
ADMIN_UID=your_firebase_uid
ADMIN_CODE=your_secret_admin_code
```

## 💳 Supported Card Games

- ✅ **Pokémon** (Primary focus)
- ✅ Yu-Gi-Oh!
- ✅ Magic: The Gathering
- ✅ Sports Cards (Baseball, Basketball, etc.)
- ✅ Other TCGs

## 📸 How It Works

1. **Scan Card** - Open camera, point at card, capture photo
2. **AI Analysis** - GPT-4o Vision identifies card details
   - Exact card name
   - Set name & number
   - Rarity & variants
   - Print variations (1st Edition, Shadowless, etc.)
   - Condition assessment
3. **Fetch Pricing** - Query eBay sold listings
   - Trending: Recent sales (7 days)
   - Average: 30-day average
   - Low: Lowest sale (30 days)
4. **Display Results** - Show card details + price table
5. **Save to History** - Store for future reference
6. **Create Bundles** - Combine multiple cards for total value

## 📊 Price Table Feature

The signature feature - instant negotiation reference:

```
┌─────────┬──────────┬──────────┬──────────┐
│ %       │ Trending │ Average  │ Low End  │
├─────────┼──────────┼──────────┼──────────┤
│ 100%    │ $145.00  │ $128.29  │ $100.00  │
│ 90%     │ $130.50  │ $115.46  │  $90.00  │
│ 80%     │ $116.00  │ $102.63  │  $80.00  │
│ ...     │ ...      │ ...      │ ...      │
└─────────┴──────────┴──────────┴──────────┘
```

Perfect for quick negotiations at card shows!

## 🔐 Admin Features

### Setup
1. Get your Firebase UID from Firebase Console
2. Add to `.env.local` as `ADMIN_UID`
3. Access dashboard at `/admin` (requires authentication)

### Dashboard Features
- Total scans count
- Unique cards cataloged
- Top scanned cards with pricing
- Recent scan activity
- Market insights & trends
- CSV export for analysis

### Data Collection
- Automatic on admin device only
- Privacy-compliant
- User opt-out available
- Helps build market intelligence

## 🏗️ Architecture

### Data Flow
```
User captures photo
    ↓
Browser Camera API
    ↓
Image optimization
    ↓
OpenAI Vision API (TCG expert prompt)
    ↓
Card identification + condition grading
    ↓
eBay API (fetch sold listings)
    ↓
Calculate 3-tier pricing
    ↓
Display results + price table
    ↓
Save to Firebase (user's history)
    ↓
[Admin only] Save to research database
```

### State Management
- Firebase Auth for user state
- React Context for global state
- Local state for UI interactions
- Firestore for persistent data

## 🧪 Development

```bash
# Run development server
npm run dev

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment

```bash
# Build optimized production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Live at: your-project-id.web.app
```

## 📱 PWA Support

The app is configured as a Progressive Web App:
- Add to iPhone home screen
- Opens full-screen (no browser UI)
- Works offline (cached resources)
- Fast, app-like experience

## 🔒 Security

- Environment variables for API keys
- Firebase Security Rules for data access
- Admin-only collections protected
- No sensitive data in client code
- HTTPS enforced

## 📚 Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System design & data flow
- [API_INTEGRATION.md](./docs/API_INTEGRATION.md) - External API details
- [ADMIN_GUIDE.md](./docs/ADMIN_GUIDE.md) - Admin dashboard usage
- [DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Developer setup guide
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Production deployment

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use ESLint (runs automatically)
3. Write JSDoc comments for functions
4. Add tests for new features
5. Update documentation

## 📄 License

Private project - All rights reserved.

---

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Project setup
- [x] Type definitions
- [x] Documentation structure

### Phase 2: Card Scanning (Current)
- [ ] Camera capture component
- [ ] AI integration with TCG prompts
- [ ] eBay pricing integration
- [ ] Price table display

### Phase 3: Advanced Features
- [ ] Bundle creator & manager
- [ ] History view with search/filter
- [ ] Admin dashboard
- [ ] Data export

### Phase 4: Polish
- [ ] PWA configuration
- [ ] Offline support
- [ ] Performance optimization
- [ ] User testing & feedback

---

Built with ❤️ for fair pricing in TCG trading

**fairV** - Because every card deserves a fair value assessment
