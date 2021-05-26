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
    add() {

    },
    remove() {

    },
    incomes() {

    },
    expenses() {

    },
    total() {

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

    },
    clearTransactions() {

    }
}


/* =============   UTILS  =============  */
const utils = {
    formatAmout(value) {

    },
    formatDate(date) {

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
    getValues() {

    },
    validateFields() {

    },
    formatValues() {

    },
    clearFields() {

    },
    submit() {

    }
}


/* =============   APP  =============  */
const app = {
    init() {
        transactions.forEach(DOM.addTransaction);
    },
    reload() {

    }
}

app.init()






