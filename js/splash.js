$(document).ready(function() {
    const envelope = $('.envelope');
    const splashScreen = $('.splash-screen');
    const clickTip = $('.splash-click-tip');
    
    // Enhanced envelope interaction
    envelope.on('click', function() {
        $(this).addClass('open');
        
        // Hide the tip immediately when clicked
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
    });
    
    envelope.on('mouseleave', function() {
        clickTip.css('animation-play-state', 'running');
        clickTip.animate({ opacity: 0.7 }, 200);
    });
    
    // Auto-hide tip after some time if user doesn't interact
    setTimeout(function() {
        if (!envelope.hasClass('open')) {
            clickTip.fadeOut(1000);
        }
    }, 8000); // Hide after 8 seconds
});
