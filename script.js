/* =====================================================
   DAILY SPEND AI - FRONTEND JAVASCRIPT
   ===================================================== */


/* ================= GLOBAL VARIABLES ================= */

let dailyLimit = 233;

let totalTodayExpense = 0;

let expenses = [];


/* ================= SCROLL FUNCTIONS ================= */

function scrollToBudget() {

    document.getElementById("budget").scrollIntoView({
        behavior: "smooth"
    });

}


function scrollToAdvisor() {

    document.getElementById("advisor").scrollIntoView({
        behavior: "smooth"
    });

}


/* ================= CALCULATE BUDGET ================= */

function calculateBudget() {

    let salary =
        Number(document.getElementById("salary").value);

    let savings =
        Number(document.getElementById("savings").value);

    let monthlyExpenses =
        Number(document.getElementById("monthlyExpenses").value);


    /* Validation */

    if (salary <= 0) {

        alert("Please enter your monthly salary.");

        return;
    }


    if (savings < 0 || monthlyExpenses < 0) {

        alert("Please enter valid amounts.");

        return;
    }


    /* Available budget */

    let available =
        salary - savings - monthlyExpenses;


    if (available < 0) {

        alert(
            "Your savings and expenses are greater than your salary."
        );

        return;
    }


    /* Daily limit */

    dailyLimit =
        available / 30;


    let weeklyLimit =
        dailyLimit * 7;


    /* Update Dashboard */

    document.getElementById("displaySalary").innerText =
        formatNumber(salary);

    document.getElementById("displaySavings").innerText =
        formatNumber(savings);

    document.getElementById("displayAvailable").innerText =
        formatNumber(available);

    document.getElementById("displayDaily").innerText =
        formatNumber(dailyLimit);


    /* Update Result */

    document.getElementById("resultAvailable").innerText =
        formatNumber(available);

    document.getElementById("resultDaily").innerText =
        formatNumber(dailyLimit);

    document.getElementById("resultWeekly").innerText =
        formatNumber(weeklyLimit);


    /* Update Hero */

    document.getElementById("heroDailyLimit").innerText =
        formatNumber(dailyLimit);


    /* Reset today's expense */

    totalTodayExpense = 0;

    expenses = [];

    updateRemaining();

    renderExpenses();


    /* Scroll */

    document.getElementById("dashboard").scrollIntoView({
        behavior: "smooth"
    });

}


/* ================= ADD EXPENSE ================= */

function addExpense() {

    let name =
        document.getElementById("expenseName").value.trim();

    let amount =
        Number(document.getElementById("expenseAmount").value);

    let category =
        document.getElementById("expenseCategory").value;


    /* Validation */

    if (name === "") {

        alert("Please enter expense name.");

        return;
    }


    if (amount <= 0) {

        alert("Please enter a valid amount.");

        return;
    }


    /* Create expense object */

    let expense = {

        id: Date.now(),

        name: name,

        amount: amount,

        category: category

    };


    expenses.push(expense);


    /* Update total */

    totalTodayExpense += amount;


    /* Clear inputs */

    document.getElementById("expenseName").value = "";

    document.getElementById("expenseAmount").value = "";


    /* Update UI */

    renderExpenses();

    updateRemaining();

}


/* ================= RENDER EXPENSES ================= */

function renderExpenses() {

    let container =
        document.getElementById("expenseItems");


    let count =
        document.getElementById("expenseCount");


    /* Empty */

    if (expenses.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div>💳</div>

                <p>No expenses added yet.</p>

                <small>
                    Add your first expense.
                </small>

            </div>

        `;

        count.innerText = "0 expenses";

        return;
    }


    /* Count */

    count.innerText =
        expenses.length +
        (expenses.length === 1
            ? " expense"
            : " expenses");


    /* Clear */

    container.innerHTML = "";


    /* Create items */

    expenses.forEach(function (expense) {


        let icon = getCategoryIcon(
            expense.category
        );


        let item =
            document.createElement("div");


        item.className =
            "expense-item";


        item.innerHTML = `

            <div class="expense-left">

                <div class="expense-icon">
                    ${icon}
                </div>

                <div>

                    <div class="expense-name">
                        ${expense.name}
                    </div>

                    <div class="expense-category">
                        ${expense.category}
                    </div>

                </div>

            </div>


            <div>

                <span class="expense-amount">
                    ₹${formatNumber(expense.amount)}
                </span>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                >
                    ×
                </button>

            </div>

        `;


        container.appendChild(item);

    });

}


/* ================= DELETE EXPENSE ================= */

function deleteExpense(id) {

    let expense =
        expenses.find(function (item) {

            return item.id === id;

        });


    if (expense) {

        totalTodayExpense -= expense.amount;

    }


    expenses =
        expenses.filter(function (item) {

            return item.id !== id;

        });


    renderExpenses();

    updateRemaining();

}


/* ================= UPDATE REMAINING ================= */

function updateRemaining() {

    let remaining =
        dailyLimit - totalTodayExpense;


    let remainingElement =
        document.getElementById("remainingAmount");


    remainingElement.innerText =
        formatNumber(Math.max(remaining, 0));


    /* Progress */

    let percentage = 0;


    if (dailyLimit > 0) {

        percentage =
            (totalTodayExpense / dailyLimit) * 100;

    }


    percentage =
        Math.min(percentage, 100);


    document.getElementById(
        "heroProgress"
    ).style.width = percentage + "%";


    /* Remaining status */

    if (remaining < 0) {

        remainingElement.style.color =
            "#e74c3c";

    } else {

        remainingElement.style.color =
            "#6c5ce7";

    }

}


/* ================= AI ================= */

function askAI() {

    let amount =
        Number(
            document.getElementById("aiAmount").value
        );


    if (amount <= 0) {

        alert(
            "Please enter an amount."
        );

        return;
    }


    generateAIResponse(amount);

}


/* ================= QUICK QUESTIONS ================= */

function quickQuestion(amount) {

    document.getElementById(
        "aiAmount"
    ).value = amount;


    generateAIResponse(amount);

}


/* ================= AI RESPONSE ================= */

function generateAIResponse(amount) {

    let answerBox =
        document.getElementById("aiAnswer");


    let answerText =
        document.getElementById("answerText");


    let remaining =
        dailyLimit - totalTodayExpense;


    let message = "";


    /* Case 1 */

    if (amount <= remaining) {

        let afterSpend =
            remaining - amount;


        message = `
            Yes! ₹${formatNumber(amount)}
            is within your remaining daily budget.
            After spending this amount, you would have
            approximately ₹${formatNumber(afterSpend)}
            left for today.
        `;

    }


    /* Case 2 */

    else {

        let extra =
            amount - remaining;


        message = `
            ⚠️ This spending is above your remaining
            daily budget by approximately
            ₹${formatNumber(extra)}.
            Consider reducing the expense to protect
            your monthly savings goal.
        `;

    }


    answerText.innerHTML =
        message;


    answerBox.style.display =
        "flex";

}


/* ================= CATEGORY ICON ================= */

function getCategoryIcon(category) {

    if (category === "Food") {

        return "🍔";

    }


    if (category === "Travel") {

        return "🚌";

    }


    if (category === "Shopping") {

        return "🛍️";

    }


    if (category === "Bills") {

        return "📄";

    }


    return "📦";

}


/* ================= NUMBER FORMAT ================= */

function formatNumber(number) {

    return Math.round(number)
        .toLocaleString("en-IN");

}


/* ================= INITIAL LOAD ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        calculateBudget();

    }
);