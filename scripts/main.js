/**
 * MAIN ENTRY POINT
 * Refactored to ensure global functions are available immediately.
 */

// ==========================================
// GLOBAL EVENT HANDLERS (Available to HTML)
// ==========================================

// --- 1. Volunteer Modal ---
window.openVolunteerModal = () => {
    const modal = document.getElementById('volunteer-modal');
    if (modal) modal.classList.add('active');
};

window.closeVolunteerModal = () => {
    const modal = document.getElementById('volunteer-modal');
    if (modal) modal.classList.remove('active');
};

// Volunteer Form Logic - defined globally so onsubmit works
window.submitVolunteerForm = async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const formData = {
        type: 'volunteer',
        full_name: document.getElementById('v-name').value,
        parent_name: document.getElementById('v-guardian').value,
        age: document.getElementById('v-age').value,
        gender: document.getElementById('v-gender').value,
        mobile: document.getElementById('v-phone').value,
        email: document.getElementById('v-email').value,
        address: document.getElementById('v-address').value,
        occupation: document.getElementById('v-occupation').value,
        availability: document.getElementById('v-availability').value,
        area_of_interest: document.getElementById('v-area').value,
        preferred_time: document.getElementById('v-slot').value,
        emergency_contact: document.getElementById('v-emergency').value,
        consent: document.getElementById('v-consent').checked ? 'Yes' : 'No'
    };
    
    console.log("Volunteer Registration Data:", formData);

    try {
        if(window.ApiService) {
            await window.ApiService.submitData(formData);
            alert(`Jai Sri Rama! Thank you, ${formData.full_name}. Your registration for ${formData.area_of_interest} has been received.`);
        } else {
            console.warn("ApiService missing, simulating success");
            alert(`Jai Sri Rama! Thank you, ${formData.full_name}. (Simulation)`);
        }
        window.closeVolunteerModal();
        e.target.reset();
    } catch (err) {
        alert("Submission failed. Please check your connection.");
        console.error(err);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Register as Volunteer";
    }
};

// --- 2. Coming Soon Modal ---
window.openComingSoonModal = (featureName) => {
    const modal = document.getElementById('coming-soon-modal');
    const textElement = document.getElementById('coming-soon-text');
    if (modal && textElement) {
        textElement.textContent = `${featureName} is currently under progress. Please check back later.`;
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
};

window.closeComingSoonModal = () => {
    const modal = document.getElementById('coming-soon-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
};
// --- 3. Festivals Modal ---
window.openFestivalsModal = () => {
    const modal = document.getElementById('festivals-modal');
    const container = document.getElementById('festival-list-container');
    
    // Hardcoded Festivals Data as per user request (used as fallback)
    const mfestivals = [
        { name: "ఉగాది", date: "22-03-2026", description: "తెలుగు నూతన సంవత్సర ఆరంభం" },
        { name: "శ్రీ రామ నవమి", date: "29-03-2026", description: "శ్రీ రామచంద్ర స్వామి జన్మోత్సవం" },
        { name: "హనుమాన్ జయంతి", date: "04-04-2026", description: "శ్రీ హనుమంతుని జన్మదినం" },
        { name: "శ్రీ కృష్ణ జన్మాష్టమి", date: "16-08-2026", description: "శ్రీ కృష్ణుని అవతార దినం" },
        { name: "వినాయక చవితి", date: "13-09-2026", description: "విఘ్నేశ్వరుని పూజోత్సవం" },
        { name: "దసరా (విజయదశమి)", date: "22-10-2026", description: "ధర్మ విజయం సూచించే పండుగ" },
        { name: "దీపావళి", date: "08-11-2026", description: "దీపాల పండుగ" }
    ];

    const displayFestivals = (window.TEMPLE_DATA && window.TEMPLE_DATA.festivals && window.TEMPLE_DATA.festivals.length > 0) 
        ? window.TEMPLE_DATA.festivals 
        : mfestivals;
    
    if (modal && container) {
        let html = '';
        if (!displayFestivals || displayFestivals.length === 0) {
             html = '<p style="text-align:center; padding:20px;">No upcoming festivals listed.</p>';
        } else {
            displayFestivals.forEach(fest => {
                html += `
                    <div class="festival-item">
                        <div class="festival-date">${fest.date}</div>
                        <div class="festival-content">
                            <h3>${fest.name}</h3>
                            <p>${fest.description}</p>
                        </div>
                    </div>
                `;
            });
        }
        container.innerHTML = html;
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
};

window.closeFestivalsModal = () => {
    const modal = document.getElementById('festivals-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
};

// --- 4. Darshan Modal ---
window.openDarshanModal = () => {
    const modal = document.getElementById('darshan-modal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
};

window.closeDarshanModal = () => {
    const modal = document.getElementById('darshan-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
};

// --- 5. History Modal ---
window.openHistoryModal = () => {
    const modal = document.getElementById('history-modal');
    if (modal) {
        modal.style.display = 'block'; 
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        setTimeout(() => modal.classList.add('active'), 10);
    } else {
        console.error("History Modal element not found in DOM");
    }
};

window.closeHistoryModal = () => {
    const modal = document.getElementById('history-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
        setTimeout(() => modal.style.display = 'none', 300);
    }
};

// --- 5b. Committees Modal ---
window.openCommitteesModal = () => {
    const modal = document.getElementById('committees-modal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
};

window.closeCommitteesModal = () => {
    const modal = document.getElementById('committees-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
};

// --- 6. Lightbox ---
window.openLightbox = (element, type = 'image') => {
    const modal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (modal && lightboxImg) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Remove any existing video
        const oldVideo = modal.querySelector('video');
        if(oldVideo) oldVideo.remove();
        
        if (type === 'video') {
            lightboxImg.style.display = 'none';
            const video = document.createElement('video');
            video.src = element.dataset.url || element.src;
            video.controls = true;
            video.autoplay = true;
            video.className = 'lightbox-content';
            video.style.maxWidth = '90%';
            video.style.maxHeight = '90vh';
            modal.appendChild(video);
        } else {
            lightboxImg.style.display = 'block';
            lightboxImg.src = element.src || element.querySelector('img').src;
            lightboxImg.alt = element.alt || 'Gallery Image';
        }
    }
}

window.closeLightbox = () => {
    const modal = document.getElementById('lightbox-modal');
    if(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            // Stop and remove video if exists
            const video = modal.querySelector('video');
            if(video) video.remove();
        }, 300);
    }
}


// --- 7. Gallery Interaction ---
window.scrollGallery = (direction) => {
    const gallery = document.getElementById('gallery-scroll');
    const viewport = document.querySelector('.gallery-viewport');
    
    if (gallery && viewport) {
        const scrollAmount = viewport.clientWidth; 
        
        if (direction === 'left') {
            gallery.scrollLeft -= scrollAmount;
        } else {
            gallery.scrollLeft += scrollAmount;
        }
    }
};


// --- Check and Close Modals on Outside Click ---
window.onclick = (event) => {
    const modals = [
        { el: document.getElementById('volunteer-modal'), close: window.closeVolunteerModal },
        { el: document.getElementById('coming-soon-modal'), close: window.closeComingSoonModal },
        { el: document.getElementById('darshan-modal'), close: window.closeDarshanModal },
        { el: document.getElementById('festivals-modal'), close: window.closeFestivalsModal },
        { el: document.getElementById('history-modal'), close: window.closeHistoryModal },
        { el: document.getElementById('lightbox-modal'), close: window.closeLightbox },
        { el: document.getElementById('committees-modal'), close: window.closeCommitteesModal }
    ];

    modals.forEach(m => {
        if(m.el && event.target == m.el) {
            m.close();
        }
    });
};


// ==========================================
// INITIALIZATION LOGIC (Runs on Load)
// ==========================================
const initializeApp = () => {
    
    // 1. Audio System Setup
    const audio = document.getElementById('bg-audio');
    const audioControl = document.getElementById('audio-control');
    const muteToggle = document.getElementById('mute-toggle');

    if (muteToggle && audio) {
        muteToggle.addEventListener('click', () => {
            if (audio.muted || audio.paused) {
                audio.muted = false;
                audio.play().catch(e => console.log("Audio Error:", e));
                muteToggle.innerText = '🔊';
            } else {
                audio.muted = true;
                muteToggle.innerText = '🔇';
            }
        });
    }


    // 2. Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu'); 
    
    if(navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if(navMenu) navMenu.classList.remove('active');
        });
    });


    // 3. Horizontal Scroll with Mouse Wheel (Safeguarded)
    const galleryContainer = document.getElementById('gallery-scroll');
    if (galleryContainer) {
        galleryContainer.addEventListener('wheel', (evt) => {
            evt.preventDefault();
            galleryContainer.scrollLeft += evt.deltaY;
        });
    }


    // Helper: Dynamic Gallery Rendering (defined early so renderAll can access it)
    window.renderGallery = (galleryData, force = false) => {
        const galleryContainer = document.getElementById('gallery-scroll');
        if (!galleryContainer) return;
        if (!galleryData) return;
        
        const currentContent = galleryContainer.innerHTML;
        // Don't re-render if we already have images and force is false
        if (!force && currentContent.includes('gallery-item')) return;

        if (galleryData.length > 0) {
            let html = '';
            galleryData.forEach(item => {
                const isVideo = item.type === 'video';
                html += `
                    <div class="gallery-item-wrapper" onclick="openLightbox(this, '${isVideo ? 'video' : 'image'}')" ${isVideo ? `data-url="${item.image_url}"` : ''}>
                        ${isVideo ? '<div class="video-overlay"><span class="play-btn">▶</span></div>' : ''}
                        <img src="${isVideo ? 'assets/hero_main.jpg' : item.image_url}" 
                             alt="${item.image_name}" 
                             class="gallery-item" 
                             loading="lazy"
                             onload="this.parentElement.classList.add('loaded')">
                    </div>`;
            });
            galleryContainer.innerHTML = html;
            console.log(`Gallery Rendered with ${galleryData.length} items`);
        } else {
            galleryContainer.innerHTML = '<p style="padding: 20px; color: #666;">No gallery images found.</p>';
        }
    };

    // Main render router
    const renderAll = (rawData, forceGallery = false) => {
        if (!rawData) return;
        
        // Normalize keys
        const data = {};
        for (let key in rawData) {
            data[key.toLowerCase()] = rawData[key];
        }
        
        // Store globally
        window.TEMPLE_DATA = data;
        
        // Render Gallery
        if (data.gallery) {
            window.renderGallery(data.gallery, forceGallery);
        }

        // Render Main Page Content
        const container = document.getElementById('dynamic-content');
        if (container && window.Render) {
            let fullHtml = '';
            
            // Render Map
            if(data.config && window.Render.map) fullHtml += window.Render.map(data.config);

            container.innerHTML = fullHtml;
            setupScrollAnimation();
        }
        
        // Static / Sidebar elements
        if(data.announcements && window.Render && window.Render.announcements) {
            window.Render.announcements(data.announcements);
        }
        
        if(data.committees && window.Render && window.Render.sidebarCommittees) {
            window.Render.sidebarCommittees(data.committees);
        }

        const committeesModalContainer = document.getElementById('committees-modal-container');
        if (data.committees && committeesModalContainer && window.Render && window.Render.committeesModal) {
            committeesModalContainer.innerHTML = window.Render.committeesModal(data.committees);
        }
        
        const darshanContainer = document.getElementById('darshan-timings-container');
        if (darshanContainer && window.Render && window.Render.darshanModal) {
            darshanContainer.innerHTML = window.Render.darshanModal(data.timings);
        }
        
        if(data.config && window.Render && window.Render.config) {
            window.Render.config(data.config);
        }
    };

    // Expose renderAll globally
    window.renderAll = renderAll;

    // Expose background hydration globally
    window.hydrateLiveDB = async () => {
        try {
            if (window.ApiService) {
                console.log("Live Firebase background hydration triggered...");
                const freshData = await window.ApiService.fetchData();
                if (freshData) {
                    console.log("Live Firebase data loaded! Hydrating UI...");
                    window.renderAll(freshData, true);
                }
            } else {
                console.log("ApiService not ready yet for background hydration.");
            }
        } catch (e) {
            console.warn("Background Firebase data load failed:", e);
        }
    };

    // --- 4. Hybrid Hydration Data Loading Flow ---
    
    // Step 1: Render immediately with optimistic mock / local fallback data (Loads in ~10-20ms)
    console.log("Instant loading: Rendering optimistic UI...");
    const fallbackData = window.ApiService ? window.ApiService.getFallbackData() : window.MOCK_DB;
    window.renderAll(fallbackData, false);

    // Step 2: Try fetching from Firebase immediately in background if ApiService is already defined
    if (window.ApiService) {
        window.hydrateLiveDB();
    }
};

// Run the initialization immediately!
initializeApp();

function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
}
