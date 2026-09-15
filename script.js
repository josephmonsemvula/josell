/* =========================================================
   JOSSELL - MA GESTION
   JavaScript complet
   Ventes + Achats + Dépenses + Bénéfices
   Rapports journaliers + hebdomadaires + mensuels
   ========================================================= */


/* =========================================================
   1. STOCKAGE
========================================================= */

const STORAGE_KEYS = {
    groups: "jossell_groups",
    articles: "jossell_articles",
    records: "jossell_daily_records"
};


let groups =
    JSON.parse(localStorage.getItem(STORAGE_KEYS.groups)) || [];

let articles =
    JSON.parse(localStorage.getItem(STORAGE_KEYS.articles)) || [];

let dailyRecords =
    JSON.parse(localStorage.getItem(STORAGE_KEYS.records)) || [];


/* =========================================================
   2. ÉLÉMENTS HTML
========================================================= */

const loadingScreen =
    document.getElementById("loadingScreen");

const dailyForm =
    document.getElementById("dailyForm");

const saleDate =
    document.getElementById("saleDate");

const saleDay =
    document.getElementById("saleDay");

const dailySales =
    document.getElementById("dailySales");

const dynamicExpenses =
    document.getElementById("dynamicExpenses");

const totalDailySales =
    document.getElementById("totalDailySales");

const totalPurchases =
    document.getElementById("totalPurchases");

const totalDailyExpenses =
    document.getElementById("totalDailyExpenses");

const calculatedBalance =
    document.getElementById("calculatedBalance");

const dailyExpensesContainer =
    document.getElementById("dailyExpensesContainer");

const addExpenseButton =
    document.getElementById("addExpenseButton");

const dailyHistory =
    document.getElementById("dailyHistory");

const articleGroupForm =
    document.getElementById("articleGroupForm");

const articleForm =
    document.getElementById("articleForm");

const groupName =
    document.getElementById("groupName");

const groupDescription =
    document.getElementById("groupDescription");

const articleGroupSelect =
    document.getElementById("articleGroupSelect");

const articleName =
    document.getElementById("articleName");

const articleQuantity =
    document.getElementById("articleQuantity");

const articlePrice =
    document.getElementById("articlePrice");

const articlesList =
    document.getElementById("articlesList");

const currentYear =
    document.getElementById("currentYear");

const homeTodayDate =
    document.getElementById("homeTodayDate");

const dailySalesSummary =
    document.getElementById("dailySalesSummary");

const dailyPurchaseSummary =
    document.getElementById("dailyPurchaseSummary");

const dailyExpenseSummary =
    document.getElementById("dailyExpenseSummary");

const dailyBalanceSummary =
    document.getElementById("dailyBalanceSummary");

const homeCategorySummary =
    document.getElementById("homeCategorySummary");

const totalRecordedDays =
    document.getElementById("totalRecordedDays");

const totalCategories =
    document.getElementById("totalCategories");

const totalArticles =
    document.getElementById("totalArticles");

const bestCategory =
    document.getElementById("bestCategory");

const weeklySales =
    document.getElementById("weeklySales");

const monthlySales =
    document.getElementById("monthlySales");

const monthlyPurchases =
    document.getElementById("monthlyPurchases");

const monthlyExpenses =
    document.getElementById("monthlyExpenses");

const monthlyTotal =
    document.getElementById("monthlyTotal");

const weeklyReportSales =
    document.getElementById("weeklyReportSales");

const weeklyReportPurchases =
    document.getElementById("weeklyReportPurchases");

const weeklyReportExpenses =
    document.getElementById("weeklyReportExpenses");

const weeklyReportProfit =
    document.getElementById("weeklyReportProfit");

const weeklyReportDays =
    document.getElementById("weeklyReportDays");

const weekRange =
    document.getElementById("weekRange");

const categoryReports =
    document.getElementById("categoryReports");

const reportMonth =
    document.getElementById("reportMonth");

const refreshReports =
    document.getElementById("refreshReports");

const dailySalesReport =
    document.getElementById("dailySalesReport");

const finalMonthlySales =
    document.getElementById("finalMonthlySales");

const finalMonthlyPurchases =
    document.getElementById("finalMonthlyPurchases");

const finalMonthlyExpenses =
    document.getElementById("finalMonthlyExpenses");

const finalMonthlyProfit =
    document.getElementById("finalMonthlyProfit");

const accountingAlert =
    document.getElementById("accountingAlert");

const notificationContainer =
    document.getElementById("notificationContainer");

const historyCount =
    document.getElementById("historyCount");

const inventoryCount =
    document.getElementById("inventoryCount");

const calculatorStatus =
    document.getElementById("calculatorStatus");


/* =========================================================
   3. FONCTIONS GÉNÉRALES
========================================================= */

function saveData() {

    localStorage.setItem(
        STORAGE_KEYS.groups,
        JSON.stringify(groups)
    );

    localStorage.setItem(
        STORAGE_KEYS.articles,
        JSON.stringify(articles)
    );

    localStorage.setItem(
        STORAGE_KEYS.records,
        JSON.stringify(dailyRecords)
    );
}


function formatMoney(number) {

    number = Number(number) || 0;

    return number.toLocaleString("fr-FR") + " FC";
}


function todayISO() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {

    if (!dateString) return "";

    const parts =
        dateString.split("-");

    if (parts.length !== 3)
        return dateString;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


function getDayName(dateString) {

    if (!dateString) return "";

    const date =
        new Date(dateString + "T12:00:00");

    return date.toLocaleDateString(
        "fr-FR",
        {
            weekday: "long"
        }
    );
}


function escapeHTML(text) {

    if (
        text === null ||
        text === undefined
    ) {
        return "";
    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   4. NOTIFICATIONS
========================================================= */

function showNotification(
    message,
    type = "success"
) {

    if (!notificationContainer)
        return;

    const notification =
        document.createElement("div");

    notification.className =
        "jossell-notification";

    notification.style.padding =
        "14px 18px";

    notification.style.marginBottom =
        "10px";

    notification.style.borderRadius =
        "12px";

    notification.style.color =
        "#ffffff";

    notification.style.fontWeight =
        "600";

    notification.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.18)";

    notification.style.background =
        type === "error"
            ? "#dc2626"
            : type === "warning"
                ? "#f59e0b"
                : "#16a34a";

    notification.textContent =
        message;

    notificationContainer.appendChild(
        notification
    );

    setTimeout(() => {

        notification.style.opacity =
            "0";

        notification.style.transform =
            "translateX(30px)";

        notification.style.transition =
            "0.3s";

        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 3000);
}


/* =========================================================
   5. NAVIGATION
========================================================= */

function openPage(pageName) {

    const pages =
        document.querySelectorAll(".page");

    const navItems =
        document.querySelectorAll(".nav-item");


    pages.forEach(page => {

        page.classList.remove(
            "active-page"
        );

    });


    navItems.forEach(button => {

        button.classList.remove(
            "active"
        );

    });


    const targetPage =
        document.getElementById(
            `page-${pageName}`
        );


    const targetButton =
        document.querySelector(
            `.nav-item[data-page="${pageName}"]`
        );


    if (targetPage) {

        targetPage.classList.add(
            "active-page"
        );

    }


    if (targetButton) {

        targetButton.classList.add(
            "active"
        );

    }


    if (pageName === "home") {

        updateHomeSummary();

    }


    if (pageName === "calculator") {

        renderCategoryInputs();

        calculateCurrentDay();

        renderHistory();

    }


    if (pageName === "groups") {

        renderGroups();

        updateArticleGroupSelect();

    }


    if (pageName === "reports") {

        renderReports();

    }

}


document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                openPage(
                    button.dataset.page
                );

            }
        );

    });


document
    .querySelectorAll("[data-page]")
    .forEach(element => {

        element.addEventListener(
            "click",
            function () {

                const page =
                    this.dataset.page;

                if (
                    !this.classList.contains(
                        "nav-item"
                    )
                ) {

                    openPage(page);

                }

            }
        );

    });


/* =========================================================
   6. DATE
========================================================= */

function initializeDate() {

    const today =
        todayISO();


    if (saleDate) {

        saleDate.value =
            today;

    }


    updateDay();


    if (homeTodayDate) {

        homeTodayDate.textContent =
            formatDate(today);

    }

}


function updateDay() {

    if (
        !saleDate ||
        !saleDay
    ) {
        return;
    }

    saleDay.value =
        getDayName(
            saleDate.value
        );

}


if (saleDate) {

    saleDate.addEventListener(
        "change",
        () => {

            updateDay();

            renderCategoryInputs();

            calculateCurrentDay();

        }
    );

}


/* =========================================================
   7. GROUPES / CATÉGORIES
========================================================= */

if (articleGroupForm) {

    articleGroupForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                groupName.value.trim();


            const description =
                groupDescription.value.trim();


            if (!name) {

                showNotification(
                    "Veuillez entrer le nom du groupe.",
                    "error"
                );

                return;

            }


            const alreadyExists =
                groups.some(group =>
                    group.name
                        .toLowerCase() ===
                    name.toLowerCase()
                );


            if (alreadyExists) {

                showNotification(
                    "Cette catégorie existe déjà.",
                    "error"
                );

                return;

            }


            const newGroup = {

                id: Date.now(),

                name: name,

                description:
                    description,

                createdAt:
                    new Date().toISOString()

            };


            groups.push(
                newGroup
            );


            saveData();


            articleGroupForm.reset();


            renderGroups();

            updateArticleGroupSelect();

            renderCategoryInputs();

            updateHomeSummary();


            showNotification(
                "Catégorie ajoutée avec succès."
            );

        }
    );

}


function renderGroups() {

    if (!articlesList)
        return;


    let groupsHTML = "";


    if (groups.length === 0) {

        groupsHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📁
                </div>

                <h4>
                    Aucune catégorie
                </h4>

                <p>
                    Créez votre première catégorie.
                </p>

            </div>

        `;

    }

    else {

        groups.forEach(group => {

            const groupArticles =
                articles.filter(
                    article =>
                        article.groupId ===
                        group.id
                );


            groupsHTML += `

                <div class="group-card">

                    <div class="group-header">

                        <div>

                            <h4>
                                📁
                                ${escapeHTML(
                                    group.name
                                )}
                            </h4>

                            <small>
                                ${escapeHTML(
                                    group.description ||
                                    "Aucune description"
                                )}
                            </small>

                        </div>


                        <button
                            type="button"
                            class="btn-danger-small"
                            onclick="deleteGroup(${group.id})">

                            🗑️

                        </button>

                    </div>


                    <div class="group-meta">

                        <span>
                            📦
                            ${groupArticles.length}
                            article(s)
                        </span>

                    </div>

                </div>

            `;

        });

    }


    let articlesHTML = "";


    if (articles.length > 0) {

        articlesHTML = `

            <h4 class="list-title">
                🛒 Articles enregistrés
            </h4>

        `;


        articles.forEach(article => {

            const group =
                groups.find(
                    g =>
                        g.id ===
                        article.groupId
                );


            articlesHTML += `

                <div class="article-card">

                    <div class="article-info">

                        <strong>
                            ${escapeHTML(
                                article.name
                            )}
                        </strong>

                        <span>
                            📁
                            ${escapeHTML(
                                group
                                    ? group.name
                                    : "Inconnue"
                            )}
                        </span>

                        <span>
                            📦 Stock :
                            ${Number(
                                article.quantity
                            ) || 0}
                        </span>

                        <span>
                            💰 Prix :
                            ${formatMoney(
                                article.price
                            )}
                        </span>

                    </div>


                    <button
                        type="button"
                        class="btn-danger-small"
                        onclick="deleteArticle(${article.id})">

                        🗑️

                    </button>

                </div>

            `;

        });

    }


    articlesList.innerHTML =
        groupsHTML +
        articlesHTML;


    if (inventoryCount) {

        inventoryCount.textContent =
            articles.length;

    }

}


function deleteGroup(id) {

    const group =
        groups.find(
            g => g.id === id
        );


    if (!group)
        return;


    const linkedArticles =
        articles.filter(
            article =>
                article.groupId === id
        );


    let message =
        `Voulez-vous supprimer la catégorie "${group.name}" ?`;


    if (linkedArticles.length > 0) {

        message +=
            `\n\nAttention : ${linkedArticles.length} article(s) seront également supprimés.`;

    }


    if (!confirm(message))
        return;


    groups =
        groups.filter(
            g => g.id !== id
        );


    articles =
        articles.filter(
            a => a.groupId !== id
        );


    saveData();


    renderGroups();

    updateArticleGroupSelect();

    renderCategoryInputs();

    updateHomeSummary();

    renderReports();


    showNotification(
        "Catégorie supprimée."
    );

}


/* =========================================================
   8. ARTICLES
========================================================= */

if (articleForm) {

    articleForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const selectedGroup =
                articleGroupSelect.value;


            const name =
                articleName.value.trim();


            const quantity =
                Number(
                    articleQuantity.value
                ) || 0;


            const price =
                Number(
                    articlePrice.value
                ) || 0;


            if (!selectedGroup) {

                showNotification(
                    "Veuillez sélectionner une catégorie.",
                    "error"
                );

                return;

            }


            if (!name) {

                showNotification(
                    "Veuillez entrer le nom de l'article.",
                    "error"
                );

                return;

            }


            const newArticle = {

                id: Date.now(),

                groupId:
                    Number(selectedGroup),

                name: name,

                quantity:
                    quantity,

                price:
                    price,

                createdAt:
                    new Date().toISOString()

            };


            articles.push(
                newArticle
            );


            saveData();


            articleForm.reset();


            renderGroups();

            updateHomeSummary();


            showNotification(
                "Article ajouté avec succès."
            );

        }
    );

}


function updateArticleGroupSelect() {

    if (!articleGroupSelect)
        return;


    articleGroupSelect.innerHTML = `

        <option value="">
            -- Sélectionner un groupe --
        </option>

    `;


    groups.forEach(group => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            group.id;


        option.textContent =
            group.name;


        articleGroupSelect.appendChild(
            option
        );

    });

}


function deleteArticle(id) {

    const article =
        articles.find(
            a => a.id === id
        );


    if (!article)
        return;


    if (
        !confirm(
            `Voulez-vous supprimer l'article "${article.name}" ?`
        )
    ) {

        return;

    }


    articles =
        articles.filter(
            a => a.id !== id
        );


    saveData();


    renderGroups();

    updateHomeSummary();


    showNotification(
        "Article supprimé."
    );

}


/* =========================================================
   9. CATÉGORIES DU CALCULATEUR
========================================================= */

function renderCategoryInputs() {

    if (!dynamicExpenses)
        return;


    if (groups.length === 0) {

        dynamicExpenses.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📁
                </div>

                <h4>
                    Aucune catégorie
                </h4>

                <p>
                    Créez d'abord une catégorie
                    dans "Groupes & Articles".
                </p>

            </div>

        `;


        calculateCurrentDay();

        return;

    }


    const editingId =
        dailyForm.dataset.editingId;


    let existingRecord = null;


    if (editingId) {

        existingRecord =
            dailyRecords.find(
                record =>
                    record.id ===
                    Number(editingId)
            );

    }


    dynamicExpenses.innerHTML = "";


    groups.forEach(group => {


        let existingData = null;


        if (existingRecord) {

            existingData =
                existingRecord.categories.find(
                    category =>
                        category.groupId ===
                        group.id
                );

        }


        const salesValue =
            existingData
                ? existingData.sales
                : "";


        const purchaseValue =
            existingData
                ? existingData.purchase
                : "";


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "category-financial-row";


        row.innerHTML = `

            <div class="category-header">

                <strong>
                    📁
                    ${escapeHTML(
                        group.name
                    )}
                </strong>


                <span
                    class="category-profit"
                    data-group-id="${group.id}">

                    Bénéfice :
                    0 FC

                </span>

            </div>


            <div class="form-grid">


                <div class="form-group">

                    <label>
                        💵 Ventes
                    </label>

                    <div class="money-input">

                        <input
                            type="number"
                            min="0"
                            class="category-sale-input"
                            data-group-id="${group.id}"
                            value="${salesValue}"
                            placeholder="0">

                        <span>
                            FC
                        </span>

                    </div>

                </div>


                <div class="form-group">

                    <label>
                        🛒 Achats
                    </label>

                    <div class="money-input">

                        <input
                            type="number"
                            min="0"
                            class="category-purchase-input"
                            data-group-id="${group.id}"
                            value="${purchaseValue}"
                            placeholder="0">

                        <span>
                            FC
                        </span>

                    </div>

                </div>


            </div>

        `;


        dynamicExpenses.appendChild(
            row
        );

    });


    if (dailySales) {

        dailySales.readOnly =
            true;

        dailySales.style.background =
            "rgba(37,99,235,0.06)";

        dailySales.style.fontWeight =
            "700";

    }


    dynamicExpenses
        .querySelectorAll(
            ".category-sale-input, .category-purchase-input"
        )
        .forEach(input => {

            input.addEventListener(
                "input",
                calculateCurrentDay
            );

        });


    calculateCurrentDay();

}


/* =========================================================
   10. CALCUL DES VENTES / ACHATS / DÉPENSES
========================================================= */

function calculateCurrentDay() {

    let sales = 0;

    let purchases = 0;


    document
        .querySelectorAll(
            ".category-sale-input"
        )
        .forEach(input => {

            sales +=
                Number(
                    input.value
                ) || 0;

        });


    document
        .querySelectorAll(
            ".category-purchase-input"
        )
        .forEach(input => {

            purchases +=
                Number(
                    input.value
                ) || 0;

        });


    const expenses =
        calculateExpenseInputs();


    const profit =
        sales -
        purchases -
        expenses;


    if (dailySales) {

        dailySales.value =
            sales;

    }


    if (totalDailySales) {

        totalDailySales.textContent =
            formatMoney(sales);

    }


    if (totalPurchases) {

        totalPurchases.textContent =
            formatMoney(purchases);

    }


    if (totalDailyExpenses) {

        totalDailyExpenses.textContent =
            formatMoney(expenses);

    }


    if (calculatedBalance) {

        calculatedBalance.textContent =
            formatMoney(profit);


        calculatedBalance.style.color =
            profit >= 0
                ? "#16a34a"
                : "#dc2626";

    }


    groups.forEach(group => {

        const saleInput =
            document.querySelector(
                `.category-sale-input[data-group-id="${group.id}"]`
            );


        const purchaseInput =
            document.querySelector(
                `.category-purchase-input[data-group-id="${group.id}"]`
            );


        const profitElement =
            document.querySelector(
                `.category-profit[data-group-id="${group.id}"]`
            );


        if (
            !saleInput ||
            !purchaseInput ||
            !profitElement
        ) {

            return;

        }


        const categorySales =
            Number(
                saleInput.value
            ) || 0;


        const categoryPurchases =
            Number(
                purchaseInput.value
            ) || 0;


        const categoryProfit =
            categorySales -
            categoryPurchases;


        profitElement.textContent =
            `Bénéfice : ${formatMoney(
                categoryProfit
            )}`;


        profitElement.style.color =
            categoryProfit >= 0
                ? "#16a34a"
                : "#dc2626";

    });

}


/* =========================================================
   11. DÉPENSES
========================================================= */

function calculateExpenseInputs() {

    let total = 0;


    document
        .querySelectorAll(
            ".expense-amount"
        )
        .forEach(input => {

            total +=
                Number(
                    input.value
                ) || 0;

        });


    return total;
}


function attachExpenseEvents() {

    document
        .querySelectorAll(
            ".expense-amount, .expense-name"
        )
        .forEach(element => {

            element.addEventListener(
                "input",
                calculateCurrentDay
            );

            element.addEventListener(
                "change",
                calculateCurrentDay
            );

        });


    document
        .querySelectorAll(
            ".remove-expense"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const row =
                        this.closest(
                            ".expense-input-row"
                        );


                    if (row) {

                        row.remove();

                        calculateCurrentDay();

                    }

                }
            );

        });

}


if (addExpenseButton) {

    addExpenseButton.addEventListener(
        "click",
        function () {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "expense-input-row";


            row.innerHTML = `

                <div class="form-group">

                    <label>
                        Catégorie de dépense
                    </label>

                    <select class="expense-name">

                        <option value="">
                            -- Choisir --
                        </option>

                        <option value="Transport">
                            Transport
                        </option>

                        <option value="Salaire">
                            Salaire
                        </option>

                        <option value="Electricité">
                            Électricité
                        </option>

                        <option value="Loyer">
                            Loyer
                        </option>

                        <option value="Communication">
                            Communication
                        </option>

                        <option value="Carburant">
                            Carburant
                        </option>

                        <option value="Autre">
                            Autre
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Montant
                    </label>

                    <div class="money-input">

                        <input
                            type="number"
                            class="expense-amount"
                            min="0"
                            placeholder="0">

                        <span>
                            FC
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    class="btn-danger-small remove-expense">

                    ✕

                </button>

            `;


            dailyExpensesContainer.appendChild(
                row
            );


            attachExpenseEvents();

        }
    );

}


attachExpenseEvents();


/* =========================================================
   12. ENREGISTRER UNE JOURNÉE
========================================================= */

if (dailyForm) {

    dailyForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const date =
                saleDate.value;


            if (!date) {

                showNotification(
                    "Veuillez sélectionner une date.",
                    "error"
                );

                return;

            }


            if (groups.length === 0) {

                showNotification(
                    "Créez au moins une catégorie.",
                    "error"
                );

                return;

            }


            const categories = [];


            groups.forEach(group => {


                const saleInput =
                    document.querySelector(
                        `.category-sale-input[data-group-id="${group.id}"]`
                    );


                const purchaseInput =
                    document.querySelector(
                        `.category-purchase-input[data-group-id="${group.id}"]`
                    );


                const sales =
                    Number(
                        saleInput?.value
                    ) || 0;


                const purchase =
                    Number(
                        purchaseInput?.value
                    ) || 0;


                categories.push({

                    groupId:
                        group.id,

                    groupName:
                        group.name,

                    sales:
                        sales,

                    purchase:
                        purchase,

                    profit:
                        sales -
                        purchase

                });

            });


            /* -----------------------------------------
               RÉCUPÉRER LES DÉPENSES
            ----------------------------------------- */

            const expenses = [];


            document
                .querySelectorAll(
                    ".expense-input-row"
                )
                .forEach(row => {


                    const name =
                        row.querySelector(
                            ".expense-name"
                        )?.value || "";


                    const amount =
                        Number(
                            row.querySelector(
                                ".expense-amount"
                            )?.value
                        ) || 0;


                    if (
                        name &&
                        amount > 0
                    ) {

                        expenses.push({

                            name:
                                name,

                            amount:
                                amount

                        });

                    }

                });


            const totalSales =
                categories.reduce(
                    (sum, category) =>
                        sum +
                        category.sales,
                    0
                );


            const totalPurchase =
                categories.reduce(
                    (sum, category) =>
                        sum +
                        category.purchase,
                    0
                );


            const totalExpenses =
                expenses.reduce(
                    (sum, expense) =>
                        sum +
                        expense.amount,
                    0
                );


            const totalProfit =
                totalSales -
                totalPurchase -
                totalExpenses;


            const editingId =
                dailyForm.dataset.editingId;


            /* -----------------------------------------
               MODIFICATION
            ----------------------------------------- */

            if (editingId) {


                const index =
                    dailyRecords.findIndex(
                        record =>
                            record.id ===
                            Number(editingId)
                    );


                if (index !== -1) {

                    dailyRecords[index] = {

                        ...dailyRecords[index],

                        date:
                            date,

                        day:
                            getDayName(
                                date
                            ),

                        categories:
                            categories,

                        expenses:
                            expenses,

                        totalSales:
                            totalSales,

                        totalPurchase:
                            totalPurchase,

                        totalExpenses:
                            totalExpenses,

                        totalProfit:
                            totalProfit,

                        updatedAt:
                            new Date().toISOString()

                    };

                }


                delete dailyForm.dataset.editingId;


                if (calculatorStatus) {

                    calculatorStatus.textContent =
                        "Nouvelle journée";

                }


                showNotification(
                    "Journée modifiée avec succès."
                );

            }


            /* -----------------------------------------
               NOUVEL ENREGISTREMENT
            ----------------------------------------- */

            else {


                const record = {

                    id:
                        Date.now(),

                    date:
                        date,

                    day:
                        getDayName(
                            date
                        ),

                    categories:
                        categories,

                    expenses:
                        expenses,

                    totalSales:
                        totalSales,

                    totalPurchase:
                        totalPurchase,

                    totalExpenses:
                        totalExpenses,

                    totalProfit:
                        totalProfit,

                    createdAt:
                        new Date().toISOString()

                };


                dailyRecords.push(
                    record
                );


                showNotification(
                    "Journée enregistrée avec succès."
                );

            }


            saveData();


            resetDailyForm();


            renderHistory();

            updateHomeSummary();

            renderReports();

        }
    );

}


/* =========================================================
   13. RÉINITIALISER LE FORMULAIRE
========================================================= */

function resetDailyForm() {

    if (!dailyForm)
        return;


    dailyForm.reset();


    delete dailyForm.dataset.editingId;


    saleDate.value =
        todayISO();


    updateDay();


    if (calculatorStatus) {

        calculatorStatus.textContent =
            "Nouvelle journée";

    }


    if (dailyExpensesContainer) {

        dailyExpensesContainer.innerHTML = `

            <div class="expense-input-row">

                <div class="form-group">

                    <label>
                        Catégorie de dépense
                    </label>

                    <select class="expense-name">

                        <option value="">
                            -- Choisir --
                        </option>

                        <option value="Transport">
                            Transport
                        </option>

                        <option value="Salaire">
                            Salaire
                        </option>

                        <option value="Electricité">
                            Électricité
                        </option>

                        <option value="Loyer">
                            Loyer
                        </option>

                        <option value="Communication">
                            Communication
                        </option>

                        <option value="Carburant">
                            Carburant
                        </option>

                        <option value="Autre">
                            Autre
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Montant
                    </label>

                    <div class="money-input">

                        <input
                            type="number"
                            class="expense-amount"
                            min="0"
                            placeholder="0">

                        <span>
                            FC
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    class="btn-danger-small remove-expense">

                    ✕

                </button>

            </div>

        `;


        attachExpenseEvents();

    }


    renderCategoryInputs();

}


/* =========================================================
   14. HISTORIQUE
========================================================= */

function renderHistory() {

    if (!dailyHistory)
        return;


    if (historyCount) {

        historyCount.textContent =
            dailyRecords.length;

    }


    if (dailyRecords.length === 0) {

        dailyHistory.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📜
                </div>

                <h4>
                    Aucun enregistrement
                </h4>

                <p>
                    Vos journées apparaîtront ici.
                </p>

            </div>

        `;

        return;

    }


    const sortedRecords =
        [...dailyRecords].sort(
            (a, b) =>
                b.date.localeCompare(
                    a.date
                )
        );


    let html = "";


    sortedRecords.forEach(record => {


        const profitClass =
            record.totalProfit >= 0
                ? "positive"
                : "negative";


        let categoryHTML = "";


        record.categories.forEach(
            category => {


                if (
                    category.sales === 0 &&
                    category.purchase === 0
                ) {

                    return;

                }


                categoryHTML += `

                    <div class="history-category">

                        <strong>
                            ${escapeHTML(
                                category.groupName
                            )}
                        </strong>

                        <span>
                            Ventes :
                            ${formatMoney(
                                category.sales
                            )}
                        </span>

                        <span>
                            Achats :
                            ${formatMoney(
                                category.purchase
                            )}
                        </span>

                        <span>
                            Bénéfice :
                            ${formatMoney(
                                category.profit
                            )}
                        </span>

                    </div>

                `;

            }
        );


        let expenseHTML = "";


        if (
            record.expenses &&
            record.expenses.length > 0
        ) {


            expenseHTML = `

                <div class="history-expenses">

                    <strong>
                        💸 Dépenses
                    </strong>

            `;


            record.expenses.forEach(
                expense => {

                    expenseHTML += `

                        <span>
                            ${escapeHTML(
                                expense.name
                            )}
                            :
                            ${formatMoney(
                                expense.amount
                            )}
                        </span>

                    `;

                }
            );


            expenseHTML += `

                </div>

            `;

        }


        html += `

            <div class="history-card">


                <div class="history-top">

                    <div>

                        <h4>
                            📅
                            ${formatDate(
                                record.date
                            )}
                        </h4>

                        <small>
                            ${escapeHTML(
                                record.day
                            )}
                        </small>

                    </div>


                    <div class="history-result">

                        <span>
                            Ventes :
                            ${formatMoney(
                                record.totalSales
                            )}
                        </span>

                        <span>
                            Achats :
                            ${formatMoney(
                                record.totalPurchase
                            )}
                        </span>

                        <span>
                            Dépenses :
                            ${formatMoney(
                                record.totalExpenses
                            )}
                        </span>

                        <strong class="${profitClass}">

                            Bénéfice net :
                            ${formatMoney(
                                record.totalProfit
                            )}

                        </strong>

                    </div>

                </div>


                <div class="history-categories">

                    ${
                        categoryHTML ||
                        "<small>Aucune vente enregistrée.</small>"
                    }

                </div>


                ${expenseHTML}


                <div class="history-actions">

                    <button
                        type="button"
                        onclick="editRecord(${record.id})">

                        ✏️ Modifier

                    </button>


                    <button
                        type="button"
                        onclick="deleteRecord(${record.id})">

                        🗑️ Supprimer

                    </button>

                </div>


            </div>

        `;

    });


    dailyHistory.innerHTML =
        html;

}


/* =========================================================
   15. MODIFIER UNE JOURNÉE
========================================================= */

function editRecord(id) {

    const record =
        dailyRecords.find(
            r => r.id === id
        );


    if (!record)
        return;


    dailyForm.dataset.editingId =
        id;


    saleDate.value =
        record.date;


    updateDay();


    renderCategoryInputs();


    /* -----------------------------------------
       RESTAURER LES DÉPENSES
    ----------------------------------------- */

    if (dailyExpensesContainer) {

        dailyExpensesContainer.innerHTML =
            "";


        const expenses =
            record.expenses || [];


        if (expenses.length === 0) {

            addEmptyExpenseRow();

        }

        else {

            expenses.forEach(
                expense => {

                    addExpenseRow(
                        expense.name,
                        expense.amount
                    );

                }
            );

        }


        attachExpenseEvents();

    }


    if (calculatorStatus) {

        calculatorStatus.textContent =
            "Modification en cours";

    }


    calculateCurrentDay();


    openPage(
        "calculator"
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    showNotification(
        "Vous pouvez maintenant modifier cette journée."
    );

}


function addExpenseRow(
    selectedName = "",
    amount = ""
) {

    if (!dailyExpensesContainer)
        return;


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "expense-input-row";


    row.innerHTML = `

        <div class="form-group">

            <label>
                Catégorie de dépense
            </label>

            <select class="expense-name">

                <option value="">
                    -- Choisir --
                </option>

                <option value="Transport">
                    Transport
                </option>

                <option value="Salaire">
                    Salaire
                </option>

                <option value="Electricité">
                    Électricité
                </option>

                <option value="Loyer">
                    Loyer
                </option>

                <option value="Communication">
                    Communication
                </option>

                <option value="Carburant">
                    Carburant
                </option>

                <option value="Autre">
                    Autre
                </option>

            </select>

        </div>


        <div class="form-group">

            <label>
                Montant
            </label>

            <div class="money-input">

                <input
                    type="number"
                    class="expense-amount"
                    min="0"
                    value="${amount}"
                    placeholder="0">

                <span>
                    FC
                </span>

            </div>

        </div>


        <button
            type="button"
            class="btn-danger-small remove-expense">

            ✕

        </button>

    `;


    dailyExpensesContainer.appendChild(
        row
    );


    const select =
        row.querySelector(
            ".expense-name"
        );


    select.value =
        selectedName;

}


function addEmptyExpenseRow() {

    addExpenseRow(
        "",
        ""
    );

}


/* =========================================================
   16. SUPPRIMER UNE JOURNÉE
========================================================= */

function deleteRecord(id) {

    const record =
        dailyRecords.find(
            r => r.id === id
        );


    if (!record)
        return;


    if (
        !confirm(
            `Voulez-vous supprimer l'enregistrement du ${formatDate(record.date)} ?`
        )
    ) {

        return;

    }


    dailyRecords =
        dailyRecords.filter(
            r => r.id !== id
        );


    saveData();


    renderHistory();

    updateHomeSummary();

    renderReports();


    showNotification(
        "Enregistrement supprimé."
    );

}


/* =========================================================
   17. ACCUEIL
========================================================= */

function updateHomeSummary() {

    const today =
        todayISO();


    if (homeTodayDate) {

        homeTodayDate.textContent =
            formatDate(today);

    }


    const todayRecords =
        dailyRecords.filter(
            record =>
                record.date === today
        );


    const sales =
        todayRecords.reduce(
            (sum, record) =>
                sum +
                Number(
                    record.totalSales || 0
                ),
            0
        );


    const purchases =
        todayRecords.reduce(
            (sum, record) =>
                sum +
                Number(
                    record.totalPurchase || 0
                ),
            0
        );


    const expenses =
        todayRecords.reduce(
            (sum, record) =>
                sum +
                Number(
                    record.totalExpenses || 0
                ),
            0
        );


    const profit =
        sales -
        purchases -
        expenses;


    if (dailySalesSummary) {

        dailySalesSummary.textContent =
            formatMoney(sales);

    }


    if (dailyPurchaseSummary) {

        dailyPurchaseSummary.textContent =
            formatMoney(purchases);

    }


    if (dailyExpenseSummary) {

        dailyExpenseSummary.textContent =
            formatMoney(expenses);

    }


    if (dailyBalanceSummary) {

        dailyBalanceSummary.textContent =
            formatMoney(profit);


        dailyBalanceSummary.className =
            profit >= 0
                ? "positive"
                : "negative";

    }


    if (totalRecordedDays) {

        totalRecordedDays.textContent =
            dailyRecords.length;

    }


    if (totalCategories) {

        totalCategories.textContent =
            groups.length;

    }


    if (totalArticles) {

        totalArticles.textContent =
            articles.length;

    }


    renderHomeCategorySummary(
        todayRecords
    );


    calculateBestCategory();

}


/* =========================================================
   18. VENTES PAR CATÉGORIE SUR ACCUEIL
========================================================= */

function renderHomeCategorySummary(
    records
) {

    if (!homeCategorySummary)
        return;


    if (records.length === 0) {

        homeCategorySummary.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📊
                </div>

                <h4>
                    Aucune donnée aujourd'hui
                </h4>

                <p>
                    Les résultats par catégorie
                    apparaîtront ici.
                </p>

            </div>

        `;

        return;

    }


    const categoryTotals = {};


    records.forEach(record => {

        record.categories.forEach(
            category => {


                if (
                    !categoryTotals[
                        category.groupId
                    ]
                ) {

                    categoryTotals[
                        category.groupId
                    ] = {

                        name:
                            category.groupName,

                        sales:
                            0,

                        purchases:
                            0,

                        profit:
                            0

                    };

                }


                categoryTotals[
                    category.groupId
                ].sales +=
                    Number(
                        category.sales || 0
                    );


                categoryTotals[
                    category.groupId
                ].purchases +=
                    Number(
                        category.purchase || 0
                    );


                categoryTotals[
                    category.groupId
                ].profit +=
                    Number(
                        category.profit || 0
                    );

            }
        );

    });


    let html = "";


    Object.values(
        categoryTotals
    ).forEach(category => {


        const maxSales =
            Math.max(
                ...Object.values(
                    categoryTotals
                ).map(
                    item =>
                        item.sales
                )
            );


        const percentage =
            maxSales > 0
                ? Math.round(
                    category.sales /
                    maxSales *
                    100
                )
                : 0;


        html += `

            <div class="home-category-row">


                <div class="home-category-top">

                    <strong>
                        📁
                        ${escapeHTML(
                            category.name
                        )}
                    </strong>

                    <strong>
                        ${formatMoney(
                            category.sales
                        )}
                    </strong>

                </div>


                <div class="category-progress">

                    <div
                        class="category-progress-bar"
                        style="width:${percentage}%">
                    </div>

                </div>


                <div class="home-category-bottom">

                    <span>
                        Achats :
                        ${formatMoney(
                            category.purchases
                        )}
                    </span>


                    <span class="${
                        category.profit >= 0
                            ? "positive"
                            : "negative"
                    }">

                        Bénéfice :
                        ${formatMoney(
                            category.profit
                        )}

                    </span>

                </div>

            </div>

        `;

    });


    homeCategorySummary.innerHTML =
        html;

}


/* =========================================================
   19. MEILLEURE CATÉGORIE
========================================================= */

function calculateBestCategory() {

    if (!bestCategory)
        return;


    const totals = {};


    dailyRecords.forEach(record => {

        record.categories.forEach(
            category => {


                if (
                    !totals[
                        category.groupId
                    ]
                ) {

                    totals[
                        category.groupId
                    ] = {

                        name:
                            category.groupName,

                        profit:
                            0

                    };

                }


                totals[
                    category.groupId
                ].profit +=
                    Number(
                        category.profit || 0
                    );

            }
        );

    });


    const list =
        Object.values(
            totals
        );


    if (list.length === 0) {

        bestCategory.textContent =
            "-";

        return;

    }


    list.sort(
        (a, b) =>
            b.profit -
            a.profit
    );


    bestCategory.textContent =
        list[0].name;

}


/* =========================================================
   20. RAPPORTS
========================================================= */

function getWeekStart(date) {

    const result =
        new Date(date);


    const day =
        result.getDay();


    const difference =
        day === 0
            ? 6
            : day - 1;


    result.setDate(
        result.getDate() -
        difference
    );


    result.setHours(
        0,
        0,
        0,
        0
    );


    return result;

}


function getWeekRecords() {

    const today =
        new Date();


    const start =
        getWeekStart(
            today
        );


    return dailyRecords.filter(
        record => {

            const date =
                new Date(
                    record.date +
                    "T12:00:00"
                );


            return date >= start;

        }
    );

}


function renderReports() {

    const now =
        new Date();


    /* -----------------------------------------
       SEMAINE
    ----------------------------------------- */

    const weekRecords =
        getWeekRecords();


    let weekSalesTotal = 0;

    let weekPurchasesTotal = 0;

    let weekExpensesTotal = 0;


    weekRecords.forEach(
        record => {

            weekSalesTotal +=
                Number(
                    record.totalSales || 0
                );


            weekPurchasesTotal +=
                Number(
                    record.totalPurchase || 0
                );


            weekExpensesTotal +=
                Number(
                    record.totalExpenses || 0
                );

        }
    );


    const weekProfit =
        weekSalesTotal -
        weekPurchasesTotal -
        weekExpensesTotal;


    if (weeklySales) {

        weeklySales.textContent =
            formatMoney(
                weekSalesTotal
            );

    }


    if (weeklyReportSales) {

        weeklyReportSales.textContent =
            formatMoney(
                weekSalesTotal
            );

    }


    if (weeklyReportPurchases) {

        weeklyReportPurchases.textContent =
            formatMoney(
                weekPurchasesTotal
            );

    }


    if (weeklyReportExpenses) {

        weeklyReportExpenses.textContent =
            formatMoney(
                weekExpensesTotal
            );

    }


    if (weeklyReportProfit) {

        weeklyReportProfit.textContent =
            formatMoney(
                weekProfit
            );


        weeklyReportProfit.className =
            weekProfit >= 0
                ? "positive"
                : "negative";

    }


    renderWeekRange();

    renderWeeklyDays(
        weekRecords
    );


    /* -----------------------------------------
       MOIS ACTUEL
    ----------------------------------------- */

    const year =
        now.getFullYear();


    const month =
        now.getMonth();


    const monthRecords =
        dailyRecords.filter(
            record => {

                const date =
                    new Date(
                        record.date +
                        "T12:00:00"
                    );


                return (
                    date.getFullYear() ===
                    year &&

                    date.getMonth() ===
                    month
                );

            }
        );


    renderMonthlyTotals(
        monthRecords
    );


    renderCategoryReports(
        monthRecords
    );


    renderDailySalesReport(
        monthRecords
    );


    updateAccountingAlert(
        monthRecords
    );

}


/* =========================================================
   21. PÉRIODE DE LA SEMAINE
========================================================= */

function renderWeekRange() {

    if (!weekRange)
        return;


    const start =
        getWeekStart(
            new Date()
        );


    const end =
        new Date(start);


    end.setDate(
        end.getDate() + 6
    );


    weekRange.textContent =
        `${formatDate(
            dateToISO(start)
        )} → ${formatDate(
            dateToISO(end)
        )}`;

}


function dateToISO(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


/* =========================================================
   22. JOURS DE LA SEMAINE
========================================================= */

function renderWeeklyDays(
    records
) {

    if (!weeklyReportDays)
        return;


    if (records.length === 0) {

        weeklyReportDays.innerHTML = `

            <div class="empty-state">

                <p>
                    📅 Aucune journée enregistrée cette semaine.
                </p>

            </div>

        `;

        return;

    }


    const sorted =
        [...records].sort(
            (a, b) =>
                a.date.localeCompare(
                    b.date
                )
        );


    let html = "";


    sorted.forEach(record => {

        html += `

            <div class="weekly-day-row">

                <div>

                    <strong>
                        ${formatDate(
                            record.date
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            record.day
                        )}
                    </span>

                </div>


                <div>

                    <span>
                        Ventes :
                        ${formatMoney(
                            record.totalSales
                        )}
                    </span>

                    <span>
                        Bénéfice :
                        ${formatMoney(
                            record.totalProfit
                        )}
                    </span>

                </div>

            </div>

        `;

    });


    weeklyReportDays.innerHTML =
        html;

}


/* =========================================================
   23. TOTAL MENSUEL
========================================================= */

function renderMonthlyTotals(
    records
) {

    let sales = 0;

    let purchases = 0;

    let expenses = 0;


    records.forEach(record => {

        sales +=
            Number(
                record.totalSales || 0
            );


        purchases +=
            Number(
                record.totalPurchase || 0
            );


        expenses +=
            Number(
                record.totalExpenses || 0
            );

    });


    const profit =
        sales -
        purchases -
        expenses;


    if (monthlySales) {

        monthlySales.textContent =
            formatMoney(sales);

    }


    if (monthlyPurchases) {

        monthlyPurchases.textContent =
            formatMoney(purchases);

    }


    if (monthlyExpenses) {

        monthlyExpenses.textContent =
            formatMoney(expenses);

    }


    if (monthlyTotal) {

        monthlyTotal.textContent =
            formatMoney(profit);


        monthlyTotal.className =
            profit >= 0
                ? "positive"
                : "negative";

    }


    if (finalMonthlySales) {

        finalMonthlySales.textContent =
            formatMoney(sales);

    }


    if (finalMonthlyPurchases) {

        finalMonthlyPurchases.textContent =
            formatMoney(purchases);

    }


    if (finalMonthlyExpenses) {

        finalMonthlyExpenses.textContent =
            formatMoney(expenses);

    }


    if (finalMonthlyProfit) {

        finalMonthlyProfit.textContent =
            formatMoney(profit);


        finalMonthlyProfit.className =
            profit >= 0
                ? "positive"
                : "negative";

    }

}


/* =========================================================
   24. RAPPORT PAR CATÉGORIE
========================================================= */

function renderCategoryReports(
    records
) {

    if (!categoryReports)
        return;


    const totals = {};


    records.forEach(record => {

        record.categories.forEach(
            category => {


                if (
                    !totals[
                        category.groupId
                    ]
                ) {

                    totals[
                        category.groupId
                    ] = {

                        name:
                            category.groupName,

                        sales:
                            0,

                        purchases:
                            0,

                        profit:
                            0

                    };

                }


                totals[
                    category.groupId
                ].sales +=
                    Number(
                        category.sales || 0
                    );


                totals[
                    category.groupId
                ].purchases +=
                    Number(
                        category.purchase || 0
                    );


                totals[
                    category.groupId
                ].profit +=
                    Number(
                        category.profit || 0
                    );

            }
        );

    });


    const categories =
        Object.values(
            totals
        );


    if (categories.length === 0) {

        categoryReports.innerHTML = `

            <div class="empty-state">

                <p>
                    📊 Aucun résultat disponible.
                </p>

            </div>

        `;

        return;

    }


    let rows = "";


    categories.forEach(
        category => {

            rows += `

                <tr>

                    <td>
                        📁
                        ${escapeHTML(
                            category.name
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            category.sales
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            category.purchases
                        )}
                    </td>

                    <td class="${
                        category.profit >= 0
                            ? "positive"
                            : "negative"
                    }">

                        <strong>
                            ${formatMoney(
                                category.profit
                            )}
                        </strong>

                    </td>

                </tr>

            `;

        }
    );


    categoryReports.innerHTML = `

        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>
                            Catégorie
                        </th>

                        <th>
                            Ventes
                        </th>

                        <th>
                            Achats
                        </th>

                        <th>
                            Bénéfice
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>

    `;

}


/* =========================================================
   25. RAPPORT JOUR PAR JOUR
========================================================= */

function renderDailySalesReport(
    records
) {

    if (!dailySalesReport)
        return;


    if (records.length === 0) {

        dailySalesReport.innerHTML = `

            <div class="empty-state">

                <p>
                    📅 Aucun jour enregistré pour ce mois.
                </p>

            </div>

        `;

        return;

    }


    const sortedRecords =
        [...records].sort(
            (a, b) =>
                a.date.localeCompare(
                    b.date
                )
        );


    let rows = "";


    sortedRecords.forEach(
        record => {

            rows += `

                <tr>

                    <td>
                        ${formatDate(
                            record.date
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            record.day
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            record.totalSales
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            record.totalPurchase
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            record.totalExpenses
                        )}
                    </td>

                    <td class="${
                        record.totalProfit >= 0
                            ? "positive"
                            : "negative"
                    }">

                        <strong>
                            ${formatMoney(
                                record.totalProfit
                            )}
                        </strong>

                    </td>

                </tr>

            `;

        }
    );


    dailySalesReport.innerHTML = `

        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>
                            Date
                        </th>

                        <th>
                            Jour
                        </th>

                        <th>
                            Ventes
                        </th>

                        <th>
                            Achats
                        </th>

                        <th>
                            Dépenses
                        </th>

                        <th>
                            Bénéfice net
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>

    `;

}


/* =========================================================
   26. FILTRE DU MOIS
========================================================= */

if (reportMonth) {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    reportMonth.value =
        `${year}-${month}`;


    reportMonth.addEventListener(
        "change",
        function () {

            renderSelectedMonth(
                this.value
            );

        }
    );

}


if (refreshReports) {

    refreshReports.addEventListener(
        "click",
        function () {

            if (
                reportMonth &&
                reportMonth.value
            ) {

                renderSelectedMonth(
                    reportMonth.value
                );

            }

            else {

                renderReports();

            }


            showNotification(
                "Rapports actualisés."
            );

        }
    );

}


function renderSelectedMonth(
    selectedMonth
) {

    if (!selectedMonth)
        return;


    const records =
        dailyRecords.filter(
            record =>
                record.date.startsWith(
                    selectedMonth
                )
        );


    renderMonthlyTotals(
        records
    );


    renderCategoryReports(
        records
    );


    renderDailySalesReport(
        records
    );


    updateAccountingAlert(
        records
    );

}


/* =========================================================
   27. CONTRÔLE COMPTABLE
========================================================= */

function updateAccountingAlert(
    records
) {

    if (!accountingAlert)
        return;


    let sales = 0;

    let purchases = 0;

    let expenses = 0;


    records.forEach(record => {

        sales +=
            Number(
                record.totalSales || 0
            );


        purchases +=
            Number(
                record.totalPurchase || 0
            );


        expenses +=
            Number(
                record.totalExpenses || 0
            );

    });


    const profit =
        sales -
        purchases -
        expenses;


    if (records.length === 0) {

        accountingAlert.innerHTML = `

            <strong>
                ℹ️ Aucune donnée
            </strong>

            <p>
                Enregistrez vos journées pour
                obtenir une analyse comptable.
            </p>

        `;

        return;

    }


    if (profit > 0) {

        accountingAlert.innerHTML = `

            <strong>
                ✅ Situation positive
            </strong>

            <p>
                Votre résultat net est de
                <strong>
                    ${formatMoney(profit)}
                </strong>.
            </p>

        `;

        accountingAlert.className =
            "accounting-alert success";

    }

    else if (profit === 0) {

        accountingAlert.innerHTML = `

            <strong>
                ⚖️ Équilibre
            </strong>

            <p>
                Les ventes couvrent exactement
                les achats et les dépenses.
            </p>

        `;

        accountingAlert.className =
            "accounting-alert warning";

    }

    else {

        accountingAlert.innerHTML = `

            <strong>
                ⚠️ Attention : résultat négatif
            </strong>

            <p>
                Vous avez enregistré une perte de
                <strong>
                    ${formatMoney(
                        Math.abs(profit)
                    )}
                </strong>.
            </p>

        `;

        accountingAlert.className =
            "accounting-alert danger";

    }

}


/* =========================================================
   28. ANNÉE AUTOMATIQUE
========================================================= */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   29. INITIALISATION
========================================================= */

function initializeApp() {

    initializeDate();

    updateArticleGroupSelect();

    renderGroups();

    renderCategoryInputs();

    renderHistory();

    updateHomeSummary();

    renderReports();


    setTimeout(
        () => {

            if (loadingScreen) {

                loadingScreen.style.opacity =
                    "0";

                loadingScreen.style.transition =
                    "0.4s";


                setTimeout(
                    () => {

                        loadingScreen.style.display =
                            "none";

                    },
                    400
                );

            }

        },
        500
    );

}


document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);