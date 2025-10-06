// Drag and Drop functionality
class DragDropHandler {
    constructor(app) {
        this.app = app;
        this.draggedGuest = null;
        this.initializeDragDrop();
    }

    initializeDragDrop() {
        // Make guest items draggable
        this.setupGuestDragging();
        
        // Make tables droppable
        this.setupTableDropping();
    }

    setupGuestDragging() {
        // Use event delegation for dynamically created guest items
        document.getElementById('guestsContainer').addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('guest-item') || e.target.closest('.guest-item')) {
                const guestItem = e.target.closest('.guest-item') || e.target;
                this.draggedGuest = guestItem.dataset.guestId;
                guestItem.classList.add('dragging');
                
                // Set drag data
                e.dataTransfer.setData('text/plain', this.draggedGuest);
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        document.getElementById('guestsContainer').addEventListener('dragend', (e) => {
            if (e.target.classList.contains('guest-item') || e.target.closest('.guest-item')) {
                const guestItem = e.target.closest('.guest-item') || e.target;
                guestItem.classList.remove('dragging');
                this.draggedGuest = null;
            }
        });
    }

    setupTableDropping() {
        document.querySelectorAll('.table').forEach(table => {
            // Prevent default drag behavior
            table.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                table.classList.add('drop-zone');
            });

            table.addEventListener('dragenter', (e) => {
                e.preventDefault();
                table.classList.add('drag-over');
            });

            table.addEventListener('dragleave', (e) => {
                // Only remove classes if we're leaving the table completely
                if (!table.contains(e.relatedTarget)) {
                    table.classList.remove('drop-zone', 'drag-over');
                }
            });

            table.addEventListener('drop', (e) => {
                e.preventDefault();
                table.classList.remove('drop-zone', 'drag-over');
                
                const guestId = e.dataTransfer.getData('text/plain');
                const tableId = table.dataset.tableId;
                
                if (guestId && tableId) {
                    const success = this.app.assignGuestToTable(guestId, tableId);
                    
                    if (success) {
                        // Add visual feedback
                        this.showDropSuccess(table);
                    }
                }
            });
        });
    }

    showDropSuccess(table) {
        // Add a brief success animation
        table.style.transform = 'scale(1.1)';
        table.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            table.style.transform = '';
            setTimeout(() => {
                table.style.transition = '';
            }, 200);
        }, 150);
    }

    // Method to refresh drag and drop for dynamically added elements
    refreshGuestDragging() {
        // The event delegation approach means this is handled automatically
        // But we can add any additional setup if needed
    }
}

// Enhanced table interaction for mobile devices
class TouchHandler {
    constructor(app) {
        this.app = app;
        this.selectedGuest = null;
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        // Handle touch selection on mobile
        document.addEventListener('touchstart', (e) => {
            const guestItem = e.target.closest('.guest-item');
            if (guestItem) {
                this.handleGuestTouch(guestItem);
            }
        });

        // Handle table touches
        document.querySelectorAll('.table').forEach(table => {
            table.addEventListener('touchend', (e) => {
                if (this.selectedGuest) {
                    e.preventDefault();
                    const tableId = table.dataset.tableId;
                    const success = this.app.assignGuestToTable(this.selectedGuest, tableId);
                    
                    if (success) {
                        this.clearGuestSelection();
                        this.showMobileDropSuccess(table);
                    }
                }
            });
        });
    }

    handleGuestTouch(guestItem) {
        // Clear previous selection
        this.clearGuestSelection();
        
        // Select new guest
        this.selectedGuest = guestItem.dataset.guestId;
        guestItem.classList.add('selected-for-move');
        
        // Show instruction
        this.showMobileInstruction();
    }

    clearGuestSelection() {
        document.querySelectorAll('.guest-item.selected-for-move').forEach(item => {
            item.classList.remove('selected-for-move');
        });
        this.selectedGuest = null;
        this.hideMobileInstruction();
    }

    showMobileInstruction() {
        let instruction = document.getElementById('mobileInstruction');
        if (!instruction) {
            instruction = document.createElement('div');
            instruction.id = 'mobileInstruction';
            instruction.className = 'mobile-instruction';
            instruction.textContent = 'Toca una mesa para asignar el invitado';
            document.body.appendChild(instruction);
        }
        instruction.style.display = 'block';
    }

    hideMobileInstruction() {
        const instruction = document.getElementById('mobileInstruction');
        if (instruction) {
            instruction.style.display = 'none';
        }
    }

    showMobileDropSuccess(table) {
        table.classList.add('mobile-drop-success');
        setTimeout(() => {
            table.classList.remove('mobile-drop-success');
        }, 500);
    }
}

// Initialize drag and drop when the app is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the main app to initialize
    setTimeout(() => {
        if (window.app) {
            window.dragDropHandler = new DragDropHandler(window.app);
            window.touchHandler = new TouchHandler(window.app);
        }
    }, 100);
});

// Add mobile-specific styles dynamically
const mobileStyles = `
    .guest-item.selected-for-move {
        background-color: #007bff !important;
        color: white !important;
        transform: scale(1.05);
    }

    .mobile-instruction {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1001;
        display: none;
        font-size: 1rem;
        text-align: center;
    }

    .mobile-drop-success {
        animation: mobileSuccess 0.5s ease;
    }

    @keyframes mobileSuccess {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); background-color: #28a745; }
        100% { transform: scale(1); }
    }

    @media (max-width: 768px) {
        .guest-item {
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
        }
    }
`;

// Add the mobile styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileStyles;
document.head.appendChild(styleSheet);