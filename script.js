/* ==========================================================================
   JOSSELL - MA GESTION (Fichier JavaScript Complet)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- ÉTATS & DONNÉES (Stockées dans localStorage) ---
  let groups = JSON.parse(localStorage.getItem('jossell_groups')) || [
    { id: 'g1', name: 'Vivre frais', description: 'Nourriture & Vivres' },
    { id: 'g2', name: 'Boissons', description: 'Jus & Rafraîchissements' }
  ];

  let articles = JSON.parse(localStorage.getItem('jossell_articles')) || [];
  let dailyRecords = JSON.parse(localStorage.getItem('jossell_records')) || [];

  // --- SÉLECTEURS DU DOM ---
  const loadingScreen = document.getElementById('loadingScreen');
  const mainNav = document.getElementById('mainNavigation');
  const pages = document.querySelectorAll('.page');
  const notificationContainer = document.getElementById('notificationContainer');

  // Dates
  const currentDateEl = document.getElementById('currentDate');
  const saleDateInput = document.getElementById('saleDate');
  const saleDayInput = document.getElementById('saleDay');

  // Formulaire Calculateur
  const dailyForm = document.getElementById('dailyForm');
  const dailySalesInput = document.getElementById('dailySales');
  const dynamicExpensesDiv = document.getElementById('dynamicExpenses');
  const totalPurchasesEl = document.getElementById('totalPurchases');
  const calculatedBalanceEl = document.getElementById('calculatedBalance');
  const dailyHistoryDiv = document.getElementById('dailyHistory');

  // Formulaires Groupes & Articles
  const articleGroupForm = document.getElementById('articleGroupForm');
  const groupNameInput = document.getElementById('groupName');
  const groupDescInput = document.getElementById('groupDescription');
  const articleForm = document.getElementById('articleForm');
  const articleGroupSelect = document.getElementById('articleGroupSelect');
  const articleNameInput = document.getElementById('articleName');
  const articleQtyInput = document.getElementById('articleQuantity');
  const articlePriceInput = document.getElementById('articlePrice');
  const articlesListDiv = document.getElementById('articlesList');

  // Résumés Accueil & Rapports
  const dailySalesSummary = document.getElementById('dailySalesSummary');
  const dailyPurchaseSummary = document.getElementById('dailyPurchaseSummary');
  const dailyBalanceSummary = document.getElementById('dailyBalanceSummary');
  const weeklyTotalEl = document.getElementById('weeklyTotal');
  const monthlyTotalEl = document.getElementById('monthlyTotal');

  // --- INITIALISATION ---
  function initApp() {
    // Masquer le chargement
    setTimeout(() => {
      if (loadingScreen) loadingScreen.style.display = 'none';
    }, 400);

    // Date du jour par défaut
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    if (saleDateInput) {
      saleDateInput.value = formattedToday;
      updateDayOfWeek(formattedToday);
    }

    if (currentDateEl) {
      currentDateEl.textContent = today.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }

    // Charger les composants
    renderDynamicExpenses();
    renderGroupOptions();
    renderArticlesAndGroups();
    renderDailyHistory();
    updateDashboardSummaries();
    setupNavigation();
  }

  // --- NAVIGATION ENTRE PAGES ---
  function setupNavigation() {
    document.querySelectorAll('[data-page]').forEach(button => {
      button.addEventListener('click', (e) => {
        const targetPage = button.getAttribute('data-page');

        // Mettre à jour la navigation
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-page="${targetPage}"]`);
        if (activeNav) activeNav.classList.add('active');

        // Afficher la page ciblée
        pages.forEach(page => {
          if (page.id === `page-${targetPage}`) {
            page.classList.add('active-page');
          } else {
            page.classList.remove('active-page');
          }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // --- NOTIFICATIONS ---
  function showNotification(message, type = 'success') {
    if (!notificationContainer) return;
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      margin-bottom: 10px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    `;
    toast.textContent = message;
    notificationContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // --- CALCULATEUR & JOURNÉE ---
  if (saleDateInput) {
    saleDateInput.addEventListener('change', (e) => {
      updateDayOfWeek(e.target.value);
    });
  }

  function updateDayOfWeek(dateString) {
    if (!dateString) return;
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dateObj = new Date(dateString);
    if (saleDayInput) {
      saleDayInput.value = days[dateObj.getDay()];
    }
  }

  // Générer les champs de dépenses dynamiques selon les groupes créés
  function renderDynamicExpenses() {
    if (!dynamicExpensesDiv) return;
    dynamicExpensesDiv.innerHTML = '';

    if (groups.length === 0) {
      dynamicExpensesDiv.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Aucune catégorie trouvée. Ajoutez un groupe pour détailler vos dépenses.</p>';
      return;
    }

    groups.forEach(group => {
      const row = document.createElement('div');
      row.className = 'expense-row';
      row.innerHTML = `
        <label for="exp-${group.id}" style="font-weight: 600; font-size: 0.9rem;">${group.name}</label>
        <input type="number" id="exp-${group.id}" class="expense-input" data-group-id="${group.id}" min="0" placeholder="0 FC">
      `;
      dynamicExpensesDiv.appendChild(row);
    });

    // Écouter les changements pour le calcul automatique
    document.querySelectorAll('.expense-input').forEach(input => {
      input.addEventListener('input', calculateDailyTotals);
    });
  }

  if (dailySalesInput) {
    dailySalesInput.addEventListener('input', calculateDailyTotals);
  }

  function calculateDailyTotals() {
    const sales = parseFloat(dailySalesInput.value) || 0;
    let purchases = 0;

    document.querySelectorAll('.expense-input').forEach(input => {
      purchases += parseFloat(input.value) || 0;
    });

    const balance = sales - purchases;

    if (totalPurchasesEl) totalPurchasesEl.textContent = `${purchases.toLocaleString('fr-FR')} FC`;
    if (calculatedBalanceEl) {
      calculatedBalanceEl.textContent = `${balance.toLocaleString('fr-FR')} FC`;
      calculatedBalanceEl.className = balance >= 0 ? 'positive' : 'negative';
    }

    return { sales, purchases, balance };
  }

  // Enregistrement de la journée
  if (dailyForm) {
    dailyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const totals = calculateDailyTotals();
      const dateVal = saleDateInput.value;
      const dayVal = saleDayInput.value;

      if (!dateVal) {
        showNotification('Veuillez sélectionner une date.', 'danger');
        return;
      }

      // Récupération du détail des dépenses
      const expenseDetails = {};
      document.querySelectorAll('.expense-input').forEach(input => {
        const groupId = input.getAttribute('data-group-id');
        expenseDetails[groupId] = parseFloat(input.value) || 0;
      });

      const newRecord = {
        id: Date.now().toString(),
        date: dateVal,
        day: dayVal,
        sales: totals.sales,
        purchases: totals.purchases,
        balance: totals.balance,
        details: expenseDetails
      };

      // Remplacer si enregistrement existant à la même date
      const existingIndex = dailyRecords.findIndex(r => r.date === dateVal);
      if (existingIndex !== -1) {
        dailyRecords[existingIndex] = newRecord;
      } else {
        dailyRecords.unshift(newRecord);
      }

      localStorage.setItem('jossell_records', JSON.stringify(dailyRecords));
      showNotification('Journée enregistrée avec succès !');

      // Réinitialiser le formulaire
      dailySalesInput.value = '';
      document.querySelectorAll('.expense-input').forEach(i => i.value = '');
      calculateDailyTotals();

      // Mettre à jour l'affichage
      renderDailyHistory();
      updateDashboardSummaries();
    });
  }

  // Afficher l'historique
  function renderDailyHistory() {
    if (!dailyHistoryDiv) return;
    dailyHistoryDiv.innerHTML = '';

    if (dailyRecords.length === 0) {
      dailyHistoryDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 10px;">Aucun enregistrement pour le moment.</p>';
      return;
    }

    dailyRecords.forEach(rec => {
      const div = document.createElement('div');
      div.style.cssText = 'background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;';
      div.innerHTML = `
        <div>
          <strong>${rec.day} (${rec.date})</strong>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
            Ventes: ${rec.sales.toLocaleString('fr-FR')} FC | Achats: ${rec.purchases.toLocaleString('fr-FR')} FC
          </div>
        </div>
        <div style="text-align: right;">
          <span class="${rec.balance >= 0 ? 'positive' : 'negative'}" style="font-weight: 700; font-size: 1rem; display: block;">
            ${rec.balance.toLocaleString('fr-FR')} FC
          </span>
          <button class="delete-button" onclick="deleteRecord('${rec.id}')" style="margin-top: 4px;">Supprimer</button>
        </div>
      `;
      dailyHistoryDiv.appendChild(div);
    });
  }

  window.deleteRecord = function(id) {
    dailyRecords = dailyRecords.filter(r => r.id !== id);
    localStorage.setItem('jossell_records', JSON.stringify(dailyRecords));
    renderDailyHistory();
    updateDashboardSummaries();
    showNotification('Enregistrement supprimé.');
  };

  // --- GESTION DES GROUPES & ARTICLES ---
  if (articleGroupForm) {
    articleGroupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = groupNameInput.value.trim();
      const desc = groupDescInput.value.trim();

      if (!name) return;

      const newGroup = {
        id: 'g_' + Date.now(),
        name: name,
        description: desc
      };

      groups.push(newGroup);
      localStorage.setItem('jossell_groups', JSON.stringify(groups));

      groupNameInput.value = '';
      groupDescInput.value = '';

      renderGroupOptions();
      renderDynamicExpenses();
      renderArticlesAndGroups();
      showNotification('Nouveau groupe ajouté !');
    });
  }

  function renderGroupOptions() {
    if (!articleGroupSelect) return;
    articleGroupSelect.innerHTML = '<option value="">-- Sélectionner un groupe --</option>';
    groups.forEach(group => {
      const option = document.createElement('option');
      option.value = group.id;
      option.textContent = group.name;
      articleGroupSelect.appendChild(option);
    });
  }

  if (articleForm) {
    articleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const groupId = articleGroupSelect.value;
      const name = articleNameInput.value.trim();
      const qty = parseInt(articleQtyInput.value) || 0;
      const price = parseFloat(articlePriceInput.value) || 0;

      if (!groupId || !name) {
        showNotification('Veuillez sélectionner un groupe et saisir un nom.', 'danger');
        return;
      }

      const newArticle = {
        id: 'a_' + Date.now(),
        groupId: groupId,
        name: name,
        quantity: qty,
        price: price
      };

      articles.push(newArticle);
      localStorage.setItem('jossell_articles', JSON.stringify(articles));

      articleNameInput.value = '';
      articleQtyInput.value = '';
      articlePriceInput.value = '';

      renderArticlesAndGroups();
      showNotification('Article ajouté avec succès !');
    });
  }

  function renderArticlesAndGroups() {
    if (!articlesListDiv) return;
    articlesListDiv.innerHTML = '';

    if (groups.length === 0) {
      articlesListDiv.innerHTML = '<p style="color: var(--text-muted);">Aucun groupe disponible.</p>';
      return;
    }

    groups.forEach(group => {
      const groupArticles = articles.filter(a => a.groupId === group.id);
      const groupBlock = document.createElement('div');
      groupBlock.style.cssText = 'background: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 14px;';

      let articlesHTML = '';
      if (groupArticles.length === 0) {
        articlesHTML = '<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px;">Aucun article dans ce groupe.</p>';
      } else {
        articlesHTML = groupArticles.map(art => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed var(--border-color); font-size: 0.9rem;">
            <span><strong>${art.name}</strong> (${art.quantity} en stock)</span>
            <div>
              <span style="color: var(--primary); font-weight: 600; margin-right: 10px;">${art.price.toLocaleString('fr-FR')} FC</span>
              <button class="delete-button" onclick="deleteArticle('${art.id}')">✕</button>
            </div>
          </div>
        `).join('');
      }

      groupBlock.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--bg-color); padding-bottom: 8px;">
          <h4 style="color: var(--primary); font-size: 1rem;">📁 ${group.name}</h4>
          <button class="delete-button" onclick="deleteGroup('${group.id}')">Supprimer groupe</button>
        </div>
        ${group.description ? `<p style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0 8px 0;">${group.description}</p>` : ''}
        ${articlesHTML}
      `;

      articlesListDiv.appendChild(groupBlock);
    });
  }

  window.deleteGroup = function(groupId) {
    groups = groups.filter(g => g.id !== groupId);
    articles = articles.filter(a => a.groupId !== groupId);
    localStorage.setItem('jossell_groups', JSON.stringify(groups));
    localStorage.setItem('jossell_articles', JSON.stringify(articles));

    renderGroupOptions();
    renderDynamicExpenses();
    renderArticlesAndGroups();
    showNotification('Groupe supprimé.');
  };

  window.deleteArticle = function(articleId) {
    articles = articles.filter(a => a.id !== articleId);
    localStorage.setItem('jossell_articles', JSON.stringify(articles));
    renderArticlesAndGroups();
    showNotification('Article supprimé.');
  };

  // --- RAPPORTS & RECAPITULATIFS ---
  function updateDashboardSummaries() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecord = dailyRecords.find(r => r.date === todayStr);

    if (todayRecord) {
      if (dailySalesSummary) dailySalesSummary.textContent = `${todayRecord.sales.toLocaleString('fr-FR')} FC`;
      if (dailyPurchaseSummary) dailyPurchaseSummary.textContent = `${todayRecord.purchases.toLocaleString('fr-FR')} FC`;
      if (dailyBalanceSummary) {
        dailyBalanceSummary.textContent = `${todayRecord.balance.toLocaleString('fr-FR')} FC`;
        dailyBalanceSummary.className = todayRecord.balance >= 0 ? 'positive' : 'negative';
      }
    } else {
      if (dailySalesSummary) dailySalesSummary.textContent = '0 FC';
      if (dailyPurchaseSummary) dailyPurchaseSummary.textContent = '0 FC';
      if (dailyBalanceSummary) {
        dailyBalanceSummary.textContent = '0 FC';
        dailyBalanceSummary.className = 'positive';
      }
    }

    // Calcul semaine et mois
    const now = new Date();
    let weeklyBalance = 0;
    let monthlyBalance = 0;

    dailyRecords.forEach(rec => {
      const recDate = new Date(rec.date);
      const diffDays = Math.floor((now - recDate) / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) weeklyBalance += rec.balance;
      if (recDate.getMonth() === now.getMonth() && recDate.getFullYear() === now.getFullYear()) {
        monthlyBalance += rec.balance;
      }
    });

    if (weeklyTotalEl) {
      weeklyTotalEl.textContent = `${weeklyBalance.toLocaleString('fr-FR')} FC`;
      weeklyTotalEl.className = weeklyBalance >= 0 ? 'positive' : 'negative';
    }
    if (monthlyTotalEl) {
      monthlyTotalEl.textContent = `${monthlyBalance.toLocaleString('fr-FR')} FC`;
      monthlyTotalEl.className = monthlyBalance >= 0 ? 'positive' : 'negative';
    }
  }

  // Lancement de l'application
  initApp();

});