// script.js — Interações leves e acessibilidade
document.addEventListener('DOMContentLoaded', function () {

  // -------------------------
  // Tooltip do Bootstrap
  // -------------------------
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // -------------------------
  // Expand/Collapse de listas
  // -------------------------
  document.querySelectorAll('[data-toggle="collapse-list"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      const el = document.querySelector(target);
      if (el) {
        const isHidden = el.classList.contains('d-none');
        el.classList.toggle('d-none', !isHidden);
        btn.setAttribute('aria-expanded', String(isHidden));
      }
    });
  });

  // -------------------------
  // Controle de tema
  // -------------------------
  const btnPreto = document.getElementById('cor_preta');
  const btnBranco = document.getElementById('cor_branco');
  const navbar = document.querySelector('nav.navbar');

  function aplicarTema(tema) {
    // Troca a imagem do sistema imunológico conforme o tema
    const imgSistema = document.querySelector('#fig-sistema img');
    if (imgSistema) {
      if (tema === 'escuro') {
        imgSistema.src = 'assets/sistema.jpg';
        imgSistema.style.maxWidth = '600px';
        imgSistema.style.width = '100%';
      } else {
        imgSistema.src = 'assets/sistema-branco.png';
        imgSistema.style.maxWidth = '600px';
        imgSistema.style.width = '100%';
      }
    }
    if (tema === 'escuro') {
      document.documentElement.classList.add('modo-escuro');
      document.body.classList.add('modo-escuro');
      document.documentElement.style.backgroundColor = '#181818';
      document.body.style.backgroundColor = '#181818';

      if (navbar) {
        navbar.classList.remove('bg-white', 'navbar-light');
        navbar.classList.add('bg-dark', 'navbar-dark');
      }

      btnPreto?.style.setProperty('display', 'none', 'important');
      btnBranco?.style.setProperty('display', 'inline-flex', 'important');
    } else {
      document.documentElement.classList.remove('modo-escuro');
      document.body.classList.remove('modo-escuro');
      document.documentElement.style.backgroundColor = '#fff';
      document.body.style.backgroundColor = '#fff';

      if (navbar) {
        navbar.classList.remove('bg-dark', 'navbar-dark');
        navbar.classList.add('bg-white', 'navbar-light');
      }

      btnBranco?.style.setProperty('display', 'none', 'important');
      btnPreto?.style.setProperty('display', 'inline-flex', 'important');
    }
    localStorage.setItem('tema-imuno', tema);
  }

  // Estado inicial do tema
  aplicarTema(localStorage.getItem('tema-imuno') || 'claro');

  btnPreto?.addEventListener('click', e => { e.preventDefault(); aplicarTema('escuro'); });
  btnBranco?.addEventListener('click', e => { e.preventDefault(); aplicarTema('claro'); });

  // -------------------------
  // Botão "Ver mais" e animação de cards
  // -------------------------
  const btnVerMais = document.getElementById('btn-vermais-anim');
  const iconVerMais = document.getElementById('icon-vermais');
  const collapse = document.getElementById('more-sec-1');

  function animateCardsIn() {
    const cards = document.querySelectorAll('#cards-list > a');
    const delay = 350;

    // Scroll responsivo: acima de 992px vai para o h2, abaixo para a lista de cards
    const offset = window.innerHeight * 0.10;
    if (window.innerWidth >= 992) {
      const h2Imuno = document.querySelector('#sec-0 .section-title');
      if (h2Imuno) {
        const rect = h2Imuno.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - offset;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    } else {
      const cardsList = document.getElementById('cards-list');
      if (cardsList) {
        const rect = cardsList.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - offset;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }

    // Só depois de 500ms começa a animar os cards
    setTimeout(() => {
      cards.forEach((cardElem, idx) => {
        setTimeout(() => {
          const cardDiv = cardElem.querySelector('.card');
          cardDiv.style.transition = 'opacity 0.6s, transform 0.6s';
          cardDiv.style.opacity = '1';
          cardDiv.style.transform = 'translateY(0)';
        }, delay * idx);
      });

      // Adiciona animação de clique e redirecionamento
      setTimeout(() => {
        document.querySelectorAll('.link-card-anim').forEach(link => {
          link.addEventListener('click', e => {
            e.preventDefault();
            link.classList.add('clicked');
            const href = link.getAttribute('href');
            setTimeout(() => window.location.href = href, 400);
          });
        });
      }, delay * cards.length);
    }, 500);
  }

  if (btnVerMais && collapse && iconVerMais) {
    collapse.addEventListener('show.bs.collapse', () => {
      btnVerMais.querySelector('span').textContent = 'Ocultar conteúdos';
      iconVerMais.classList.replace('bi-chevron-double-down', 'bi-chevron-double-up');
      btnVerMais.style.setProperty('margin-top', '1rem', 'important');
      setTimeout(animateCardsIn, 200);
    });

    collapse.addEventListener('hide.bs.collapse', () => {
      btnVerMais.querySelector('span').textContent = 'Ver mais';
      iconVerMais.classList.replace('bi-chevron-double-up', 'bi-chevron-double-down');
      btnVerMais.style.removeProperty('margin-top');

      const cards = document.querySelectorAll('#cards-list > a .card');
      cards.forEach(cardDiv => {
        cardDiv.style.opacity = '0';
        cardDiv.style.transform = 'translateY(30px)';
      });
    });
  }

});
