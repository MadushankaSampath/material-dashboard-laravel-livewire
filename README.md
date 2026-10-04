# Pocketbook

A mobile-first web app for tracking daily income and expenses together as a family.

- **Quick entry.** Tap **+**, type the amount, pick a category and how you paid, then save. The last payment type you used is pre-selected.
- **Income.** Record salary, business income, gifts and so on, and the account each one went into.
- **Payment types.** Cash, bank account or transfer, credit cards, e-wallets and others.
- **Credit cards.** Each card stores its limit, last statement balance, statement date and due date. The app works out the live balance and the credit still available.
- **Categories.** Starts with Food, Groceries, Home, Bills, Transport, Health, Shopping, Kids, Loan Payment, **CC Payment**, Salary and more. You can add your own or remove them.
- **Family sharing.** One household can have several members, for example a husband and wife. Each person has their own login and name, and everyone sees the same book. Every entry shows who added it.
- **Sign in options.** Email and password, Google, and password reset.

Stack: **React + Vite + TypeScript**, **Firebase Auth**, **Firebase SQL Connect (Data Connect, PostgreSQL)**, and **Firebase Hosting**.

---

## Plan / architecture

```
web/                    React app (Vite)
  src/firebase.ts       Firebase app, Auth and SQL Connect init (+ emulator switch)
  src/state/            Auth + household context, entry/card data hooks
  src/pages/            Auth, Onboarding, Home, History, Cards, Family/Settings
  src/components/       QuickAdd sheet, EntryList, CardTile, Layout (tab bar + FAB)
  src/dataconnect-generated/   Typed SDK generated from the connector (committed)
dataconnect/
  schema/schema.gql     Postgres tables
  connector/*.gql       The only queries/mutations clients may run
firebase.json           Hosting (SPA rewrite) + Data Connect + emulators
```

### Data model (`dataconnect/schema/schema.gql`)

| Table | Purpose |
|---|---|
| `User` | One row per Firebase Auth uid, holding the display name and email |
| `Household` | The shared book: name, currency, invite code |
| `Member` | Links a user to a household (OWNER / MEMBER). Keyed by user, so each user has one household |
| `PaymentMethod` | Cash / Bank / Credit card / Wallet / Other. Card fields: limit, last statement balance and date, due date |
| `Category` | Expense or income category. `systemKey = CC_PAYMENT` marks a credit-card payment |
| `Entry` | One income or expense: amount, date, note, category, payment method, `paidCard` (for CC payments) and `createdBy` |

### Credit-card maths

```
balance   = last statement balance
          + card purchases dated after the statement date
          − refunds to the card after the statement date
          − CC Payment entries for the card after the statement date
available = limit − balance
```

A **CC Payment** is an expense paid *from* a bank account or cash *to* a card. It reduces the card's balance. Monthly "Spent" totals leave it out so purchases aren't counted twice, and it is shown on its own line.

### Security

Every operation needs a signed-in user (`@auth(level: USER)`) and is scoped to that user's household on the server:

- **Queries** start from `member(key: { userId_expr: "auth.uid" })`, so a user can only reach their own household's data.
- **Inserts** look up the caller's membership first and take `householdId` from it. `@check` rejects the insert if the caller has no household.
- **Updates and deletes** only match rows whose household has the caller as a member.
- **Removing a member** is limited to the household OWNER.
- **Joining** needs the household's 8-character invite code.

### Family flow

1. Person A signs up and chooses **Start a new household**. This seeds default categories and a Cash payment type.
2. Person A opens **Family** and taps **Share** to send the invite code.
3. Person B signs up with their own email and name, then chooses **Join a family member** and enters the code.
4. Both now see the same entries, cards and categories.

### Possible next steps

- Monthly budgets per category, with alerts
- Recurring entries (rent, loan instalments)
- Card due-date reminders (Cloud Functions + FCM)
- Charts over months, and CSV export
- Offline queue / installable PWA with a service worker

---

## Setup

Prerequisites: Node 20+ and the Firebase CLI (`npm i -g firebase-tools`).

1. Create a Firebase project on the **Blaze** plan, which SQL Connect needs for Cloud SQL.
2. Turn on **Authentication** and enable the **Email/Password** and **Google** providers.
3. Put the project id in `.firebaserc`, and adjust `serviceId`, `location`, `instanceId` and `database` in `dataconnect/dataconnect.yaml` if you want different names.
4. Register a web app, then copy `web/.env.example` to `web/.env.local` and fill in its config values.

```bash
cd web && npm install && cd ..
firebase deploy --only dataconnect   # creates Cloud SQL instance, migrates schema, deploys connector
firebase deploy --only hosting       # builds web/ and deploys
```

Also add your hosting domain under **Auth → Settings → Authorized domains**.

### Local development with emulators

```bash
firebase emulators:start --only auth,dataconnect
# in another terminal, with VITE_USE_EMULATORS=true in web/.env.local
cd web && npm run dev
```

### After changing `.gql` files

```bash
firebase dataconnect:sdk:generate   # regenerates web/src/dataconnect-generated
```
