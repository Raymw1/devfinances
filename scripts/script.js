/* =============   MODAL  =============  */
const modal = {
    open() {
        document.querySelector(".modal-overlay").classList.add("active");
    },
    close() {
        form.clearFields();
        document.querySelector(".modal-overlay").classList.remove("active");
    }
}

/* =============   DARK   =============  */
const dark = {
    enable() {
        const imgElement = document.querySelector("header a")
        document.querySelector("body").classList.add("dark");
        document.querySelector(".modal").classList.add("dark");
        document.querySelector("footer span").classList.add("dark");
        const sun = `<img src="assets/sun.png" width="30" alt="Light mode">`
        imgElement.innerHTML = sun
        imgElement.setAttribute("onclick", "dark.disable()")
    },
    disable() {
        const imgElement = document.querySelector("header a")
        document.querySelector("body").classList.remove("dark");
        document.querySelector(".modal").classList.remove("dark");
        document.querySelector("footer span").classList.remove("dark");
        const moon = `<img src="assets/moon.png" width="30" alt="Dark mode">`
        imgElement.innerHTML = moon
        imgElement.setAttribute("onclick", "dark.enable()")
    }
}

// function openCloseForm() {   // ====== ALTERNATE FUNCTION=========
//     document.querySelector(".modal-overlay").classList.toggle("active");
// }

/* =============   STORAGE  =============  */
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions",
        JSON.stringify(transactions))
    }
}

/* =============   TRANSACTIONS  =============  */
const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction);
        app.reload();
    },
    remove(index) {
        Transaction.all.splice(index, 1);
        app.reload();
    },
    edit(index, transaction) {
        Transaction.all[index].description = transaction.description;
        Transaction.all[index].amount = transaction.amount;
        Transaction.all[index].date = transaction.date;
        app.reload();
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
        <td><img onclick="form.editModal(${index})" class="svg" src="assets/edit.svg" alt="Editar transa????o"></td>
        <td><img onclick="Transaction.remove(${index})" class="svg" src="assets/minus.svg  " alt="Remover transa????o"></td>`;
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
        return  { description, amount, date };
    },
    editModal(index) {
        modal.open();
        document.querySelector("#form h2").innerHTML = "Editar Transa????o";
        document.querySelector("button").innerText = "Editar";
        form.description.value = Transaction.all[index].description;
        form.amount.value = Transaction.all[index].amount / 100;
        let date = Transaction.all[index].date.split("/");
        date = `${date[2]}-${date[1]}-${date[0]}`;
        form.date.value = date;
        document.querySelector("form").setAttribute("onsubmit", `form.submit(event, ${index})`);
    },
    clearFields() {
        setTimeout(() => {
            document.querySelector("#form h2").innerHTML = "Nova Transa????o";
            form.description.value = "";
            form.amount.value = "";
            form.date.value = "";
            document.querySelector("form").setAttribute("onsubmit", "form.submit(event)");
            document.querySelector("button").innerText = "Salvar";
        }, 400)

    },
    submit(event, index) {
        event.preventDefault();
        try {
            form.validateFields();
            let transaction = form.formatValues();
            if (index != undefined) {
                Transaction.edit(index, transaction);
            }
            else {
                Transaction.add(transaction);
            }
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
        Transaction.all.forEach(DOM.addTransaction);
        DOM.updateBalance();
        Storage.set(Transaction.all);
    },
    reload() {
        DOM.clearTransactions();
        app.init();
    }
}

app.init();






