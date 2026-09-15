/* =========================================================
   JOSSELL - MA GESTION
   JavaScript complet
   Ventes - Achats - Bénéfices - Rapports
   ========================================================= */


/* =========================================================
   1. STOCKAGE DES DONNÉES
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
   2. RÉCUPÉRATION DES ÉLÉMENTS HTML
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

const calculatedBalance =
    document.getElementById("calculatedBalance");

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

const currentDate =
    document.getElementById("currentDate");

const dailySalesSummary =
    document.getElementById("dailySalesSummary");

const dailyPurchaseSummary =
    document.getElementById("dailyPurchaseSummary");

const dailyBalanceSummary =
    document.getElementById("dailyBalanceSummary");

const homeCategorySummary =
    document.getElementById("homeCategorySummary");

const weeklySales =
    document.getElementById("weeklySales");

const monthlySales =
    document.getElementById("monthlySales");

const monthlyPurchases =
    document.getElementById("monthlyPurchases");

const monthlyTotal =
    document.getElementById("monthlyTotal");

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

const finalMonthlyProfit =
    document.getElementById("finalMonthlyProfit");

const notificationContainer =
    document.getElementById("notificationContainer");


/* =========================================================
   3. SAUVEGARDE
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


/* =========================================================
   4. FORMATAGE DES MONTANTS
   ========================================================= */

function formatMoney(number) {

    number = Number(number) || 0;

    return number.toLocaleString("fr-FR") + " FC";
}


/* =========================================================
   5. DATE DU JOUR
   ========================================================= */

function todayISO() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


/* =========================================================
   7. NOM DU JOUR
   ========================================================= */

function getDayName(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(dateString + "T12:00:00");

    return date.toLocaleDateString(
        "fr-FR",
        {
            weekday: "long"
        }
    );
}


/* =========================================================
   8. ÉCHAPPER LE HTML
   ========================================================= */

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
   9. NOTIFICATIONS
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
        "600";

    notification.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.15)";

    notification.textContent =
        message;

    notificationContainer.appendChild(
        notification
    );

    setTimeout(() => {

        notification.remove();

    }, 3000);
}


/* =========================================================
   10. NAVIGATION
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


/* Navigation principale */

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


/* Bouton Commencer */

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
   11. INITIALISATION DATE
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


/* Changement de date */

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
   12. GROUPES / CATÉGORIES
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

                description: description,

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
   13. AFFICHER LES GROUPES ET ARTICLES
   ========================================================= */

function renderGroups() {

    if (!articlesList) {
        return;
    }


    let groupsHTML = "";


    if (groups.length === 0) {

        groupsHTML = `

            <div class="empty-state">

                <p>
                    📁 Aucun groupe créé pour le moment.
                </p>

            </div>

        `;

    } else {

        groups.forEach(group => {

            const groupArticles =
                articles.filter(
                    article =>
                        article.groupId ===
                        group.id
                );


            groupsHTML += `

                <div class="group-card">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:10px;
                    ">

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
                            onclick="deleteGroup(${group.id})"
                            style="
                                background:#dc2626;
                                color:white;
                                border:0;
                                padding:8px 12px;
                                border-radius:8px;
                                cursor:pointer;
                            "
                        >
                            Supprimer
                        </button>

                    </div>


                    <div style="
                        margin-top:12px;
                    ">

                        <strong>
                            ${groupArticles.length}
                            article(s)
                        </strong>

                    </div>

                </div>

            `;

        });

    }


    let articlesHTML = "";


    if (articles.length > 0) {

        articlesHTML = `

            <h4 style="
                margin-top:25px;
                margin-bottom:12px;
            ">
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

                <div style="
                    padding:14px;
                    margin-bottom:10px;
                    border-radius:12px;
                    background:rgba(37,99,235,0.05);
                    border:1px solid rgba(37,99,235,0.12);
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        gap:10px;
                        align-items:center;
                    ">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    article.name
                                )}
                            </strong>

                            <div>
                                Catégorie :
                                ${escapeHTML(
                                    group
                                        ? group.name
                                        : "Inconnue"
                                )}
                            </div>

                            <div>
                                Stock :
                                ${Number(
                                    article.quantity
                                ) || 0}
                            </div>

                            <div>
                                Prix :
                                ${formatMoney(
                                    article.price
                                )}
                            </div>

                        </div>


                        <button
                            type="button"
                            onclick="deleteArticle(${article.id})"
                            style="
                                background:#dc2626;
                                color:white;
                                border:0;
                                padding:8px 12px;
                                border-radius:8px;
                                cursor:pointer;
                            "
                        >
                            Supprimer
                        </button>

                    </div>

                </div>

            `;

        });

    }


    articlesList.innerHTML =
        groupsHTML +
        articlesHTML;
}


/* =========================================================
   14. SUPPRIMER UN GROUPE
   ========================================================= */

function deleteGroup(id) {

    const group =
        groups.find(
            g => g.id === id
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
        `Voulez-vous supprimer la catégorie "${group.name}" ?`;


    if (linkedArticles.length > 0) {

        message +=
            `\n\nAttention : ${linkedArticles.length} article(s) appartiennent à cette catégorie.`;

    }


    if (!confirm(message)) {
        return;
    }


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


    showNotification(
        "Catégorie supprimée."
    );
}


/* =========================================================
   15. AJOUTER UN ARTICLE
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

                quantity: quantity,

                price: price,

                createdAt:
                    new Date().toISOString()

            };


            articles.push(
                newArticle
            );


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
   16. LISTE DES CATÉGORIES
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
   17. SUPPRIMER UN ARTICLE
   ========================================================= */

function deleteArticle(id) {

    const article =
        articles.find(
            a => a.id === id
        );

    if (!article) {
        return;
    }


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


    showNotification(
        "Article supprimé."
    );
}


/* =========================================================
   18. CRÉER LES CHAMPS DES CATÉGORIES
   ========================================================= */

function renderCategoryInputs() {

    if (!dynamicExpenses) {
        return;
    }


    if (groups.length === 0) {

        dynamicExpenses.innerHTML = `

            <div class="empty-state">

                <p>
                    📁 Créez d'abord une catégorie
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


        row.style.cssText = `

            margin-bottom:15px;

            padding:15px;

            border:1px solid
                rgba(37,99,235,0.15);

            border-radius:14px;

            background:
                rgba(37,99,235,0.03);

        `;


        row.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:10px;
                margin-bottom:12px;
            ">

                <strong>
                    📁
                    ${escapeHTML(group.name)}
                </strong>


                <span
                    class="category-profit"
                    data-group-id="${group.id}"
                    style="
                        font-weight:bold;
                        color:#16a34a;
                    "
                >
                    Bénéfice : 0 FC
                </span>

            </div>


            <div class="form-grid">

                <div class="form-group">

                    <label>
                        💵 Ventes
                    </label>

                    <input
                        type="number"
                        min="0"
                        class="category-sale-input"
                        data-group-id="${group.id}"
                        value="${salesValue}"
                        placeholder="0"
                    >

                </div>


                <div class="form-group">

                    <label>
                        🛒 Achats
                    </label>

                    <input
                        type="number"
                        min="0"
                        class="category-purchase-input"
                        data-group-id="${group.id}"
                        value="${purchaseValue}"
                        placeholder="0"
                    >

                </div>

            </div>

        `;


        dynamicExpenses.appendChild(
            row
        );

    });


    /* Le total des ventes est calculé
       automatiquement */

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
   19. CALCUL DE LA JOURNÉE
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
                Number(input.value) || 0;

        });


    document
        .querySelectorAll(
            ".category-purchase-input"
        )
        .forEach(input => {

            purchases +=
                Number(input.value) || 0;

        });


    const balance =
        sales - purchases;


    /* Total ventes */

    if (dailySales) {

        dailySales.value =
            sales;

    }


    if (totalDailySales) {

        totalDailySales.textContent =
            formatMoney(sales);

    }


    /* Total achats */

    if (totalPurchases) {

        totalPurchases.textContent =
            formatMoney(purchases);

    }


    /* Bénéfice */

    if (calculatedBalance) {

        calculatedBalance.textContent =
            formatMoney(balance);

        calculatedBalance.style.color =
            balance >= 0
                ? "#16a34a"
                : "#dc2626";

    }


    /* Bénéfice de chaque catégorie */

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


        profitElement.style.color =
            profit >= 0
                ? "#16a34a"
                : "#dc2626";

    });
}


/* =========================================================
   20. ENREGISTRER UNE JOURNÉE
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
                    "Créez au moins une catégorie avant d'enregistrer.",
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
                        sales - purchase

                });

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


            const totalProfit =
                totalSales -
                totalPurchase;


            const editingId =
                dailyForm.dataset.editingId;


            /* MODIFICATION */

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
                            getDayName(date),

                        categories:
                            categories,

                        totalSales:
                            totalSales,

                        totalPurchase:
                            totalPurchase,

                        totalProfit:
                            totalProfit,

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
                        getDayName(date),

                    categories:
                        categories,

                    totalSales:
                        totalSales,

                    totalPurchase:
                        totalPurchase,

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


            dailyForm.reset();


            saleDate.value =
                todayISO();


            updateDay();


            renderCategoryInputs();

            renderHistory();

            updateHomeSummary();

            renderReports();

        }
    );

}


/* =========================================================
   21. HISTORIQUE
   ========================================================= */

function renderHistory() {

    if (!dailyHistory) {
        return;
    }


    if (dailyRecords.length === 0) {

        dailyHistory.innerHTML = `

            <div class="empty-state">

                <p>
                    📜 Aucun enregistrement pour le moment.
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

                    <div style="
                        padding:8px 0;
                        border-bottom:
                            1px solid
                            rgba(0,0,0,0.06);
                    ">

                        <strong>
                            ${escapeHTML(
                                category.groupName
                            )}
                        </strong>

                        <br>

                        <small>

                            Ventes :
                            ${formatMoney(
                                category.sales
                            )}

                            |

                            Achats :
                            ${formatMoney(
                                category.purchase
                            )}

                            |

                            Bénéfice :

                            <strong>
                                ${formatMoney(
                                    category.profit
                                )}
                            </strong>

                        </small>

                    </div>

                `;

            }
        );


        html += `

            <div class="history-card"
                style="
                    margin-bottom:15px;
                    padding:16px;
                    border-radius:14px;
                    border:
                        1px solid
                        rgba(0,0,0,0.08);
                    background:#fff;
                ">

                <div style="
                    display:flex;
                    justify-content:
                        space-between;
                    align-items:
                        flex-start;
                    gap:10px;
                ">

                    <div>

                        <h4 style="
                            margin:
                                0 0 5px;
                        ">

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


                    <div style="
                        text-align:right;
                    ">

                        <strong>
                            Ventes :
                            ${formatMoney(
                                record.totalSales
                            )}
                        </strong>

                        <br>

                        <strong>
                            Achats :
                            ${formatMoney(
                                record.totalPurchase
                            )}
                        </strong>

                        <br>

                        <strong
                            class="${profitClass}"
                        >
                            Bénéfice :
                            ${formatMoney(
                                record.totalProfit
                            )}
                        </strong>

                    </div>

                </div>


                <div style="
                    margin-top:15px;
                ">

                    ${
                        categoryHTML ||
                        `
                        <small>
                            Aucune opération enregistrée.
                        </small>
                        `
                    }

                </div>


                <div style="
                    display:flex;
                    gap:8px;
                    margin-top:15px;
                    flex-wrap:wrap;
                ">

                    <button
                        type="button"
                        onclick="editRecord(${record.id})"
                        style="
                            padding:9px 14px;
                            border:0;
                            border-radius:8px;
                            cursor:pointer;
                        "
                    >
                        ✏️ Modifier
                    </button>


                    <button
                        type="button"
                        onclick="deleteRecord(${record.id})"
                        style="
                            padding:9px 14px;
                            border:0;
                            border-radius:8px;
                            background:#dc2626;
                            color:white;
                            cursor:pointer;
                        "
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
   22. MODIFIER UNE JOURNÉE
   ========================================================= */

function editRecord(id) {

    const record =
        dailyRecords.find(
            r => r.id === id
        );


    if (!record) {
        return;
    }


    dailyForm.dataset.editingId =
        id;


    saleDate.value =
        record.date;


    updateDay();


    renderCategoryInputs();


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


/* =========================================================
   23. SUPPRIMER UNE JOURNÉE
   ========================================================= */

function deleteRecord(id) {

    const record =
        dailyRecords.find(
            r => r.id === id
        );


    if (!record) {
        return;
    }


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
   24. RÉSUMÉ ACCUEIL
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


    const balance =
        sales - purchases;


    dailySalesSummary.textContent =
        formatMoney(sales);


    dailyPurchaseSummary.textContent =
        formatMoney(purchases);


    dailyBalanceSummary.textContent =
        formatMoney(balance);


    dailyBalanceSummary.className =
        balance >= 0
            ? "positive"
            : "negative";


    /* Résumé des catégories */

    renderHomeCategorySummary(
        todayRecords
    );
}


/* =========================================================
   25. CATÉGORIES SUR L'ACCUEIL
   ========================================================= */

function renderHomeCategorySummary(
    records
) {

    if (!homeCategorySummary) {
        return;
    }


    if (records.length === 0) {

        homeCategorySummary.innerHTML = `

            <div class="empty-state">

                <p>
                    📊 Aucune vente enregistrée aujourd'hui.
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

                        sales: 0,

                        purchases: 0,

                        profit: 0

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

        html += `

            <div style="
                display:grid;
                grid-template-columns:
                    1.3fr 1fr 1fr 1fr;
                gap:10px;
                align-items:center;
                padding:12px 0;
                border-bottom:
                    1px solid
                    rgba(0,0,0,0.07);
            ">

                <strong>
                    📁
                    ${escapeHTML(
                        category.name
                    )}
                </strong>

                <span>
                    Ventes :
                    <strong>
                        ${formatMoney(
                            category.sales
                        )}
                    </strong>
                </span>

                <span>
                    Achats :
                    <strong>
                        ${formatMoney(
                            category.purchases
                        )}
                    </strong>
                </span>

                <span class="${
                    category.profit >= 0
                        ? "positive"
                        : "negative"
                }">

                    Bénéfice :
                    <strong>
                        ${formatMoney(
                            category.profit
                        )}
                    </strong>

                </span>

            </div>

        `;

    });


    homeCategorySummary.innerHTML =
        html;
}


/* =========================================================
   26. RAPPORTS
   ========================================================= */

function renderReports() {

    const now =
        new Date();


    /* =========================
       SEMAINE
       ========================= */

    const startOfWeek =
        new Date(now);


    const day =
        startOfWeek.getDay();


    const difference =
        day === 0
            ? 6
            : day - 1;


    startOfWeek.setDate(
        startOfWeek.getDate() -
        difference
    );


    startOfWeek.setHours(
        0,
        0,
        0,
        0
    );


    let weekSales = 0;


    dailyRecords.forEach(
        record => {

            const recordDate =
                new Date(
                    record.date +
                    "T12:00:00"
                );


            if (
                recordDate >=
                startOfWeek
            ) {

                weekSales +=
                    Number(
                        record.totalSales ||
                        0
                    );

            }

        }
    );


    /* =========================
       MOIS ACTUEL
       ========================= */

    const currentYear =
        now.getFullYear();

    const currentMonth =
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
                    currentYear &&

                    date.getMonth() ===
                    currentMonth

                );

            }
        );


    let monthSales = 0;

    let monthPurchases = 0;


    monthRecords.forEach(
        record => {

            monthSales +=
                Number(
                    record.totalSales ||
                    0
                );


            monthPurchases +=
                Number(
                    record.totalPurchase ||
                    0
                );

        }
    );


    const monthProfit =
        monthSales -
        monthPurchases;


    /* Affichage */

    if (weeklySales) {

        weeklySales.textContent =
            formatMoney(
                weekSales
            );

    }


    if (monthlySales) {

        monthlySales.textContent =
            formatMoney(
                monthSales
            );

    }


    if (monthlyPurchases) {

        monthlyPurchases.textContent =
            formatMoney(
                monthPurchases
            );

    }


    if (monthlyTotal) {

        monthlyTotal.textContent =
            formatMoney(
                monthProfit
            );

        monthlyTotal.className =
            monthProfit >= 0
                ? "positive"
                : "negative";

    }


    if (finalMonthlySales) {

        finalMonthlySales.textContent =
            formatMoney(
                monthSales
            );

    }


    if (finalMonthlyPurchases) {

        finalMonthlyPurchases.textContent =
            formatMoney(
                monthPurchases
            );

    }


    if (finalMonthlyProfit) {

        finalMonthlyProfit.textContent =
            formatMoney(
                monthProfit
            );

        finalMonthlyProfit.className =
            monthProfit >= 0
                ? "positive"
                : "negative";

    }


    renderCategoryReports(
        monthRecords
    );


    renderDailySalesReport(
        monthRecords
    );

}


/* =========================================================
   27. RAPPORT PAR CATÉGORIE
   ========================================================= */

function renderCategoryReports(
    records
) {

    if (!categoryReports) {
        return;
    }


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

                        sales: 0,

                        purchases: 0,

                        profit: 0

                    };

                }


                totals[
                    category.groupId
                ].sales +=
                    Number(
                        category.sales ||
                        0
                    );


                totals[
                    category.groupId
                ].purchases +=
                    Number(
                        category.purchase ||
                        0
                    );


                totals[
                    category.groupId
                ].profit +=
                    Number(
                        category.profit ||
                        0
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

        <div style="
            overflow-x:auto;
        ">

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
   28. RAPPORT JOUR PAR JOUR
   ========================================================= */

function renderDailySalesReport(
    records
) {

    if (!dailySalesReport) {
        return;
    }


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

        <div style="
            overflow-x:auto;
        ">

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
   29. FILTRE PAR MOIS
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
        function() {

            renderSelectedMonth(
                this.value
            );

        }
    );

}


/* =========================================================
   30. ACTUALISER LES RAPPORTS
   ========================================================= */

if (refreshReports) {

    refreshReports.addEventListener(
        "click",
        function() {

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
   31. RAPPORT DU MOIS SÉLECTIONNÉ
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


    records.forEach(record => {

        sales +=
            Number(
                record.totalSales ||
                0
            );


        purchases +=
            Number(
                record.totalPurchase ||
                0
            );

    });


    const profit =
        sales - purchases;


    if (monthlySales) {

        monthlySales.textContent =
            formatMoney(sales);

    }


    if (monthlyPurchases) {

        monthlyPurchases.textContent =
            formatMoney(purchases);

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


    if (finalMonthlyProfit) {

        finalMonthlyProfit.textContent =
            formatMoney(profit);

        finalMonthlyProfit.className =
            profit >= 0
                ? "positive"
                : "negative";

    }


    renderCategoryReports(
        records
    );


    renderDailySalesReport(
        records
    );

}


/* =========================================================
   32. INITIALISATION DE L'APPLICATION
   ========================================================= */

function initializeApp() {

    initializeDate();

    updateArticleGroupSelect();

    renderGroups();

    renderCategoryInputs();

    renderHistory();

    updateHomeSummary();

    renderReports();


    /* Écran de chargement */

    setTimeout(
        () => {

            if (loadingScreen) {

                loadingScreen.style.opacity =
                    "0";


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


/* =========================================================
   33. LANCEMENT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);