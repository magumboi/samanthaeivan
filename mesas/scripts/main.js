// Main application logic
class SeatingPlanApp {
    constructor() {
        this.guests = [];
        this.tables = {};
        this.selectedTable = null;
        this.guestIdCounter = 1;
        this.isDragging = false;
        
        this.initializeApp();
        this.bindEvents();
        this.loadSampleData();
        this.setupTableDisplay();
        this.loadTablePositions();
        this.setupTableDragging();
        this.setupKeyboardShortcuts();
        // this.setupZoomControls(); // Controles removidos
        
        // Instrucciones para debugging
        console.log('🎯 DRAG AND DROP ACTIVADO');
        console.log('📍 Mueve las mesas y las coordenadas se imprimirán automáticamente');
        console.log('⌨️  Presiona "P" para imprimir todas las coordenadas actuales');
    }

    initializeApp() {
        // Initialize tables
        document.querySelectorAll('.table').forEach(table => {
            const tableId = table.dataset.tableId;
            const capacity = parseInt(table.dataset.capacity);
            
            this.tables[tableId] = {
                id: tableId,
                element: table,
                capacity: capacity,
                guests: [],
                name: table.querySelector('.table-label').textContent
            };

            // Create seats visualization
            this.createSeatsVisualization(table, capacity);
            
            // Make table draggable with custom system (not HTML5 drag)
            table.draggable = false;
            table.style.position = 'absolute';
            table.style.cursor = 'move';
            
            // Create status indicator
            const statusDiv = document.createElement('div');
            statusDiv.className = 'table-status empty';
            table.appendChild(statusDiv);
            
            // El click para modal se manejará en setupTableDragging para evitar conflictos
        });

        this.updateGuestList();
    }

    setupTableDisplay() {
        // Update table display when guests change
        this.updateAllTablesDisplay();
        this.updateSidebar();
    }



    highlightTable(tableId) {
        // Remove previous highlights
        document.querySelectorAll('.table').forEach(table => {
            table.classList.remove('highlighted');
        });

        // Highlight selected table
        const table = document.querySelector(`[data-table-id="${tableId}"]`);
        if (table) {
            table.classList.add('highlighted');
        }
    }

    setupZoomControls() {
        this.currentZoom = 1;
        this.currentPanX = 0;
        this.currentPanY = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.panSpeed = 50;
        this.zoomSpeed = 0.2;
        this.animationDuration = 300;

        const layoutContainer = document.querySelector('.layout-container');

        // Funcionalidad de zoom por rueda del mouse
        this.setupWheelZoom(layoutContainer);
        
        // Funcionalidad de arrastre para pan
        this.setupDragPan(layoutContainer);
        
        // Doble click para resetear zoom
        this.setupDoubleClickReset(layoutContainer);
        
        // Controles de zoom discretos
        this.setupZoomControls();
        
        // Manejo de orientación móvil
        this.setupMobileOrientation();
    }

    bindButton(id, callback) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', callback);
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case '+':
                case '=':
                    e.preventDefault();
                    this.zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    this.zoomOut();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.pan(0, this.panSpeed);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.pan(0, -this.panSpeed);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.pan(this.panSpeed, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.pan(-this.panSpeed, 0);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.resetZoom();
                    break;
                case ' ':
                    e.preventDefault();
                    this.fitToScreen();
                    break;
                case 'p':
                case 'P':
                    e.preventDefault();
                    this.printAllTableCoordinates();
                    break;
            }
        });
    }

    setupPanControls(layoutContainer) {
        layoutContainer.style.cursor = 'grab';
        
        layoutContainer.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('table') || e.target.closest('.table')) {
                return;
            }
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            layoutContainer.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMouseX;
                const deltaY = e.clientY - this.lastMouseY;
                
                this.currentPanX += deltaX;
                this.currentPanY += deltaY;
                
                this.updateTransform();
                
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                layoutContainer.style.cursor = 'grab';
            }
        });

        // Enhanced zoom with mouse wheel
        layoutContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
            this.zoom(this.currentZoom + delta, e.clientX, e.clientY);
        });

        // Enhanced touch support
        this.setupTouchControls(layoutContainer);
    }

    setupMouseTracking(layoutContainer) {
        layoutContainer.addEventListener('mousemove', (e) => {
            if (!this.isDragging) {
                const x = Math.round((e.clientX - this.currentPanX) / this.currentZoom);
                const y = Math.round((e.clientY - this.currentPanY) / this.currentZoom);
                
                const coordsDisplay = document.getElementById('mouseCoords');
                if (coordsDisplay) {
                    // Only show coordinates if within venue bounds
                    if (x >= 0 && x <= 1200 && y >= 0 && y <= 800) {
                        coordsDisplay.textContent = `X: ${x}, Y: ${y}`;
                    } else {
                        coordsDisplay.textContent = 'Fuera del venue';
                    }
                }
            }
        });
    }

    setupMiniMap() {
        const miniMap = document.querySelector('.mini-map');
        const miniViewport = document.querySelector('.mini-viewport');
        
        if (!miniMap || !miniViewport) return;

        // Click to navigate on mini map
        miniMap.addEventListener('click', (e) => {
            const rect = miniMap.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            // Convert to venue coordinates
            const targetX = (window.innerWidth - 1200 * this.currentZoom) / 2 - (x - 0.5) * 1200 * this.currentZoom;
            const targetY = (window.innerHeight - 800 * this.currentZoom) / 2 - (y - 0.5) * 800 * this.currentZoom;
            
            this.animateTo(targetX, targetY, this.currentZoom);
        });

        this.updateMiniMap();
    }

    setupTouchControls(layoutContainer) {
        let lastTouchDistance = 0;
        let lastTouchCenter = { x: 0, y: 0 };
        let touchStartTime = 0;

        layoutContainer.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            
            if (e.touches.length === 2) {
                lastTouchDistance = this.getTouchDistance(e.touches);
                lastTouchCenter = this.getTouchCenter(e.touches);
            } else if (e.touches.length === 1) {
                this.lastMouseX = e.touches[0].clientX;
                this.lastMouseY = e.touches[0].clientY;
            }
        });

        layoutContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 2) {
                // Pinch to zoom
                const currentDistance = this.getTouchDistance(e.touches);
                const currentCenter = this.getTouchCenter(e.touches);
                
                if (lastTouchDistance > 0) {
                    const scale = currentDistance / lastTouchDistance;
                    this.zoom(this.currentZoom * scale, currentCenter.x, currentCenter.y);
                }
                
                lastTouchDistance = currentDistance;
                lastTouchCenter = currentCenter;
            } else if (e.touches.length === 1) {
                // Pan
                const touch = e.touches[0];
                const deltaX = touch.clientX - this.lastMouseX;
                const deltaY = touch.clientY - this.lastMouseY;
                
                this.currentPanX += deltaX;
                this.currentPanY += deltaY;
                
                this.updateTransform();
                
                this.lastMouseX = touch.clientX;
                this.lastMouseY = touch.clientY;
            }
        });

        // Double tap to zoom
        layoutContainer.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 300 && e.changedTouches.length === 1) {
                const touch = e.changedTouches[0];
                this.zoom(this.currentZoom + this.zoomSpeed, touch.clientX, touch.clientY);
            }
        });
    }

    initializeCenteredView() {
        // Center the venue in the viewport
        this.currentPanX = (window.innerWidth - 1200) / 2;
        this.currentPanY = (window.innerHeight - 800) / 2;
        this.currentZoom = 1;
        this.updateTransform();
    }

    zoomIn() {
        this.zoom(this.currentZoom + this.zoomSpeed);
    }

    zoomOut() {
        this.zoom(this.currentZoom - this.zoomSpeed);
    }

    resetZoom() {
        const centerX = (window.innerWidth - 1200) / 2;
        const centerY = (window.innerHeight - 800) / 2;
        this.animateTo(centerX, centerY, 1);
    }

    centerVenue() {
        const centerX = (window.innerWidth - 1200 * this.currentZoom) / 2;
        const centerY = (window.innerHeight - 800 * this.currentZoom) / 2;
        this.animateTo(centerX, centerY, this.currentZoom);
    }

    fitToScreen() {
        const padding = 50;
        const scaleX = (window.innerWidth - padding * 2) / 1200;
        const scaleY = (window.innerHeight - padding * 2) / 800;
        const scale = Math.min(scaleX, scaleY, 1);
        
        const centerX = (window.innerWidth - 1200 * scale) / 2;
        const centerY = (window.innerHeight - 800 * scale) / 2;
        
        this.animateTo(centerX, centerY, scale);
    }

    pan(deltaX, deltaY) {
        this.animateTo(this.currentPanX + deltaX, this.currentPanY + deltaY, this.currentZoom);
    }

    zoom(newZoom, centerX = window.innerWidth / 2, centerY = window.innerHeight / 2) {
        const minZoom = 0.1;
        const maxZoom = 5;
        newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
        
        if (newZoom === this.currentZoom) return;
        
        // Calculate new pan to zoom towards the center point
        const zoomRatio = newZoom / this.currentZoom;
        const newPanX = centerX - (centerX - this.currentPanX) * zoomRatio;
        const newPanY = centerY - (centerY - this.currentPanY) * zoomRatio;
        
        this.animateTo(newPanX, newPanY, newZoom);
    }

    animateTo(targetX, targetY, targetZoom) {
        const startX = this.currentPanX;
        const startY = this.currentPanY;
        const startZoom = this.currentZoom;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.animationDuration, 1);
            
            // Easing function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            this.currentPanX = startX + (targetX - startX) * easeProgress;
            this.currentPanY = startY + (targetY - startY) * easeProgress;
            this.currentZoom = startZoom + (targetZoom - startZoom) * easeProgress;
            
            this.updateTransform();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateTransform() {
        const layoutContainer = document.querySelector('.layout-container');
        layoutContainer.style.transform = `translate(${this.currentPanX}px, ${this.currentPanY}px) scale(${this.currentZoom})`;
        this.updateUI();
    }

    updateUI() {
        // Update zoom indicator
        const zoomLevel = document.getElementById('zoomLevel');
        if (zoomLevel) {
            zoomLevel.textContent = Math.round(this.currentZoom * 100) + '%';
        }
        
        // Update mini map
        this.updateMiniMap();
    }

    updateMiniMap() {
        const miniVenue = document.querySelector('.mini-venue');
        const miniViewport = document.querySelector('.mini-viewport');
        if (!miniViewport || !miniVenue) return;

        // Clear existing mini tables
        const existingTables = miniVenue.querySelectorAll('.mini-table');
        existingTables.forEach(table => table.remove());
        
        // Add mini tables based on their transform position
        const tables = document.querySelectorAll('.table');
        tables.forEach(table => {
            const style = window.getComputedStyle(table);
            const transform = style.transform;
            
            let x = 0, y = 0;
            if (transform !== 'none') {
                const matrix = transform.match(/matrix.*\((.+)\)/);
                if (matrix) {
                    const values = matrix[1].split(', ');
                    x = parseFloat(values[4]) || 0;
                    y = parseFloat(values[5]) || 0;
                }
            }
            
            // Scale to mini-map (150px width for 1200px venue)
            const miniX = (x / 1200) * 150;
            const miniY = (y / 800) * 100;
            
            // Only show tables within venue bounds
            if (x >= 0 && x <= 1200 && y >= 0 && y <= 800) {
                const miniTable = document.createElement('div');
                miniTable.className = 'mini-table';
                miniTable.style.left = miniX + 'px';
                miniTable.style.top = miniY + 'px';
                
                miniVenue.appendChild(miniTable);
            }
        });

        // Update viewport indicator
        const viewportWidth = Math.min(150, window.innerWidth / (1200 * this.currentZoom) * 150);
        const viewportHeight = Math.min(100, window.innerHeight / (800 * this.currentZoom) * 100);
        
        // Calculate position based on current pan - fixed for new coordinate system
        const viewportX = (-this.currentPanX / (1200 * this.currentZoom)) * 150;
        const viewportY = (-this.currentPanY / (800 * this.currentZoom)) * 100;
        
        miniViewport.style.left = Math.max(0, Math.min(150 - viewportWidth, viewportX)) + 'px';
        miniViewport.style.top = Math.max(0, Math.min(100 - viewportHeight, viewportY)) + 'px';
        miniViewport.style.width = viewportWidth + 'px';
        miniViewport.style.height = viewportHeight + 'px';
    }

    getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getTouchCenter(touches) {
        return {
            x: (touches[0].clientX + touches[1].clientX) / 2,
            y: (touches[0].clientY + touches[1].clientY) / 2
        };
    }

    exportCoordinates() {
        const coordinates = {};
        const venueLayout = document.getElementById('venueLayout');
        const venueRect = venueLayout.getBoundingClientRect();

        // Capturar coordenadas de las mesas numeradas
        coordinates.tables = {};
        Object.values(this.tables).forEach(table => {
            const element = table.element;
            const rect = element.getBoundingClientRect();
            
            // Calcular posición relativa al contenedor venue
            const left = rect.left - venueRect.left;
            const top = rect.top - venueRect.top;
            
            // Convertir a porcentajes para responsive design
            const leftPercent = ((left / venueRect.width) * 100).toFixed(2);
            const topPercent = ((top / venueRect.height) * 100).toFixed(2);
            
            coordinates.tables[`table${table.id}`] = {
                id: table.id,
                name: table.name,
                capacity: table.capacity,
                position: {
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    leftPx: Math.round(left),
                    topPx: Math.round(top)
                },
                currentGuests: table.guests.length
            };
        });

        // Capturar coordenadas de elementos especiales
        coordinates.specialElements = {};
        
        // DJ Area
        const djArea = document.querySelector('.dj-area');
        if (djArea) {
            const djRect = djArea.getBoundingClientRect();
            const djLeft = ((djRect.left - venueRect.left) / venueRect.width * 100).toFixed(2);
            const djTop = ((djRect.top - venueRect.top) / venueRect.height * 100).toFixed(2);
            
            coordinates.specialElements.djArea = {
                position: {
                    left: `${djLeft}%`,
                    top: `${djTop}%`,
                    leftPx: Math.round(djRect.left - venueRect.left),
                    topPx: Math.round(djRect.top - venueRect.top)
                },
                width: `${((djRect.width / venueRect.width) * 100).toFixed(2)}%`,
                height: `${((djRect.height / venueRect.height) * 100).toFixed(2)}%`
            };
        }

        // Dance Floor
        const danceFloor = document.querySelector('.dance-floor');
        if (danceFloor) {
            const dfRect = danceFloor.getBoundingClientRect();
            const dfLeft = ((dfRect.left - venueRect.left) / venueRect.width * 100).toFixed(2);
            const dfTop = ((dfRect.top - venueRect.top) / venueRect.height * 100).toFixed(2);
            
            coordinates.specialElements.danceFloor = {
                position: {
                    left: `${dfLeft}%`,
                    top: `${dfTop}%`,
                    leftPx: Math.round(dfRect.left - venueRect.left),
                    topPx: Math.round(dfRect.top - venueRect.top)
                },
                width: `${((dfRect.width / venueRect.width) * 100).toFixed(2)}%`,
                height: `${((dfRect.height / venueRect.height) * 100).toFixed(2)}%`
            };
        }

        // Bride and Groom Table
        const brideGroomTable = document.querySelector('.bride-groom-table');
        if (brideGroomTable) {
            const bgRect = brideGroomTable.getBoundingClientRect();
            const bgLeft = ((bgRect.left - venueRect.left) / venueRect.width * 100).toFixed(2);
            const bgTop = ((bgRect.top - venueRect.top) / venueRect.height * 100).toFixed(2);
            
            coordinates.specialElements.brideGroomTable = {
                position: {
                    left: `${bgLeft}%`,
                    top: `${bgTop}%`,
                    leftPx: Math.round(bgRect.left - venueRect.left),
                    topPx: Math.round(bgRect.top - venueRect.top)
                },
                width: `${((bgRect.width / venueRect.width) * 100).toFixed(2)}%`,
                height: `${((bgRect.height / venueRect.height) * 100).toFixed(2)}%`
            };
        }

        // Agregar metadatos
        coordinates.metadata = {
            exportDate: new Date().toISOString(),
            venueSize: {
                width: Math.round(venueRect.width),
                height: Math.round(venueRect.height)
            },
            totalTables: Object.keys(this.tables).length,
            totalGuests: this.guests.length,
            assignedGuests: this.guests.filter(g => g.tableId).length,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        // Generar CSS para fácil implementación
        coordinates.cssOutput = this.generateCSSFromCoordinates(coordinates);

        // Crear y descargar el archivo
        const dataStr = JSON.stringify(coordinates, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `seating-plan-coordinates-${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // También mostrar en consola para fácil acceso
        console.log('Coordenadas exportadas:', coordinates);
        
        // Mostrar confirmación al usuario
        alert(`Coordenadas exportadas exitosamente!\n\nArchivo: ${link.download}\n\nTotal de mesas: ${coordinates.metadata.totalTables}\nInvitados asignados: ${coordinates.metadata.assignedGuests}/${coordinates.metadata.totalGuests}\n\nRevisa la consola del navegador para ver las coordenadas.`);
    }

    generateCSSFromCoordinates(coordinates) {
        let css = '/* CSS generado automáticamente desde las coordenadas actuales */\n\n';
        
        // CSS para mesas
        css += '/* Posicionamiento de mesas */\n';
        Object.entries(coordinates.tables).forEach(([key, table]) => {
            css += `#${key} { top: ${table.position.top}; left: ${table.position.left}; } /* Mesa ${table.id} - ${table.currentGuests}/${table.capacity} invitados */\n`;
        });
        
        // CSS para elementos especiales
        css += '\n/* Elementos especiales */\n';
        if (coordinates.specialElements.djArea) {
            const dj = coordinates.specialElements.djArea;
            css += `.dj-area { top: ${dj.position.top}; left: ${dj.position.left}; width: ${dj.width}; height: ${dj.height}; }\n`;
        }
        
        if (coordinates.specialElements.danceFloor) {
            const df = coordinates.specialElements.danceFloor;
            css += `.dance-floor { top: ${df.position.top}; left: ${df.position.left}; width: ${df.width}; height: ${df.height}; }\n`;
        }
        
        if (coordinates.specialElements.brideGroomTable) {
            const bg = coordinates.specialElements.brideGroomTable;
            css += `.bride-groom-table { top: ${bg.position.top}; left: ${bg.position.left}; width: ${bg.width}; height: ${bg.height}; }\n`;
        }
        
        return css;
    }

    updateAllTablesDisplay() {
        Object.values(this.tables).forEach(table => {
            this.updateTableDisplay(table.id);
        });
    }

    updateTableDisplay(tableId) {
        const table = this.tables[tableId];
        if (!table) return;

        const assignedGuests = this.guests.filter(guest => guest.tableId === tableId);
        
        // Asignar invitados a la mesa
        table.guests = assignedGuests;
        
        const statusIndicator = table.element.querySelector('.table-status');

        // Update status indicator
        if (statusIndicator) {
            const capacity = table.capacity;
            const occupied = assignedGuests.length;
            
            statusIndicator.className = 'table-status';
            if (occupied === 0) {
                statusIndicator.classList.add('empty');
            } else if (occupied < capacity) {
                statusIndicator.classList.add('partial');
            } else {
                statusIndicator.classList.add('full');
            }
        }
    }

    setupTableDragging() {
        let draggedTable = null;
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        let mouseDownTime = 0;
        let hasMoved = false;

        Object.values(this.tables).forEach(table => {
            const element = table.element;

            // Mouse events for desktop
            element.addEventListener('mousedown', (e) => {
                console.log(`🖱️ Mousedown en mesa ${table.id}`);
                
                if (e.target.classList.contains('table-status') || e.target.classList.contains('popup-close')) {
                    return;
                }
                
                // Registrar tiempo y posición inicial
                mouseDownTime = Date.now();
                hasMoved = false;
                
                startX = e.clientX;
                startY = e.clientY;
                
                const rect = element.getBoundingClientRect();
                const venueRect = element.parentElement.getBoundingClientRect();
                
                initialLeft = rect.left - venueRect.left;
                initialTop = rect.top - venueRect.top;
                
                // Preparar para posible drag pero no activarlo aún
                draggedTable = table;
                
                e.preventDefault();
            });
            
            element.addEventListener('mousemove', (e) => {
                if (!draggedTable) return;
                
                const deltaX = Math.abs(e.clientX - startX);
                const deltaY = Math.abs(e.clientY - startY);
                
                // Si se mueve más de 5px, activar drag
                if ((deltaX > 5 || deltaY > 5) && !isDragging) {
                    console.log(`🎯 Iniciando drag de mesa ${table.id}`);
                    isDragging = true;
                    this.isDragging = true;
                    hasMoved = true;
                    element.classList.add('dragging');
                }
            });
            
            element.addEventListener('mouseup', (e) => {
                if (draggedTable && !hasMoved) {
                    // Fue un click, no un drag - mostrar modal
                    const clickDuration = Date.now() - mouseDownTime;
                    if (clickDuration < 300) { // Click rápido
                        console.log(`👆 Click en mesa ${table.id} - abriendo modal`);
                        this.showTableDetails(table.id);
                    }
                }
                
                // Reset
                if (draggedTable) {
                    draggedTable.element.classList.remove('dragging');
                    if (isDragging && hasMoved) {
                        console.log(`✅ Finalizando drag de mesa ${draggedTable.id}`);
                        this.saveTablePosition(draggedTable);
                    }
                }
                
                isDragging = false;
                this.isDragging = false;
                draggedTable = null;
                hasMoved = false;
            });

            // Touch events for mobile with improved handling
            let touchStartTime = 0;
            element.addEventListener('touchstart', (e) => {
                if (e.target.classList.contains('table-status') || e.target.classList.contains('popup-close')) {
                    return;
                }
                
                touchStartTime = Date.now();
                
                // Allow time for tap vs drag detection
                setTimeout(() => {
                    if (Date.now() - touchStartTime >= 100) {
                        isDragging = true;
                        draggedTable = table;
                        
                        const touch = e.touches[0];
                        startX = touch.clientX;
                        startY = touch.clientY;
                        
                        const rect = element.getBoundingClientRect();
                        const venueRect = element.parentElement.getBoundingClientRect();
                        
                        initialLeft = rect.left - venueRect.left;
                        initialTop = rect.top - venueRect.top;
                        
                        element.classList.add('dragging');
                    }
                }, 100);
                
                e.preventDefault();
            });

            // Handle tap for showing popup
            element.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                if (touchDuration < 200 && !isDragging) {
                    // This was a tap, show popup
                    this.showTablePopup(table, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                }
            });
        });

        // Global mouse move
        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !draggedTable) return;
            
            console.log(`🔄 Moviendo mesa ${draggedTable.id}`);
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newLeft = initialLeft + deltaX;
            const newTop = initialTop + deltaY;
            
            draggedTable.element.style.left = `${newLeft}px`;
            draggedTable.element.style.top = `${newTop}px`;
        });

        // Global touch move
        document.addEventListener('touchmove', (e) => {
            if (!isDragging || !draggedTable) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            const newLeft = initialLeft + deltaX;
            const newTop = initialTop + deltaY;
            
            draggedTable.element.style.left = `${newLeft}px`;
            draggedTable.element.style.top = `${newTop}px`;
            
            e.preventDefault();
        });

        // Manejo de mouseup ahora en elementos individuales

        // Global touch end
        document.addEventListener('touchend', () => {
            if (isDragging && draggedTable) {
                draggedTable.element.classList.remove('dragging');
                this.saveTablePosition(draggedTable);
                isDragging = false;
                this.isDragging = false;
                draggedTable = null;
            }
        });
    }

    createSeatsVisualization(tableElement, capacity) {
        const seatsContainer = tableElement.querySelector('.seats');
        seatsContainer.innerHTML = '';

        const isRound = tableElement.classList.contains('round-table');
        const isSquare = tableElement.classList.contains('square-table');
        
        for (let i = 0; i < capacity; i++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            
            if (isRound) {
                // Position seats around circle (up to 10 seats)
                const angle = (i / capacity) * 2 * Math.PI - Math.PI / 2; // Start at top
                const radius = 38;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                seat.style.left = `${x}%`;
                seat.style.top = `${y}%`;
            } else if (isSquare) {
                // Position seats around square perimeter (up to 10 seats)
                const seatsPerSide = Math.ceil(capacity / 4);
                const side = Math.floor(i / seatsPerSide);
                const posInSide = i % seatsPerSide;
                
                switch(side) {
                    case 0: // Top
                        seat.style.left = `${15 + posInSide * (70 / Math.max(1, seatsPerSide - 1))}%`;
                        seat.style.top = '5%';
                        break;
                    case 1: // Right
                        seat.style.left = '90%';
                        seat.style.top = `${15 + posInSide * (70 / Math.max(1, seatsPerSide - 1))}%`;
                        break;
                    case 2: // Bottom
                        seat.style.left = `${85 - posInSide * (70 / Math.max(1, seatsPerSide - 1))}%`;
                        seat.style.top = '90%';
                        break;
                    case 3: // Left
                        seat.style.left = '5%';
                        seat.style.top = `${85 - posInSide * (70 / Math.max(1, seatsPerSide - 1))}%`;
                        break;
                }
            } else {
                // Rectangular table - seats on long sides (up to 10 seats)
                const seatsPerSide = Math.ceil(capacity / 2);
                if (i < seatsPerSide) {
                    // Left side
                    seat.style.left = '8%';
                    seat.style.top = `${15 + i * (70 / Math.max(1, seatsPerSide - 1))}%`;
                } else {
                    // Right side
                    const pos = i - seatsPerSide;
                    seat.style.left = '85%';
                    seat.style.top = `${15 + pos * (70 / Math.max(1, seatsPerSide - 1))}%`;
                }
            }
            
            seatsContainer.appendChild(seat);
        }
    }

    bindEvents() {
        // Add guest button
        const addGuestBtn = document.getElementById('addGuestBtn');
        if (addGuestBtn) {
            addGuestBtn.addEventListener('click', () => {
                this.showAddGuestModal();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.showExportOptions();
            });
        }

        // Add guest form
        document.getElementById('addGuestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGuest();
        });

        // Modal close events
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelAdd').addEventListener('click', () => {
            this.closeModal();
        });

        // Table selection
        document.querySelectorAll('.table').forEach(table => {
            table.addEventListener('click', (event) => {
                this.selectTable(table.dataset.tableId);
                this.showTableDetails(table.dataset.tableId, event);
            });
        });

        // Guest search functionality removed since we don't have sidebar

        // Modal click outside to close
        document.getElementById('addGuestModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });
    }

    loadSampleData() {
        // Load data from CSV
        this.loadCSVData();
    }

    saveTablePosition(table) {
        const rect = table.element.getBoundingClientRect();
        const venueRect = table.element.parentElement.getBoundingClientRect();
        
        const position = {
            left: rect.left - venueRect.left,
            top: rect.top - venueRect.top
        };
        
        // Imprimir coordenadas en la consola para debugging
        console.log(`Mesa ${table.id}: left: ${position.left}px, top: ${position.top}px`);
        
        const positions = JSON.parse(localStorage.getItem('tablePositions')) || {};
        positions[table.id] = position;
        localStorage.setItem('tablePositions', JSON.stringify(positions));
    }

    // Función para imprimir todas las coordenadas actuales
    printAllTableCoordinates() {
        console.log('\n=== COORDENADAS ACTUALES DE TODAS LAS MESAS ===');
        Object.values(this.tables).forEach(table => {
            const rect = table.element.getBoundingClientRect();
            const venueRect = table.element.parentElement.getBoundingClientRect();
            
            const position = {
                left: rect.left - venueRect.left,
                top: rect.top - venueRect.top
            };
            
            console.log(`Mesa ${table.id}: left: ${position.left}px, top: ${position.top}px`);
        });
        console.log('=== FIN COORDENADAS ===\n');
    }

    loadTablePositions() {
        const positions = JSON.parse(localStorage.getItem('tablePositions')) || {};
        
        // Solo aplicar posiciones guardadas si existen, sino usar las posiciones CSS por defecto
        Object.values(this.tables).forEach(table => {
            if (positions[table.id]) {
                const pos = positions[table.id];
                table.element.style.left = `${pos.left}px`;
                table.element.style.top = `${pos.top}px`;
            }
            // Si no hay posición guardada, el CSS por defecto se aplicará automáticamente
        });
    }

    async loadCSVData() {
        try {
            const response = await fetch('CONFIRMACIONES FINAL - Hoja 7 (1).csv');
            const csvText = await response.text();
            this.processCSVData(csvText);
        } catch (error) {
            console.log('CSV file not found, loading with manual data');
            this.loadManualCSVData();
        }
    }

    loadManualCSVData() {
        // CSV data from the file
        const csvData = `Invitado,mesa,Adultos,Niño
MEMO mayra,1,4,2
HORTENCIA MORENO,1,2,
contador,1,2,
CEPI,2,1,
RAQUEL,2,1,
BRENDA,2,2,1
JESSI,2,1,
JILLAN ,2,2,
ATALIA,3,2,
ANA,3,2,
ANAHI,3,2,
ALONDRA,3,2,
VICKY,3,2,
DIANA,4,4,
ERIKA,4,4,
CESAR,4,1,
ALEX,4,1,
FAMILIA DE CHUY,5,4,
CLAUDIA,5,2,3
RIQUIS,6,3,1
HORTENCIA duran,6,2,1
adela,6,5,
CHABELA,7,7,
HUGO,7,2,
BERE,8,2,
PATY,8,2,
GABY,8,2,
amigas jesi,8,3,
TIO PONCHO,9,2,
PAPAS NOVIO,9,2,
CALLIS,9,2,
ABUELITO JUAN,9,1,
GEORGINA,10,6,
OSCAR,11,2,
EVER,11,2,
HOUSTON,11,2,
JAVIX,11,2,
familia de fer,12,3,
ADRIAN,12,2,
carlitos,12,2,
LUIS,12,2,
TERE,13,4,
JESUS,13,2,
BETO,13,4,
EVA,14,2,
ANDREA,14,2,
tío hector,14,2,
tia luz,14,2,
RENE,15,2,
STEVE,15,2,
ALEJANDRO,15,2,
POLLO,15,2,
JORGE,15,1,
MARIFER,,2,
CINTIA,,2,
TIO ARMANDO,,2,
PACO,,2,
TIA TITA,,2,
TIA SILVIA,,2,
CAROL,,2,
MARIANA,,2,
ABUELITO ARMANDO,,2,
TOTALES,,144,8`;
        
        this.processCSVData(csvData);
    }

    processCSVData(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        // Skip header and totals line
        for (let i = 1; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const columns = line.split(',');
            const invitado = columns[0]?.trim();
            const mesa = columns[1]?.trim();
            const adultos = parseInt(columns[2]) || 0;
            const ninos = parseInt(columns[3]) || 0;
            
            if (!invitado || invitado === 'TOTALES') continue;
            
            // Create individual guests for adults
            for (let j = 1; j <= adultos; j++) {
                const guestName = adultos > 1 ? `${invitado} ${j}` : invitado;
                const guest = {
                    id: this.guestIdCounter++,
                    name: guestName,
                    type: 'adulto',
                    diet: '',
                    tableId: mesa && !isNaN(parseInt(mesa)) ? mesa : null
                };
                this.guests.push(guest);
            }
            
            // Create individual guests for children
            for (let j = 1; j <= ninos; j++) {
                const guestName = ninos > 1 ? `${invitado} (niño ${j})` : `${invitado} (niño)`;
                const guest = {
                    id: this.guestIdCounter++,
                    name: guestName,
                    type: 'niño',
                    diet: '',
                    tableId: mesa && !isNaN(parseInt(mesa)) ? mesa : null
                };
                this.guests.push(guest);
            }
        }
        
        this.updateGuestList();
        console.log(`Cargados ${this.guests.length} invitados desde CSV`);
    }

    showAddGuestModal() {
        document.getElementById('addGuestModal').style.display = 'block';
        document.getElementById('guestName').focus();
    }

    closeModal() {
        document.getElementById('addGuestModal').style.display = 'none';
        document.getElementById('addGuestForm').reset();
    }

    addGuest() {
        const name = document.getElementById('guestName').value.trim();
        const type = document.getElementById('guestType').value;
        const diet = document.getElementById('guestDiet').value.trim();

        if (!name) {
            alert('Por favor, ingresa el nombre del invitado.');
            return;
        }

        const guest = {
            id: this.guestIdCounter++,
            name: name,
            type: type,
            diet: diet,
            tableId: null
        };

        this.guests.push(guest);
        this.updateGuestList();
        this.closeModal();
    }

    updateGuestList() {
        const assignedGuests = this.guests.filter(guest => guest.tableId);
        const unassignedGuests = this.guests.filter(guest => !guest.tableId);

        // Update table statuses and display
        this.updateTableStatuses();
        this.updateAllTablesDisplay();
        
        // Update title with statistics
        this.updateTitle(this.guests.length, assignedGuests.length, unassignedGuests.length);
    }

    updateTitle(total, assigned, unassigned) {
        const headerTitle = document.querySelector('header h1');
        if (headerTitle) {
            headerTitle.textContent = `Plan de Asientos - Boda (${assigned}/${total} asignados)`;
        }
    }

    // Guest element creation removed since sidebar is not needed

    selectTable(tableId) {
        // Remove previous selection
        document.querySelectorAll('.table').forEach(table => {
            table.classList.remove('selected');
        });

        // Select new table
        const table = this.tables[tableId];
        if (table) {
            table.element.classList.add('selected');
            this.selectedTable = tableId;
            this.showTableDetails(tableId);
        }
    }

    showTableDetails(tableId, event) {
        // Close any existing popup
        this.closeTablePopup();

        const table = this.tables[tableId];
        const assignedGuests = this.guests.filter(guest => guest.tableId === tableId);
        const capacity = table.capacity;
        const occupied = assignedGuests.length;
        const available = capacity - occupied;

        // Create popup element
        const popup = document.createElement('div');
        popup.id = 'tablePopup';
        popup.className = 'table-popup';

        let guestListHTML = '';
        if (assignedGuests.length > 0) {
            guestListHTML = assignedGuests.map((guest, index) => 
                `<div class="popup-guest-item ${guest.type}">
                    <span class="popup-guest-name">${index + 1}. ${guest.name}</span>
                    <span class="popup-guest-type">${guest.type}</span>
                </div>`
            ).join('');
        } else {
            guestListHTML = '<div class="popup-empty">No hay invitados asignados</div>';
        }

        popup.innerHTML = `
            <button class="popup-close" onclick="app.closeTablePopup()">&times;</button>
            <h3>${table.name}</h3>
            <div class="popup-capacity">
                <span><strong>Ocupados:</strong> ${occupied}</span>
                <span><strong>Disponibles:</strong> ${available}</span>
                <span><strong>Total:</strong> ${capacity}</span>
            </div>
            <div class="popup-guest-list">
                ${guestListHTML}
            </div>
        `;

        document.body.appendChild(popup);

        // Position popup near the clicked table
        const tableRect = table.element.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        
        let left = tableRect.right + 10;
        let top = tableRect.top;

        // Adjust if popup goes off screen
        if (left + popupRect.width > window.innerWidth) {
            left = tableRect.left - popupRect.width - 10;
        }
        if (top + popupRect.height > window.innerHeight) {
            top = window.innerHeight - popupRect.height - 10;
        }
        if (left < 0) left = 10;
        if (top < 0) top = 10;

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;

        // Close popup when clicking outside
        setTimeout(() => {
            document.addEventListener('click', this.handlePopupOutsideClick.bind(this), { once: true });
        }, 100);
    }

    closeTablePopup() {
        const popup = document.getElementById('tablePopup');
        if (popup) {
            popup.remove();
        }
    }

    handlePopupOutsideClick(event) {
        const popup = document.getElementById('tablePopup');
        if (popup && !popup.contains(event.target)) {
            this.closeTablePopup();
        }
    }

    removeGuestFromTable(guestId) {
        const guest = this.guests.find(g => g.id == guestId);
        if (guest) {
            const oldTableId = guest.tableId;
            guest.tableId = null;
            this.updateGuestList();
            if (oldTableId) {
                this.updateTableDisplay(oldTableId);
            }
            if (this.selectedTable) {
                this.showTableDetails(this.selectedTable);
            }
        }
    }

    updateTableStatuses() {
        Object.values(this.tables).forEach(table => {
            const assignedGuests = this.guests.filter(guest => guest.tableId === table.id);
            const occupied = assignedGuests.length;
            
            table.element.classList.remove('occupied', 'full');
            
            if (occupied > 0) {
                table.element.classList.add('occupied');
            }
            
            if (occupied >= table.capacity) {
                table.element.classList.add('full');
            }
        });
    }

    assignGuestToTable(guestId, tableId) {
        const guest = this.guests.find(g => g.id == guestId);
        const table = this.tables[tableId];

        if (!guest || !table) return false;

        const currentOccupied = this.guests.filter(g => g.tableId === tableId).length;
        if (currentOccupied >= table.capacity) {
            alert(`La ${table.name} está llena (${table.capacity}/${table.capacity})`);
            return false;
        }

        guest.tableId = tableId;
        this.updateGuestList();
        this.updateTableDisplay(tableId);
        
        if (this.selectedTable === tableId) {
            this.showTableDetails(tableId);
        }

        return true;
    }

    // Search functionality removed since sidebar is not needed

    saveLayout() {
        const layout = {
            guests: this.guests,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('seatingPlanLayout', JSON.stringify(layout));
        alert('Layout guardado exitosamente');
    }

    loadLayout() {
        const saved = localStorage.getItem('seatingPlanLayout');
        if (saved) {
            const layout = JSON.parse(saved);
            this.guests = layout.guests || [];
            this.guestIdCounter = Math.max(...this.guests.map(g => g.id), 0) + 1;
            this.updateGuestList();
            alert('Layout cargado exitosamente');
        } else {
            alert('No hay layout guardado');
        }
    }

    reloadCSVData() {
        if (confirm('¿Estás seguro de que quieres recargar los datos del CSV? Esto sobrescribirá todos los invitados actuales.')) {
            this.guests = [];
            this.guestIdCounter = 1;
            this.loadManualCSVData();
            alert('Datos CSV recargados exitosamente');
        }
    }

    showExportOptions() {
        const options = [
            'CSV - Lista de invitados',
            'HTML - Para imprimir', 
            'JSON - Respaldo completo',
            'Resumen de mesas'
        ];

        const choice = prompt(
            'Selecciona el formato de exportación:\n' +
            '1. CSV - Lista de invitados\n' +
            '2. HTML - Para imprimir\n' +
            '3. JSON - Respaldo completo\n' +
            '4. Resumen de mesas\n\n' +
            'Ingresa el número (1-4):'
        );

        switch(choice) {
            case '1':
                if (window.exportManager) {
                    window.exportManager.exportToCSV(this.guests, this.tables);
                }
                break;
            case '2':
                if (window.exportManager) {
                    window.exportManager.exportToPrintHTML(this.guests, this.tables);
                }
                break;
            case '3':
                if (window.storageManager) {
                    const data = {
                        guests: this.guests,
                        tables: this.tables,
                        timestamp: new Date().toISOString()
                    };
                    window.storageManager.exportToFile(data, 'seating-plan-backup.json');
                }
                break;
            case '4':
                if (window.exportManager) {
                    window.exportManager.exportTableSummary(this.guests, this.tables);
                }
                break;
            default:
                if (choice !== null) {
                    alert('Opción no válida');
                }
        }
    }

    setupWheelZoom(container) {
        const venueLayout = container.querySelector('.venue-layout');
        if (!venueLayout) return;

        // Variables para el zoom mejorado
        this.currentZoom = 1;
        this.currentTranslateX = 0;
        this.currentTranslateY = 0;

        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const rect = venueLayout.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            // Posición del mouse relativa al venue
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Calcular zoom con mejor sensibilidad
            const zoomFactor = e.deltaY > 0 ? 0.85 : 1.15;
            let newZoom = this.currentZoom * zoomFactor;
            
            // Limitar zoom entre 0.3 y 4
            newZoom = Math.max(0.3, Math.min(4, newZoom));
            
            if (newZoom !== this.currentZoom) {
                // Aplicar transformación suave
                venueLayout.style.transform = `scale(${newZoom})`;
                venueLayout.style.transformOrigin = `${(mouseX / rect.width) * 100}% ${(mouseY / rect.height) * 100}%`;
                venueLayout.style.transition = 'transform 0.1s ease-out';
                
                this.currentZoom = newZoom;
                
                // Remover transición después del zoom
                setTimeout(() => {
                    venueLayout.style.transition = '';
                }, 100);
            }
        });
        
        // Soporte para pinch zoom en móviles
        this.setupPinchZoom(container, venueLayout);
    }

    setupDragPan(container) {
        const venueLayout = container.querySelector('.venue-layout');
        if (!venueLayout) return;

        let isDragging = false;
        let lastX = 0;
        let lastY = 0;
        let currentTranslateX = 0;
        let currentTranslateY = 0;

        venueLayout.addEventListener('mousedown', (e) => {
            // Solo permitir drag si no se está clickeando en una mesa
            if (!e.target.classList.contains('table') && !e.target.closest('.table')) {
                isDragging = true;
                lastX = e.clientX;
                lastY = e.clientY;
                venueLayout.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                
                const scale = this.getElementScale(venueLayout);
                currentTranslateX += deltaX / scale;
                currentTranslateY += deltaY / scale;
                
                const transform = `scale(${scale}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
                venueLayout.style.transform = transform;
                
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                venueLayout.style.cursor = 'grab';
            }
        });

        // Soporte para touch en móviles
        venueLayout.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
                e.preventDefault();
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - lastX;
                const deltaY = e.touches[0].clientY - lastY;
                
                const scale = this.getElementScale(venueLayout);
                currentTranslateX += deltaX / scale;
                currentTranslateY += deltaY / scale;
                
                const transform = `scale(${scale}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
                venueLayout.style.transform = transform;
                
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
            }
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    getElementScale(element) {
        const transform = element.style.transform;
        if (!transform || transform === 'none') return 1;
        
        const scaleMatch = transform.match(/scale\(([^)]+)\)/);
        return scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    }

    setupDoubleClickReset(container) {
        const venueLayout = container.querySelector('.venue-layout');
        if (!venueLayout) return;

        venueLayout.addEventListener('dblclick', (e) => {
            // Solo resetear si no se está haciendo doble click en una mesa
            if (!e.target.classList.contains('table') && !e.target.closest('.table')) {
                venueLayout.style.transform = 'scale(1) translate(0px, 0px)';
                e.preventDefault();
            }
        });
    }

    setupPinchZoom(container, venueLayout) {
        // Variables para pinch zoom
        let initialDistance = 0;
        let initialZoom = 1;
        let isZooming = false;

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                isZooming = true;
                initialDistance = this.getTouchDistance(e.touches);
                initialZoom = this.currentZoom;
                e.preventDefault();
            }
        });

        container.addEventListener('touchmove', (e) => {
            if (isZooming && e.touches.length === 2) {
                const currentDistance = this.getTouchDistance(e.touches);
                const scale = currentDistance / initialDistance;
                let newZoom = initialZoom * scale;
                
                // Limitar zoom
                newZoom = Math.max(0.3, Math.min(4, newZoom));
                
                // Obtener punto central entre los dos toques
                const centerTouch = this.getTouchCenter(e.touches);
                const rect = venueLayout.getBoundingClientRect();
                
                const centerX = (centerTouch.x - rect.left) / rect.width * 100;
                const centerY = (centerTouch.y - rect.top) / rect.height * 100;
                
                venueLayout.style.transform = `scale(${newZoom})`;
                venueLayout.style.transformOrigin = `${centerX}% ${centerY}%`;
                
                this.currentZoom = newZoom;
                e.preventDefault();
            }
        });

        container.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                isZooming = false;
            }
        });
    }

    getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getTouchCenter(touches) {
        return {
            x: (touches[0].clientX + touches[1].clientX) / 2,
            y: (touches[0].clientY + touches[1].clientY) / 2
        };
    }

    setupMobileOrientation() {
        // Función para verificar si es dispositivo móvil
        const isMobile = () => {
            return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        };

        // Función para manejar cambios de orientación
        const handleOrientationChange = () => {
            if (isMobile()) {
                const isPortrait = window.innerHeight > window.innerWidth;
                const landscapeNotice = document.querySelector('.mobile-landscape-notice');
                const container = document.querySelector('.container');

                if (isPortrait) {
                    // Mostrar mensaje de rotación
                    if (landscapeNotice) landscapeNotice.style.display = 'flex';
                    if (container) container.style.display = 'none';
                } else {
                    // Ocultar mensaje y mostrar contenido
                    if (landscapeNotice) landscapeNotice.style.display = 'none';
                    if (container) container.style.display = 'block';
                    
                    // Pequeño delay para ajustar layout después de rotación
                    setTimeout(() => {
                        this.adjustLayoutForMobileLandscape();
                    }, 100);
                }
            }
        };

        // Escuchar cambios de orientación y redimensionamiento
        window.addEventListener('orientationchange', () => {
            // Delay para permitir que la orientación se complete
            setTimeout(handleOrientationChange, 200);
        });

        window.addEventListener('resize', handleOrientationChange);

        // Verificación inicial
        handleOrientationChange();
    }

    adjustLayoutForMobileLandscape() {
        if (window.innerWidth <= 768 && window.innerWidth > window.innerHeight) {
            const venueLayout = document.querySelector('.venue-layout');
            if (venueLayout) {
                // Resetear zoom para móvil landscape
                venueLayout.style.transform = 'scale(1) translate(0px, 0px)';
                
                // Forzar recálculo de dimensiones
                const container = document.querySelector('.layout-container');
                if (container) {
                    container.style.width = '100%';
                    container.style.height = '100vh';
                }
            }
        }
    }
    showTableDetails(tableId) {
        const table = this.tables[tableId];
        if (!table) return;
        
        // Actualizar título del modal
        document.getElementById('tableDetailsTitle').textContent = table.name;
        
        // Generar visualización de la mesa
        this.generateTableVisual(table);
        
        // Mostrar modal y bloquear scroll del body
        document.getElementById('tableDetailsModal').style.display = 'block';
        document.body.classList.add('modal-open');
        
        // Event listener para cerrar
        document.getElementById('closeTableDetails').onclick = () => {
            document.getElementById('tableDetailsModal').style.display = 'none';
            document.body.classList.remove('modal-open');
        };
        
        // Cerrar al hacer clic fuera del modal
        window.onclick = (event) => {
            const modal = document.getElementById('tableDetailsModal');
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        };
        
        // Cerrar con tecla Escape
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                document.getElementById('tableDetailsModal').style.display = 'none';
                document.body.classList.remove('modal-open');
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    generateTableVisual(table) {
        const tableVisual = document.getElementById('tableVisual');
        tableVisual.innerHTML = '';
        
        // Determinar tipo de mesa y aplicar clase CSS
        const tableElement = table.element;
        const isRound = tableElement.classList.contains('round-table');
        const isSquare = tableElement.classList.contains('square-table');
        const isRect = tableElement.classList.contains('rect-table');
        
        tableVisual.className = 'table-visual';
        if (isSquare) tableVisual.classList.add('square');
        if (isRect) tableVisual.classList.add('rectangular');
        
        // Agregar etiqueta de la mesa en el centro
        const centerLabel = document.createElement('div');
        centerLabel.textContent = table.name;
        centerLabel.style.position = 'absolute';
        centerLabel.style.fontSize = '1.2rem';
        centerLabel.style.fontWeight = 'bold';
        centerLabel.style.color = '#666';
        tableVisual.appendChild(centerLabel);
        
        // Generar posiciones de asientos según el tipo de mesa
        const seatPositions = this.calculateSeatPositions(table.capacity, isRound, isSquare, isRect);
        
        seatPositions.forEach((position, index) => {
            const seatDiv = document.createElement('div');
            seatDiv.className = 'seat-position';
            seatDiv.style.left = position.x + '%';
            seatDiv.style.top = position.y + '%';
            
            // Verificar si hay un invitado asignado a esta silla
            const guest = table.guests[index];
            if (guest) {
                seatDiv.classList.add('occupied');
                
                // Mostrar nombre del invitado directamente en el asiento
                const nameSpan = document.createElement('span');
                nameSpan.className = 'guest-name-label';
                nameSpan.textContent = guest.name;
                seatDiv.appendChild(nameSpan);
            } else {
                seatDiv.classList.add('empty');
                
                // Mostrar número del asiento vacío
                const numberSpan = document.createElement('span');
                numberSpan.className = 'seat-number';
                numberSpan.textContent = (index + 1).toString();
                seatDiv.appendChild(numberSpan);
            }
            
            tableVisual.appendChild(seatDiv);
        });
    }
    
    calculateSeatPositions(capacity, isRound, isSquare, isRect) {
        const positions = [];
        const centerX = 50;
        const centerY = 50;
        
        if (isRound) {
            // Mesa redonda - distribuir asientos en círculo (hasta 10 personas)
            const radius = 40;
            for (let i = 0; i < capacity; i++) {
                const angle = (i / capacity) * 2 * Math.PI - Math.PI / 2; // Empezar arriba
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                positions.push({ x: x - 3, y: y - 3 });
            }
        } else if (isSquare) {
            // Mesa cuadrada - distribuir en los bordes (hasta 10 personas)
            const sideSeats = Math.floor(capacity / 4);
            const extraSeats = capacity % 4;
            
            // Distribuir asientos uniformemente en los 4 lados
            for (let i = 0; i < capacity; i++) {
                let x, y;
                const sideIndex = Math.floor(i / (capacity / 4));
                const positionInSide = i % Math.ceil(capacity / 4);
                
                switch (sideIndex) {
                    case 0: // Lado superior
                        x = 20 + (positionInSide * 60 / Math.ceil(capacity / 4));
                        y = 5;
                        break;
                    case 1: // Lado derecho
                        x = 85;
                        y = 15 + (positionInSide * 70 / Math.ceil(capacity / 4));
                        break;
                    case 2: // Lado inferior
                        x = 75 - (positionInSide * 60 / Math.ceil(capacity / 4));
                        y = 85;
                        break;
                    case 3: // Lado izquierdo
                        x = 5;
                        y = 75 - (positionInSide * 70 / Math.ceil(capacity / 4));
                        break;
                }
                positions.push({ x: x - 3, y: y - 3 });
            }
        } else if (isRect) {
            // Mesa rectangular - distribuir a los lados largos (hasta 10 personas)
            const seatsPerSide = Math.ceil(capacity / 2);
            
            for (let i = 0; i < capacity; i++) {
                let x, y;
                if (i < seatsPerSide) {
                    // Lado izquierdo
                    x = 8;
                    y = 15 + (i * 70 / (seatsPerSide - 1));
                } else {
                    // Lado derecho
                    const rightIndex = i - seatsPerSide;
                    x = 82;
                    y = 15 + (rightIndex * 70 / (seatsPerSide - 1));
                }
                positions.push({ x: x - 3, y: y - 3 });
            }
        }
        
        return positions;
    }
}

// Controles de zoom eliminados - ya no son necesarios
/* 
function setupZoomControls() {
    // Función eliminada - controles de zoom removidos
}
*/

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SeatingPlanApp();
    // setupZoomControls(); // Eliminado - controles no necesarios
});