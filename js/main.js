/**
 * Main application logic for GTM Testing Site
 * Handles interactive elements and triggers trackEvent()
 */

document.addEventListener("DOMContentLoaded", () => {

    // --- Hero Banner Interactions ---
    const banner = document.getElementById("home-banner");
    if (banner) {
        // Track visual interaction if user hovers or clicks within the banner
        let bannerInteracted = false;
        banner.addEventListener("mouseenter", () => {
            if (!bannerInteracted) {
                trackEvent("banner_interaction", {
                    banner_id: "home-banner",
                    interaction_type: "hover"
                });
                bannerInteracted = true;
            }
        });
    }

    // --- CTA Buttons ---
    const ctas = document.querySelectorAll(".track-cta");
    ctas.forEach(cta => {
        cta.addEventListener("click", (e) => {
            trackEvent("cta_click", {
                cta_type: cta.getAttribute("data-cta-type"),
                cta_text: cta.getAttribute("data-cta-text"),
                destination_url: cta.href
            });
        });
    });

    // --- Social Links ---
    const socialLinks = document.querySelectorAll(".social-links a");
    socialLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            trackEvent("social_click", {
                social_network: link.getAttribute("data-social"),
                link_url: link.href
            });
        });
    });

    // --- Video Tracking ---
    const video = document.getElementById("demo-video");
    if (video) {
        let videoProgress = new Set();

        video.addEventListener("play", () => {
            if (video.currentTime === 0) {
                trackEvent("video_start", { video_title: "Product Tour QA" });
            }
        });

        video.addEventListener("pause", () => {
            if (video.currentTime < video.duration) {
                trackEvent("video_pause", {
                    video_title: "Product Tour QA",
                    current_time: Math.round(video.currentTime)
                });
            }
        });

        video.addEventListener("timeupdate", () => {
            const percent = (video.currentTime / video.duration) * 100;
            const marks = [25, 50, 75];

            marks.forEach(mark => {
                if (percent >= mark && !videoProgress.has(mark)) {
                    videoProgress.add(mark);
                    trackEvent("video_progress", {
                        video_title: "Product Tour QA",
                        progress_percent: mark
                    });
                }
            });
        });

        video.addEventListener("ended", () => {
            trackEvent("video_complete", { video_title: "Product Tour QA" });
            videoProgress.clear(); // Reset for replays
        });
    }

    // --- Accordion ---
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const isOpen = item.classList.contains("active");

            // Toggle UI
            item.classList.toggle("active");

            // Track event
            if (!isOpen) {
                trackEvent("accordion_open", {
                    accordion_title: header.innerText.trim(),
                    accordion_index: Array.from(accordionHeaders).indexOf(header) + 1
                });
            }
        });
    });

    // --- Tabs ---
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active classes
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

            // Add to targeted tab
            btn.classList.add("active");
            const targetId = btn.getAttribute("data-target");
            document.getElementById(targetId).classList.add("active");

            // Track event
            trackEvent("tab_click", {
                tab_name: btn.innerText.trim(),
                tab_id: targetId
            });
        });
    });

    // --- Form Tracking ---
    const leadForm = document.getElementById("lead-form");
    if (leadForm) {
        let formStarted = false;
        const inputs = leadForm.querySelectorAll("input, textarea");

        // Track Form Start
        inputs.forEach(input => {
            input.addEventListener("focus", () => {
                if (!formStarted) {
                    trackEvent("form_start", { form_id: "lead_generation_form" });
                    formStarted = true;
                }
            });
        });

        // Track Form Submit & Errors
        leadForm.addEventListener("submit", (e) => {
            e.preventDefault();

            let hasErrors = false;
            let errorFields = [];

            // Basic Validation
            inputs.forEach(input => {
                if (input.hasAttribute("required") && !input.value.trim()) {
                    hasErrors = true;
                    input.classList.add("is-invalid");
                    errorFields.push(input.name);
                } else {
                    input.classList.remove("is-invalid");
                }
            });

            if (hasErrors) {
                trackEvent("form_error", {
                    form_id: "lead_generation_form",
                    error_fields: errorFields.join(",")
                });
            } else {
                trackEvent("form_submit", {
                    form_id: "lead_generation_form",
                    lead_type: "B2B Contact"
                });

                // Reset form UI visually
                leadForm.reset();
                formStarted = false;

                // Custom visually appealing toast to simulate success
                const btn = leadForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                btn.innerText = "Submitted Successfully!";
                btn.style.backgroundColor = "var(--success)";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = "var(--primary-color)";
                }, 3000);
            }
        });
    }

});
