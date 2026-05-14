document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // 2. Navbar Scroll Effect & Active Link Highlighting
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link, .mobile-menu .nav-link');

    window.addEventListener('scroll', () => {
        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Fade-up Animation Observer
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

});

// 4. Modal Functions (Global Scope)
function openPdfModal(title, fileUrl, page = 1) {
    const modal = document.getElementById('pdfModal');
    const modalTitle = document.getElementById('pdfModalTitle');
    const modalDesc = document.getElementById('pdfModalDesc');
    const pdfFrame = document.getElementById('pdfFrame');
    
    modalTitle.textContent = title;
    
    // 확장자 확인
    const isHwp = fileUrl.toLowerCase().endsWith('.hwp');
    
    if (isHwp) {
        // HWP 파일은 브라우저 뷰어 미지원으로 인해 다운로드 유도
        pdfFrame.style.display = 'none';
        modalDesc.innerHTML = `
            <div style="text-align:center; padding: 60px 20px;">
                <i class="fa-solid fa-file-word" style="font-size: 4rem; color: #0077FF; margin-bottom: 20px;"></i>
                <h4 style="font-size: 1.2rem; color: #0A2540; margin-bottom: 10px;">HWP 문서는 브라우저에서 직접 열람할 수 없습니다.</h4>
                <p style="color: #666; margin-bottom: 30px;">아래 버튼을 클릭하여 파일을 다운로드한 후 확인해 주세요.</p>
                <a href="${fileUrl}" download class="btn-download" style="display: inline-block; padding: 12px 30px; background: #0A2540; color: white; border-radius: 30px; font-weight: bold; text-decoration: none;">파일 다운로드</a>
            </div>
        `;
    } else {
        // PDF 파일은 iframe에 view=Fit (화면에 딱 맞게 렌더링)
        pdfFrame.style.display = 'block';
        modalDesc.innerHTML = '';
        // page 파라미터와 view=Fit 을 통해 스크롤 없이 한 화면에 들어오도록 설정
        pdfFrame.src = `${fileUrl}#page=${page}&toolbar=0&navpanes=0&view=Fit`;
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    
    const pdfFrame = document.getElementById('pdfFrame');
    if(pdfFrame) pdfFrame.src = "";
    
    document.body.style.overflow = '';
}

// Close modal on clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal();
        }
    });
}
