class ArmesManager {
    constructor() {
        this.baseURL = 'http://localhost:8800/api/v1';
        this.init();
    }

    init() {
        this.checkAPIStatus();
        this.loadArmes();
        this.setupEventListeners();
    }

    async checkAPIStatus() {
        try {
            const response = await fetch(`${this.baseURL}/armes/`);
            const statusElement = document.getElementById('api-status');

            if (response.ok) {
                statusElement.textContent = 'En ligne';
                statusElement.className = 'status online';
            } else {
                statusElement.textContent = 'Erreur';
                statusElement.className = 'status offline';
            }
        } catch (error) {
            const statusElement = document.getElementById('api-status');
            statusElement.textContent = 'Hors ligne';
            statusElement.className = 'status offline';
            console.error('Erreur de connexion à l\'API:', error);
        }
    }

    async loadArmes() {
        const tbody = document.getElementById('armes-tbody');
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Chargement des données...</td></tr>';

        try {
            const response = await fetch(`${this.baseURL}/armes/`);
            if (!response.ok) throw new Error('Erreur lors du chargement des données');

            const armes = await response.json();
            this.displayArmes(armes);
            this.updateStats(armes);
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="7" style="color: #e53e3e; text-align: center; padding: 40px;">
                ❌ Erreur lors du chargement des données: ${error.message}
            </td></tr>`;
            console.error('Erreur:', error);
        }
    }

    displayArmes(armes) {
        const tbody = document.getElementById('armes-tbody');

        if (armes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">Aucune arme trouvée</td></tr>';
            return;
        }

        tbody.innerHTML = armes.map(arme => `
            <tr>
                <td>${arme.id}</td>
                <td><strong>${arme.nom_fr}</strong></td>
                <td>${arme.nom_jp}</td>
                <td>${arme.robot_id}</td>
                <td>${arme.puissance || '-'}</td>
                <td>
                    ${arme.frequence_utilisation ?
            `<span class="badge ${this.getFrequenceClass(arme.frequence_utilisation)}">
                            ${arme.frequence_utilisation}
                        </span>` :
            '-'
        }
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-success btn-sm" onclick="armesManager.editArme(${arme.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="armesManager.deleteArme(${arme.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="armesManager.showDetails(${arme.id})">
                            <i class="fas fa-info"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getFrequenceClass(frequence) {
        const classes = {
            'Très Fréquente': 'badge-frequent',
            'Fréquente': 'badge-frequent',
            'Occasionnelle': '',
            'Assez Rare': 'badge-rare',
            'Rare': 'badge-rare',
            'Très Rare': 'badge-rare'
        };
        return classes[frequence] || '';
    }

    updateStats(armes) {
        document.getElementById('total-armes').textContent = armes.length;
    }

    async addArme(armeData) {
        try {
            const response = await fetch(`${this.baseURL}/armes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(armeData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de l\'ajout');
            }

            alert('✅ Arme ajoutée avec succès!');
            this.loadArmes();
            this.resetAddForm();
            return result;
        } catch (error) {
            alert(`❌ Erreur: ${error.message}`);
            console.error('Erreur:', error);
            throw error;
        }
    }

    async updateArme(id, armeData) {
        try {
            const response = await fetch(`${this.baseURL}/armes/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(armeData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de la mise à jour');
            }

            alert('✅ Arme mise à jour avec succès!');
            this.loadArmes();
            this.closeEditModal();
            return result;
        } catch (error) {
            alert(`❌ Erreur: ${error.message}`);
            console.error('Erreur:', error);
            throw error;
        }
    }

    async deleteArme(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette arme ?')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/armes/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Erreur lors de la suppression');
            }

            alert('✅ Arme supprimée avec succès!');
            this.loadArmes();
        } catch (error) {
            alert(`❌ Erreur: ${error.message}`);
            console.error('Erreur:', error);
        }
    }

    async editArme(id) {
        try {
            const response = await fetch(`${this.baseURL}/armes/${id}`);
            if (!response.ok) throw new Error('Arme non trouvée');

            const arme = await response.json();
            this.openEditModal(arme);
        } catch (error) {
            alert(`❌ Erreur: ${error.message}`);
            console.error('Erreur:', error);
        }
    }

    async showDetails(id) {
        try {
            const response = await fetch(`${this.baseURL}/armes/${id}`);
            if (!response.ok) throw new Error('Arme non trouvée');

            const arme = await response.json();

            let details = `
                <strong>ID:</strong> ${arme.id}<br>
                <strong>Nom FR:</strong> ${arme.nom_fr}<br>
                <strong>Nom JP:</strong> ${arme.nom_jp}<br>
                <strong>Robot ID:</strong> ${arme.robot_id}<br>
                <strong>Puissance:</strong> ${arme.puissance || 'Non spécifiée'}<br>
                <strong>Fréquence:</strong> ${arme.frequence_utilisation || 'Non spécifiée'}<br>
            `;

            if (arme.description) {
                details += `<strong>Description:</strong><br>${arme.description}`;
            }

            alert(details);
        } catch (error) {
            alert(`❌ Erreur: ${error.message}`);
            console.error('Erreur:', error);
        }
    }

    openEditModal(arme) {
        document.getElementById('edit-id').value = arme.id;
        document.getElementById('edit-nom_fr').value = arme.nom_fr;
        document.getElementById('edit-nom_jp').value = arme.nom_jp;
        document.getElementById('edit-robot_id').value = arme.robot_id;
        document.getElementById('edit-puissance').value = arme.puissance || '';
        document.getElementById('edit-frequence_utilisation').value = arme.frequence_utilisation || '';
        document.getElementById('edit-description').value = arme.description || '';

        const modal = document.getElementById('edit-modal');
        modal.classList.add('active');
    }

    closeEditModal() {
        const modal = document.getElementById('edit-modal');
        modal.classList.remove('active');
        document.getElementById('edit-form').reset();
    }

    resetAddForm() {
        document.getElementById('add-form').reset();
    }

    setupEventListeners() {
        // Formulaire d'ajout
        document.getElementById('add-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const armeData = {
                nom_fr: document.getElementById('nom_fr').value,
                nom_jp: document.getElementById('nom_jp').value,
                robot_id: parseInt(document.getElementById('robot_id').value),
                puissance: document.getElementById('puissance').value || null,
                frequence_utilisation: document.getElementById('frequence_utilisation').value || null,
                description: document.getElementById('description').value || null
            };

            await this.addArme(armeData);
        });

        // Formulaire d'édition
        document.getElementById('edit-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('edit-id').value;
            const armeData = {
                nom_fr: document.getElementById('edit-nom_fr').value,
                nom_jp: document.getElementById('edit-nom_jp').value,
                robot_id: parseInt(document.getElementById('edit-robot_id').value),
                puissance: document.getElementById('edit-puissance').value || null,
                frequence_utilisation: document.getElementById('edit-frequence_utilisation').value || null,
                description: document.getElementById('edit-description').value || null
            };

            await this.updateArme(id, armeData);
        });

        // Bouton d'actualisation
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadArmes();
            this.checkAPIStatus();
        });

        // Fermer le modal
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeEditModal();
            });
        });

        // Fermer le modal avec ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEditModal();
            }
        });

        // Fermer le modal en cliquant en dehors
        document.getElementById('edit-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('edit-modal')) {
                this.closeEditModal();
            }
        });
    }
}

// Initialiser l'application
const armesManager = new ArmesManager();

// Exposer au scope global pour les événements onclick
window.armesManager = armesManager;

// Charger les données au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    armesManager.loadArmes();
});