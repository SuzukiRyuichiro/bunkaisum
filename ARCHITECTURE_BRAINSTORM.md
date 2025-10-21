# Architecture Brainstorm - Bunkaisum

## Project Goals
- Fast tab switching between Expenses and Balances
- Minimal backend/database hosting costs
- Infrequent writes (adding/updating expenses)
- Small user base (sharehouse members only)
- Future: View Transitions API integration

---

## Frontend Architecture

### Tab Navigation Strategy

#### Option 1: Client-Side State Management (RECOMMENDED)
**Approach:** Keep both Expenses and Balances data in client state, use UTabs for instant switching

**Pros:**
- Instant tab switching (no page reload)
- Data fetched once and cached in memory
- Works perfectly with UTabs component
- Easy to implement View Transitions API later
- Better UX for frequent tab switching

**Cons:**
- Initial load fetches both datasets
- Memory usage (negligible for small sharehouse)

**Implementation:**
```vue
<!-- app.vue or pages/index.vue -->
<template>
  <UApp>
    <UContainer>
      <UTabs v-model="selectedTab" :items="tabs">
        <template #expenses>
          <ExpensesView :data="expensesData" />
        </template>
        <template #balances>
          <BalancesView :data="balancesData" />
        </template>
      </UTabs>
    </UContainer>
  </UApp>
</template>

<script setup>
const selectedTab = ref(0)
const { data: expensesData } = await useFetch('/api/expenses')
const { data: balancesData } = await useFetch('/api/balances')
</script>
```

#### Option 2: Route-Based Navigation
**Approach:** Use `/expenses` and `/balances` routes with UTabs for navigation

**Pros:**
- Lazy loading per tab
- Smaller initial bundle
- Shareable URLs per section

**Cons:**
- Page navigation delay (even if small)
- Re-fetching data on tab switch (unless cached)
- More complex state management

**Verdict:** Not ideal for your "quick switching" requirement

---

## Backend Architecture

### Database Strategy - Serverless/Edge Options

#### Option 1: Cloudflare D1 + Workers (RECOMMENDED)
**Why:** Perfect for low-frequency writes, high read performance

**Architecture:**
```
Nuxt App (Static/SSR)
  ↓
Cloudflare Workers (API endpoints)
  ↓
D1 Database (SQLite)
```

**Pricing:**
- D1: Free tier = 100k reads/day, 1k writes/day
- Workers: Free tier = 100k requests/day
- Perfect for sharehouse use case!

**Data Model:**
```sql
-- expenses table
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY,
  description TEXT,
  amount DECIMAL,
  paid_by TEXT,
  split_among TEXT, -- JSON array of members
  date TEXT,
  created_at TIMESTAMP
);

-- Pre-calculated balances (updated on write)
CREATE TABLE balances (
  member TEXT PRIMARY KEY,
  balance DECIMAL,
  owes_to TEXT, -- JSON object of who owes whom
  last_updated TIMESTAMP
);
```

**Write Flow:**
1. User submits expense
2. Worker receives request
3. Insert into `expenses` table
4. **Immediately recalculate all balances**
5. Update `balances` table
6. Return updated data

**Read Flow:**
- Query pre-calculated `balances` table (instant!)
- No computation on read

#### Option 2: Supabase (PostgreSQL)
**Why:** Full-featured, real-time subscriptions

**Pros:**
- Free tier: 500MB database, 2GB bandwidth
- Built-in auth (if you add login later)
- Real-time subscriptions (auto-update when roommate adds expense)
- Row-level security

**Cons:**
- Heavier than needed for your use case
- Always-running Postgres instance

**Best for:** If you want real-time updates across devices

#### Option 3: Turso (LibSQL/SQLite Edge)
**Why:** SQLite at the edge, pay-per-read model

**Pros:**
- Free tier: 9GB storage, 1B row reads
- Edge replicas for global performance
- SQLite = simple, fast

**Cons:**
- Newer service (less mature than D1)

#### Option 4: GitHub as Database (Ultra-Minimal)
**Why:** Git commits = database writes

**Architecture:**
```
Nuxt App (Static on Vercel/Netlify)
  ↓
GitHub Actions (on expense submission)
  ↓
JSON file in repo (expenses.json, balances.json)
  ↓
Rebuild static site
```

**Pros:**
- ZERO database hosting costs
- Version history built-in
- Audit trail for free
- No backend needed (use GitHub API)

**Cons:**
- 3-5 second delay on writes (rebuild time)
- Not suitable for frequent writes
- Feels hacky (but works!)

**Perfect for:** Your "minimal backend" requirement

---

## Recommended Tech Stack

### Minimal Cost Option (GitHub-based)
```yaml
Frontend: Nuxt 4 (Static Generation)
Hosting: Vercel/Netlify/Cloudflare Pages (Free)
Database: JSON files in GitHub repo
API: GitHub API + Octokit
Build Trigger: GitHub Actions
```

**Flow:**
1. User adds expense via form
2. Frontend calls serverless function
3. Function commits to GitHub (expenses.json)
4. GitHub Action triggers rebuild
5. Balances recalculated at build time
6. Static site redeployed (3-5 sec)

### Best Performance Option (D1-based)
```yaml
Frontend: Nuxt 4 (SSR/Hybrid)
Hosting: Cloudflare Pages
Backend: Cloudflare Workers
Database: Cloudflare D1 (SQLite)
Caching: KV Storage for balances
```

**Flow:**
1. User adds expense
2. Worker writes to D1
3. Worker recalculates balances
4. Balances cached in KV
5. Next read = instant from KV

---

## Layout Implementation

### Recommended: Single-Page with UTabs

```vue
<!-- app/pages/index.vue -->
<template>
  <UContainer class="py-8">
    <h1 class="text-2xl font-bold mb-6">Sharehouse Expenses</h1>

    <UTabs
      v-model="activeTab"
      :items="tabs"
      class="mb-6"
    >
      <template #expenses>
        <ExpensesList
          :expenses="expenses"
          @add="handleAddExpense"
        />
      </template>

      <template #balances>
        <BalancesSummary
          :balances="balances"
          :members="members"
        />
      </template>
    </UTabs>
  </UContainer>
</template>

<script setup lang="ts">
const activeTab = ref(0)

const tabs = [
  { label: 'Expenses', icon: 'i-lucide-receipt', slot: 'expenses' },
  { label: 'Balances', icon: 'i-lucide-wallet', slot: 'balances' }
]

// Fetch both datasets once
const { data: expenses, refresh: refreshExpenses } = await useFetch('/api/expenses')
const { data: balances, refresh: refreshBalances } = await useFetch('/api/balances')
const { data: members } = await useFetch('/api/members')

async function handleAddExpense(expense) {
  await $fetch('/api/expenses', { method: 'POST', body: expense })
  // Refresh both (balances recalculated on backend)
  await Promise.all([refreshExpenses(), refreshBalances()])
}
</script>
```

### Key Components

**ExpensesList.vue:**
```vue
<template>
  <div>
    <UButton @click="showAddModal = true">Add Expense</UButton>

    <UTable :rows="expenses" :columns="columns">
      <template #amount-data="{ row }">
        {{ formatCurrency(row.amount) }}
      </template>
    </UTable>

    <UModal v-model="showAddModal">
      <ExpenseForm @submit="$emit('add', $event)" />
    </UModal>
  </div>
</template>
```

**BalancesSummary.vue:**
```vue
<template>
  <div class="grid gap-4">
    <UCard v-for="member in members" :key="member.id">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-semibold">{{ member.name }}</h3>
          <p class="text-sm text-gray-500">
            {{ formatBalance(balances[member.id]) }}
          </p>
        </div>
        <UBadge :color="getBalanceColor(balances[member.id])">
          {{ balances[member.id] > 0 ? 'Owed' : 'Owes' }}
        </UBadge>
      </div>

      <!-- Detailed breakdown -->
      <div v-if="balances[member.id]?.owesTo" class="mt-4">
        <div v-for="(amount, person) in balances[member.id].owesTo">
          {{ member.name }} owes {{ person }}: {{ formatCurrency(amount) }}
        </div>
      </div>
    </UCard>
  </div>
</template>
```

---

## View Transitions API (Future)

### Implementation Plan

```ts
// composables/useViewTransition.ts
export const useViewTransition = () => {
  const navigate = (callback: () => void) => {
    if (!document.startViewTransition) {
      callback()
      return
    }

    document.startViewTransition(() => callback())
  }

  return { navigate }
}

// Usage in tab switching
const { navigate } = useViewTransition()

function switchTab(index: number) {
  navigate(() => {
    activeTab.value = index
  })
}
```

**CSS for transitions:**
```css
/* assets/css/main.css */
@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}
```

---

## My Recommendations

### Phase 1: MVP (This Week)
- ✅ **Frontend:** Single-page app with UTabs (client-side switching)
- ✅ **Backend:** Cloudflare D1 + Workers (free tier)
- ✅ **Data:** Pre-calculate balances on every expense write
- ✅ **Hosting:** Cloudflare Pages (free)

### Phase 2: Enhancements (Later)
- 🔄 Add View Transitions API
- 🔄 PWA for mobile (install on phones)
- 🔄 Real-time updates with WebSockets (if needed)
- 🔄 Export to CSV/PDF

### Alternative for ZERO Cost
If you want absolutely $0 hosting:
- Static site on GitHub Pages
- JSON files as database
- GitHub Actions for recalculation
- Trade-off: 3-5 second delay on writes (totally acceptable for sharehouse)

---

## Performance Checklist

- ✅ Preload both tabs' data on initial load
- ✅ Use Nuxt's `useFetch` with caching
- ✅ Pre-calculate balances (never compute on read)
- ✅ Optimize images (if any) with Nuxt Image
- ✅ Use lazy loading for heavy components
- ✅ Consider edge caching for balances (KV/Cache API)

**Expected Performance:**
- Initial load: < 1s
- Tab switch: < 50ms (instant)
- Add expense: < 200ms (with D1)
- Add expense: < 5s (with GitHub Actions rebuild)
