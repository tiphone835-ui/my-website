/**
 * RENDER ENGINE
 * Generates HTML for various sections based on data.
 */

window.Render = {
    config: (data) => {
        // Update Header/Footer details if elements exist
        if(data.templeName) {
            const el = document.querySelector('.english-name');
            if(el) el.innerText = data.templeName;
        }
        if(data.address) {
            const footerAddr = document.querySelector('.contact-details');
            // Check if we want to update footer dynamically strictly or keep static
        }
        // ... extend as needed
    },

    about: (data) => {
        if(!data || data.length === 0) return '';
        const item = data[0]; // Take first item for summary
        return `
            <section id="about" class="section">
                <div class="section-title">History</div>
                <div class="card">
                    <h4>${item.title}</h4>
                    <p>${item.content}</p>
                </div>
            </section>
        `;
    },

    // Specialized renderer for the Darshan Modal
    darshanModal: (data) => {
        if(!data || data.length === 0) return '<p>No timings information available.</p>';
        
        let html = '';
        
        // Separate Darshan (Major) from Sevas (Minor) for layout
        // Assuming user puts "Darshan" or "Seva" in 'Type' column
        const major = data.filter(i => i.type && i.type.toLowerCase().includes('darshan'));
        const minor = data.filter(i => !i.type || !i.type.toLowerCase().includes('darshan'));
        
        // Render Major Timings (Big Blocks)
        major.forEach(item => {
            html += `
                <div class="timing-block" style="margin-bottom: 20px;">
                    <h3 style="color: var(--govt-maroon); font-size: 1.2rem; margin-bottom: 5px;">${item.name}</h3>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #333;">${item.time}</p>
                </div>
            `;
        });

        // Render Minor Timings (Row)
        if (minor.length > 0) {
            html += '<div class="timing-row" style="display: flex; flex-wrap: wrap; justify-content: space-around; gap: 20px; margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 20px;">';
            minor.forEach(item => {
                html += `
                    <div>
                        <strong style="display:block; color: #555;">${item.name}</strong>
                        <span style="font-size: 1.1rem; font-weight: bold; color: var(--govt-maroon);">${item.time}</span>
                    </div>
                `;
            });
            html += '</div>';
        }

        return html;
    },

    festivals: (data) => {
        if(!data) return '';
        let html = '<section id="festivals" class="section"><div class="section-title">Upcoming Festivals</div><div class="festival-list">';
        data.slice(0, 3).forEach(item => { // Show only top 3
            html += `
                <div class="festival-item">
                    <div class="date-box">
                        <span class="date">${item.date.split('-')[0]}</span>
                        <span class="month">${item.date.split('-')[1]}</span>
                    </div>
                    <div class="festival-info">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            `;
        });
        html += '</div></section>';
        return html;
    },

    gallery: (data) => {
        // DEPRECATED: Gallery is now handled by main.js renderGallery()
        return ''; 
    },


    bhakti: (data) => {
         return '';
    },
    
    map: (config) => {
        // PERMANENT MAP LINK - Hardcoded as requested
        const embedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d451.759528915531!2d79.0705611!3d17.640389!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb5c2e996fa297%3A0x366ef7eec9be6181!2sSri%20Rama%20Layam!5e1!3m2!1sen!2sin!4v1767255138732!5m2!1sen!2sin";
        const linkUrl = "https://maps.app.goo.gl/P688wAm9r4dbHs1L9";
        
        return `
            <section id="map" class="section">
                <div class="gallery-header">
                    <h2>TEMPLE LOCATION</h2>
                </div>
                <div class="card" style="padding: 10px; overflow:hidden;">
                    <iframe src="${embedUrl}" width="100%" height="400" style="border:0; border-radius:8px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    <p style="text-align:center; margin-top:10px; color:#666;">
                        <a href="${linkUrl}" target="_blank" style="color:var(--govt-maroon); text-decoration:underline;">Open in Google Maps</a>
                    </p>
                </div>
            </section>
        `;
    },

    announcements: (data) => {
        // Render into sidebar marquee
        const marquee = document.getElementById('announcement-marquee');
        if(marquee && data) {
            let html = '';
            // Only render active announcements (case-insensitive check)
            const activeAnnouncements = data.filter(item => !item.status || item.status.toLowerCase() === 'active');
            
            if (activeAnnouncements.length === 0) {
                html = '<p>★ Welcome to Sri Seetha Ramachandra Swamy Devasthanam, Saigudem.</p><p>★ Explore temple history, darshan timings, and participate in sevas.</p>';
            } else {
                activeAnnouncements.forEach(item => {
                    html += `<p>★ ${item.announcement_text}</p>`;
                });
            }
            marquee.innerHTML = html;
        }
    },

    updates: (data) => {
        if(!data || data.length === 0) return '';
        // Only render active updates (case-insensitive check)
        const activeUpdates = data.filter(item => !item.status || item.status.toLowerCase() === 'active');
        if (activeUpdates.length === 0) return '';

        let html = '<div class="section-title">Latest Updates</div><div class="card-grid">';
        activeUpdates.forEach(item => {
            html += `
                <div class="card">
                    <h4>${item.update_title}</h4>
                    <span class="date-badge" style="display:block; font-size:0.8rem; color:#666; margin-bottom:5px;">${item.date}</span>
                    <p>${item.update_description}</p>
                </div>
            `;
        });
        html += '</div>';
        return html;
    },

    committees: (data) => {
        if(!data || data.length === 0) return '';
        
        let html = `
            <section id="administration" class="section">
                <div class="gallery-header">
                    <h2>COMMITTEES</h2>
                </div>
                <div class="card-grid">
        `;
        
        data.forEach(item => {
            html += `
                <div class="card committee-card">
                    <div class="card-badge">${item.telugu_name}</div>
                    <h4 style="margin-top: 15px; border-bottom: 1px solid rgba(122, 0, 0, 0.1); padding-bottom: 10px;">${item.name}</h4>
                    <div class="lead-info" style="margin: 15px 0; padding: 10px; background: #fdf8ec; border-radius: 4px; border-left: 4px solid var(--color-gold);">
                        <strong style="display:block; font-size: 0.7rem; text-transform: uppercase; color: #666;">${item.lead}</strong>
                        <span style="font-size: 1.1rem; color: var(--color-maroon); font-weight: bold;">${item.lead_name}</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #555; margin-bottom: 15px;">${item.description}</p>
                    <div class="member-list" style="text-align: left; border-top: 1px dashed #ddd; padding-top: 10px;">
                        <span style="display:block; font-size: 0.7rem; font-weight: bold; color: #999; text-transform: uppercase; margin-bottom: 5px;">Panel Members</span>
                        <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85rem; color: #444;">
                            ${Array.isArray(item.members) ? item.members.map(m => `<li style="margin-bottom: 5px;">• ${m}</li>`).join('') : ''}
                        </ul>
                    </div>
                </div>
            `;
        });
        
        html += '</div></section>';
        return html;
    },

    committeesModal: (data) => {
        if(!data || data.length === 0) return '<p style="color: #666; font-size: 0.9rem; text-align: center; grid-column: 1/-1;">No committees available.</p>';
        
        let html = '';
        data.forEach(item => {
            html += `
                <div class="card committee-card" style="margin-top: 0; min-height: auto; text-align: left;">
                    <div class="card-badge" style="display: inline-block; margin-top: 0;">${item.telugu_name}</div>
                    <h4 style="margin-top: 15px; border-bottom: 1px solid rgba(122, 0, 0, 0.1); padding-bottom: 10px; text-align: left; font-size: 1.15rem;">${item.name}</h4>
                    <div class="lead-info" style="margin: 15px 0; padding: 10px; background: #fdf8ec; border-radius: 4px; border-left: 4px solid var(--color-gold);">
                        <strong style="display:block; font-size: 0.7rem; text-transform: uppercase; color: #666;">${item.lead}</strong>
                        <span style="font-size: 1.1rem; color: var(--color-maroon); font-weight: bold;">${item.lead_name}</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #555; margin-bottom: 15px; text-align: left; line-height: 1.5;">${item.description}</p>
                    <div class="member-list" style="text-align: left; border-top: 1px dashed #ddd; padding-top: 10px;">
                        <span style="display:block; font-size: 0.7rem; font-weight: bold; color: #999; text-transform: uppercase; margin-bottom: 5px;">Panel Members</span>
                        <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85rem; color: #444;">
                            ${Array.isArray(item.members) ? item.members.map(m => `<li style="margin-bottom: 5px;">• ${m}</li>`).join('') : ''}
                        </ul>
                    </div>
                </div>
            `;
        });
        return html;
    },

    sidebarCommittees: (data) => {
        const container = document.getElementById('committee-sidebar-container');
        if(container && data) {
            let html = '';
            if (data.length === 0) {
                html = '<p style="color: #666; font-size: 0.85rem; text-align: center;">No active committees listed.</p>';
            } else {
                data.forEach(item => {
                    html += `
                        <div class="sidebar-committee-item" style="border-bottom: 1px dashed rgba(212, 175, 55, 0.3); padding-bottom: 10px; margin-bottom: 10px; text-align: left;">
                            <strong style="color: var(--govt-maroon); font-size: 0.85rem; display: block; font-family: 'Tiro Telugu', serif;">${item.telugu_name}</strong>
                            <span style="color: #666; font-size: 0.8rem; display: block; font-weight: 600; font-family: 'Cinzel', serif; margin-top: 2px;">${item.name}</span>
                            <div style="font-size: 0.75rem; margin-top: 5px; color: #444;">
                                <span style="font-weight: bold; color: var(--govt-maroon);">${item.lead}:</span> ${item.lead_name}
                            </div>
                        </div>
                    `;
                });
                // Link to open Committees Modal
                html += `
                    <div style="text-align: center; margin-top: 10px;">
                        <a href="javascript:void(0)" onclick="openCommitteesModal()" style="color: var(--govt-maroon); font-weight: bold; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s;" onmouseover="this.style.color='var(--govt-gold)'" onmouseout="this.style.color='var(--govt-maroon)'">
                            View Panel Members ➔
                        </a>
                    </div>
                `;
            }
            container.innerHTML = html;
        }
    }
};
