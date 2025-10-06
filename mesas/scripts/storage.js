// Local Storage and Data Persistence
class StorageManager {
    constructor() {
        this.storageKey = 'seatingPlanData';
        this.layoutKey = 'seatingPlanLayout';
    }

    // Save complete application state
    saveState(guests, tables) {
        const state = {
            guests: guests,
            tables: this.serializeTables(tables),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(state));
            return true;
        } catch (error) {
            console.error('Error saving state:', error);
            return false;
        }
    }

    // Load complete application state
    loadState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const state = JSON.parse(saved);
                return {
                    guests: state.guests || [],
                    tables: state.tables || {},
                    timestamp: state.timestamp,
                    version: state.version
                };
            }
        } catch (error) {
            console.error('Error loading state:', error);
        }
        return null;
    }

    // Save just the layout (guest assignments)
    saveLayout(guests) {
        const layout = {
            assignments: guests.map(guest => ({
                id: guest.id,
                tableId: guest.tableId
            })),
            timestamp: new Date().toISOString()
        };

        try {
            localStorage.setItem(this.layoutKey, JSON.stringify(layout));
            return true;
        } catch (error) {
            console.error('Error saving layout:', error);
            return false;
        }
    }

    // Load just the layout
    loadLayout() {
        try {
            const saved = localStorage.getItem(this.layoutKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading layout:', error);
        }
        return null;
    }

    // Export data as JSON file
    exportToFile(data, filename = 'seating-plan.json') {
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Import data from JSON file
    importFromFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            resolve(data);
                        } catch (error) {
                            reject(error);
                        }
                    };
                    reader.readAsText(file);
                }
            };

            input.click();
        });
    }

    // Serialize tables for storage (remove DOM references)
    serializeTables(tables) {
        const serialized = {};
        Object.keys(tables).forEach(key => {
            const table = tables[key];
            serialized[key] = {
                id: table.id,
                capacity: table.capacity,
                name: table.name,
                guests: table.guests
            };
        });
        return serialized;
    }

    // Get storage usage info
    getStorageInfo() {
        try {
            const used = new Blob([localStorage.getItem(this.storageKey) || '']).size;
            const layoutUsed = new Blob([localStorage.getItem(this.layoutKey) || '']).size;
            
            return {
                totalUsed: used + layoutUsed,
                stateSize: used,
                layoutSize: layoutUsed,
                available: this.getAvailableStorage()
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    // Estimate available storage space
    getAvailableStorage() {
        try {
            const testKey = 'storageTest';
            const testData = '0'.repeat(1024); // 1KB
            let available = 0;

            while (available < 10240) { // Max 10MB test
                try {
                    localStorage.setItem(testKey + available, testData);
                    available += 1024;
                } catch (e) {
                    break;
                }
            }

            // Clean up test data
            for (let i = 0; i < available; i += 1024) {
                localStorage.removeItem(testKey + i);
            }

            return available;
        } catch (error) {
            return 0;
        }
    }

    // Clear all stored data
    clearStorage() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.layoutKey);
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // Auto-save functionality
    setupAutoSave(app, intervalMinutes = 5) {
        setInterval(() => {
            if (app && app.guests) {
                this.saveState(app.guests, app.tables);
                console.log('Auto-saved at', new Date().toLocaleTimeString());
            }
        }, intervalMinutes * 60 * 1000);
    }
}

// Enhanced export functionality
class ExportManager {
    constructor() {
        this.storageManager = new StorageManager();
    }

    // Export to CSV format
    exportToCSV(guests, tables) {
        let csv = 'Nombre,Tipo,Dieta,Mesa,Capacidad Mesa,Ocupacion Mesa\n';

        guests.forEach(guest => {
            const table = guest.tableId ? tables[guest.tableId] : null;
            const tableName = table ? table.name : 'Sin asignar';
            const tableCapacity = table ? table.capacity : '';
            const tableOccupation = table ? 
                guests.filter(g => g.tableId === guest.tableId).length : '';

            csv += `"${guest.name}","${guest.type}","${guest.diet || ''}","${tableName}","${tableCapacity}","${tableOccupation}"\n`;
        });

        this.downloadFile(csv, 'seating-plan.csv', 'text/csv');
    }

    // Export table summary
    exportTableSummary(guests, tables) {
        let summary = 'Mesa,Capacidad,Ocupados,Disponibles,Invitados\n';

        Object.values(tables).forEach(table => {
            const assignedGuests = guests.filter(g => g.tableId === table.id);
            const guestNames = assignedGuests.map(g => g.name).join('; ');
            
            summary += `"${table.name}","${table.capacity}","${assignedGuests.length}","${table.capacity - assignedGuests.length}","${guestNames}"\n`;
        });

        this.downloadFile(summary, 'table-summary.csv', 'text/csv');
    }

    // Export to print-friendly HTML
    exportToPrintHTML(guests, tables) {
        const assignedGuests = guests.filter(g => g.tableId);
        const unassignedGuests = guests.filter(g => !g.tableId);

        let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Plan de Asientos - Boda</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .table-section { margin-bottom: 20px; }
        .table-name { font-weight: bold; color: #333; }
        .guest-list { margin: 10px 0; padding-left: 20px; }
        .unassigned { margin-top: 30px; padding: 15px; background: #f5f5f5; }
        .stats { background: #e9ecef; padding: 15px; margin: 20px 0; }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Plan de Asientos - Boda</h1>
        <p>Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
    </div>

    <div class="stats">
        <h3>Resumen</h3>
        <p><strong>Total de invitados:</strong> ${guests.length}</p>
        <p><strong>Invitados asignados:</strong> ${assignedGuests.length}</p>
        <p><strong>Sin asignar:</strong> ${unassignedGuests.length}</p>
        <p><strong>Total de mesas:</strong> ${Object.keys(tables).length}</p>
    </div>
`;

        // Add table assignments
        Object.values(tables).forEach(table => {
            const tableGuests = guests.filter(g => g.tableId === table.id);
            html += `
    <div class="table-section">
        <div class="table-name">${table.name} (${tableGuests.length}/${table.capacity})</div>
        <div class="guest-list">
`;
            tableGuests.forEach(guest => {
                html += `            <div>• ${guest.name} (${guest.type})${guest.diet ? ' - ' + guest.diet : ''}</div>\n`;
            });
            html += `        </div>
    </div>
`;
        });

        // Add unassigned guests
        if (unassignedGuests.length > 0) {
            html += `
    <div class="unassigned">
        <h3>Invitados sin asignar (${unassignedGuests.length})</h3>
`;
            unassignedGuests.forEach(guest => {
                html += `        <div>• ${guest.name} (${guest.type})${guest.diet ? ' - ' + guest.diet : ''}</div>\n`;
            });
            html += '    </div>\n';
        }

        html += `
    <div class="no-print" style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()">Imprimir</button>
    </div>
</body>
</html>`;

        this.downloadFile(html, 'seating-plan.html', 'text/html');
    }

    // Helper method to download files
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Initialize storage and export managers
document.addEventListener('DOMContentLoaded', () => {
    window.storageManager = new StorageManager();
    window.exportManager = new ExportManager();
});