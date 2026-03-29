# Mini Banking System with Transaction Log

## Cover Page

- Student Name: `________________`
- Roll Number: `________________`
- Subject / Course: `________________`
- Live Hosted Link: `https://________________`
- GitHub Repository Link: `https://________________`
- Submission Date: `________________`

## Problem Statement

Develop a simple banking console system that allows a user to create and manage accounts, perform deposits and withdrawals, store account details, maintain a transaction log, search for an account by account number, view account summaries, and display the last five transactions for a selected account.

## Features Implemented

1. Create account using `AccNo`, `Name`, and `Balance`
2. Deposit money into an existing account
3. Withdraw money with negative-balance prevention
4. Save account data persistently in browser local storage
5. Export account data to `accounts.json`
6. Maintain and export transaction log data in `transactions.json`
7. View account summary in tabular form
8. Search account by `AccNo`
9. Display the last 5 transactions for an account
10. Reset demo data for quick testing

## Structure / Function List

| Name | Type | Purpose |
|---|---|---|
| `STORAGE_KEYS` | constant object | Stores local storage keys for accounts and transactions |
| `demoAccounts` | array | Provides initial sample account records |
| `demoTransactions` | array | Provides initial sample transaction records |
| `state` | object | Stores live account and transaction data in memory |
| `bootstrap()` | function | Initializes the application and binds events |
| `wireEvents()` | function | Connects UI forms and buttons to banking actions |
| `handleCreateAccount()` | function | Validates input and creates a new account |
| `handleTransaction()` | function | Processes deposit and withdraw operations |
| `handleSearch()` | function | Searches account by account number |
| `renderAccount()` | function | Shows account details and recent transactions |
| `renderSummary()` | function | Displays all accounts in summary table |
| `runCommand()` | function | Handles quick console command buttons |
| `resetData()` | function | Restores demo data for repeat testing |
| `findAccount()` | function | Returns matching account object by `AccNo` |
| `getRecentTransactions()` | function | Fetches latest five transactions for an account |
| `countTransactions()` | function | Counts transactions for an account |
| `saveState()` | function | Saves account and transaction arrays persistently |
| `renderStorageStatus()` | function | Updates status text for saved data |
| `loadJson()` | function | Loads persistent data or fallback demo data |
| `printConsole()` | function | Adds messages to the console window |
| `makeTransaction()` | function | Creates a transaction log entry object |
| `downloadFile()` | function | Downloads exported JSON files |
| `formatAmount()` | function | Formats numeric amount with two decimals |
| `formatDate()` | function | Converts timestamps into readable form |
| `capitalize()` | function | Capitalizes transaction labels |
| `escapeHtml()` | function | Prevents HTML injection while rendering |

## File Format Description

### Account File: `accounts.json`

Each account object stores:

- `accNo`: unique account number
- `name`: account holder name
- `balance`: current balance

Example:

```json
[
  {
    "accNo": "1001",
    "name": "Anika Sharma",
    "balance": 5000
  }
]
```

### Transaction Log File: `transactions.json`

Each transaction object stores:

- `accNo`: related account number
- `type`: `create`, `deposit`, or `withdraw`
- `amount`: transaction amount
- `timestamp`: ISO date-time string

Example:

```json
[
  {
    "accNo": "1001",
    "type": "withdraw",
    "amount": 250,
    "timestamp": "2026-03-29T11:20:00.000Z"
  }
]
```

## Testing Table

| Test Case ID | Input / Action | Expected Result | Actual Result |
|---|---|---|---|
| TC-01 | Create account `1003`, `Meera Nair`, `4000` | New account created and shown in summary | Pass |
| TC-02 | Create duplicate account `1001` | Error message shown, no duplicate created | Pass |
| TC-03 | Deposit `750` to account `1002` | Balance increases and log entry added | Pass |
| TC-04 | Withdraw `500` from account `1001` | Balance decreases and log entry added | Pass |
| TC-05 | Withdraw amount greater than balance | Withdrawal blocked with error | Pass |
| TC-06 | Search valid account `1001` | Account details and last 5 transactions displayed | Pass |
| TC-07 | Search invalid account `9999` | Not found message displayed | Pass |
| TC-08 | Export accounts and transactions | JSON files download successfully | Pass |

## Screenshots

Add at least 3 screenshots in the final PDF:

1. Home screen showing console and summary table
2. Successful account creation or deposit/withdraw operation
3. Search result showing last 5 transactions

Suggested image file names:

- `screenshot-home.png`
- `screenshot-transaction.png`
- `screenshot-search.png`

## AI Usage Declaration

AI tools were used to assist with project scaffolding, interface design, code organization, and documentation drafting. All generated content was reviewed and edited before final submission.
