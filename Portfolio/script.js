document.addEventListener('DOMContentLoaded', function() {

    // --- LOGICA DELLA BARRA SOCIAL NEL FOOTER ---
    const socialBar = document.querySelector('.footer-social-bar');
    const footer = document.getElementById('site-footer');

    function updateSocialBarPosition() {
        if (!socialBar || !footer) return;

        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const barHeight = socialBar.offsetHeight;
        const gap = 32;

        if (footerRect.top < windowHeight - gap) {
            const overlap = windowHeight - footerRect.top + gap;
            socialBar.style.bottom = `${overlap}px`;
        } else {
            socialBar.style.bottom = `${gap}px`;
        }
    }

    window.addEventListener('scroll', updateSocialBarPosition);
    window.addEventListener('resize', updateSocialBarPosition);
    updateSocialBarPosition();

    // --- LOGICA DELLE ANIMAZIONI SCROLL (FEATURES E SEZIONI) ---
    const features = document.querySelectorAll('.feature-animate');
    const featuresObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.4 });

    features.forEach(card => featuresObserver.observe(card));

    const sections = document.querySelectorAll('.section-animate');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(sec => sectionObserver.observe(sec));


    // --- LOGICA DELLO SCROLL AI LINK DI NAVIGAZIONE ---
    function scrollToElement(elementSelector, instance = 0) {
        const elements = document.querySelectorAll(elementSelector);
        if (elements.length > instance) {
            const element = elements[instance];
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    const link1 = document.getElementById("link1");
    const link2 = document.getElementById("link2");
    const link3 = document.getElementById("link3");
    const link4 = document.getElementById("link4");

    if (link1) {
        link1.addEventListener("click", (e) => {
            e.preventDefault();
            scrollToElement('header');
        });
    }

    if (link2) {
        link2.addEventListener("click", (e) => {
            e.preventDefault();
            scrollToElement('#features');
        });
    }

    if (link3) {
        link3.addEventListener("click", (e) => {
            e.preventDefault();
            scrollToElement('#pricing');
        });
    }

    if (link4) {
        link4.addEventListener("click", (e) => {
            e.preventDefault();
            scrollToElement('#contact');
        });
    }

    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // --- LOGICA DEL FORM DI CONTATTO E EMAILJS ---
    const contactForm = document.getElementById('contact-form');
    const formInputs = contactForm.querySelectorAll('input, textarea');
    const formStatus = document.getElementById('form-status');

    function validateField(field) {
        if (field.hasAttribute('required')) {
            if (field.value.trim() === '') {
                field.classList.remove('valid');
                field.classList.add('invalid');
                return false;
            } else {
                field.classList.remove('invalid');
                field.classList.add('valid');
                return true;
            }
        }
        return true;
    }

    formInputs.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });

        field.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        let formIsValid = true;

        formInputs.forEach(field => {
            if (!validateField(field)) {
                formIsValid = false;
            }
        });

        if (!formIsValid) {
            const firstInvalidField = document.querySelector('.invalid');
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
            // Message for invalid fields
            formStatus.textContent = 'Please fill in all required fields.';
            formStatus.style.color = '#e74c3c'; 
        } else {
            // Form is valid, proceed with EmailJS submission
            formStatus.textContent = 'Sending message...';
            formStatus.style.color = '#333';
            
            // EMAILJS: Ensure these IDs are correct
            emailjs.sendForm('service_gz5wkgp', 'template_kx5195d', this)
                .then(function() {
                    console.log('SUCCESS!');
                    // Success message
                    formStatus.textContent = 'Message sent successfully! I will reply soon.';
                    formStatus.style.color = '#4CAF50';
                    contactForm.reset();
                    
                    formInputs.forEach(field => {
                        field.classList.remove('valid');
                        field.classList.remove('invalid');
                    });
                    setTimeout(() => { formStatus.textContent = ""; }, 5000); 
                }, function(error) {
                    console.log('FAILED...', error);
                    // Error message
                    formStatus.textContent = 'Error sending message. Please try again later.';
                    formStatus.style.color = '#e74c3c';
                    setTimeout(() => { formStatus.textContent = ""; }, 5000);
                });
        }
    });

}); 