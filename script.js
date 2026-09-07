/* =========================================================
   JOSSELL - MA GESTION
   JavaScript principal
========================================================= */

/* =========================================================
   1. DONNÉES
========================================================= */

let groupes = JSON.parse(localStorage.getItem("jossell_groupes")) || [];
let calculs = JSON.parse(localStorage.getItem("jossell_calculs")) || [];

/* =========================================================
   2. DÉMARRAGE DE L'APPLICATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Écran de chargement
    setTimeout(function () {
        const loading = document.getElementById("loadingScreen");
        if (loading) {
            loading.style.display = "none";
        }
    }, 500);

    initialiserDate();
    afficherGroupes();
    afficherCategoriesCalcul();
    afficherHistorique();
    mettreAJourRapports();
    initialiserNavigation();
    initialiserFormulaires();
    initialiserOngletsRapports();
    remplirSelectGroupes();
});

/* =========================================================
   3. NAVIGATION
========================================================= */

function initialiserNavigation() {
    const boutons = document.querySelectorAll("[data-page]");

    boutons.forEach(function (bouton) {
        bouton.addEventListener("click", function (event) {
            event.preventDefault();
            const page = bouton.getAttribute("data-page");
            afficherPage(page);
        });
    });

    // Menu burger mobile
    const menuButton = document.getElementById("menuButton");
    const mainNav = document.getElementById("mainNavigation");

    if (menuButton && mainNav) {
        menuButton.addEventListener("click", function () {
            mainNav.classList.toggle("nav-open");
        });
    }
}

function afficherPage(page) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(function (element) {
        element.classList.remove("active-page", "active");
    });

    const pageChoisie = document.getElementById("page-" + page);
    if (pageChoisie) {
        pageChoisie.classList.add("active-page");
    }

    const boutons = document.querySelectorAll(".nav-item");
    boutons.forEach(function (bouton) {
        bouton.classList.remove("active");
        if (bouton.getAttribute("data-page") === page) {
            bouton.classList.add("active");
        }
    });

    // Fermer le menu mobile si ouvert
    const mainNav = document.getElementById("mainNavigation");
    if (mainNav) {
        mainNav.classList.remove("nav-open");
    }

    // Retour en haut
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================================================
   4. DATE AUTOMATIQUE
========================================================= */

function initialiserDate() {
    const maintenant = new Date();

    const annee = maintenant.getFullYear();
    const mois = String(maintenant.getMonth() + 1).padStart(2, "0");
    const jour = String(maintenant.getDate()).padStart(2, "0");

    const dateComplete = `${annee}-${mois}-${jour}`;

    const dateInput = document.getElementById("saleDate") || document.getElementById("calcDate");

    if (dateInput) {
        dateInput.value = dateComplete;
        dateInput.addEventListener("change", function (e) {
            mettreAJourNomJour(e.target.value);
        });
    }

    const jourInput = document.getElementById("saleDay") || document.getElementById("calcDay");
    if (jourInput) {
        jourInput.value = obtenirJourFrancais(maintenant);
    }

    const dateAffichage = document.getElementById("currentDate");
    if (dateAffichage) {
        dateAffichage.textContent = maintenant.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }
}

function mettreAJourNomJour(dateString) {
    const jourInput = document.getElementById("saleDay") || document.getElementById("calcDay");
    if (!jourInput || !dateString) return;
    const date = new Date(dateString);
    jourInput.value = obtenirJourFrancais(date);
}

function obtenirJourFrancais(date) {
    const jours = [
        "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
    ];
    return jours[date.getDay()];
}

/* =========================================================
   5. FORMULAIRES
========================================================= */

function initialiserFormulaires() {
    const groupeForm = document.getElementById("articleGroupForm");
    if (groupeForm) {
        groupeForm.addEventListener("submit", function (event) {
            event.preventDefault();
            ajouterGroupe();
        });
    }

    const articleForm = document.getElementById("articleForm");
    if (articleForm) {
        articleForm.addEventListener("submit", function (event) {
            event.preventDefault();
            ajouterArticle();
        });
    }

    const calculForm = document.getElementById("dailyForm") || document.getElementById("calculationForm");
    if (calculForm) {
        calculForm.addEventListener("submit", function (event) {
            event.preventDefault();
            enregistrerCalcul();
        });
    }

    // Recalcul automatique lors de la saisie
    document.addEventListener("input", function (event) {
        if (
            event.target.classList.contains("expense-input") ||
            event.target.id === "dailySales"
        ) {
            calculerTotal();
        }
    });
}

/* =========================================================
   6. AJOUTER UN GROUPE
========================================================= */

function ajouterGroupe() {
    const nomInput = document.getElementById("groupName");
    const descriptionInput = document.getElementById("groupDescription");

    if (!nomInput) return;

    const nom = nomInput.value.trim();
    const description = descriptionInput ? descriptionInput.value.trim() : "";

    if (nom === "") {
        afficherNotification("Veuillez donner un nom au groupe.", "error");
        return;
    }

    const existe = groupes.some(function (groupe) {
        return groupe.nom.toLowerCase() === nom.toLowerCase();
    });

    if (existe) {
        afficherNotification("Ce groupe existe déjà.", "error");
        return;
    }

    const nouveauGroupe = {
        id: Date.now(),
        nom: nom,
        description: description,
        articles: [],
        dateCreation: new Date().toISOString()
    };

    groupes.push(nouveauGroupe);
    sauvegarderGroupes();
    afficherGroupes();
    afficherCategoriesCalcul();

    nomInput.value = "";
    if (descriptionInput) {
        descriptionInput.value = "";
    }

    afficherNotification("Groupe ajouté avec succès.", "success");
}

/* =========================================================
   7. AFFICHER LES GROUPES
========================================================= */

function afficherGroupes() {
    const container = document.getElementById("articlesList") || document.getElementById("groupsList");
    if (!container) return;

    container.innerHTML = "";

    if (groupes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span>🛒</span>
                <h3>Aucun groupe enregistré</h3>
                <p>Créez votre premier groupe ci-dessus.</p>
            </div>
        `;
        return;
    }

    groupes.forEach(function (groupe) {
        const div = document.createElement("div");
        div.className = "article-group-card";

        div.innerHTML = `
            <div class="group-header">
                <div>
                    <h3>${echapperHTML(groupe.nom)}</h3>
                    <p>${echapperHTML(groupe.description || "Aucune description")}</p>
                </div>
                <button type="button" class="delete-button" onclick="supprimerGroupe(${groupe.id})">
                    Supprimer
                </button>
            </div>
            <div class="group-articles">
                ${
                    groupe.articles.length > 0
                    ? groupe.articles.map(function (article) {
                        return `
                            <div class="article-item">
                                <div>
                                    <strong>${echapperHTML(article.nom)}</strong>
                                    <small>Quantité : ${article.quantite}</small>
                                </div>
                                <div>${formaterMontant(article.prix)} FC</div>
                            </div>
                        `;
                    }).join("")
                    : `<p class="empty-small">Aucun article dans ce groupe.</p>`
                }
            </div>
        `;

        container.appendChild(div);
    });

    remplirSelectGroupes();
}

/* =========================================================
   8. SUPPRIMER UN GROUPE
========================================================= */

function supprimerGroupe(id) {
    const groupe = groupes.find(function (g) { return g.id === id; });
    if (!groupe) return;

    if (!confirm(`Voulez-vous vraiment supprimer le groupe "${groupe.nom}" ?`)) return;

    groupes = groupes.filter(function (g) { return g.id !== id; });

    sauvegarderGroupes();
    afficherGroupes();
    afficherCategoriesCalcul();

    afficherNotification("Groupe supprimé.", "success");
}

/* =========================================================
   9. AJOUTER UN ARTICLE
========================================================= */

function ajouterArticle() {
    const nomInput = document.getElementById("articleName");
    const groupeInput = document.getElementById("articleGroupSelect") || document.getElementById("articleGroup");
    const quantiteInput = document.getElementById("articleQuantity");
    const prixInput = document.getElementById("articlePrice");

    if (!nomInput || !groupeInput) return;

    const nom = nomInput.value.trim();
    const groupeId = Number(groupeInput.value);
    const quantite = Number(quantiteInput ? quantiteInput.value : 0);
    const prix = Number(prixInput ? prixInput.value : 0);

    if (nom === "") {
        afficherNotification("Veuillez entrer le nom de l'article.", "error");
        return;
    }

    if (!groupeId) {
        afficherNotification("Veuillez sélectionner un groupe.", "error");
        return;
    }

    const groupe = groupes.find(function (g) { return g.id === groupeId; });

    if (!groupe) {
        afficherNotification("Groupe introuvable.", "error");
        return;
    }

    const article = {
        id: Date.now(),
        nom: nom,
        quantite: quantite || 0,
        prix: prix || 0
    };

    groupe.articles.push(article);

    sauvegarderGroupes();
    afficherGroupes();

    nomInput.value = "";
    if (quantiteInput) quantiteInput.value = "";
    if (prixInput) prixInput.value = "";

    afficherNotification("Article ajouté avec succès.", "success");
}

/* =========================================================
   10. REMPLIR LA LISTE DES GROUPES
========================================================= */

function remplirSelectGroupes() {
    const select = document.getElementById("articleGroupSelect") || document.getElementById("articleGroup");
    if (!select) return;

    select.innerHTML = `<option value="">-- Sélectionner un groupe --</option>`;

    groupes.forEach(function (groupe) {
        const option = document.createElement("option");
        option.value = groupe.id;
        option.textContent = groupe.nom;
        select.appendChild(option);
    });
}

/* =========================================================
   11. CATÉGORIES DES CALCULS
========================================================= */

function afficherCategoriesCalcul() {
    const container = document.getElementById("dynamicExpenses");
    if (!container) return;

    container.innerHTML = "";

    groupes.forEach(function (groupe) {
        ajouterLigneCalcul(container, groupe.nom, "groupe-" + groupe.id, groupe.id);
    });

    calculerTotal();
}

function ajouterLigneCalcul(container, nom, identifiant, groupeId = null) {
    const ligne = document.createElement("div");
    ligne.className = "expense-row";

    ligne.innerHTML = `
        <div class="expense-label">
            <span class="expense-icon">📁</span>
            <div>
                <strong>${echapperHTML(nom)}</strong>
                <small>Catégorie personnalisée</small>
            </div>
        </div>
        <input type="number" min="0" class="expense-input" data-category="${identifiant}" data-group-id="${groupeId || ""}" placeholder="0">
        <span class="currency">FC</span>
    `;

    container.appendChild(ligne);
}

/* =========================================================
   12. CALCUL DU TOTAL
========================================================= */

function calculerTotal() {
    const inputs = document.querySelectorAll(".expense-input");
    let totalAchats = 0;

    inputs.forEach(function (input) {
        const valeur = Number(input.value) || 0;
        totalAchats += valeur;
    });

    const salesInput = document.getElementById("dailySales");
    const ventes = Number(salesInput ? salesInput.value : 0) || 0;
    const solde = ventes - totalAchats;

    const totalElement = document.getElementById("totalPurchases");
    if (totalElement) {
        totalElement.textContent = formaterMontant(totalAchats);
    }

    const balanceElement = document.getElementById("calculatedBalance");
    if (balanceElement) {
        balanceElement.textContent = formaterMontant(solde);
    }

    return { achats: totalAchats, ventes: ventes, solde: solde };
}

/* =========================================================
   13. ENREGISTRER LE CALCUL DU JOUR
========================================================= */

function enregistrerCalcul() {
    const dateInput = document.getElementById("saleDate") || document.getElementById("calcDate");
    const dayInput = document.getElementById("saleDay") || document.getElementById("calcDay");
    const salesInput = document.getElementById("dailySales");

    if (!dateInput) return;

    const date = dateInput.value;
    const jour = dayInput ? dayInput.value : "";
    const ventes = Number(salesInput ? salesInput.value : 0) || 0;

    const resultat = calculerTotal();

    if (!date) {
        afficherNotification("Veuillez sélectionner une date.", "error");
        return;
    }

    const depenses = {};
    document.querySelectorAll(".expense-input").forEach(function (input) {
        const categorie = input.getAttribute("data-category") || input.name || "divers";
        const valeur = Number(input.value) || 0;
        depenses[categorie] = valeur;
    });

    const nouveauCalcul = {
        id: Date.now(),
        date: date,
        jour: jour,
        achats: resultat.achats,
        ventes: ventes,
        solde: resultat.solde,
        depenses: depenses,
        dateEnregistrement: new Date().toISOString()
    };

    calculs.push(nouveauCalcul);
    sauvegarderCalculs();
    afficherHistorique();
    mettreAJourRapports();

    afficherNotification("Calcul du jour enregistré avec succès.", "success");

    // Reinitialisation des champs de saisie
    document.querySelectorAll(".expense-input").forEach(function (input) { input.value = ""; });
    if (salesInput) salesInput.value = "";
    calculerTotal();
}

/* =========================================================
   14. HISTORIQUE
========================================================= */

function afficherHistorique() {
    const container = document.getElementById("dailyHistory");
    if (!container) return;

    container.innerHTML = "";

    if (calculs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span>📋</span>
                <h3>Aucun enregistrement</h3>
                <p>Vos journées apparaîtront ici.</p>
            </div>
        `;
        return;
    }

    const calculsTries = [...calculs].sort((a, b) => new Date(b.date) - new Date(a.date));

    calculsTries.forEach(function (calcul) {
        const div = document.createElement("div");
        div.className = "history-card";

        div.innerHTML = `
            <div class="card-heading">
                <div>
                    <h2>${echapperHTML(calcul.jour)}</h2>
                    <p>${formaterDate(calcul.date)}</p>
                </div>
                <button type="button" class="delete-button" onclick="supprimerCalcul(${calcul.id})">Supprimer</button>
            </div>
            <div class="summary-grid">
                <div class="summary-card">
                    <span>Achats</span>
                    <strong>${formaterMontant(calcul.achats)} FC</strong>
                </div>
                <div class="summary-card">
                    <span>Ventes</span>
                    <strong>${formaterMontant(calcul.ventes)} FC</strong>
                </div>
                <div class="summary-card">
                    <span>Solde</span>
                    <strong class="${calcul.solde >= 0 ? "positive" : "negative"}">${formaterMontant(calcul.solde)} FC</strong>
                </div>
            </div>
        `;

        container.appendChild(div);
    });
}

/* =========================================================
   15. SUPPRIMER UN CALCUL
========================================================= */

function supprimerCalcul(id) {
    if (!confirm("Voulez-vous supprimer cet enregistrement ?")) return;

    calculs = calculs.filter(function (calcul) { return calcul.id !== id; });

    sauvegarderCalculs();
    afficherHistorique();
    mettreAJourRapports();

    afficherNotification("Enregistrement supprimé.", "success");
}

/* =========================================================
   16. RAPPORTS
========================================================= */

function mettreAJourRapports() {
    const maintenant = new Date();
    let ventesJour = 0;
    let achatsJour = 0;

    calculs.forEach(function (calcul) {
        const dateCalcul = new Date(calcul.date + "T00:00:00");

        if (
            dateCalcul.getFullYear() === maintenant.getFullYear() &&
            dateCalcul.getMonth() === maintenant.getMonth() &&
            dateCalcul.getDate() === maintenant.getDate()
        ) {
            ventesJour += Number(calcul.ventes) || 0;
            achatsJour += Number(calcul.achats) || 0;
        }
    });

    const soldeJour = ventesJour - achatsJour;

    afficherValeur("dailyPurchaseSummary", achatsJour);
    afficherValeur("dailySalesSummary", ventesJour);
    afficherValeur("dailyBalanceSummary", soldeJour);

    calculerRapportSemaine();
    calculerRapportMois();
}

/* =========================================================
   17. RAPPORT DE LA SEMAINE
========================================================= */

function calculerRapportSemaine() {
    const maintenant = new Date();
    const jourSemaine = maintenant.getDay();
    const difference = jourSemaine === 0 ? 6 : jourSemaine - 1;

    const debutSemaine = new Date(maintenant);
    debutSemaine.setDate(maintenant.getDate() - difference);
    debutSemaine.setHours(0, 0, 0, 0);

    let ventes = 0;
    let achats = 0;

    calculs.forEach(function (calcul) {
        const date = new Date(calcul.date + "T00:00:00");
        if (date >= debutSemaine && date <= maintenant) {
            ventes += Number(calcul.ventes) || 0;
            achats += Number(calcul.achats) || 0;
        }
    });

    afficherValeur("weeklyTotal", ventes - achats);
}

/* =========================================================
   18. RAPPORT DU MOIS
========================================================= */

function calculerRapportMois() {
    const maintenant = new Date();
    const mois = maintenant.getMonth();
    const annee = maintenant.getFullYear();

    let ventes = 0;
    let achats = 0;

    calculs.forEach(function (calcul) {
        const date = new Date(calcul.date + "T00:00:00");
        if (date.getMonth() === mois && date.getFullYear() === annee) {
            ventes += Number(calcul.ventes) || 0;
            achats += Number(calcul.achats) || 0;
        }
    });

    afficherValeur("monthlyTotal", ventes - achats);
}

/* =========================================================
   19. ONGLETS ET AFFICHAGES RAPPORTS
========================================================= */

function initialiserOngletsRapports() {
    const boutons = document.querySelectorAll(".report-tab");
    boutons.forEach(function (bouton) {
        bouton.addEventListener("click", function () {
            boutons.forEach(function (b) { b.classList.remove("active"); });
            bouton.classList.add("active");
        });
    });
}

/* =========================================================
   20. SAUVEGARDE ET UTILITAIRES
========================================================= */

function sauvegarderGroupes() {
    localStorage.setItem("jossell_groupes", JSON.stringify(groupes));
}

function sauvegarderCalculs() {
    localStorage.setItem("jossell_calculs", JSON.stringify(calculs));
}

function formaterMontant(nombre) {
    return Number(nombre || 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 });
}

function formaterDate(date) {
    return new Date(date + "T00:00:00").toLocaleDateString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric"
    });
}

function afficherValeur(id, valeur) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = formaterMontant(valeur);
    }
}

function afficherNotification(message, type = "success") {
    let container = document.getElementById("notificationContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "notificationContainer";
        container.style.position = "fixed";
        container.style.bottom = "20px";
        container.style.right = "20px";
        container.style.zIndex = "9999";
        document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.className = "notification " + type;
    notification.textContent = message;
    notification.style.background = type === "success" ? "#10b981" : "#ef4444";
    notification.style.color = "#ffffff";
    notification.style.padding = "12px 20px";
    notification.style.borderRadius = "8px";
    notification.style.marginTop = "10px";
    notification.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";

    container.appendChild(notification);

    setTimeout(function () {
        notification.remove();
    }, 3000);
}

function echapperHTML(texte) {
    const div = document.createElement("div");
    div.textContent = texte == null ? "" : String(texte);
    return div.innerHTML;
}