/**
 * MOCK DATA - Simulates the JSON response from Google Apps Script
 * This allows the website to be fully developed and tested without the live sheet.
 */

const MOCK_DB = {
    config: {
        templeName: "Sri Seetha Ramachandra Swamy Temple",
        tagline: "Gateway to Infinite Peace & Divinity",
        announcement: "At present, there are no special announcements. Daily poojas and darshan are conducted as per the temple schedule. Devotees are welcome to visit and seek the blessings of Lord Sri Seetha Rama. Jai Sri Rama",
        contactPhone: "+91 98765 43210",
        contactEmail: "info@yourtemple.com",
        address: "Temple Road, Hilltop, Divine City, India - 500001",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d451.759528915531!2d79.0705611!3d17.640389!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb5c2e996fa297%3A0x366ef7eec9be6181!2sSri%20Rama%20Layam!5e1!3m2!1sen!2sin!4v1767255138732!5m2!1sen!2sin", // Updated embed
        googleMapsLink: "https://maps.app.goo.gl/P688wAm9r4dbHs1L9",
        dailySlokam: "Shuklam Baradharam Vishnum... (Daily Sloka)",
        upiImage: "assets/upi_placeholder.png", // User will replace this link
        heroImage: "https://images.unsplash.com/photo-1623945202659-1e247444c92b?q=80&w=1920&auto=format&fit=crop", // Temporary placeholder until user puts their link
        bankDetails: {
            accountName: "Sri Seetha Ramachandra Swamy Temple",
            bankName: "[Bank Name]",
            accountNumber: "[Account Number]",
            ifsc: "[IFSC Code]",
            upiId: "[UPI ID]"
        }
    },
    about: [
        { title: "Temple History", content: "The temple dates back to the 12th century..." },
        { title: "Main Deity", content: "The presiding deity, Sri Seetha Ramachandra Swamy..." }
    ],
    timings: [
        { name: "Morning Darshan", time: "06:00 AM – 12:30 PM", type: "Darshan" },
        { name: "Evening Darshan", time: "04:00 PM – 08:30 PM", type: "Darshan" },
        { name: "Suprabhatam", time: "05:30 AM", type: "Seva" },
        { name: "Ekantha Seva", time: "09:00 PM", type: "Seva" }
    ],
    festivals: [
        { name: "ఉగాది", date: "22-03-2026", description: "తెలుగు నూతన సంవత్సర ఆరంభం" },
        { name: "శ్రీ రామ నవమి", date: "29-03-2026", description: "శ్రీ రామచంద్ర స్వామి జన్మోత్సవం" },
        { name: "హనుమాన్ జయంతి", date: "04-04-2026", description: "శ్రీ హనుమంతుని జన్మదినం" },
        { name: "శ్రీ కృష్ణ జన్మాష్టమి", date: "16-08-2026", description: "శ్రీ కృష్ణుని అవతార దినం" },
        { name: "వినాయక చవితి", date: "13-09-2026", description: "విఘ్నేశ్వరుని పూజోత్సవం" },
        { name: "దసరా (విజయదశమి)", date: "22-10-2026", description: "ధర్మ విజయం సూచించే పండుగ" },
        { name: "దీపావళి", date: "08-11-2026", description: "దీపాల పండుగ" }
    ],
    updates: [
        { date: "Jan 05", update_title: "Vaikunta Ekadasi", update_description: "Special arrangements for Vaikunta Ekadasi darshan.", status: "Active" },
        { date: "Feb 12", update_title: "Annadanam Hall", update_description: "Inauguration of the new Annadanam Hall.", status: "Active" },
        { date: "Mar 01", update_title: "Volunteer Drive", update_description: "Join us as a volunteer for the upcoming Brahmotsavams.", status: "Active" }
    ],
    gallery: [
        { image_name: "Temple Celebration", image_url: "assets/gallery/WhatsApp Image 2026-03-27 at 1.02.17 PM.jpeg", display_order: 1, status: "Show", type: "image" },
        { image_name: "Temple View", image_url: "assets/gallery/WhatsApp Image 2026-04-02 at 6.18.05 PM.jpeg", display_order: 2, status: "Show", type: "image" },
        { image_name: "Deity Darshan", image_url: "assets/gallery/WhatsApp Image 2026-04-02 at 6.21.03 PM.jpeg", display_order: 3, status: "Show", type: "image" },
        { image_name: "Temple Ritual Video", image_url: "assets/gallery/WhatsApp Video 2026-04-01 at 11.46.41 AM.mp4", display_order: 4, status: "Show", type: "video" },
        { image_name: "Deity", image_url: "assets/gallery/img1.jpg", display_order: 5, status: "Show" },
        { image_name: "Temple View", image_url: "assets/gallery/img2.jpg", display_order: 6, status: "Show" },
        { image_name: "Procession", image_url: "assets/gallery/img3.jpg", display_order: 7, status: "Show" },
        { image_name: "Gopuram", image_url: "assets/gallery/img4.jpg", display_order: 8, status: "Show" },
        { image_name: "Main Hall", image_url: "assets/gallery/img5.jpg", display_order: 9, status: "Show" },
        { image_name: "Crowd", image_url: "assets/gallery/img6.jpg", display_order: 10, status: "Show" },
        { image_name: "Night View", image_url: "assets/gallery/img7.jpg", display_order: 11, status: "Show" },
        { image_name: "Decorations", image_url: "assets/gallery/img8.jpg", display_order: 12, status: "Show" },
         { image_name: "Aerial", image_url: "assets/gallery/img9.jpg", display_order: 13, status: "Show" },
        { image_name: "Pooja", image_url: "assets/gallery/img10.jpg", display_order: 14, status: "Show" },
        { image_name: "Priests", image_url: "assets/gallery/img11.jpg", display_order: 15, status: "Show" },
        { image_name: "Chariot", image_url: "assets/gallery/img12.jpg", display_order: 16, status: "Show" },
        { image_name: "Festival", image_url: "assets/gallery/img13.jpg", display_order: 17, status: "Show" },
        { image_name: "Garden", image_url: "assets/gallery/img14.jpg", display_order: 18, status: "Show" },
        { image_name: "Guest", image_url: "assets/gallery/img15.jpg", display_order: 19, status: "Show" },
        { image_name: "Entrance", image_url: "assets/gallery/img16.jpg", display_order: 20, status: "Show" },
        { image_name: "Flag Post", image_url: "assets/gallery/img17.jpg", display_order: 21, status: "Show" },
        { image_name: "Sanctum", image_url: "assets/gallery/img18.jpg", display_order: 22, status: "Show" }
    ],
    announcements: [
        { announcement_text: "⭐ Register as a Volunteer", priority: "High", status: "Active" },
        { announcement_text: "Special Poojas on Poornima", priority: "Low", status: "Active" }
    ],
    committees: [
        {
            name: "Saigudem Dharma Jagarana Committee",
            telugu_name: "సాయిగూడెంధర్మజాగరణకమిటి",
            lead: "President (అధ్యక్షులు)",
            lead_name: "Sri Myla Shrisailam (మైల శ్రీశైలం)",
            description: "Responsible for temple infrastructure, daily rituals, festivals, and pilgrim welfare at Sri Seetha Ramachandra Swamy Devasthanam, Saigudem.",
            members: [
                "Vice Presidents (ఉపాధ్యక్షులు): Sri Gangadari Upendher, Sri Konda Chanda Reddy",
                "General Secretary (ప్రధాన కార్యదర్శి): Sri Nalabolu Ramakrishna Reddy",
                "Secretaries (కార్యదర్శులు): Sri Beedani Balaraj, Sri Gangani Ramachander, Sri Udhari Praveen",
                "Treasurer (కోశాధికారి): Sri Puttap Pawan",
                "Joint Treasurer (ఉపకోశాధికారి): Sri Myla Anjaneyulu"
            ]
        }
    ]
};

// Export to window so it can be accessed globally
window.MOCK_DB = MOCK_DB;

// Automatically load localStorage overrides on startup to support instant rendering and sync
if (typeof localStorage !== 'undefined') {
    const modules = ['updates', 'gallery', 'announcements', 'timings', 'festivals', 'about', 'committees'];
    modules.forEach(mod => {
        const cached = localStorage.getItem(`admin_data_${mod}`);
        if (cached) {
            try {
                window.MOCK_DB[mod] = JSON.parse(cached);
                console.log(`Loaded localStorage override for ${mod} into MOCK_DB`);
            } catch (e) {
                console.error(`Failed to parse localStorage for ${mod}:`, e);
            }
        }
    });
}

