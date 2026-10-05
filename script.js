let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editingId = null;

const form = document.getElementById("transaction-form");

const type = document.getElementById("type");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const description = document.getElementById("description");

const transactionList = document.getElementById("transaction-list");


// Edit form
const editForm = document.getElementById("edit-form");
const updateForm = document.getElementById("update-form");

const editType = document.getElementById("edit-type");
const editAmount = document.getElementById("edit-amount");
const editCategory = document.getElementById("edit-category");
const editDate = document.getElementById("edit-date");
const editDescription = document.getElementById("edit-description");

const cancelEdit = document.getElementById("cancel-edit");


// Summary
const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const balance = document.getElementById("balance");


// Monthly summary
const month = document.getElementById("month");
const monthlyExpenses = document.getElementById("monthly-expenses");


// Filters
const typeFilter = document.getElementById("type-filter");
const categoryFilter = document.getElementById("category-filter");


// Display transactions
function renderTransactions() {

    transactionList.innerHTML = "";

    let filteredTransactions = transactions;

    if (typeFilter.value !== "all") {
        filteredTransactions = filteredTransactions.filter(function(transaction) {
            return transaction.type === typeFilter.value;
        });
    }

    if (categoryFilter.value !== "all") {
        filteredTransactions = filteredTransactions.filter(function(transaction) {
            return transaction.category === categoryFilter.value;
        });
    }

    filteredTransactions.forEach(function(transaction) {

        const transactionElement = document.createElement("div");

        transactionElement.innerHTML = `
            <div class="transaction-main">
                <h3>${transaction.category}</h3>

                <p style="color: ${transaction.type === "expense" ? "red" : "green"}">
                    ${transaction.type === "expense" ? "-" : "+"} ₹${transaction.amount}
                </p>
            </div>

            <div class="transaction-details" style="display: none;">
                <p>Description: ${transaction.description}</p>
                <p>Type: ${transaction.type}</p>
                <p>Date: ${transaction.date}</p>

                <button onclick="editTransaction(${transaction.id})">
                    Edit
                </button>

                <button onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>
            </div>
        `;

        const transactionDetails =
            transactionElement.querySelector(".transaction-details");

        transactionElement.addEventListener("click", function() {

            if (transactionDetails.style.display === "none") {
                transactionDetails.style.display = "block";
            } else {
                transactionDetails.style.display = "none";
            }

        });

        transactionList.appendChild(transactionElement);
    });
}


// Filters
typeFilter.addEventListener("change", function() {
    renderTransactions();
});

categoryFilter.addEventListener("change", function() {
    renderTransactions();
});


// Add transaction
form.addEventListener("submit", function(event) {

    event.preventDefault();

    if (Number(amount.value) <= 0) {
        alert("Amount must be greater than 0");
        return;
    }

    const transaction = {
        id: Date.now(),
        type: type.value,
        amount: Number(amount.value),
        category: category.value,
        date: date.value,
        description: description.value
    };

    transactions.push(transaction);

    saveTransactions();

    renderTransactions();

    updateSummary();

    updateMonthlyExpenses();

    form.reset();
});


// Delete transaction
function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    saveTransactions();

    renderTransactions();

    updateSummary();

    updateMonthlyExpenses();
}


// Open edit form
function editTransaction(id) {

    const transaction = transactions.find(function(transaction) {
        return transaction.id === id;
    });

    editingId = id;

    editType.value = transaction.type;
    editAmount.value = transaction.amount;
    editCategory.value = transaction.category;
    editDate.value = transaction.date;
    editDescription.value = transaction.description;

    editForm.style.display = "block";

    // Scroll to edit form
    editForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// Update transaction
updateForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (Number(editAmount.value) <= 0) {
        alert("Amount must be greater than 0");
        return;
    }

    const transaction = transactions.find(function(transaction) {
        return transaction.id === editingId;
    });

    transaction.type = editType.value;
    transaction.amount = Number(editAmount.value);
    transaction.category = editCategory.value;
    transaction.date = editDate.value;
    transaction.description = editDescription.value;

    saveTransactions();

    editForm.style.display = "none";

    editingId = null;

    renderTransactions();

    updateSummary();

    updateMonthlyExpenses();
});


// Update summary
function updateSummary() {

    let income = 0;
    let expenses = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            income += transaction.amount;
        }

        if (transaction.type === "expense") {
            expenses += transaction.amount;
        }
    });

    totalIncome.textContent = income;
    totalExpenses.textContent = expenses;
    balance.textContent = income - expenses;
}


// Monthly expense summary
function updateMonthlyExpenses() {

    let total = 0;

    transactions.forEach(function(transaction) {

        if (
            transaction.type === "expense" &&
            transaction.date.startsWith(month.value)
        ) {
            total += transaction.amount;
        }

    });

    monthlyExpenses.textContent = total;
}


month.addEventListener("change", function() {
    updateMonthlyExpenses();
});


// Cancel editing
cancelEdit.addEventListener("click", function() {

    editForm.style.display = "none";

    editingId = null;
});


// Storage
function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// Load data
renderTransactions();
updateSummary();
updateMonthlyExpenses();