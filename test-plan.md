# RentFlow E2E Test Plan

All tests assume admin is already logged in (login is verified as setup, not a test case).

---

## Test 1: Dashboard Displays Real Data (Not Hardcoded)

**Steps:**
1. Navigate to `/` (Dashboard)
2. Read all 8 stat cards

**Pass criteria (ALL must match seeded data):**
- "Total Units" card shows **210**
- "Occupied" card shows **100**
- "Vacant" card shows **110**
- "Active Tenants" card shows **100**
- "Overdue Tenants" card shows **8**
- "Open Requests" card shows **7**
- Revenue chart (bar chart) is visible with bars for months Jan–May 2026
- Occupancy pie chart is visible with two segments

**Fail if:** Any stat card shows 0 when it should show data, or shows a different number than the API returns, or charts are missing/empty.

---

## Test 2: Tenant List Shows Real Tenants with Unit Assignments

**Steps:**
1. Click "Tenants" in sidebar
2. Observe tenant table

**Pass criteria:**
- Table shows 100 rows (or paginated equivalent — row count indicator says "100")
- Each row has: Name, Email, Phone, Unit number, Rent amount, Lease End, Status
- "James Mwangi" appears in the list with unit **A101**
- Status column shows "Active" badges

**Fail if:** Table is empty, shows fewer than 100 tenants, or unit column is blank/null.

---

## Test 3: Add New Tenant with Unit Assignment

**Steps:**
1. From Tenant list, click "Add Tenant" button
2. Fill form: Name="Test Tenant", Email="test@test.com", Phone="0712345678", Password="test123", National ID="99999999", Lease Start="2026-01-01", Lease End="2027-01-01", Deposit="12000"
3. Select a vacant unit from the Unit dropdown (should show vacant units with rent amounts)
4. Submit form

**Pass criteria:**
- Unit dropdown shows only **vacant** units (not occupied ones)
- After submit, redirects to tenant list
- New tenant "Test Tenant" appears in the list
- The assigned unit now shows as "occupied" in the Units page

**Fail if:** Form doesn't submit, dropdown shows occupied units, or tenant doesn't appear after creation.

---

## Test 4: View Tenant Detail with Payment History

**Steps:**
1. From Tenant list, click on a tenant who has payments (e.g., James Mwangi)
2. Observe detail page

**Pass criteria:**
- Shows tenant info: name, email, phone, national ID
- Shows unit info: unit number (A101), block, type, rent amount
- Shows payment history table with columns: Date, Month, Amount, Method, Transaction, Balance, Status
- Payment history has multiple rows (seeded data covers Jan–May)

**Fail if:** Detail page is blank, shows wrong tenant, or payment history is empty.

---

## Test 5: Unit List with Filtering

**Steps:**
1. Click "Units" in sidebar
2. Observe unit stat cards and table
3. Use status filter: select "Vacant"
4. Observe filtered results

**Pass criteria:**
- Stat cards show: Total=210, Occupied=100, Vacant=110
- Table shows all 210 units initially
- After filtering to "Vacant": only vacant units shown (110 units)
- Each row has: Unit number, Block, Floor, Type, Rent, Status

**Fail if:** Stat cards show wrong numbers, filter doesn't work, or table is empty.

---

## Test 6: Record a Payment and View Receipt

**Steps:**
1. Click "Payments" in sidebar
2. Click "Record Payment" button
3. Select a tenant from dropdown
4. Enter Amount=8000, Method=M-Pesa, Transaction Code="MPESA12345", Date=today, Month=May, Year=2026
5. Submit
6. Find the new payment in the list and click "Receipt" button

**Pass criteria:**
- Tenant dropdown shows active tenants with their unit info
- After submit, payment appears in the list with status "Paid" or "Partial"
- Receipt modal opens showing: receipt number, tenant name, unit, amount (KES 8,000), payment method, transaction code, balance
- Receipt has a "Print" button

**Fail if:** Payment doesn't save, receipt modal is empty, or balance calculation is wrong.

---

## Test 7: Maintenance Requests List and Status Update

**Steps:**
1. Click "Maintenance" in sidebar
2. Observe maintenance requests table
3. Click update/status change on one request — change status to "in_progress"

**Pass criteria:**
- Table shows 25 maintenance requests with columns: Title, Category, Tenant, Unit, Priority, Status, Date
- Priority badges show Low/Medium/High
- Status change saves and reflects immediately in the table

**Fail if:** Table is empty, status update fails, or columns are missing.

---

## Test 8: Feedback System with Admin Reply

**Steps:**
1. Click "Feedback" in sidebar
2. Observe feedback cards
3. Click "Reply" on one feedback item
4. Type a reply message and submit

**Pass criteria:**
- Shows 15 feedback cards with: category badge, status, star rating (1-5 stars), message text
- Reply form opens with textarea and status dropdown
- After submitting reply, the admin reply text appears on the feedback card

**Fail if:** No feedback shown, reply doesn't save, or star ratings are missing.

---

## Test 9: Reports Section — All 5 Tabs

**Steps:**
1. Click "Reports" in sidebar
2. Click through each of the 5 report tabs: Monthly Income, Outstanding Balances, Vacant Units, Maintenance, Feedback Stats

**Pass criteria:**
- **Monthly Income**: Bar chart showing revenue by month + annual total displayed
- **Outstanding Balances**: Table with tenant names, amounts owed, shows overdue tenants
- **Vacant Units**: Stat cards by unit type + table of vacant units (110 units)
- **Maintenance**: Pie chart by status + bar chart by category
- **Feedback Stats**: Category distribution + average rating displayed

**Fail if:** Any tab shows empty data, charts don't render, or tab switching is broken.

---

## Test 10: Tenant Portal — Login and Dashboard

**Steps:**
1. Logout from admin
2. Login as tenant: james.mwangi@email.com / tenant123
3. Verify redirect to /portal
4. Observe tenant dashboard

**Pass criteria:**
- After login, URL is `/portal` (not `/` admin dashboard)
- Tenant dashboard shows stat cards: Monthly Rent, Paid This Month, Balance Due, Open Requests
- Unit info card shows: unit A101, block, floor, type
- Sidebar shows tenant-specific navigation (Payments, Maintenance, Feedback, Profile) — NOT admin links
- Quick action buttons visible: View Payments, Submit Maintenance, Submit Feedback

**Fail if:** Tenant sees admin dashboard, stat cards show 0/blank, or admin navigation is visible.

---

## Test 11: Tenant Portal — Submit Maintenance Request

**Steps:**
1. As tenant (james.mwangi), click "Maintenance" in sidebar
2. Click "New Request" button
3. Fill form: Title="Leaking tap", Description="Kitchen tap is leaking", Category=Plumbing, Priority=Medium
4. Submit

**Pass criteria:**
- Form submits successfully
- New request "Leaking tap" appears in the tenant's maintenance list
- Status shows "Open"

**Fail if:** Form doesn't submit, request doesn't appear, or tenant can see other tenants' requests.

---

## Test 12: Tenant Portal — Submit Feedback

**Steps:**
1. As tenant, click "Feedback" in sidebar
2. Click "Submit Feedback" button
3. Fill form: Category=Security, Message="Need better lighting in parking", Rating=3 stars
4. Submit

**Pass criteria:**
- Star rating selector works (clicking star 3 highlights 3 stars)
- Feedback submits and appears in tenant's feedback list
- Shows category "Security", rating 3 stars, status "Pending"

**Fail if:** Star rating doesn't work, feedback doesn't save, or category is missing.
