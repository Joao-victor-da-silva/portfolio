// Pega os elementos de vídeo
var v = document.getElementById("src");
var v2 = document.getElementById("tgt");

// Função de Play/Pause ao clicar
function video_click() {
    if (v.paused) {
        v.play();
        v2.play();
    } else {
        v.pause();
        v2.pause();
    }
    // Sincroniza o tempo dos vídeos
    v.currentTime = v2.currentTime;
    v2.currentTime = v.currentTime;
}

// Pega os containers do slider
var videoContainer = document.getElementById("video-compare-container"),
    videoClipper = document.getElementById("video-clipper"),
    clippedVideo = videoClipper.getElementsByTagName("video")[0];

// Função que rastreia o movimento (mouse ou toque)
function trackLocation(e) {
    // Pega o 'rect' do container (posição e tamanho na tela)
    var rect = videoContainer.getBoundingClientRect(),
        // Pega a posição X do mouse ou do primeiro toque
        // (e.clientX é mais preciso que pageX para isso)
        clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0),
        // Calcula a posição X *dentro* do container
        position = ((clientX - rect.left) / videoContainer.offsetWidth) * 100;

    // Trava a posição entre 0 e 100
    position = Math.max(0, Math.min(100, position));

    videoClipper.style.width = position + "%";

    // Evita divisão por zero se a posição for 0
    if (position > 0.1) {
        clippedVideo.style.width = ((100 / position) * 100) + "%";
    } else {
        clippedVideo.style.width = "100000%"; // Um valor "infinito"
    }
    clippedVideo.style.zIndex = 3;
}

// Adiciona os 'ouvintes' de evento
videoContainer.addEventListener("mousemove", trackLocation, false);
videoContainer.addEventListener("touchstart", trackLocation, false);
videoContainer.addEventListener("touchmove", trackLocation, false);


// Aguarda o documento carregar
document.addEventListener("DOMContentLoaded", function () {

    // --- LÓGICA DO SLIDER DE VÍDEO (Sobre Mim) ---
    // (O seu código do video_click() e trackLocation() 
    //  pode ficar aqui em cima, ele não muda)
    var v = document.getElementById("src");
    var v2 = document.getElementById("tgt");

    function video_click() {
        if (v.paused) {
            v.play();
            v2.play();
        } else {
            v.pause();
            v2.pause();
        }
        v.currentTime = v2.currentTime;
        v2.currentTime = v.currentTime;
    }

    var videoContainer = document.getElementById("video-compare-container");
    if (videoContainer) {
        var videoClipper = document.getElementById("video-clipper"),
            clippedVideo = videoClipper.getElementsByTagName("video")[0];

        function trackLocation(e) {
            var rect = videoContainer.getBoundingClientRect(),
                clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0),
                position = ((clientX - rect.left) / videoContainer.offsetWidth) * 100;

            position = Math.max(0, Math.min(100, position));
            videoClipper.style.width = position + "%";

            if (position > 0.1) {
                clippedVideo.style.width = ((100 / position) * 100) + "%";
            } else {
                clippedVideo.style.width = "100000%";
            }
            clippedVideo.style.zIndex = 3;
        }

        videoContainer.addEventListener("mousemove", trackLocation, false);
        videoContainer.addEventListener("touchstart", trackLocation, false);
        videoContainer.addEventListener("touchmove", trackLocation, false);
    }

    // --- LÓGICA DO "COPIAR" (Contato) ---
    // (O seu código do btn-copy pode ficar aqui)
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(button => {
        // ... (seu código de copiar) ...
    });


    // =========================================================
    // === NOVA LÓGICA DO MODAL DINÂMICO DE PROJETOS ===
    // =========================================================

    let projectsData = {}; // Onde vamos guardar os dados do JSON

    // 1. Busca os dados do JSON assim que a página carrega
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            projectsData = data;
        })
        .catch(error => console.error('Erro ao carregar projects.json:', error));

    const projectModal = document.getElementById('projectModal');
    if (projectModal) {

        // 2. Ouve o evento "show.bs.modal" (antes do modal abrir)
        projectModal.addEventListener('show.bs.modal', function (event) {
            // Pega o card que ativou o modal
            const triggerCard = event.relatedTarget.closest('[data-project-id]');
            if (!triggerCard) return; // Sai se não for um card de projeto

            const projectId = triggerCard.dataset.projectId;
            const project = projectsData[projectId];

            if (project) {
                // 3. Constrói o conteúdo do modal
                buildModalContent(projectModal, project.media);
            }
        });

        // 4. Ouve o evento "hidden.bs.modal" (depois do modal fechar)
        projectModal.addEventListener('hidden.bs.modal', function () {
            // Pausa todos os vídeos
            const videosInModal = projectModal.querySelectorAll('video');
            videosInModal.forEach(video => {
                video.pause();
                video.currentTime = 0;
            });
            
            // Limpa o conteúdo para o próximo clique
            clearModalContent(projectModal);
        });
    }

    /**
     * Constrói o HTML do carrossel e dos thumbnails
     * @param {HTMLElement} modal - O elemento do modal
     * @param {Array} media - O array de mídias (do JSON)
     */
    function buildModalContent(modal, media) {
        const carouselInner = modal.querySelector('.carousel-inner');
        const thumbContainer = modal.querySelector('.project-thumb-container .row');

        // Limpa o conteúdo antigo
        carouselInner.innerHTML = '';
        thumbContainer.innerHTML = '';

        // Loop por cada item de mídia (vídeo, imagem)
        media.forEach((item, index) => {
            const isActive = (index === 0) ? 'active' : '';

            // --- Cria o Slide Principal ---
            let slideHtml = '';
            if (item.type === 'video') {
                slideHtml = `
                    <div class="carousel-item ${isActive}">
                        <video id="videoModal-${index}" class="d-block w-100" controls>
                            <source src="${item.src}" type="video/mp4">
                        </video>
                    </div>`;
            } else { // 'image'
                slideHtml = `
                    <div class="carousel-item ${isActive}">
                        <img src="${item.src}" class="d-block w-100" alt="Slide ${index + 1}">
                    </div>`;
            }
            carouselInner.insertAdjacentHTML('beforeend', slideHtml);

            // --- Cria o Thumbnail ---
            // (Usando col-2 para 6 colunas, como você pediu)
            const thumbHtml = `
                <div class="col-2">
                    <a href="#" class="thumbnail-link ${isActive}"
                       data-bs-target="#projectModalCarousel" 
                       data-bs-slide-to="${index}" 
                       aria-current="${isActive ? 'true' : 'false'}" 
                       aria-label="Slide ${index + 1}">
                        
                        <img src="${item.thumb}" class="project-thumb-img" alt="Thumbnail ${index + 1}">
                    </a>
                </div>`;
            thumbContainer.insertAdjacentHTML('beforeend', thumbHtml);
        });

        // Reinicia os "active" links dos thumbnails (JavaScript para seu outro código)
        // (Isso é necessário se você tiver JS customizado para trocar a classe 'active')
        // ... (mas o Bootstrap cuida disso automaticamente se usarmos 'data-bs-slide-to')
    }

    /**
     * Limpa o conteúdo do modal
     */
    function clearModalContent(modal) {
        modal.querySelector('.carousel-inner').innerHTML = 'Carregando...';
        modal.querySelector('.project-thumb-container .row').innerHTML = '';
    }

});


/* ============================================= */
/* === SCRIPT DE "COPIAR" (SEÇÃO CONTATO) === */
/* ============================================= */

document.addEventListener("DOMContentLoaded", function() {
    
    // ... (Seu código anterior do modal, etc. Fica aqui) ...


    // --- LÓGICA DE COPIAR PARA ÁREA DE TRANSFERÊNCIA (CONTATO) ---
    
    // 1. Encontra todos os botões com a classe .btn-copy
    const copyButtons = document.querySelectorAll('.btn-copy');

    copyButtons.forEach(button => {
        // 2. Adiciona o elemento do tooltip "Copiado!" 
        //    dentro de cada botão dinamicamente
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip-text';
        tooltip.innerText = 'Copiado!';
        button.appendChild(tooltip);

        // 3. Adiciona o evento de clique
        button.addEventListener('click', (event) => {
            const buttonEl = event.currentTarget;
            
            // Pega o texto do atributo 'data-copy-text'
            const textToCopy = buttonEl.dataset.copyText; 

            // 4. Usa a API do Clipboard (moderna e segura)
            navigator.clipboard.writeText(textToCopy).then(() => {
                
                // 5. Sucesso! Mostra o tooltip
                const tooltipEl = buttonEl.querySelector('.tooltip-text');
                tooltipEl.classList.add('show');

                // 6. Esconde o tooltip depois de 2 segundos
                setTimeout(() => {
                    tooltipEl.classList.remove('show');
                }, 2000);

            }).catch(err => {
                console.error('Erro ao copiar texto: ', err);
                // (Opcional: Tratar erro, ex: alert('Não foi possível copiar'))
            });
        });
    });

});