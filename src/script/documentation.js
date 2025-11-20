
const documentationCardTemplate = document.querySelector("[data-documentation-card-template]")
const documentationCardsContainer = document.querySelector("[data-documentation-cards-container]")
const searchInput = document.querySelector("[data-search]")

let users = []
let allDocs = []

searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    console.log(users)
    users.forEach(user => {
        const isVisible = user.Title.toLowerCase().includes(value)
        user.element.classList.toggle("hide", !isVisible)
    })
})

//===================== Database fetch endpoint and documentation template logic ===================

function loadRecentDocs() {
    fetch("https://aghdvamgskydtpmipmcr.supabase.co/functions/v1/get-recent-docs", {
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnaGR2YW1nc2t5ZHRwbWlwbWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzQxNjQsImV4cCI6MjA3ODY1MDE2NH0.ItFy4XusgYDHUU5ihRLLaaL4iI_l71KKch0Y5dl5KuU'
        }
    })
    .then(res => res.json())
    .then(data => {
        displayAllDocs(data);
    });
}

function loadAllDocs() {
return fetch("https://aghdvamgskydtpmipmcr.supabase.co/functions/v1/get-documentation-full", {
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnaGR2YW1nc2t5ZHRwbWlwbWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzQxNjQsImV4cCI6MjA3ODY1MDE2NH0.ItFy4XusgYDHUU5ihRLLaaL4iI_l71KKch0Y5dl5KuU'
    }
})
    .then(res => res.json())
    .then(data => {
        allDocs = data;
        return data;
    });
}

function displayAllDocs(data) {
    documentationCardsContainer.innerHTML = '';

    users = data.map(user => {
        const card = documentationCardTemplate.content.cloneNode(true).children[0]

        const Title = card.querySelector("[data-title]")
        const Content = card.querySelector("[data-content]")
        const Categories = card.querySelector("[data-categories]")
        const Version = card.querySelector("[data-version_no]")
        const Updated_at = card.querySelector("[data-updation_date]")

        Title.textContent = user.Title
        Content.textContent = user.Content
        //console.log("Content element:", Content)
        //console.log("Content text:", user.Content)
        //console.log("Content computed color:", window.getComputedStyle(Content).color)
        Categories.textContent = user.Categories?.name || 'N/A'
        Version.textContent = user.Version?.version_number || 'N/A'
        Updated_at.textContent = user.Updated_at

        documentationCardsContainer.append(card)
        return {
            Title: user.Title, 
            Content: user.Content,
            Category: user.Categories, 
            Version: user.Version, 
            Updated_at: user.Updated_at,
            element: card
        }
    })
    
    document.querySelectorAll('.documentation-cards .card').forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const docData = users[index];
            openDocModal(docData);
        });
    });
}

searchInput.addEventListener("input", async (e) => {
    const value = e.target.value.toLowerCase().trim();
    
    if (value === '') {
        loadRecentDocs();
    } else {
        await loadAllDocs();
        const filtered = allDocs.filter(doc => 
            doc.Title.toLowerCase().includes(value)
        );
        displayAllDocs(filtered);
    }
});

loadRecentDocs();

//================================== Zoom in modal logic ===========================================

const modal = document.getElementById('docModal');
const modalBody = modal.querySelector('.doc-modal-body');
const modalClose = modal.querySelector('.doc-modal-close');
const modalBackdrop = modal.querySelector('.doc-modal-backdrop');

function openDocModal(docData) {
    //console.log("Modal data:", docData);
    //console.log("Content specifically:", docData.Content);

    modalBody.innerHTML = `
        <h2>${docData.Title}</h2>
        <div class="meta-info">
            <div class="meta-item">
                <strong>Category</strong>
                ${docData.Categories?.name || 'N/A'}
            </div>
            <div class="meta-item">
                <strong>Version</strong>
                ${docData.Version?.version_number || 'N/A'}
            </div>
            <div class="meta-item">
                <strong>Last Updated</strong>
                ${new Date(docData.Updated_at).toLocaleDateString()}
            </div>
        </div>
        <div class="doc-content">
            ${docData.Content || 'No content available.'}
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDocModal() {
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('active', 'closing');
        document.body.style.overflow = '';
    }, 300);
}

modalClose.addEventListener('click', closeDocModal);
modalBackdrop.addEventListener('click', closeDocModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeDocModal();
    }
});

//==================================================================================================