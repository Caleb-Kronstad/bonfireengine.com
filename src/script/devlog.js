document.querySelectorAll('.blog-post-header').forEach(header => {
    header.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const arrow = this.querySelector('.blog-post-arrow');
        
        // Close all other posts
        document.querySelectorAll('.blog-post-content').forEach(otherContent => {
            if (otherContent !== content && otherContent.classList.contains('open')) {
                otherContent.classList.remove('open');
                otherContent.previousElementSibling.classList.remove('active');
                otherContent.previousElementSibling.querySelector('.blog-post-arrow').classList.remove('open');
            }
        });
        
        // Toggle current post
        content.classList.toggle('open');
        this.classList.toggle('active');
        arrow.classList.toggle('open');
    });
});