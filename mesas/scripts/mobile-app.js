// JavaScript Mobile-First para Seating Plan

class MobileSeatingApp {
    constructor() {
        this.guests = [];
        this.tables = new Map();
        this.init();
    }

    async init() {
        console.log('Inicializando aplicación móvil...');
        await this.loadGuestData();
        this.setupTables();
        this.setupEventListeners();
        this.setupTouchEvents();
        this.updateDisplay();
        console.log('Aplicación móvil inicializada');
    }

    async loadGuestData() {
        // Datos hardcodeados directamente del CSV - NO DINÁMICO
        this.loadStaticGuestData();
    }

    loadStaticGuestData() {
        this.guests = [];
        let guestId = 1;
        
        // MESA 1 - MEMO mayra (4 adultos + 2 niños), HORTENCIA MORENO (2 adultos), contador (2 adultos)
        // MEMO mayra
        this.guests.push({ id: guestId++, name: 'MEMO mayra 1', type: 'adulto', diet: '', tableId: 1, confirmed: true, originalGroup: 'MEMO mayra' });
        this.guests.push({ id: guestId++, name: 'MEMO mayra 2', type: 'adulto', diet: '', tableId: 1, confirmed: true, originalGroup: 'MEMO mayra' });
        this.guests.push({ id: guestId++, name: 'MEMO mayra 3', type: 'adulto', diet: '', tableId: 1, confirmed: true, originalGroup: 'MEMO mayra' });
        this.guests.push({ id: guestId++, name: 'MEMO mayra 4', type: 'adulto', diet: '', tableId: 1, confirmed: true, originalGroup: 'MEMO mayra' });
        this.guests.push({ id: guestId++, name: 'MEMO mayra (niño 1)', type: 'niño', diet: '', tableId: 1, confirmed: true, originalGroup: 'MEMO mayra' });
        this.guests.push({ id: guestId++, name: 'MEMO mayra (niño 2)', type: 'niño', diet: '', tableId: 1, confirmed: true, originalGroup: 'MEMO mayra' });
        // HORTENCIA MORENO
        this.guests.push({ id: guestId++, name: 'HORTENCIA MORENO 1', type: 'adulto', diet: '', tableId: 1, confirmed: true, originalGroup: 'HORTENCIA MORENO' });
        this.guests.push({ id: guestId++, name: 'HORTENCIA MORENO 2', type: 'adulto', diet: '', tableId: 1, confirmed: true, originalGroup: 'HORTENCIA MORENO' });
        
        // MESA 2 - CEPI (1), RAQUEL (1), BRENDA (2+1), JESSI (1), JILLAN (2)
        this.guests.push({ id: guestId++, name: 'CEPI', type: 'adulto', diet: '', tableId: 2, confirmed: true, originalGroup: 'CEPI' });
        this.guests.push({ id: guestId++, name: 'RAQUEL', type: 'adulto', diet: '', tableId: 2, confirmed: true, originalGroup: 'RAQUEL' });
        this.guests.push({ id: guestId++, name: 'BRENDA 1', type: 'adulto', diet: '', tableId: 2, confirmed: true, originalGroup: 'BRENDA' });
        this.guests.push({ id: guestId++, name: 'BRENDA 2', type: 'adulto', diet: '', tableId: 2, confirmed: true, originalGroup: 'BRENDA' });
        this.guests.push({ id: guestId++, name: 'BRENDA (niño)', type: 'niño', diet: '', tableId: 2, confirmed: true, originalGroup: 'BRENDA' });
        this.guests.push({ id: guestId++, name: 'JESSI', type: 'adulto', diet: '', tableId: 2, confirmed: true, originalGroup: 'JESSI' });
        this.guests.push({ id: guestId++, name: 'JILLAN  1', type: 'adulto', diet: '', tableId: 2, confirmed: true, originalGroup: 'JILLAN ' });
        this.guests.push({ id: guestId++, name: 'JILLAN  2', type: 'adulto', diet: '', tableId: 2, confirmed: true, originalGroup: 'JILLAN ' });
        
        // MESA 3 - ATALIA (2), ANA (2), ANAHI (2), ALONDRA (2), VICKY (2)
        this.guests.push({ id: guestId++, name: 'ATALIA 1', type: 'adulto', diet: '', tableId: 3, confirmed: true, originalGroup: 'ATALIA' });
        this.guests.push({ id: guestId++, name: 'ATALIA 2', type: 'adulto', diet: '', tableId: 3, confirmed: true, originalGroup: 'ATALIA' });
        this.guests.push({ id: guestId++, name: 'ANA 1', type: 'adulto', diet: '', tableId: 3, confirmed: true, originalGroup: 'ANA' });
        this.guests.push({ id: guestId++, name: 'ANA 2', type: 'adulto', diet: '', tableId: 3, confirmed: true, originalGroup: 'ANA' });
        this.guests.push({ id: guestId++, name: 'ANAHI 1', type: 'adulto', diet: '', tableId: 3, confirmed: true, originalGroup: 'ANAHI' });
        this.guests.push({ id: guestId++, name: 'ANAHI 2', type: 'adulto', diet: '', tableId: 3, confirmed: true, originalGroup: 'ANAHI' });
        this.guests.push({ id: guestId++, name: 'ALONDRA 1', type: 'adulto', diet: '', tableId: 3, confirmed: true, originalGroup: 'ALONDRA' });
        this.guests.push({ id: guestId++, name: 'ALONDRA 2', type: 'adulto', diet: '', tableId: 3, confirmed: true, originalGroup: 'ALONDRA' });
        this.guests.push({ id: guestId++, name: 'VICKY 1', type: 'adulto', diet: '', tableId: 3, confirmed: true, originalGroup: 'VICKY' });
        this.guests.push({ id: guestId++, name: 'VICKY 2', type: 'adulto', diet: '', tableId: 3, confirmed: true, originalGroup: 'VICKY' });
        
        // MESA 4 - DIANA (4), ERIKA (4), CESAR (1), ALEX (1)
        this.guests.push({ id: guestId++, name: 'DIANA 1', type: 'adulto', diet: '', tableId: 4, confirmed: true, originalGroup: 'DIANA' });
        this.guests.push({ id: guestId++, name: 'DIANA 2', type: 'adulto', diet: '', tableId: 4, confirmed: true, originalGroup: 'DIANA' });
        this.guests.push({ id: guestId++, name: 'DIANA 3', type: 'adulto', diet: '', tableId: 4, confirmed: true, originalGroup: 'DIANA' });
        this.guests.push({ id: guestId++, name: 'DIANA 4', type: 'adulto', diet: '', tableId: 4, confirmed: true, originalGroup: 'DIANA' });
        this.guests.push({ id: guestId++, name: 'ERIKA 1', type: 'adulto', diet: '', tableId: 4, confirmed: true, originalGroup: 'ERIKA' });
        this.guests.push({ id: guestId++, name: 'ERIKA 2', type: 'adulto', diet: '', tableId: 4, confirmed: true, originalGroup: 'ERIKA' });
        this.guests.push({ id: guestId++, name: 'ERIKA 3', type: 'adulto', diet: '', tableId: 4, confirmed: true, originalGroup: 'ERIKA' });
        this.guests.push({ id: guestId++, name: 'ERIKA 4', type: 'adulto', diet: '', tableId: 4, confirmed: true, originalGroup: 'ERIKA' });
        this.guests.push({ id: guestId++, name: 'CESAR', type: 'adulto', diet: '', tableId: 4, confirmed: true, originalGroup: 'CESAR' });
        this.guests.push({ id: guestId++, name: 'ALEX', type: 'adulto', diet: '', tableId: 4, confirmed: true, originalGroup: 'ALEX' });
        
        // MESA 5 - FAMILIA DE CHUY (4), CLAUDIA (2+3)
        this.guests.push({ id: guestId++, name: 'FAMILIA DE CHUY 1', type: 'adulto', diet: '', tableId: 5, confirmed: true, originalGroup: 'FAMILIA DE CHUY' });
        this.guests.push({ id: guestId++, name: 'FAMILIA DE CHUY 2', type: 'adulto', diet: '', tableId: 5, confirmed: true, originalGroup: 'FAMILIA DE CHUY' });
        this.guests.push({ id: guestId++, name: 'FAMILIA DE CHUY 3', type: 'adulto', diet: '', tableId: 5, confirmed: true, originalGroup: 'FAMILIA DE CHUY' });
        this.guests.push({ id: guestId++, name: 'FAMILIA DE CHUY 4', type: 'adulto', diet: '', tableId: 5, confirmed: true, originalGroup: 'FAMILIA DE CHUY' });
        this.guests.push({ id: guestId++, name: 'CLAUDIA 1', type: 'adulto', diet: '', tableId: 5, confirmed: true, originalGroup: 'CLAUDIA' });
        this.guests.push({ id: guestId++, name: 'CLAUDIA 2', type: 'adulto', diet: '', tableId: 5, confirmed: true, originalGroup: 'CLAUDIA' });
        this.guests.push({ id: guestId++, name: 'CLAUDIA (niño 1)', type: 'niño', diet: '', tableId: 5, confirmed: true, originalGroup: 'CLAUDIA' });
        this.guests.push({ id: guestId++, name: 'CLAUDIA (niño 2)', type: 'niño', diet: '', tableId: 5, confirmed: true, originalGroup: 'CLAUDIA' });
        this.guests.push({ id: guestId++, name: 'CLAUDIA (niño 3)', type: 'niño', diet: '', tableId: 5, confirmed: true, originalGroup: 'CLAUDIA' });
        
        // MESA 6 - RIQUIS (3+1), HORTENCIA duran (2+1), adela (5)
        this.guests.push({ id: guestId++, name: 'RIQUIS 1', type: 'adulto', diet: '', tableId: 6, confirmed: true, originalGroup: 'RIQUIS' });
        this.guests.push({ id: guestId++, name: 'RIQUIS 2', type: 'adulto', diet: '', tableId: 6, confirmed: true, originalGroup: 'RIQUIS' });
        this.guests.push({ id: guestId++, name: 'RIQUIS 3', type: 'adulto', diet: '', tableId: 6, confirmed: true, originalGroup: 'RIQUIS' });
        this.guests.push({ id: guestId++, name: 'RIQUIS (niño)', type: 'niño', diet: '', tableId: 6, confirmed: true, originalGroup: 'RIQUIS' });
        this.guests.push({ id: guestId++, name: 'HORTENCIA duran 1', type: 'adulto', diet: '', tableId: 6, confirmed: true, originalGroup: 'HORTENCIA duran' });
        this.guests.push({ id: guestId++, name: 'HORTENCIA duran 2', type: 'adulto', diet: '', tableId: 6, confirmed: true, originalGroup: 'HORTENCIA duran' });
        this.guests.push({ id: guestId++, name: 'HORTENCIA duran (niño)', type: 'niño', diet: '', tableId: 6, confirmed: true, originalGroup: 'HORTENCIA duran' });
        this.guests.push({ id: guestId++, name: 'adela 1', type: 'adulto', diet: '', tableId: 6, confirmed: true, originalGroup: 'adela' });
        this.guests.push({ id: guestId++, name: 'adela 2', type: 'adulto', diet: '', tableId: 6, confirmed: true, originalGroup: 'adela' });
        this.guests.push({ id: guestId++, name: 'adela 3', type: 'adulto', diet: '', tableId: 6, confirmed: true, originalGroup: 'adela' });
        this.guests.push({ id: guestId++, name: 'adela 4', type: 'adulto', diet: '', tableId: 6, confirmed: true, originalGroup: 'adela' });
        this.guests.push({ id: guestId++, name: 'adela 5', type: 'adulto', diet: '', tableId: 6, confirmed: true, originalGroup: 'adela' });
        
        // MESA 7 - CHABELA (7), HUGO (2)
        this.guests.push({ id: guestId++, name: 'CHABELA 1', type: 'adulto', diet: '', tableId: 7, confirmed: true, originalGroup: 'CHABELA' });
        this.guests.push({ id: guestId++, name: 'CHABELA 2', type: 'adulto', diet: '', tableId: 7, confirmed: true, originalGroup: 'CHABELA' });
        this.guests.push({ id: guestId++, name: 'CHABELA 3', type: 'adulto', diet: '', tableId: 7, confirmed: true, originalGroup: 'CHABELA' });
        this.guests.push({ id: guestId++, name: 'CHABELA 4', type: 'adulto', diet: '', tableId: 7, confirmed: true, originalGroup: 'CHABELA' });
        this.guests.push({ id: guestId++, name: 'CHABELA 5', type: 'adulto', diet: '', tableId: 7, confirmed: true, originalGroup: 'CHABELA' });
        this.guests.push({ id: guestId++, name: 'CHABELA 6', type: 'adulto', diet: '', tableId: 7, confirmed: true, originalGroup: 'CHABELA' });
        this.guests.push({ id: guestId++, name: 'CHABELA 7', type: 'adulto', diet: '', tableId: 7, confirmed: true, originalGroup: 'CHABELA' });
        this.guests.push({ id: guestId++, name: 'HUGO 1', type: 'adulto', diet: '', tableId: 7, confirmed: true, originalGroup: 'HUGO' });
        this.guests.push({ id: guestId++, name: 'HUGO 2', type: 'adulto', diet: '', tableId: 7, confirmed: true, originalGroup: 'HUGO' });
        
        // MESA 8 - BERE (2), PATY (2), GABY (2), amigas jesi (3)
        this.guests.push({ id: guestId++, name: 'BERE 1', type: 'adulto', diet: '', tableId: 8, confirmed: true, originalGroup: 'BERE' });
        this.guests.push({ id: guestId++, name: 'BERE 2', type: 'adulto', diet: '', tableId: 8, confirmed: true, originalGroup: 'BERE' });
        this.guests.push({ id: guestId++, name: 'PATY 1', type: 'adulto', diet: '', tableId: 8, confirmed: true, originalGroup: 'PATY' });
        this.guests.push({ id: guestId++, name: 'PATY 2', type: 'adulto', diet: '', tableId: 8, confirmed: true, originalGroup: 'PATY' });
        this.guests.push({ id: guestId++, name: 'GABY 1', type: 'adulto', diet: '', tableId: 8, confirmed: true, originalGroup: 'GABY' });
        this.guests.push({ id: guestId++, name: 'GABY 2', type: 'adulto', diet: '', tableId: 8, confirmed: true, originalGroup: 'GABY' });
        this.guests.push({ id: guestId++, name: 'amigas jesi 1', type: 'adulto', diet: '', tableId: 8, confirmed: true, originalGroup: 'amigas jesi' });
        this.guests.push({ id: guestId++, name: 'amigas jesi 2', type: 'adulto', diet: '', tableId: 8, confirmed: true, originalGroup: 'amigas jesi' });
        this.guests.push({ id: guestId++, name: 'amigas jesi 3', type: 'adulto', diet: '', tableId: 8, confirmed: true, originalGroup: 'amigas jesi' });
        
        // MESA 9 - TIO PONCHO (2), PAPAS NOVIO (2), CALLIS (2), ABUELITO JUAN (1)
        this.guests.push({ id: guestId++, name: 'TIO PONCHO 1', type: 'adulto', diet: '', tableId: 9, confirmed: true, originalGroup: 'TIO PONCHO' });
        this.guests.push({ id: guestId++, name: 'TIO PONCHO 2', type: 'adulto', diet: '', tableId: 9, confirmed: true, originalGroup: 'TIO PONCHO' });
        this.guests.push({ id: guestId++, name: 'PAPAS NOVIO 1', type: 'adulto', diet: '', tableId: 9, confirmed: true, originalGroup: 'PAPAS NOVIO' });
        this.guests.push({ id: guestId++, name: 'PAPAS NOVIO 2', type: 'adulto', diet: '', tableId: 9, confirmed: true, originalGroup: 'PAPAS NOVIO' });
        this.guests.push({ id: guestId++, name: 'CALLIS 1', type: 'adulto', diet: '', tableId: 9, confirmed: true, originalGroup: 'CALLIS' });
        this.guests.push({ id: guestId++, name: 'CALLIS 2', type: 'adulto', diet: '', tableId: 9, confirmed: true, originalGroup: 'CALLIS' });
        this.guests.push({ id: guestId++, name: 'ABUELITO JUAN', type: 'adulto', diet: '', tableId: 9, confirmed: true, originalGroup: 'ABUELITO JUAN' });
        
        // MESA 10 - GEORGINA (6)
        this.guests.push({ id: guestId++, name: 'GEORGINA 1', type: 'adulto', diet: '', tableId: 10, confirmed: true, originalGroup: 'GEORGINA' });
        this.guests.push({ id: guestId++, name: 'GEORGINA 2', type: 'adulto', diet: '', tableId: 10, confirmed: true, originalGroup: 'GEORGINA' });
        this.guests.push({ id: guestId++, name: 'GEORGINA 3', type: 'adulto', diet: '', tableId: 10, confirmed: true, originalGroup: 'GEORGINA' });
        this.guests.push({ id: guestId++, name: 'GEORGINA 4', type: 'adulto', diet: '', tableId: 10, confirmed: true, originalGroup: 'GEORGINA' });
        this.guests.push({ id: guestId++, name: 'GEORGINA 5', type: 'adulto', diet: '', tableId: 10, confirmed: true, originalGroup: 'GEORGINA' });
        this.guests.push({ id: guestId++, name: 'GEORGINA 6', type: 'adulto', diet: '', tableId: 10, confirmed: true, originalGroup: 'GEORGINA' });
        
        // MESA 11 - OSCAR (2), EVER (2), HOUSTON (2), JAVIX (2)
        this.guests.push({ id: guestId++, name: 'OSCAR 1', type: 'adulto', diet: '', tableId: 11, confirmed: true, originalGroup: 'OSCAR' });
        this.guests.push({ id: guestId++, name: 'OSCAR 2', type: 'adulto', diet: '', tableId: 11, confirmed: true, originalGroup: 'OSCAR' });
        this.guests.push({ id: guestId++, name: 'EVER 1', type: 'adulto', diet: '', tableId: 11, confirmed: true, originalGroup: 'EVER' });
        this.guests.push({ id: guestId++, name: 'EVER 2', type: 'adulto', diet: '', tableId: 11, confirmed: true, originalGroup: 'EVER' });
        this.guests.push({ id: guestId++, name: 'HOUSTON 1', type: 'adulto', diet: '', tableId: 11, confirmed: true, originalGroup: 'HOUSTON' });
        this.guests.push({ id: guestId++, name: 'HOUSTON 2', type: 'adulto', diet: '', tableId: 11, confirmed: true, originalGroup: 'HOUSTON' });
        this.guests.push({ id: guestId++, name: 'JAVIX 1', type: 'adulto', diet: '', tableId: 11, confirmed: true, originalGroup: 'JAVIX' });
        this.guests.push({ id: guestId++, name: 'JAVIX 2', type: 'adulto', diet: '', tableId: 11, confirmed: true, originalGroup: 'JAVIX' });
        
        // MESA 12 - familia de fer (3), ADRIAN (2), carlitos (2), LUIS (2)
        this.guests.push({ id: guestId++, name: 'familia de fer 1', type: 'adulto', diet: '', tableId: 12, confirmed: true, originalGroup: 'familia de fer' });
        this.guests.push({ id: guestId++, name: 'familia de fer 2', type: 'adulto', diet: '', tableId: 12, confirmed: true, originalGroup: 'familia de fer' });
        this.guests.push({ id: guestId++, name: 'familia de fer 3', type: 'adulto', diet: '', tableId: 12, confirmed: true, originalGroup: 'familia de fer' });
        this.guests.push({ id: guestId++, name: 'ADRIAN 1', type: 'adulto', diet: '', tableId: 12, confirmed: true, originalGroup: 'ADRIAN' });
        this.guests.push({ id: guestId++, name: 'ADRIAN 2', type: 'adulto', diet: '', tableId: 12, confirmed: true, originalGroup: 'ADRIAN' });
        this.guests.push({ id: guestId++, name: 'carlitos 1', type: 'adulto', diet: '', tableId: 12, confirmed: true, originalGroup: 'carlitos' });
        this.guests.push({ id: guestId++, name: 'carlitos 2', type: 'adulto', diet: '', tableId: 12, confirmed: true, originalGroup: 'carlitos' });
        this.guests.push({ id: guestId++, name: 'LUIS 1', type: 'adulto', diet: '', tableId: 12, confirmed: true, originalGroup: 'LUIS' });
        this.guests.push({ id: guestId++, name: 'LUIS 2', type: 'adulto', diet: '', tableId: 12, confirmed: true, originalGroup: 'LUIS' });
        
        // MESA 13 - TERE (4), JESUS (2), BETO (4)
        this.guests.push({ id: guestId++, name: 'TERE 1', type: 'adulto', diet: '', tableId: 13, confirmed: true, originalGroup: 'TERE' });
        this.guests.push({ id: guestId++, name: 'TERE 2', type: 'adulto', diet: '', tableId: 13, confirmed: true, originalGroup: 'TERE' });
        this.guests.push({ id: guestId++, name: 'TERE 3', type: 'adulto', diet: '', tableId: 13, confirmed: true, originalGroup: 'TERE' });
        this.guests.push({ id: guestId++, name: 'TERE 4', type: 'adulto', diet: '', tableId: 13, confirmed: true, originalGroup: 'TERE' });
        this.guests.push({ id: guestId++, name: 'JESUS 1', type: 'adulto', diet: '', tableId: 13, confirmed: true, originalGroup: 'JESUS' });
        this.guests.push({ id: guestId++, name: 'JESUS 2', type: 'adulto', diet: '', tableId: 13, confirmed: true, originalGroup: 'JESUS' });
        this.guests.push({ id: guestId++, name: 'BETO 1', type: 'adulto', diet: '', tableId: 13, confirmed: true, originalGroup: 'BETO' });
        this.guests.push({ id: guestId++, name: 'BETO 2', type: 'adulto', diet: '', tableId: 13, confirmed: true, originalGroup: 'BETO' });
        this.guests.push({ id: guestId++, name: 'BETO 3', type: 'adulto', diet: '', tableId: 13, confirmed: true, originalGroup: 'BETO' });
        this.guests.push({ id: guestId++, name: 'BETO 4', type: 'adulto', diet: '', tableId: 13, confirmed: true, originalGroup: 'BETO' });
        
        // MESA 14 - EVA (2), ANDREA (2), tío hector (2), tia luz (2)
        this.guests.push({ id: guestId++, name: 'EVA 1', type: 'adulto', diet: '', tableId: 14, confirmed: true, originalGroup: 'EVA' });
        this.guests.push({ id: guestId++, name: 'EVA 2', type: 'adulto', diet: '', tableId: 14, confirmed: true, originalGroup: 'EVA' });
        this.guests.push({ id: guestId++, name: 'ANDREA 1', type: 'adulto', diet: '', tableId: 14, confirmed: true, originalGroup: 'ANDREA' });
        this.guests.push({ id: guestId++, name: 'ANDREA 2', type: 'adulto', diet: '', tableId: 14, confirmed: true, originalGroup: 'ANDREA' });
        this.guests.push({ id: guestId++, name: 'tío hector 1', type: 'adulto', diet: '', tableId: 14, confirmed: true, originalGroup: 'tío hector' });
        this.guests.push({ id: guestId++, name: 'tío hector 2', type: 'adulto', diet: '', tableId: 14, confirmed: true, originalGroup: 'tío hector' });
        this.guests.push({ id: guestId++, name: 'tia luz 1', type: 'adulto', diet: '', tableId: 14, confirmed: true, originalGroup: 'tia luz' });
        this.guests.push({ id: guestId++, name: 'tia luz 2', type: 'adulto', diet: '', tableId: 14, confirmed: true, originalGroup: 'tia luz' });
        
        // MESA 15 - RENE (2), STEVE (2), ALEJANDRO (2), POLLO (2), JORGE (1)
        this.guests.push({ id: guestId++, name: 'RENE 1', type: 'adulto', diet: '', tableId: 15, confirmed: true, originalGroup: 'RENE' });
        this.guests.push({ id: guestId++, name: 'RENE 2', type: 'adulto', diet: '', tableId: 15, confirmed: true, originalGroup: 'RENE' });
        this.guests.push({ id: guestId++, name: 'STEVE 1', type: 'adulto', diet: '', tableId: 15, confirmed: true, originalGroup: 'STEVE' });
        this.guests.push({ id: guestId++, name: 'STEVE 2', type: 'adulto', diet: '', tableId: 15, confirmed: true, originalGroup: 'STEVE' });
        this.guests.push({ id: guestId++, name: 'ALEJANDRO 1', type: 'adulto', diet: '', tableId: 15, confirmed: true, originalGroup: 'ALEJANDRO' });
        this.guests.push({ id: guestId++, name: 'ALEJANDRO 2', type: 'adulto', diet: '', tableId: 15, confirmed: true, originalGroup: 'ALEJANDRO' });
        this.guests.push({ id: guestId++, name: 'POLLO 1', type: 'adulto', diet: '', tableId: 15, confirmed: true, originalGroup: 'POLLO' });
        this.guests.push({ id: guestId++, name: 'POLLO 2', type: 'adulto', diet: '', tableId: 15, confirmed: true, originalGroup: 'POLLO' });
        this.guests.push({ id: guestId++, name: 'JORGE', type: 'adulto', diet: '', tableId: 15, confirmed: true, originalGroup: 'JORGE' });
        
        // INVITADOS SIN MESA ASIGNADA
        this.guests.push({ id: guestId++, name: 'MARIFER 1', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'MARIFER' });
        this.guests.push({ id: guestId++, name: 'MARIFER 2', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'MARIFER' });
        this.guests.push({ id: guestId++, name: 'CINTIA 1', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'CINTIA' });
        this.guests.push({ id: guestId++, name: 'CINTIA 2', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'CINTIA' });
        this.guests.push({ id: guestId++, name: 'TIO ARMANDO 1', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'TIO ARMANDO' });
        this.guests.push({ id: guestId++, name: 'TIO ARMANDO 2', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'TIO ARMANDO' });
        this.guests.push({ id: guestId++, name: 'PACO 1', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'PACO' });
        this.guests.push({ id: guestId++, name: 'PACO 2', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'PACO' });
        this.guests.push({ id: guestId++, name: 'TIA TITA 1', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'TIA TITA' });
        this.guests.push({ id: guestId++, name: 'TIA TITA 2', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'TIA TITA' });
        this.guests.push({ id: guestId++, name: 'TIA SILVIA 1', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'TIA SILVIA' });
        this.guests.push({ id: guestId++, name: 'TIA SILVIA 2', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'TIA SILVIA' });
        this.guests.push({ id: guestId++, name: 'CAROL 1', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'CAROL' });
        this.guests.push({ id: guestId++, name: 'CAROL 2', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'CAROL' });
        this.guests.push({ id: guestId++, name: 'MARIANA 1', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'MARIANA' });
        this.guests.push({ id: guestId++, name: 'MARIANA 2', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'MARIANA' });
        this.guests.push({ id: guestId++, name: 'ABUELITO ARMANDO 1', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'ABUELITO ARMANDO' });
        this.guests.push({ id: guestId++, name: 'ABUELITO ARMANDO 2', type: 'adulto', diet: '', tableId: null, confirmed: true, originalGroup: 'ABUELITO ARMANDO' });
        
        // Faltaba el invitado "contador" de la Mesa 1
        this.guests.push({ id: guestId++, name: 'contador 1', type: 'adulto', diet: '', tableId: 1, confirmed: true, originalGroup: 'contador' });
        this.guests.push({ id: guestId++, name: 'contador 2', type: 'adulto', diet: '', tableId: 1, confirmed: true, originalGroup: 'contador' });
        
        console.log(`✅ Cargados ${this.guests.length} invitados ESTÁTICOS (${this.guests.filter(g => g.type === 'adulto').length} adultos, ${this.guests.filter(g => g.type === 'niño').length} niños)`);
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        this.guests = [];
        let guestId = 1;
        
        // Skip header and process each line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.includes('TOTALES')) continue;
            
            const columns = line.split(',');
            const invitado = columns[0]?.trim();
            const mesa = columns[1]?.trim();
            const adultos = parseInt(columns[2]) || 0;
            const ninos = parseInt(columns[3]) || 0;
            
            if (!invitado || invitado === 'TOTALES') continue;
            
            // Create individual guests for adults - MISMA LÓGICA QUE PROYECTO ORIGINAL
            for (let j = 1; j <= adultos; j++) {
                const guestName = adultos > 1 ? `${invitado} ${j}` : invitado;
                const guest = {
                    id: guestId++,
                    name: guestName,
                    type: 'adulto',
                    diet: '',
                    tableId: mesa && !isNaN(parseInt(mesa)) ? parseInt(mesa) : null,
                    confirmed: true,
                    originalGroup: invitado
                };
                this.guests.push(guest);
            }
            
            // Create individual guests for children - MISMA LÓGICA QUE PROYECTO ORIGINAL
            for (let j = 1; j <= ninos; j++) {
                const guestName = ninos > 1 ? `${invitado} (niño ${j})` : `${invitado} (niño)`;
                const guest = {
                    id: guestId++,
                    name: guestName,
                    type: 'niño',
                    diet: '',
                    tableId: mesa && !isNaN(parseInt(mesa)) ? mesa : null,
                    confirmed: true,
                    originalGroup: invitado
                };
                this.guests.push(guest);
            }
        }
        
        console.log(`Cargados ${this.guests.length} invitados (${this.guests.filter(g => g.type === 'adulto').length} adultos, ${this.guests.filter(g => g.type === 'niño').length} niños)`);
        
        // Debug: mostrar algunos ejemplos de invitados cargados
        console.log('Ejemplos de invitados cargados:');
        this.guests.slice(0, 10).forEach(guest => {
            console.log(`- ${guest.name} (Mesa: ${guest.tableId}, Tipo: ${guest.type})`);
        });
    }

    // Ya no necesitamos parseCSV, parseCSVLine ni createSampleData - datos hardcodeados arriba

    setupTables() {
        // Calcular capacidades basándose en los datos reales
        const tableCapacities = {
            1: 8,   // MEMO mayra (4+2) + HORTENCIA MORENO (2) + contador (2)
            2: 7,   // CEPI (1) + RAQUEL (1) + BRENDA (2+1) + JESSI (1) + JILLAN (2)
            3: 10,  // ATALIA (2) + ANA (2) + ANAHI (2) + ALONDRA (2) + VICKY (2)
            4: 10,  // DIANA (4) + ERIKA (4) + CESAR (1) + ALEX (1)
            5: 9,   // FAMILIA DE CHUY (4) + CLAUDIA (2+3)
            6: 10,  // RIQUIS (3+1) + HORTENCIA duran (2+1) + adela (5)
            7: 9,   // CHABELA (7) + HUGO (2)
            8: 9,   // BERE (2) + PATY (2) + GABY (2) + amigas jesi (3)
            9: 7,   // TIO PONCHO (2) + PAPAS NOVIO (2) + CALLIS (2) + ABUELITO JUAN (1)
            10: 6,  // GEORGINA (6)
            11: 8,  // OSCAR (2) + EVER (2) + HOUSTON (2) + JAVIX (2)
            12: 9,  // familia de fer (3) + ADRIAN (2) + carlitos (2) + LUIS (2)
            13: 10, // TERE (4) + JESUS (2) + BETO (4)
            14: 8,  // EVA (2) + ANDREA (2) + tío hector (2) + tia luz (2)
            15: 9   // RENE (2) + STEVE (2) + ALEJANDRO (2) + POLLO (2) + JORGE (1)
        };
        
        for (let i = 1; i <= 15; i++) {
            const tableGuests = this.guests.filter(guest => guest.tableId === i);
            this.tables.set(i, {
                id: i,
                capacity: tableCapacities[i] || 10,
                guests: tableGuests
            });
            
            // Debug: mostrar asignaciones por mesa
            if (tableGuests.length > 0) {
                console.log(`Mesa ${i}: ${tableGuests.length} invitados -`, tableGuests.map(g => g.name).join(', '));
            }
        }
        
        // Mesa de novios
        this.tables.set('bride-groom', {
            id: 'bride-groom',
            capacity: 2,
            guests: []
        });
    }

    setupEventListeners() {
        // Mesas - Click para abrir modal
        document.querySelectorAll('.mobile-table').forEach(table => {
            table.addEventListener('click', (e) => {
                e.preventDefault();
                const tableId = table.dataset.table;
                this.showTableModal(tableId);
            });
        });

        // Modal - Cerrar
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('mobileModal').addEventListener('click', (e) => {
            if (e.target.id === 'mobileModal') {
                this.closeModal();
            }
        });
    }

    setupTouchEvents() {
        // Prevenir zoom accidental
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        // Haptic feedback en mesas
        document.querySelectorAll('.mobile-table').forEach(table => {
            table.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    // Funciones de tabs eliminadas - ya no necesarias

    showTableModal(tableId) {
        const table = this.tables.get(tableId === 'bride-groom' ? 'bride-groom' : parseInt(tableId));
        if (!table) return;

        const modal = document.getElementById('mobileModal');
        const title = document.getElementById('modalTitle');
        const visual = document.getElementById('modalTableVisual');
        const assigned = document.getElementById('modalAssignedGuests');
        const available = document.getElementById('modalAvailableGuests');

        title.textContent = tableId === 'bride-groom' ? 'Mesa Novios' : `Mesa ${tableId}`;
        
        // Crear representación visual de la mesa con sillas
        visual.innerHTML = this.createTableVisualization(table, tableId);
        
        // Invitados asignados
        assigned.innerHTML = `
            <h4>Invitados Asignados (${table.guests.length}/${table.capacity})</h4>
            <div class="guest-chips">
                ${table.guests.map(guest => `
                    <div class="guest-chip" onclick="app.moveGuest(${guest.id}, null)">
                        ${guest.name}
                    </div>
                `).join('')}
            </div>
        `;

        // Invitados disponibles
        const unassignedGuests = this.guests.filter(guest => !guest.tableId || guest.tableId === null);
        available.innerHTML = `
            <h4>Invitados Disponibles (${unassignedGuests.length})</h4>
            <div class="guest-chips">
                ${unassignedGuests.slice(0, 10).map(guest => `
                    <div class="guest-chip available" onclick="app.moveGuest(${guest.id}, ${tableId === 'bride-groom' ? "'bride-groom'" : tableId})">
                        ${guest.name}
                    </div>
                `).join('')}
                ${unassignedGuests.length > 10 ? '<div class="guest-chip available">...</div>' : ''}
            </div>
        `;

        modal.classList.add('active');
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }

    closeModal() {
        document.getElementById('mobileModal').classList.remove('active');
    }

    moveGuest(guestId, newTableId) {
        const guest = this.guests.find(g => g.id === guestId);
        if (!guest) return;

        // Remover de mesa anterior
        if (guest.tableId) {
            const oldTable = this.tables.get(guest.tableId);
            if (oldTable) {
                oldTable.guests = oldTable.guests.filter(g => g.id !== guestId);
            }
        }

        // Asignar a nueva mesa
        guest.tableId = newTableId;
        if (newTableId) {
            const newTable = this.tables.get(newTableId);
            if (newTable && newTable.guests.length < newTable.capacity) {
                newTable.guests.push(guest);
            }
        }

        this.updateDisplay();
        
        // Cerrar modal después de mover
        setTimeout(() => {
            this.closeModal();
        }, 500);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([10, 50, 10]);
        }

        console.log(`Movido ${guest.name} a ${newTableId ? `mesa ${newTableId}` : 'sin asignar'}`);
    }

    showGuestOptions(guest) {
        // Simple implementación - mostrar alerta con opciones
        const tableOptions = Array.from(this.tables.keys())
            .filter(tableId => {
                const table = this.tables.get(tableId);
                return table.guests.length < table.capacity;
            })
            .slice(0, 5);

        if (tableOptions.length > 0) {
            const choice = prompt(`¿A qué mesa asignar a ${guest.name}?\n${tableOptions.join(', ')}`);
            if (choice) {
                const tableId = choice === 'bride-groom' ? 'bride-groom' : parseInt(choice);
                if (this.tables.has(tableId)) {
                    this.moveGuest(guest.id, tableId);
                }
            }
        }
    }

    updateDisplay() {
        // Actualizar contadores en mesas
        document.querySelectorAll('.mobile-table').forEach(tableElement => {
            const tableId = tableElement.dataset.table;
            const guestCountElement = tableElement.querySelector('.table-guests');
            
            if (guestCountElement && tableId !== 'bride-groom') {
                const table = this.tables.get(parseInt(tableId));
                if (table) {
                    guestCountElement.textContent = `${table.guests.length}/${table.capacity}`;
                    
                    // Cambiar color según ocupación
                    const occupancy = table.guests.length / table.capacity;
                    if (occupancy >= 1) {
                        tableElement.style.borderColor = '#e74c3c';
                    } else if (occupancy >= 0.8) {
                        tableElement.style.borderColor = '#f39c12';
                    } else {
                        tableElement.style.borderColor = '#27ae60';
                    }
                }
            }
        });

        // Actualizar contador global
        const totalGuests = this.guests.filter(guest => guest.tableId).length;
        document.getElementById('guestCount').textContent = totalGuests;
    }

    createTableVisualization(table, tableId) {
        const isSpecialTable = tableId === 'bride-groom';
        const capacity = table.capacity;
        const guests = table.guests;
        
        // Crear el contenedor de la mesa
        let html = `<div class="table-visual-container">`;
        
        if (isSpecialTable) {
            // Mesa especial de novios (rectangular)
            html += `<div class="visual-table bride-groom-table">
                        <div class="table-label">♥ Mesa Novios ♥</div>
                     </div>`;
            
            // Sillas para mesa de novios (2 sillas en los lados largos)
            html += `<div class="chairs-container bride-groom-chairs">`;
            for (let i = 0; i < 2; i++) {
                const guest = guests[i];
                const centerX = 110; // Centro del contenedor
                const centerY = 110; // Centro del contenedor
                
                // Posicionar sillas a los lados de la mesa rectangular
                const x = i === 0 ? centerX - 85 : centerX + 50; // Izquierda y derecha
                const y = centerY - 20; // Centrado verticalmente
                
                const guestClass = !guest ? 'available' : (guest.type === 'niño' ? 'child' : 'adult');
                
                html += `<div class="chair ${guestClass}" 
                           style="left: ${x}px; top: ${y}px;"
                           data-position="${i}" 
                           onclick="app.handleChairClick('${tableId}', ${i})">
                    <div class="chair-back"></div>
                    <div class="chair-name">${guest ? guest.name : 'Disponible'}</div>
                </div>`;
            }
            html += `</div>`;
        } else {
            // Mesa redonda normal
            html += `<div class="visual-table round-table">
                        <div class="table-label">Mesa ${tableId}</div>
                     </div>`;
            
            // Sillas alrededor de la mesa redonda
            html += `<div class="chairs-container round-chairs">`;
            for (let i = 0; i < capacity; i++) {
                const angle = (2 * Math.PI / capacity) * i - Math.PI / 2; // Empezar desde arriba
                const radius = 85; // Distancia desde el centro de la mesa
                const centerX = 110; // Centro del contenedor (220px / 2)
                const centerY = 110; // Centro del contenedor (220px / 2)
                
                // Calcular posición X,Y usando trigonometría
                const x = centerX + Math.cos(angle) * radius - 17.5; // -17.5 para centrar la silla (35px/2)
                const y = centerY + Math.sin(angle) * radius - 20; // -20 para centrar la silla (40px/2)
                
                const guest = guests[i];
                const guestClass = !guest ? 'available' : (guest.type === 'niño' ? 'child' : 'adult');
                
                html += `<div class="chair ${guestClass}" 
                           style="left: ${x}px; top: ${y}px;"
                           data-position="${i}"
                           onclick="app.handleChairClick(${tableId}, ${i})">
                    <div class="chair-back"></div>
                    <div class="chair-name">${guest ? guest.name : 'Disponible'}</div>
                </div>`;
            }
            html += `</div>`;
        }
        
        html += `</div>`;
        return html;
    }

    handleChairClick(tableId, chairPosition) {
        const table = this.tables.get(tableId === 'bride-groom' ? 'bride-groom' : parseInt(tableId));
        if (!table) return;

        const guest = table.guests[chairPosition];
        
        if (guest) {
            // Si hay un invitado, removerlo de la mesa
            if (confirm(`¿Remover a ${guest.name} de esta mesa?`)) {
                this.moveGuest(guest.id, null);
                // Refrescar modal
                this.showTableModal(tableId);
            }
        } else {
            // Si la silla está vacía, mostrar lista de invitados disponibles
            const unassignedGuests = this.guests.filter(g => !g.tableId || g.tableId === null);
            if (unassignedGuests.length > 0) {
                const guestNames = unassignedGuests.slice(0, 5).map((g, i) => `${i + 1}. ${g.name}`).join('\n');
                const moreGuests = unassignedGuests.length > 5 ? `\n... y ${unassignedGuests.length - 5} más` : '';
                const message = `Seleccione un invitado para asignar a esta silla:\n\n${guestNames}${moreGuests}\n\nIngrese el número del invitado (1-${Math.min(5, unassignedGuests.length)}):`;
                
                const selection = prompt(message);
                const index = parseInt(selection) - 1;
                
                if (index >= 0 && index < Math.min(5, unassignedGuests.length)) {
                    this.moveGuest(unassignedGuests[index].id, tableId === 'bride-groom' ? 'bride-groom' : tableId);
                    // Refrescar modal
                    this.showTableModal(tableId);
                }
            } else {
                alert('No hay invitados disponibles para asignar.');
            }
        }
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MobileSeatingApp();
});

// Prevenir zoom accidental
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

// Manejar orientación
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.location.reload();
    }, 100);
});