$(document).ready(function() {
    const envelope = $('.envelope');
    const splashScreen = $('.splash-screen');
    const clickTip = $('.splash-click-tip');
    const welcomeMessage = $('.splash-welcome-message');
    
    // Prevent page scrolling when splash screen is active
    $('body').css('overflow', 'hidden');
    
    // Enhanced envelope interaction
    envelope.on('click', function() {
        $(this).addClass('open');
        
        // Hide only the click tip when envelope opens, keep welcome message
        clickTip.fadeOut(300);
        
        // After envelope animation completes, fade out splash screen
        setTimeout(function() {
            splashScreen.addClass('fade-out');
            // Re-enable scrolling when splash screen fades out
            setTimeout(function() {
                $('body').css('overflow', 'auto');
            }, 500); // Wait for fade-out transition to complete
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
