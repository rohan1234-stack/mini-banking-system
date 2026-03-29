const STORAGE_KEYS = {
  accounts: "mini-banking-accounts",
  transactions: "mini-banking-transactions",
};

const demoAccounts = [
  { accNo: "1001", name: "Anika Sharma", balance: 5000 },
  { accNo: "1002", name: "Rohan Patel", balance: 3250 },
];

const demoTransactions = [
  makeTransaction("1001", "create", 5000, "2026-03-29T09:00:00.000Z"),
  makeTransaction("1002", "create", 3250, "2026-03-29T09:15:00.000Z"),
];

const state = {
  accounts: loadJson(STORAGE_KEYS.accounts, demoAccounts),
  transactions: loadJson(STORAGE_KEYS.transactions, demoTransactions),
};

const elements = {
  consoleOutput: document.getElementById("consoleOutput"),
  summaryTableBody: document.getElementById("summaryTableBody"),
  accountDetails: document.getElementById("accountDetails"),
  storageStatus: document.getElementById("storageStatus"),
  createAccountForm: document.getElementById("createAccountForm"),
  transactionForm: document.getElementById("transactionForm"),
  searchForm: document.getElementById("searchForm"),
  clearDataButton: document.getElementById("clearDataButton"),
  transactionListTemplate: document.getElementById("transactionListTemplate"),
};

bootstrap();

function bootstrap() {
  saveState();
  renderSummary();
  renderStorageStatus();
  wireEvents();
  printConsole("Mini Banking System ready. Type or click `help` to view supported actions.");
}

function wireEvents() {
  elements.createAccountForm.addEventListener("submit", handleCreateAccount);
  elements.transactionForm.addEventListener("submit", handleTransaction);
  elements.searchForm.addEventListener("submit", handleSearch);
  elements.clearDataButton.addEventListener("click", resetData);

  document.querySelectorAll("[data-command]").forEach((button) => {
    button.addEventListener("click", () => runCommand(button.dataset.command));
  });
}

function handleCreateAccount(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const accNo = formData.get("accNo").toString().trim();
  const name = formData.get("name").toString().trim();
  const balance = Number(formData.get("balance"));

  if (!accNo || !name || Number.isNaN(balance) || balance < 0) {
    printConsole("Invalid account input. Check account number, name, and opening balance.", "error");
    return;
  }

  if (findAccount(accNo)) {
    printConsole(`Account ${accNo} already exists.`, "error");
    return;
  }

  state.accounts.push({ accNo, name, balance });
  state.transactions.push(makeTransaction(accNo, "create", balance));
  saveState();
  renderSummary();
  renderAccount(accNo);

  event.currentTarget.reset();
  printConsole(`Account ${accNo} created for ${name} with opening balance Rs. ${formatAmount(balance)}.`, "success");
}

function handleTransaction(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const accNo = formData.get("accNo").toString().trim();
  const amount = Number(formData.get("amount"));
  const type = formData.get("type").toString();

  if (!accNo || Number.isNaN(amount) || amount <= 0) {
    printConsole("Enter a valid account number and amount greater than zero.", "error");
    return;
  }

  const account = findAccount(accNo);
  if (!account) {
    printConsole(`Account ${accNo} was not found.`, "error");
    return;
  }

  if (type === "withdraw" && account.balance < amount) {
    printConsole(`Withdrawal denied. Account ${accNo} cannot go below zero.`, "error");
    return;
  }

  account.balance += type === "deposit" ? amount : -amount;
  state.transactions.push(makeTransaction(accNo, type, amount));
  saveState();
  renderSummary();
  renderAccount(accNo);

  event.currentTarget.reset();
  printConsole(
    `${capitalize(type)} of Rs. ${formatAmount(amount)} applied to account ${accNo}. New balance: Rs. ${formatAmount(account.balance)}.`,
    "success"
  );
}

function handleSearch(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const accNo = formData.get("accNo").toString().trim();
  renderAccount(accNo);
}

function renderAccount(accNo) {
  const account = findAccount(accNo);
  if (!account) {
    elements.accountDetails.innerHTML = `<p class="muted">Account ${escapeHtml(accNo)} was not found.</p>`;
    printConsole(`Search completed. Account ${accNo} does not exist.`, "error");
    return;
  }

  const recentTransactions = getRecentTransactions(accNo, 5);
  const list = elements.transactionListTemplate.content.firstElementChild.cloneNode(false);

  recentTransactions.forEach((transaction) => {
    const item = document.createElement("li");
    item.textContent = `${transaction.type.toUpperCase()} | Rs. ${formatAmount(transaction.amount)} | ${formatDate(transaction.timestamp)}`;
    list.appendChild(item);
  });

  elements.accountDetails.innerHTML = `
    <h3>${escapeHtml(account.name)}</h3>
    <p><strong>AccNo:</strong> ${escapeHtml(account.accNo)}</p>
    <p><strong>Balance:</strong> Rs. ${formatAmount(account.balance)}</p>
    <p><strong>Last 5 Transactions:</strong></p>
  `;

  elements.accountDetails.appendChild(
    recentTransactions.length
      ? list
      : buildMutedMessage("No transactions available for this account yet.")
  );

  printConsole(`Search completed. Loaded account ${accNo}.`, "success");
}

function renderSummary() {
  elements.summaryTableBody.innerHTML = "";

  if (!state.accounts.length) {
    elements.summaryTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="muted">No accounts stored yet.</td>
      </tr>
    `;
    return;
  }

  state.accounts
    .slice()
    .sort((a, b) => a.accNo.localeCompare(b.accNo))
    .forEach((account) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(account.accNo)}</td>
        <td>${escapeHtml(account.name)}</td>
        <td>Rs. ${formatAmount(account.balance)}</td>
        <td>${countTransactions(account.accNo)}</td>
      `;
      elements.summaryTableBody.appendChild(row);
    });
}

function runCommand(command) {
  switch (command) {
    case "help":
      printConsole("Supported actions: create account, deposit, withdraw, search by AccNo, summary, export accounts, export transactions.");
      break;
    case "summary":
      printConsole(`Summary: ${state.accounts.length} account(s), ${state.transactions.length} transaction log entry/entries.`);
      break;
    case "export accounts":
      downloadFile("accounts.json", JSON.stringify(state.accounts, null, 2), "application/json");
      printConsole("Accounts file exported as accounts.json.", "success");
      break;
    case "export transactions":
      downloadFile("transactions.json", JSON.stringify(state.transactions, null, 2), "application/json");
      printConsole("Transaction log file exported as transactions.json.", "success");
      break;
    default:
      printConsole(`Unknown command: ${command}`, "error");
  }
}

function resetData() {
  state.accounts = cloneData(demoAccounts);
  state.transactions = cloneData(demoTransactions);
  saveState();
  renderSummary();
  elements.accountDetails.innerHTML = `<p class="muted">Demo data restored.</p>`;
  printConsole("Demo data restored and local storage reset.", "success");
}

function findAccount(accNo) {
  return state.accounts.find((account) => account.accNo === accNo);
}

function getRecentTransactions(accNo, limit) {
  return state.transactions
    .filter((transaction) => transaction.accNo === accNo)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}

function countTransactions(accNo) {
  return state.transactions.filter((transaction) => transaction.accNo === accNo).length;
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(state.accounts));
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(state.transactions));
  renderStorageStatus();
}

function renderStorageStatus() {
  elements.storageStatus.textContent = `${state.accounts.length} account(s) and ${state.transactions.length} transaction(s) stored locally`;
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : cloneData(fallback);
  } catch (error) {
    console.error(error);
    return cloneData(fallback);
  }
}

function printConsole(message, tone = "info") {
  const line = document.createElement("p");
  line.className = `console-line ${tone}`;
  line.textContent = `> ${message}`;
  elements.consoleOutput.prepend(line);
}

function makeTransaction(accNo, type, amount, timestamp = new Date().toISOString()) {
  return { accNo, type, amount, timestamp };
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildMutedMessage(message) {
  const paragraph = document.createElement("p");
  paragraph.className = "muted";
  paragraph.textContent = message;
  return paragraph;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function formatAmount(value) {
  return Number(value).toFixed(2);
}

function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
