<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>JoSell - Achat, Vente & Sécurité</title>

  <!-- Configuration PWA -->
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#0a3d62">

  <!-- Liaison avec le fichier CSS -->
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Conteneur Mobile -->
  <div class="app-container">

    <header>
      <h1>JoSell</h1>
    </header>

    <!-- 1. FORMULAIRE D'INSCRIPTION / CONNEXION CLIENT -->
    <div class="card" id="auth-section">
      <h2>Inscription Rapide</h2>
      <form id="signup-form">
        <input type="text" placeholder="Nom" required>
        <input type="text" placeholder="Postnom">
        <input type="text" placeholder="Prénom" required>
        <input type="tel" placeholder="N° Téléphone (+243...)" required>
        <input type="tel" placeholder="N° Orange Money" required>
        <input type="tel" placeholder="N° WhatsApp (Optionnel)">
        <input type="email" placeholder="Adresse Gmail" required>
        <input type="password" placeholder="Mot de passe" required>
        <button type="submit">Se connecter / S'inscrire</button>
      </form>
    </div>

    <!-- 2. CATALOGUE PRODUITS (VUE CLIENT) -->
    <div class="card">
      <h2>Produits Disponibles</h2>
      <div class="grid-products">
        <div class="product-card">
          <img src="https://via.placeholder.com/150" alt="Produit">
          <h4>Nom du Produit</h4>
          <p class="price">15 000 FC</p>
          <button>Acheter (Séquestre)</button>
        </div>
      </div>
    </div>

    <!-- 3. ESPACE VENDEUR (MARKETING & WALLET) -->
    <div class="card">
      <h2>Espace Vendeur</h2>
      <p>Solde Séquestre : <strong>0 FC</strong></p>
      <p>Solde Disponible : <strong>0 FC</strong></p>
      <button style="margin-top:10px;">Ajouter un Produit</button>
      <button class="btn-wa" style="margin-top:10px;">Partager ma Boutique sur WhatsApp</button>
    </div>

    <!-- 4. PANNEAU ADMIN (ACCUEIL WHATSAPP DIRECT) -->
    <div class="card">
      <h2>Admin - Nouveaux Clients</h2>
      <div style="display:flex; justify-scale:space-between; align-items:center;">
        <div>
          <strong>Jean-Paul KABANGU</strong><br>
          <small>+243810000000</small>
        </div>
        <a href="https://wa.me/243810000000?text=Bonjour%20Jean-Paul,%20bienvenue%20sur%20JoSell%20!" target="_blank" style="text-decoration:none;">
          <button class="btn-wa" style="width:auto; padding:0 10px; height:38px;">WhatsApp</button>
        </a>
      </div>
    </div>

  </div>

  <!-- NOUVEAU SCRIPT SIMPLIFIÉ (STOCKAGE LOCAL) -->
  <script>
    // Enregistrement de l'application PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    // Gestion de l'inscription / connexion
    document.getElementById('signup-form').addEventListener('submit', function(e) {
      e.preventDefault();

      // 1. Récupération des données saisies
      const client = {
        nom: e.target[0].value,
        postnom: e.target[1].value,
        prenom: e.target[2].value,
        telephone: e.target[3].value,
        orange_money: e.target[4].value,
        whatsapp: e.target[5].value,
        email: e.target[6].value,
        password: e.target[7].value
      };

      // 2. Sauvegarde dans la mémoire du téléphone (localStorage)
      localStorage.setItem('user_josell', JSON.stringify(client));

      // 3. Message de réussite
      alert('Bienvenue sur JoSell ' + client.prenom + ' ! Inscription réussie.');
      
      // Masquer le formulaire une fois inscrit
      document.getElementById('auth-section').style.display = 'none';
    });

    // Au chargement : Vérifier si l'utilisateur est déjà inscrit
    window.addEventListener('DOMContentLoaded', function() {
      const userExiste = localStorage.getItem('user_josell');
      if (userExiste) {
        document.getElementById('auth-section').style.display = 'none';
      }
    });
  </script>

</body>
</html>