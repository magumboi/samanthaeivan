$(document).ready(function() {
    const envelope = $('.envelope');
    const splashScreen = $('.splash-screen');
    
    envelope.on('click', function() {
        $(this).addClass('open');
        
        // After envelope animation completes, fade out splash screen
        setTimeout(function() {
            splashScreen.addClass('fade-out');
        }, 1500); // Adjust timing as needed
    });
});
