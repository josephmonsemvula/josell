/* =========================================================
   JOSSELL - MA GESTION
   SCRIPT JAVASCRIPT COMPLET

   VENTES
   ACHATS
   DEPENSES
   BENEFICE BRUT
   BENEFICE NET
   RAPPORT HEBDOMADAIRE
   RAPPORT MENSUEL
   INSTALLATION APPLICATION
   ========================================================= */


/* =========================================================
   1. STOCKAGE
   ========================================================= */

const STORAGE_KEYS = {

    groups: "jossell_groups",

    articles: "jossell_articles",

    records: "jossell_daily_records",

    expenseCategories:
        "jossell_expense_categories"

};


/* =========================================================
   2. CHARGEMENT DES DONNEES
   ========================================================= */

let groups =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEYS.groups
        )
    ) || [];


let articles =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEYS.articles
        )
    ) || [];


let dailyRecords =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEYS.records
        )
    ) || [];


/*
   Catégories de dépenses par défaut
*/

let expenseCategories =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEYS.expenseCategories
        )
    ) || [

        {
            id: 1,
            name: "Loyer"
        },

        {
            id: 2,
            name: "Transport"
        }

    ];


/* =========================================================
   3. ELEMENTS HTML
   ========================================================= */

const loadingScreen =
    document.getElementById(
        "loadingScreen"
    );


const dailyForm =
    document.getElementById(
        "dailyForm"
    );


const saleDate =
    document.getElementById(
        "saleDate"
    );


const saleDay =
    document.getElementById(
        "saleDay"
    );


const dailySales =
    document.getElementById(
        "dailySales"
    );


const dynamicExpenses =
    document.getElementById(
        "dynamicExpenses"
    );


const totalDailySales =
    document.getElementById(
        "totalDailySales"
    );


const totalPurchases =
    document.getElementById(
        "totalPurchases"
    );


const calculatedGrossProfit =
    document.getElementById(
        "calculatedGrossProfit"
    );


const calculatedBalance =
    document.getElementById(
        "calculatedBalance"
    );


const dailyHistory =
    document.getElementById(
        "dailyHistory"
    );


const articleGroupForm =
    document.getElementById(
        "articleGroupForm"
    );


const articleForm =
    document.getElementById(
        "articleForm"
    );


const groupName =
    document.getElementById(
        "groupName"
    );


const groupDescription =
    document.getElementById(
        "groupDescription"
    );


const articleGroupSelect =
    document.getElementById(
        "articleGroupSelect"
    );


const articleName =
    document.getElementById(
        "articleName"
    );


const articleQuantity =
    document.getElementById(
        "articleQuantity"
    );


const articlePrice =
    document.getElementById(
        "articlePrice"
    );


const articlesList =
    document.getElementById(
        "articlesList"
    );


const currentDate =
    document.getElementById(
        "currentDate"
    );


const dailySalesSummary =
    document.getElementById(
        "dailySalesSummary"
    );


const dailyPurchaseSummary =
    document.getElementById(
        "dailyPurchaseSummary"
    );


const dailyExpenseSummary =
    document.getElementById(
        "dailyExpenseSummary"
    );


const dailyBalanceSummary =
    document.getElementById(
        "dailyBalanceSummary"
    );


const homeCategorySummary =
    document.getElementById(
        "homeCategorySummary"
    );


const expenseCategoriesContainer =
    document.getElementById(
        "expenseCategories"
    );


const addExpenseCategoryButton =
    document.getElementById(
        "addExpenseCategory"
    );


const categoryReports =
    document.getElementById(
        "categoryReports"
    );


const expenseReports =
    document.getElementById(
        "expenseReports"
    );


const reportMonth =
    document.getElementById(
        "reportMonth"
    );


const refreshReports =
    document.getElementById(
        "refreshReports"
    );


const dailySalesReport =
    document.getElementById(
        "dailySalesReport"
    );


const notificationContainer =
    document.getElementById(
        "notificationContainer"
    );


/* =========================================================
   4. FORMATAGE
   ========================================================= */

function formatMoney(number) {

    number =
        Number(number) || 0;

    return (
        number.toLocaleString("fr-FR")
        + " FC"
    );

}


/* =========================================================
   5. DATE DU JOUR
   ========================================================= */

function todayISO() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return (
        `${year}-${month}-${day}`
    );

}


/* =========================================================
   6. FORMAT DATE
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const parts =
        dateString.split("-");

    if (parts.length !== 3) {
        return dateString;
    }

    return (
        `${parts[2]}/${parts[1]}/${parts[0]}`
    );

}


/* =========================================================
   7. JOUR DE LA SEMAINE
   ========================================================= */

function getDayName(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(
            dateString + "T12:00:00"
        );

    return date.toLocaleDateString(
        "fr-FR",
        {
            weekday: "long"
        }
    );

}


/* =========================================================
   8. PROTECTION HTML
   ========================================================= */

function escapeHTML(text) {

    if (
        text === null ||
        text === undefined
    ) {
        return "";
    }

    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   9. SAUVEGARDE
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

    localStorage.setItem(
        STORAGE_KEYS.expenseCategories,
        JSON.stringify(
            expenseCategories
        )
    );

}


/* =========================================================
   10. NOTIFICATION
   ========================================================= */

function showNotification(
    message,
    type = "success"
) {

    if (!notificationContainer) {
        return;
    }

    const notification =
        document.createElement("div");

    notification.style.padding =
        "14px 18px";

    notification.style.marginBottom =
        "10px";

    notification.style.borderRadius =
        "10px";

    notification.style.background =
        type === "error"
            ? "#dc2626"
            : "#16a34a";

    notification.style.color =
        "white";

    notification.style.fontWeight =
        "700";

    notification.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.18)";

    notification.textContent =
        message;

    notificationContainer.appendChild(
        notification
    );

    setTimeout(
        () => {
            notification.remove();
        },
        3500
    );

}


/* =========================================================
   11. NAVIGATION
   ========================================================= */

function openPage(pageName) {

    const pages =
        document.querySelectorAll(
            ".page"
        );

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


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

        renderExpenseCategories();

        calculateCurrentDay();

        renderHistory();

    }


    if (pageName === "groups") {

        renderGroups();

        updateArticleGroupSelect();

    }


    if (pageName === "reports") {

        if (
            reportMonth &&
            reportMonth.value
        ) {

            renderSelectedMonth(
                reportMonth.value
            );

        } else {

            renderReports();

        }

    }

}


/* =========================================================
   12. BOUTONS NAVIGATION
   ========================================================= */

document
    .querySelectorAll(
        ".nav-item"
    )
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
    .querySelectorAll(
        "[data-page]"
    )
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
   13. INITIALISATION DATE
   ========================================================= */

function initializeDate() {

    const today =
        todayISO();


    if (saleDate) {

        saleDate.value =
            today;

    }


    updateDay();


    if (currentDate) {

        currentDate.textContent =
            formatDate(today);

    }

}


/* =========================================================
   14. AFFICHER LE JOUR
   ========================================================= */

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


/* =========================================================
   15. CHANGEMENT DATE
   ========================================================= */

if (saleDate) {

    saleDate.addEventListener(
        "change",
        function () {

            updateDay();

            renderCategoryInputs();

            renderExpenseCategories();

            calculateCurrentDay();

        }
    );

}


/* =========================================================
   16. GROUPES / CATEGORIES
   ========================================================= */

if (articleGroupForm) {

    articleGroupForm.addEventListener(
        "submit",
        function (event) {

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
                groups.some(
                    group =>
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

                id:
                    Date.now(),

                name:
                    name,

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


            showNotification(
                "Catégorie ajoutée avec succès."
            );

        }
    );

}


/* =========================================================
   17. AFFICHER LES GROUPES
   ========================================================= */

function renderGroups() {

    if (!articlesList) {
        return;
    }


    let html = "";


    if (groups.length === 0) {

        html = `

            <div class="empty-state">

                <div class="empty-icon">
                    📁
                </div>

                <h4>
                    Aucun groupe
                </h4>

                <p>
                    Créez votre première catégorie
                    d'articles.
                </p>

            </div>

        `;

    }


    groups.forEach(group => {

        const groupArticles =
            articles.filter(
                article =>
                    article.groupId ===
                    group.id
            );


        html += `

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
                            ${
                                escapeHTML(
                                    group.description ||
                                    "Aucune description"
                                )
                            }
                        </small>

                    </div>


                    <button
                        type="button"
                        class="btn-danger-small"
                        onclick="deleteGroup(${group.id})"
                    >
                        ×
                    </button>

                </div>


                <div class="group-meta">

                    📦
                    ${groupArticles.length}
                    article(s)

                </div>

            </div>

        `;

    });


    if (articles.length > 0) {

        html += `

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


            html += `

                <div class="article-card">

                    <div class="article-info">

                        <strong>
                            ${escapeHTML(
                                article.name
                            )}
                        </strong>

                        <span>
                            📁
                            ${
                                escapeHTML(
                                    group
                                        ? group.name
                                        : "Inconnue"
                                )
                            }
                        </span>

                        <span>
                            📦 Stock :
                            ${
                                Number(
                                    article.quantity
                                ) || 0
                            }
                        </span>

                        <span>
                            💵 Prix :
                            ${formatMoney(
                                article.price
                            )}
                        </span>

                    </div>


                    <button
                        type="button"
                        class="btn-danger-small"
                        onclick="deleteArticle(${article.id})"
                    >
                        ×
                    </button>

                </div>

            `;

        });

    }


    articlesList.innerHTML =
        html;

}


/* =========================================================
   18. SUPPRIMER GROUPE
   ========================================================= */

function deleteGroup(id) {

    const group =
        groups.find(
            g =>
                g.id === id
        );


    if (!group) {
        return;
    }


    const linkedArticles =
        articles.filter(
            article =>
                article.groupId === id
        );


    let message =
        `Voulez-vous supprimer "${group.name}" ?`;


    if (
        linkedArticles.length > 0
    ) {

        message +=
            `\n\n${linkedArticles.length} article(s) seront également supprimés.`;

    }


    if (!confirm(message)) {
        return;
    }


    groups =
        groups.filter(
            g =>
                g.id !== id
        );


    articles =
        articles.filter(
            a =>
                a.groupId !== id
        );


    saveData();


    renderGroups();

    updateArticleGroupSelect();

    renderCategoryInputs();


    showNotification(
        "Catégorie supprimée."
    );

}


/* =========================================================
   19. AJOUT ARTICLE
   ========================================================= */

if (articleForm) {

    articleForm.addEventListener(
        "submit",
        function (event) {

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


            articles.push({

                id:
                    Date.now(),

                groupId:
                    Number(
                        selectedGroup
                    ),

                name:
                    name,

                quantity:
                    quantity,

                price:
                    price,

                createdAt:
                    new Date().toISOString()

            });


            saveData();


            articleForm.reset();


            renderGroups();


            showNotification(
                "Article ajouté avec succès."
            );

        }
    );

}


/* =========================================================
   20. SELECT DES GROUPES
   ========================================================= */

function updateArticleGroupSelect() {

    if (!articleGroupSelect) {
        return;
    }


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


/* =========================================================
   21. SUPPRIMER ARTICLE
   ========================================================= */

function deleteArticle(id) {

    const article =
        articles.find(
            a =>
                a.id === id
        );


    if (!article) {
        return;
    }


    if (
        !confirm(
            `Supprimer l'article "${article.name}" ?`
        )
    ) {

        return;

    }


    articles =
        articles.filter(
            a =>
                a.id !== id
        );


    saveData();


    renderGroups();


    showNotification(
        "Article supprimé."
    );

}


/* =========================================================
   22. AFFICHER CATEGORIES FINANCIERES
   ========================================================= */

function renderCategoryInputs() {

    if (!dynamicExpenses) {
        return;
    }


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
                    dans Groupes & Articles.
                </p>

            </div>

        `;


        calculateCurrentDay();

        return;

    }


    const editingId =
        dailyForm?.dataset.editingId;


    let existingRecord = null;


    if (editingId) {

        existingRecord =
            dailyRecords.find(
                record =>
                    record.id ===
                    Number(editingId)
            );

    }


    dynamicExpenses.innerHTML =
        "";


    groups.forEach(group => {

        let existingData = null;


        if (existingRecord) {

            existingData =
                existingRecord.categories?.find(
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
                    data-group-id="${group.id}"
                >
                    Bénéfice : 0 FC
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
                            placeholder="0"
                        >

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
                            placeholder="0"
                        >

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
   23. DEPENSES PERSONNALISEES
   ========================================================= */

function renderExpenseCategories() {

    if (
        !expenseCategoriesContainer
    ) {
        return;
    }


    const editingId =
        dailyForm?.dataset.editingId;


    let existingRecord = null;


    if (editingId) {

        existingRecord =
            dailyRecords.find(
                record =>
                    record.id ===
                    Number(editingId)
            );

    }


    expenseCategoriesContainer.innerHTML =
        "";


    if (
        expenseCategories.length === 0
    ) {

        expenseCategoriesContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    💸
                </div>

                <p>
                    Aucune catégorie de dépense.
                </p>

            </div>

        `;

        return;

    }


    expenseCategories.forEach(
        category => {

            let existingAmount = "";


            if (existingRecord) {

                const oldExpense =
                    existingRecord.expenses?.find(
                        expense =>
                            expense.categoryId ===
                            category.id
                    );


                if (oldExpense) {

                    existingAmount =
                        oldExpense.amount;

                }

            }


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "expense-input-row";


            row.innerHTML = `

                <div class="form-group">

                    <label>
                        Catégorie
                    </label>

                    <input
                        type="text"
                        value="${escapeHTML(
                            category.name
                        )}"
                        readonly
                    >

                </div>


                <div class="form-group">

                    <label>
                        Montant
                    </label>

                    <div class="money-input">

                        <input
                            type="number"
                            min="0"
                            value="${existingAmount}"
                            placeholder="0"
                            class="expense-value-input"
                            data-expense-id="${category.id}"
                        >

                        <span>
                            FC
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    class="btn-danger-small"
                    onclick="deleteExpenseCategory(${category.id})"
                    title="Supprimer cette catégorie"
                >
                    ×
                </button>

            `;


            expenseCategoriesContainer.appendChild(
                row
            );

        }
    );


    expenseCategoriesContainer
        .querySelectorAll(
            ".expense-value-input"
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
   24. AJOUT CATEGORIE DEPENSE
   ========================================================= */

if (addExpenseCategoryButton) {

    addExpenseCategoryButton.addEventListener(
        "click",
        function () {

            const name =
                prompt(
                    "Quel est le nom de cette dépense ?"
                );


            if (!name) {
                return;
            }


            const cleanName =
                name.trim();


            if (!cleanName) {
                return;
            }


            const exists =
                expenseCategories.some(
                    category =>
                        category.name
                            .toLowerCase() ===
                        cleanName.toLowerCase()
                );


            if (exists) {

                showNotification(
                    "Cette catégorie existe déjà.",
                    "error"
                );

                return;

            }


            expenseCategories.push({

                id:
                    Date.now(),

                name:
                    cleanName

            });


            saveData();


            renderExpenseCategories();


            showNotification(
                "Catégorie de dépense ajoutée."
            );

        }
    );

}


/* =========================================================
   25. SUPPRIMER CATEGORIE DEPENSE
   ========================================================= */

function deleteExpenseCategory(id) {

    const category =
        expenseCategories.find(
            item =>
                item.id === id
        );


    if (!category) {
        return;
    }


    if (
        !confirm(
            `Supprimer "${category.name}" ?`
        )
    ) {

        return;

    }


    expenseCategories =
        expenseCategories.filter(
            item =>
                item.id !== id
        );


    saveData();


    renderExpenseCategories();


    showNotification(
        "Catégorie de dépense supprimée."
    );

}


/* =========================================================
   26. CALCUL JOURNALIER
   ========================================================= */

function calculateCurrentDay() {

    let sales = 0;

    let purchases = 0;

    let expenses = 0;


    /* VENTES */

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


    /* ACHATS */

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


    /* DEPENSES */

    document
        .querySelectorAll(
            ".expense-value-input"
        )
        .forEach(input => {

            expenses +=
                Number(
                    input.value
                ) || 0;

        });


    const grossProfit =
        sales -
        purchases;


    const netProfit =
        sales -
        purchases -
        expenses;


    /* TOTAL VENTES */

    if (dailySales) {

        dailySales.value =
            sales;

    }


    if (totalDailySales) {

        totalDailySales.textContent =
            formatMoney(sales);

    }


    /* TOTAL ACHATS */

    if (totalPurchases) {

        totalPurchases.textContent =
            formatMoney(purchases);

    }


    /* DEPENSES */

    updateExpenseTotalElements(
        expenses
    );


    /* BENEFICE BRUT */

    if (calculatedGrossProfit) {

        calculatedGrossProfit.textContent =
            formatMoney(
                grossProfit
            );


        calculatedGrossProfit.className =
            grossProfit >= 0
                ? "positive"
                : "negative";

    }


    /* BENEFICE NET */

    if (calculatedBalance) {

        calculatedBalance.textContent =
            formatMoney(
                netProfit
            );


        calculatedBalance.className =
            netProfit >= 0
                ? "positive"
                : "negative";

    }


    /* BENEFICE PAR CATEGORIE */

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


        const profit =
            categorySales -
            categoryPurchases;


        profitElement.textContent =
            `Bénéfice : ${formatMoney(profit)}`;


        profitElement.className =
            "category-profit " +
            (
                profit >= 0
                    ? "positive"
                    : "negative"
            );

    });

}


/* =========================================================
   27. METTRE A JOUR LES DEUX AFFICHAGES DES DEPENSES
   ========================================================= */

function updateExpenseTotalElements(
    amount
) {

    const elements =
        document.querySelectorAll(
            "#dailyExpensesTotal"
        );


    elements.forEach(element => {

        element.textContent =
            formatMoney(amount);

    });

}


/* =========================================================
   28. ENREGISTRER LA JOURNEE
   ========================================================= */

if (dailyForm) {

    dailyForm.addEventListener(
        "submit",
        function (event) {

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


            if (
                groups.length === 0
            ) {

                showNotification(
                    "Créez au moins une catégorie avant d'enregistrer.",
                    "error"
                );

                return;

            }


            /* CATEGORIES */

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


            /* TOTALS */

            const totalSales =
                categories.reduce(
                    (
                        sum,
                        category
                    ) =>
                        sum +
                        category.sales,
                    0
                );


            const totalPurchase =
                categories.reduce(
                    (
                        sum,
                        category
                    ) =>
                        sum +
                        category.purchase,
                    0
                );


            /* DEPENSES */

            const expenses = [];


            document
                .querySelectorAll(
                    ".expense-value-input"
                )
                .forEach(input => {

                    const amount =
                        Number(
                            input.value
                        ) || 0;


                    const expenseId =
                        Number(
                            input.dataset.expenseId
                        );


                    const category =
                        expenseCategories.find(
                            item =>
                                item.id ===
                                expenseId
                        );


                    if (category) {

                        expenses.push({

                            categoryId:
                                category.id,

                            categoryName:
                                category.name,

                            amount:
                                amount

                        });

                    }

                });


            const totalExpenses =
                expenses.reduce(
                    (
                        sum,
                        expense
                    ) =>
                        sum +
                        Number(
                            expense.amount || 0
                        ),
                    0
                );


            const grossProfit =
                totalSales -
                totalPurchase;


            const netProfit =
                totalSales -
                totalPurchase -
                totalExpenses;


            /* MODIFICATION */

            const editingId =
                dailyForm.dataset.editingId;


            if (editingId) {

                const index =
                    dailyRecords.findIndex(
                        record =>
                            record.id ===
                            Number(
                                editingId
                            )
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

                        totalSales:
                            totalSales,

                        totalPurchase:
                            totalPurchase,

                        expenses:
                            expenses,

                        totalExpenses:
                            totalExpenses,

                        grossProfit:
                            grossProfit,

                        netProfit:
                            netProfit,

                        updatedAt:
                            new Date().toISOString()

                    };

                }


                delete dailyForm.dataset.editingId;


                showNotification(
                    "Journée modifiée avec succès."
                );

            }


            /* NOUVEL ENREGISTREMENT */

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

                    totalSales:
                        totalSales,

                    totalPurchase:
                        totalPurchase,

                    expenses:
                        expenses,

                    totalExpenses:
                        totalExpenses,

                    grossProfit:
                        grossProfit,

                    netProfit:
                        netProfit,

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


            dailyForm.reset();


            saleDate.value =
                todayISO();


            updateDay();


            renderCategoryInputs();

            renderExpenseCategories();

            renderHistory();

            updateHomeSummary();

            renderReports();

        }
    );

}


/* =========================================================
   29. HISTORIQUE
   ========================================================= */

function renderHistory() {

    if (!dailyHistory) {
        return;
    }


    if (
        dailyRecords.length === 0
    ) {

        dailyHistory.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📜
                </div>

                <h4>
                    Aucun enregistrement
                </h4>

                <p>
                    Vos journées enregistrées
                    apparaîtront ici.
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

        const profit =
            Number(
                record.netProfit ??
                (
                    record.totalSales -
                    record.totalPurchase
                )
            );


        const profitClass =
            profit >= 0
                ? "positive"
                : "negative";


        let categoryHTML =
            "";


        record.categories?.forEach(
            category => {

                if (
                    Number(
                        category.sales
                    ) === 0 &&
                    Number(
                        category.purchase
                    ) === 0
                ) {

                    return;

                }


                categoryHTML += `

                    <div class="history-category">

                        <strong>
                            📁
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


        let expensesHTML =
            "";


        record.expenses?.forEach(
            expense => {

                if (
                    Number(
                        expense.amount
                    ) <= 0
                ) {

                    return;

                }


                expensesHTML += `

                    <span>
                        <strong>
                            ${escapeHTML(
                                expense.categoryName
                            )}
                        </strong>
                        :
                        ${formatMoney(
                            expense.amount
                        )}
                    </span>

                `;

            }
        );


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

                        <strong>
                            Ventes :
                            ${formatMoney(
                                record.totalSales
                            )}
                        </strong>

                        <strong>
                            Achats :
                            ${formatMoney(
                                record.totalPurchase
                            )}
                        </strong>

                        <strong>
                            Dépenses :
                            ${formatMoney(
                                record.totalExpenses || 0
                            )}
                        </strong>

                        <strong class="${profitClass}">
                            Bénéfice net :
                            ${formatMoney(
                                profit
                            )}
                        </strong>

                    </div>

                </div>


                <div class="history-categories">

                    ${
                        categoryHTML ||
                        `
                            <small>
                                Aucune vente ou achat.
                            </small>
                        `
                    }

                </div>


                ${
                    expensesHTML
                        ? `
                            <div class="history-expenses">
                                💸
                                ${expensesHTML}
                            </div>
                        `
                        : ""
                }


                <div class="history-actions">

                    <button
                        type="button"
                        onclick="editRecord(${record.id})"
                    >
                        ✏️ Modifier
                    </button>

                    <button
                        type="button"
                        onclick="deleteRecord(${record.id})"
                    >
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
   30. MODIFIER ENREGISTREMENT
   ========================================================= */

function editRecord(id) {

    const record =
        dailyRecords.find(
            r =>
                r.id === id
        );


    if (!record) {
        return;
    }


    dailyForm.dataset.editingId =
        id;


    saleDate.value =
        record.date;


    updateDay();


    openPage(
        "calculator"
    );


    renderCategoryInputs();

    renderExpenseCategories();

    calculateCurrentDay();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    showNotification(
        "Vous pouvez maintenant modifier cette journée."
    );

}


/* =========================================================
   31. SUPPRIMER ENREGISTREMENT
   ========================================================= */

function deleteRecord(id) {

    const record =
        dailyRecords.find(
            r =>
                r.id === id
        );


    if (!record) {
        return;
    }


    if (
        !confirm(
            `Supprimer l'enregistrement du ${formatDate(record.date)} ?`
        )
    ) {

        return;

    }


    dailyRecords =
        dailyRecords.filter(
            r =>
                r.id !== id
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
   32. ACCUEIL
   ========================================================= */

function updateHomeSummary() {

    if (!dailySalesSummary) {
        return;
    }


    const today =
        todayISO();


    const todayRecords =
        dailyRecords.filter(
            record =>
                record.date ===
                today
        );


    let sales = 0;

    let purchases = 0;

    let expenses = 0;

    let profit = 0;


    todayRecords.forEach(record => {

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


        profit +=
            Number(
                record.netProfit ??
                (
                    record.totalSales -
                    record.totalPurchase -
                    record.totalExpenses
                )
            );

    });


    dailySalesSummary.textContent =
        formatMoney(
            sales
        );


    dailyPurchaseSummary.textContent =
        formatMoney(
            purchases
        );


    if (dailyExpenseSummary) {

        dailyExpenseSummary.textContent =
            formatMoney(
                expenses
            );

    }


    dailyBalanceSummary.textContent =
        formatMoney(
            profit
        );


    dailyBalanceSummary.className =
        profit >= 0
            ? "positive"
            : "negative";


    renderHomeCategorySummary(
        todayRecords
    );

}


/* =========================================================
   33. CATEGORIES SUR ACCUEIL
   ========================================================= */

function renderHomeCategorySummary(
    records
) {

    if (!homeCategorySummary) {
        return;
    }


    if (
        records.length === 0
    ) {

        homeCategorySummary.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📊
                </div>

                <h4>
                    Aucune vente aujourd'hui
                </h4>

                <p>
                    Enregistrez votre journée
                    pour voir les résultats.
                </p>

            </div>

        `;

        return;

    }


    const totals = {};


    records.forEach(record => {

        record.categories?.forEach(
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


    const maximumSales =
        Math.max(
            ...categories.map(
                category =>
                    category.sales
            ),
            1
        );


    let html = "";


    categories.forEach(
        category => {

            const percentage =
                Math.min(
                    100,
                    (
                        category.sales /
                        maximumSales
                    ) * 100
                );


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
                            style="
                                width:${percentage}%;
                            "
                        ></div>

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

        }
    );


    homeCategorySummary.innerHTML =
        html;

}


/* =========================================================
   34. RAPPORTS
   ========================================================= */

function getCurrentWeekStart() {

    const now =
        new Date();


    const start =
        new Date(
            now
        );


    const day =
        start.getDay();


    const difference =
        day === 0
            ? 6
            : day - 1;


    start.setDate(
        start.getDate() -
        difference
    );


    start.setHours(
        0,
        0,
        0,
        0
    );


    return start;

}


/* =========================================================
   35. RAPPORT GENERAL
   ========================================================= */

function renderReports() {

    const now =
        new Date();


    const startOfWeek =
        getCurrentWeekStart();


    let weekSales = 0;

    let weekPurchases = 0;

    let weekExpenses = 0;


    dailyRecords.forEach(
        record => {

            const date =
                new Date(
                    record.date +
                    "T12:00:00"
                );


            if (
                date >=
                startOfWeek
            ) {

                weekSales +=
                    Number(
                        record.totalSales || 0
                    );


                weekPurchases +=
                    Number(
                        record.totalPurchase || 0
                    );


                weekExpenses +=
                    Number(
                        record.totalExpenses || 0
                    );

            }

        }
    );


    const weekGrossProfit =
        weekSales -
        weekPurchases;


    const weekNetProfit =
        weekSales -
        weekPurchases -
        weekExpenses;


    updateElementMoney(
        "weeklySales",
        weekSales
    );


    updateElementMoney(
        "weeklyPurchases",
        weekPurchases
    );


    updateElementMoney(
        "weeklyExpenses",
        weekExpenses
    );


    updateElementMoney(
        "weeklyNetProfit",
        weekNetProfit
    );


    /* MOIS ACTUEL */

    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const selectedMonth =
        `${year}-${month}`;


    if (
        reportMonth &&
        !reportMonth.value
    ) {

        reportMonth.value =
            selectedMonth;

    }


    renderSelectedMonth(
        reportMonth?.value ||
        selectedMonth
    );

}


/* =========================================================
   36. ELEMENT MONEY
   ========================================================= */

function updateElementMoney(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.textContent =
        formatMoney(
            value
        );


    if (
        id.includes(
            "Profit"
        )
    ) {

        element.className =
            value >= 0
                ? "positive"
                : "negative";

    }

}


/* =========================================================
   37. RAPPORT MOIS SELECTIONNE
   ========================================================= */

function renderSelectedMonth(
    selectedMonth
) {

    if (!selectedMonth) {
        return;
    }


    const records =
        dailyRecords.filter(
            record =>
                record.date.startsWith(
                    selectedMonth
                )
        );


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


    const grossProfit =
        sales -
        purchases;


    const netProfit =
        sales -
        purchases -
        expenses;


    /* AFFICHAGE */

    updateElementMoney(
        "monthlySales",
        sales
    );


    updateElementMoney(
        "monthlyPurchases",
        purchases
    );


    updateElementMoney(
        "monthlyExpenses",
        expenses
    );


    updateElementMoney(
        "monthlyGrossProfit",
        grossProfit
    );


    updateElementMoney(
        "monthlyNetProfit",
        netProfit
    );


    updateElementMoney(
        "finalMonthlySales",
        sales
    );


    updateElementMoney(
        "finalMonthlyPurchases",
        purchases
    );


    updateElementMoney(
        "finalMonthlyExpenses",
        expenses
    );


    updateElementMoney(
        "finalMonthlyProfit",
        netProfit
    );


    renderCategoryReports(
        records
    );


    renderExpenseReports(
        records
    );


    renderDailySalesReport(
        records
    );

}


/* =========================================================
   38. RAPPORT PAR CATEGORIE
   ========================================================= */

function renderCategoryReports(
    records
) {

    if (!categoryReports) {
        return;
    }


    const totals = {};


    records.forEach(record => {

        record.categories?.forEach(
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


    if (
        categories.length === 0
    ) {

        categoryReports.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📦
                </div>

                <p>
                    Aucun résultat disponible.
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
   39. RAPPORT DES DEPENSES
   ========================================================= */

function renderExpenseReports(
    records
) {

    if (!expenseReports) {
        return;
    }


    const totals = {};


    records.forEach(record => {

        record.expenses?.forEach(
            expense => {

                if (
                    !totals[
                        expense.categoryId
                    ]
                ) {

                    totals[
                        expense.categoryId
                    ] = {

                        name:
                            expense.categoryName,

                        amount:
                            0

                    };

                }


                totals[
                    expense.categoryId
                ].amount +=
                    Number(
                        expense.amount || 0
                    );

            }
        );

    });


    const expenses =
        Object.values(
            totals
        );


    if (
        expenses.length === 0
    ) {

        expenseReports.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    💸
                </div>

                <p>
                    Aucune dépense enregistrée
                    pour cette période.
                </p>

            </div>

        `;

        return;

    }


    const maximum =
        Math.max(
            ...expenses.map(
                expense =>
                    expense.amount
            ),
            1
        );


    let html = "";


    expenses.forEach(
        expense => {

            const percentage =
                (
                    expense.amount /
                    maximum
                ) * 100;


            html += `

                <div class="home-category-row">

                    <div class="home-category-top">

                        <strong>
                            💸
                            ${escapeHTML(
                                expense.name
                            )}
                        </strong>

                        <strong>
                            ${formatMoney(
                                expense.amount
                            )}
                        </strong>

                    </div>


                    <div class="category-progress">

                        <div
                            class="category-progress-bar"
                            style="
                                width:${percentage}%;
                            "
                        ></div>

                    </div>

                </div>

            `;

        }
    );


    expenseReports.innerHTML =
        html;

}


/* =========================================================
   40. RAPPORT JOUR PAR JOUR
   ========================================================= */

function renderDailySalesReport(
    records
) {

    if (!dailySalesReport) {
        return;
    }


    if (
        records.length === 0
    ) {

        dailySalesReport.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📅
                </div>

                <p>
                    Aucun jour enregistré
                    pour ce mois.
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

            const netProfit =
                Number(
                    record.netProfit ??
                    (
                        record.totalSales -
                        record.totalPurchase -
                        record.totalExpenses
                    )
                );


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
                            record.totalExpenses || 0
                        )}
                    </td>

                    <td class="${
                        netProfit >= 0
                            ? "positive"
                            : "negative"
                    }">

                        <strong>
                            ${formatMoney(
                                netProfit
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
   41. CHANGEMENT DE MOIS
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


/* =========================================================
   42. ACTUALISER RAPPORTS
   ========================================================= */

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

            } else {

                renderReports();

            }


            showNotification(
                "Rapports actualisés."
            );

        }
    );

}


/* =========================================================
   43. INSTALLATION APPLICATION
   ========================================================= */

let deferredInstallPrompt =
    null;


const installAppButton =
    document.getElementById(
        "installAppButton"
    );


const installHelp =
    document.getElementById(
        "installHelp"
    );


const closeInstallHelp =
    document.getElementById(
        "closeInstallHelp"
    );


window.addEventListener(
    "beforeinstallprompt",
    function (event) {

        event.preventDefault();

        deferredInstallPrompt =
            event;

    }
);


/* BOUTON INSTALLER */

if (installAppButton) {

    installAppButton.addEventListener(
        "click",
        async function () {

            /*
              Si le navigateur autorise
              directement l'installation
            */

            if (
                deferredInstallPrompt
            ) {

                deferredInstallPrompt.prompt();


                const result =
                    await deferredInstallPrompt.userChoice;


                if (
                    result.outcome ===
                    "accepted"
                ) {

                    showNotification(
                        "JOSSELL est en cours d'installation."
                    );

                }


                deferredInstallPrompt =
                    null;


                return;

            }


            /*
              Sinon on affiche les instructions
            */

            if (installHelp) {

                installHelp.style.display =
                    "block";

            }

        }
    );

}


/* FERMER AIDE */

if (closeInstallHelp) {

    closeInstallHelp.addEventListener(
        "click",
        function () {

            if (installHelp) {

                installHelp.style.display =
                    "none";

            }

        }
    );

}


/* INSTALLATION TERMINEE */

window.addEventListener(
    "appinstalled",
    function () {

        showNotification(
            "JOSSELL a été installé avec succès."
        );


        if (installAppButton) {

            installAppButton.style.display =
                "none";

        }

    }
);


/* =========================================================
   44. INITIALISATION COMPLETE
   ========================================================= */

function initializeApp() {

    initializeDate();

    updateArticleGroupSelect();

    renderGroups();

    renderCategoryInputs();

    renderExpenseCategories();

    renderHistory();

    updateHomeSummary();

    renderReports();


    /*
      Cacher l'écran de chargement
    */

    setTimeout(
        function () {

            if (loadingScreen) {

                loadingScreen.style.opacity =
                    "0";


                setTimeout(
                    function () {

                        loadingScreen.style.display =
                            "none";

                    },
                    400
                );

            }

        },
        600
    );

}


/* =========================================================
   45. DEMARRAGE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);