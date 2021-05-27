/* =============   MODAL  =============  */
const modal = {
    open() {
        document.querySelector(".modal-overlay").classList.add("active");
    },
    close() {
        document.querySelector(".modal-overlay").classList.remove("active");
    }
}

// function openCloseForm() {   // ====== ALTERNATE FUNCTION=========
//     document.querySelector(".modal-overlay").classList.toggle("active");
// }

/* =============   STORAGE  =============  */
const transactions = [
    {
        description: "Computador",
        amount: -500000,
        date: "25/05/2021"
    },
    {
        description: "Vendas",
        amount: 500000,
        date: "26/05/2021"
    }
]

/* =============   TRANSACTIONS  =============  */
const Transaction = {
    all: transactions,
    add(transaction) {
        Transaction.all.push(transaction);
        app.reload();
    },
    remove() {

    },
    incomes() {
        let income = 0;
        Transaction.all.forEach(function(transaction) {
            income += transaction.amount > 0 ? transaction.amount : 0;
        })
        return income;
    },
    expenses() {
        let expense = 0;
        Transaction.all.forEach(function(transaction) {
            expense += transaction.amount < 0 ? transaction.amount : 0;
        })
        return expense;
    },
    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}


/* =============   DOM  =============  */
const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),
    addTransaction(transaction, index) {
        const tr = document.createElement("tr");
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;
        DOM.transactionsContainer.appendChild(tr);
    },
    innerHTMLTransaction(transaction, index) {
        const CSSClass = transaction.amount > 0 ? "income" : "expense";
        const amount = utils.formatCurrency(transaction.amount);
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSClass}">${amount}</td>
        <td class="date">${transaction.date }</td>
        <td><img onclick="Transaction.remove(${index})" src="assets/minus.svg  " alt="Remover transação"></td>`;
        return html;
    },
    updateBalance() {
        document.getElementById("incomesDisplay").innerHTML = utils.formatCurrency(Transaction.incomes());
        document.getElementById("expensesDisplay").innerHTML = utils.formatCurrency(Transaction.expenses());
        document.getElementById("totalDisplay").innerHTML = utils.formatCurrency(Transaction.total());
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}


/* =============   UTILS  =============  */
const utils = {
    formatAmout(value) {
        value = Number(value) * 100;
        value = Math.round(value);
        return value;
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";
        value = String(value).replace(/\D/g, "")    // Remove anything that is not number
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value;
    }
}


/* =============   FORM  =============  */
const form = {
    description: document.querySelector("form input#description"),
    amount: document.querySelector("form input#amount"),
    date: document.querySelector("form input#date"),
    getValues() {
        return {
            description: form.description.value,
            amount: form.amount.value,
            date: form.date.value
        }
    },
    validateFields() {
        const { description, amount, date } = form.getValues();
        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos!");
        }
    },
    formatValues() {
        let { description, amount, date } = form.getValues();
        amount = utils.formatAmout(amount);
        date = utils.formatDate(date);
        console.log(description, amount, date)
        return  { description, amount, date };
    },
    clearFields() {
        form.description.value = "";
        form.amount.value = "";
        form.date.value = "";
    },
    submit(event) {
        event.preventDefault();
        try {
            form.validateFields();
            const transaction = form.formatValues();
            Transaction.add(transaction);
            form.clearFields();
            modal.close();
        } catch(error) {
            alert(error.message);
        }
    }
}


/* =============   APP  =============  */
const app = {
    init() {
        transactions.forEach(DOM.addTransaction);
        DOM.updateBalance();
    },
    reload() {
        DOM.clearTransactions();
        app.init()
    }
}

app.init()






