$(document).ready(function() {
    const envelope = $('.envelope');
    const splashScreen = $('.splash-screen');
    const clickTip = $('.splash-click-tip');
    const welcomeMessage = $('.splash-welcome-message');
    
    // Enhanced envelope interaction
    envelope.on('click', function() {
        $(this).addClass('open');
        
        // Hide only the click tip when envelope opens, keep welcome message
        clickTip.fadeOut(300);
        
        // After envelope animation completes, fade out splash screen
        setTimeout(function() {
            splashScreen.addClass('fade-out');
        }, 1500); // Adjust timing as needed
    });
    
    // Add hover effects for better user experience
    envelope.on('mouseenter', function() {
        clickTip.css('animation-play-state', 'paused');
        clickTip.animate({ opacity: 1 }, 200);
        welcomeMessage.animate({ opacity: 1 }, 200);
    });
    
    envelope.on('mouseleave', function() {
        clickTip.css('animation-play-state', 'running');
        clickTip.animate({ opacity: 0.7 }, 200);
        welcomeMessage.animate({ opacity: 0.8 }, 200);
    });
});
