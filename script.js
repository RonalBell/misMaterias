// Clase para manejar las materias
class GestorMaterias {
    constructor() {
        this.materias = JSON.parse(localStorage.getItem('materias')) || [];
        this.tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        this.semestres = JSON.parse(localStorage.getItem('semestres')) || [];
        
        // Inicializar semestre por defecto si no hay semestres
        if (this.semestres.length === 0) {
            const semestreDefault = {
                id: 'default',
                nombre: 'Semestre 1',
                materias: [],
                activo: true
            };
            this.semestres.push(semestreDefault);
            this.guardarSemestres();
        }

        // Obtener el semestre activo
        this.semestreActual = this.semestres.find(s => s.activo)?.id || this.semestres[0].id;

        this.inicializarGraficos();
        this.inicializar();
        this.actualizarTareas();
        this.inicializarSemestres();
        this.kawaiiFaces = {
            happy: ['(◕‿◕)', '(｡♥‿♥｡)', 'ʕ•ᴥ•ʔ', '(◠‿◠)', '(✿◠‿◠)'],
            sad: ['(╥﹏╥)', '(っ˘̩╭╮˘̩)っ', '(｡•́︿•̀｡)', '(个_个)', '(╯︵╰,)'],
            success: ['(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(★^O^★)', '(◕‿◕)♡', 'ヽ(>∀<☆)ノ', '٩(◕‿◕｡)۶'],
            error: ['(╯°□°）╯︵ ┻━┻', '(｡•́︿•̀｡)', '(＃￣ω￣)', '(￣︿￣)', 'ಠ_ಠ'],
            love: ['(♡˙︶˙♡)', '(◍•ᴗ•◍)❤', '(♡°▽°♡)', '(◕‿◕)♡', '(｡♥‿♥｡)'],
            surprise: ['(◎_◎;)', '(°o°)', '(⊙_⊙)', '(o_O)', '(°ロ°)'],
            info: ['(◠‿◠)', '🤔', '💡', '🔍', '🔄']
        };

        this.respuestasListas = this.cargarRespuestas();
        this.inicializarPerfilEditable();
    }

    async cargarRespuestas() {
        try {
            const response = await fetch('./respuestas.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.respuestas = await response.json();
        } catch (error) {
            console.error('Error cargando respuestas:', error);
        }

        // Si no se pudieron cargar las respuestas, usar estas por defecto
        if (!this.respuestas) {
            this.respuestas = {
                promedio_general: {
                    excelente: [
                        { texto: "¡INCREÍBLE! Eres el Einstein kawaii (ﾉ´ヮ`)ﾉ*: ･ﾟ", emoji: "🎯" },
                        { texto: "¡BRILLANTE! Tu cerebro está en modo Ultra Pro Max (◕‿◕)♡", emoji: "🧠" },
                        { texto: "¡GENIAL! Hasta ChatGPT te tiene envidia ⊂((・▽・))⊃", emoji: "🤖" }
                    ],
                    bueno: [
                        { texto: "¡Muy bien! El café valió la pena (◠‿◠✿)", emoji: "☕" },
                        { texto: "¡Buen trabajo! Netflix está celoso ヽ(>∀<☆)ノ", emoji: "📚" },
                        { texto: "¡Excelente! Tus neuronas están en llamas (•̀ᴗ•́)و", emoji: "🔥" }
                    ],
                    regular: [
                        { texto: "Mmm... ¿Mitad estudio, mitad TikTok? (￣ω￣;)", emoji: "📱" },
                        { texto: "Regular... como mi conexión a WiFi (；一_一)", emoji: "📶" },
                        { texto: "Ni tan bien ni tan mal... como mi vida social (╯°□°）╯", emoji: "💔" }
                    ],
                    aprobado: [
                        { texto: "Pasando raspando como tostada (；一_一)", emoji: "🍞" },
                        { texto: "¡Aprobado! Por los pelos... (｡•́‿•̀｡)", emoji: "😅" },
                        { texto: "3.0... el número mágico (◠‿◠)", emoji: "✨" }
                    ],
                    peligro: [
                        { texto: "¡ALERTA! Tu promedio necesita RCP (╥﹏╥)", emoji: "🚨" },
                        { texto: "¡AUXILIO! Tu promedio se está ahogando (｡•́︿•̀｡)", emoji: "🆘" },
                        { texto: "¡SOCORRO! Necesitamos un milagro... ¡URGENTE! (×﹏×)", emoji: "🙏" }
                    ]
                }
            };
        }
        return true;
    }

    inicializarGraficos() {
        // Solo inicializar el gráfico de materias
        this.graficoMaterias = new Chart(document.getElementById('graficoMaterias').getContext('2d'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Calificación Promedio',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 183, 197, 0.6)',  // kawaii pink
                        'rgba(183, 212, 255, 0.6)',  // kawaii blue
                        'rgba(226, 183, 255, 0.6)',  // kawaii purple
                        'rgba(255, 229, 183, 0.6)',  // kawaii yellow
                        'rgba(183, 255, 216, 0.6)'   // kawaii green
                    ],
                    borderColor: [
                        'rgba(255, 183, 197, 1)',
                        'rgba(183, 212, 255, 1)',
                        'rgba(226, 183, 255, 1)',
                        'rgba(255, 229, 183, 1)',
                        'rgba(183, 255, 216, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }

    inicializar() {
        this.cargarMaterias();
        this.configurarEventos();
        this.actualizarGraficos();
    }

    inicializarSemestres() {
        const selector = document.getElementById('semestreSelector');
        if (selector) {
            selector.innerHTML = '';
            
            this.semestres.forEach(semestre => {
                const option = document.createElement('option');
                option.value = semestre.id;
                option.textContent = semestre.nombre;
                if (semestre.id === this.semestreActual) {
                    option.selected = true;
                }
                selector.appendChild(option);
            });

            // Remover listener anterior si existe
            selector.removeEventListener('change', this._handleSemestreChange);
            
            // Agregar nuevo listener
            this._handleSemestreChange = (e) => {
                this.cambiarSemestre(e.target.value);
            };
            selector.addEventListener('change', this._handleSemestreChange);
        }
    }

    mostrarModalSemestres() {
        this.limpiarModales();
        const modal = document.getElementById('modalSemestres');
        const listaSemestres = modal.querySelector('#listaSemestres');
        
        listaSemestres.innerHTML = '';
        this.semestres.forEach(semestre => {
            const item = document.createElement('div');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.innerHTML = `
                <span>${semestre.nombre}</span>
                <div class="btn-group">
                    ${semestre.activo ? 
                        '<span class="badge bg-success">Semestre Actual ✓</span>' :
                        `<button class="btn btn-sm btn-kawaii" onclick="gestorMaterias.establecerSemestreActual('${semestre.id}')">
                            Establecer como actual
                        </button>`
                    }
                    <button class="btn btn-sm btn-danger ms-2" onclick="gestorMaterias.eliminarSemestre('${semestre.id}')"
                            ${semestre.id === 'default' ? 'disabled' : ''}>
                        🗑️
                    </button>
                </div>
            `;
            listaSemestres.appendChild(item);
        });

        new bootstrap.Modal(modal).show();
    }

    agregarSemestre(nombre) {
        const nuevoSemestre = {
            id: Date.now().toString(),
            nombre: nombre,
            materias: [],
            activo: false
        };

        this.semestres.push(nuevoSemestre);
        
        // Si es el primer semestre, establecerlo como activo
        if (this.semestres.length === 1) {
            nuevoSemestre.activo = true;
            this.semestreActual = nuevoSemestre.id;
        }

        this.guardarSemestres();
        this.mostrarKawaiiToast('semestre', 'nuevo');
        this.mostrarModalSemestres();
        return nuevoSemestre;
    }

    eliminarSemestre(id) {
        if (id === 'default') return;
        
        if (confirm('¿Estás seguro de eliminar este semestre y todas sus materias?')) {
            const index = this.semestres.findIndex(s => s.id === id);
            if (index !== -1) {
                const semestreEliminado = this.semestres[index];
                this.semestres.splice(index, 1);
                
                // Si el semestre eliminado era el activo, activar el primer semestre disponible
                if (semestreEliminado.activo && this.semestres.length > 0) {
                    this.semestres[0].activo = true;
                    this.semestreActual = this.semestres[0].id;
                }
                
                this.guardarSemestres();
                this.mostrarKawaiiToast('semestre', 'eliminado');
                this.mostrarModalSemestres();
                this.cargarMaterias();
            }
        }
    }

    establecerSemestreActual(id) {
        // Desactivar el semestre actual anterior
        this.semestres.forEach(s => s.activo = false);
        
        // Activar el nuevo semestre actual
        const nuevoSemestreActual = this.semestres.find(s => s.id === id);
        if (nuevoSemestreActual) {
            nuevoSemestreActual.activo = true;
            this.semestreActual = id;
            this.guardarSemestres();
            this.cargarMaterias();
            this.actualizarGraficos();
            this.actualizarTareas();
            this.mostrarKawaiiToast('semestre', 'cambio');
            this.mostrarModalSemestres();
        }
    }

    cambiarSemestre(id) {
        if (id && id !== this.semestreActual) {
            this.semestreActual = id;
            localStorage.setItem('semestreActual', id);
            this.cargarMaterias();
            this.actualizarGraficos();
            this.actualizarTareas();
            this.mostrarKawaiiToast('semestre', 'cambio');
        }
    }

    guardarSemestres() {
        localStorage.setItem('semestres', JSON.stringify(this.semestres));
        this.inicializarSemestres();
    }

    cargarMaterias() {
        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (!semestreActual) return;

        const listaMaterias = document.getElementById('listaMaterias');
        const tbody = document.getElementById('tablaMaterias');
        const promedioGeneral = this.calcularPromedioGeneral();
        
        // Modificar la parte donde se muestra el promedio general
        const headerTabla = document.querySelector('.card-header');
        if (headerTabla) {
            // Determinar el tipo de mensaje según el promedio
            let tipo;
            if (promedioGeneral >= 4.5) tipo = 'alta';
            else if (promedioGeneral >= 4.0) tipo = 'buena';
            else if (promedioGeneral >= 3.5) tipo = 'regular';
            else if (promedioGeneral >= 3.0) tipo = 'aprobado';
            else tipo = 'baja';

            const promedioElement = document.createElement('div');
            promedioElement.className = 'd-flex justify-content-between align-items-center';
            promedioElement.innerHTML = `
                <span class="kawaii-icon">📚 Detalle de Materias</span>
                <div class="d-flex align-items-center gap-2" style="cursor: pointer;">
                    <span class="text-white">Promedio General:</span>
                    <span class="badge bg-${promedioGeneral >= 3.0 ? 'success' : 'danger'} px-3">
                        ${promedioGeneral}
                    </span>
                </div>
            `;

            const promedioClickeable = promedioElement.querySelector('.d-flex.align-items-center.gap-2');
            promedioClickeable.onclick = () => {
                this.mostrarKawaiiToast('notas', tipo);
            };

            headerTabla.innerHTML = '';
            headerTabla.appendChild(promedioElement);
        }
        
        listaMaterias.innerHTML = '';
        tbody.innerHTML = '';

        if (!semestreActual.materias || semestreActual.materias.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        No hay materias registradas en ${semestreActual.nombre}
                    </td>
                </tr>
            `;
            return;
        }

        semestreActual.materias.forEach((materia, index) => {
            // Calcular el promedio y determinar el estilo
            const promedio = this.calcularPromedio(materia);
            let badgeStyle = '';
            
            if (promedio.valor === 0) {
                // Sin notas
                badgeStyle = 'background: linear-gradient(135deg, #a0a0a0, #808080)';
            } else if (promedio.valor >= 3.0) {
                // Aprobado
                badgeStyle = 'background: linear-gradient(135deg, #98FB98, #32CD32)';
            } else {
                // Reprobado
                badgeStyle = 'background: linear-gradient(135deg, #FFB6C1, #DC143C)';
            }

            // Agregar a la lista del sidebar con el nuevo estilo
            const materiaElement = document.createElement('div');
            materiaElement.innerHTML = `
                <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
                   data-id="${materia.id}">
                    <span>✨ ${materia.nombre}</span>
                    <span class="badge" style="${badgeStyle}; 
                                             padding: 8px 12px; 
                                             border-radius: 15px;
                                             font-weight: bold;
                                             box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                                             min-width: 40px;
                                             text-align: center;">
                            ${promedio.valor}
                    </span>
                </a>
            `;
            listaMaterias.appendChild(materiaElement);
            aplicarAnimacionNuevoElemento(materiaElement);

            // Agregar el evento click
            materiaElement.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                const materiaId = e.currentTarget.dataset.id;
                this.focusMateria(materiaId);
            });

            // Agregar a la tabla
            tbody.innerHTML += `
                <tr data-materia-id="${materia.id}" ${this.calcularInasistencias(materia) >= materia.limiteInasistencias ? 'class="materia-perdida"' : ''}>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <span>✨</span>
                            <span class="text-truncate">${materia.nombre}</span>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <span>👨‍🏫</span>
                            <span class="text-truncate">${materia.profesor}</span>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <span>📊</span>
                            <div>
                                ${(() => {
                                    const promedio = this.calcularPromedio(materia);
                                    if (promedio.perdidaPorFaltas) {
                                        return '<span class="text-danger">Perdida por faltas</span>';
                                    }
                                    return `
                                        <div>${promedio.valor} 
                                            <small class="text-muted">
                                                (${promedio.porcentajeCompletado}% completado)
                                            </small>
                                        </div>
                                        <div class="progress" style="height: 4px; width: 100px;">
                                            <div class="progress-bar ${promedio.valor >= 3.0 ? 'bg-success' : 'bg-danger'}" 
                                                 role="progressbar" 
                                                 style="width: ${promedio.porcentajeCompletado}%">
                                            </div>
                                        </div>
                                    `;
                                })()}
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="asistencia-container">
                            <div class="asistencia-info">
                                <span>📅 ${this.calcularInasistencias(materia)} / ${materia.limiteInasistencias}</span>
                            </div>
                            <div class="btn-group-responsive">
                            <button class="btn btn-kawaii btn-sm" 
                                    onclick="gestorMaterias.registrarInasistencia('${materia.id}')"
                                    ${this.calcularInasistencias(materia) >= materia.limiteInasistencias ? 'disabled' : ''}>
                                    <span>➕</span>
                                    <span class="d-none d-sm-inline">Falta</span>
                            </button>
                            ${this.calcularInasistencias(materia) > 0 ? `
                                <button class="btn btn-kawaii btn-sm" 
                                        onclick="gestorMaterias.quitarInasistencia('${materia.id}')">
                                        <span>➖</span>
                                        <span class="d-none d-sm-inline">Quitar</span>
                                </button>
                            ` : ''}
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="acciones-container">
                        <button class="btn btn-kawaii btn-sm" onclick="gestorMaterias.agregarNota('${materia.id}')">
                                <span>📝</span>
                                <span class="d-none d-sm-inline">Nota</span>
                        </button>
                        <button class="btn btn-kawaii btn-sm" onclick="gestorMaterias.verDetalles('${materia.id}')">
                                <span>👁️</span>
                                <span class="d-none d-sm-inline">Ver</span>
                        </button>
                        <button class="btn btn-kawaii btn-sm" onclick="gestorMaterias.eliminarMateria('${materia.id}')">
                                <span>❌</span>
                        </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }

    configurarEventos() {
        // Evento para nueva materia
        const formNuevaMateria = document.getElementById('formNuevaMateria');
        if (formNuevaMateria) {
            formNuevaMateria.addEventListener('submit', (e) => {
                e.preventDefault();
                const nombre = document.getElementById('nombreMateria').value;
                const profesor = document.getElementById('profesorMateria').value;
                const horario = document.getElementById('horarioMateria').value;
                const aula = document.getElementById('aulaMateria').value;
                const creditos = document.getElementById('creditosMateria').value;
                const limiteInasistencias = document.getElementById('limiteInasistencias').value;
                const ponderaciones = Array.from(document.querySelectorAll('.ponderacion-item')).map(item => {
                    const nombre = item.querySelector('input[placeholder="Nombre"]').value;
                    const porcentaje = item.querySelector('input[placeholder="%"]').value;
                    return { nombre, porcentaje };
                });
                
                this.agregarMateria(nombre, profesor, horario, aula, creditos, limiteInasistencias, ponderaciones);
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevaMateria'));
                if (modal) modal.hide();
                e.target.reset();
            });
        }

        // Evento para nueva nota
        const formNuevaNota = document.getElementById('formNuevaNota');
        if (formNuevaNota) {
            formNuevaNota.addEventListener('submit', (e) => {
                e.preventDefault();
                const materiaId = document.getElementById('materiaId').value;
                const tipoPonderacion = document.getElementById('tipoPonderacionNota').value;
                const descripcion = document.getElementById('descripcionNota').value;
                const valor = document.getElementById('valorNota').value;
                const fecha = document.getElementById('fechaNota').value;
                
                this.guardarNota(materiaId, descripcion, valor, fecha, tipoPonderacion);
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevaNota'));
                if (modal) modal.hide();
                e.target.reset();
            });
        }

        // Evento para nueva tarea
        const formNuevaTarea = document.getElementById('formNuevaTarea');
        if (formNuevaTarea) {
            formNuevaTarea.addEventListener('submit', (e) => {
                e.preventDefault();
                const materiaId = document.getElementById('materiaIdTarea').value;
                const descripcion = document.getElementById('descripcionTarea').value;
                const fechaEntrega = document.getElementById('fechaEntregaTarea').value;
                
                if (this.agregarTarea(materiaId, descripcion, fechaEntrega)) {
                    this.mostrarKawaiiToast('tareas', 'nueva');
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevaTarea'));
                    if (modal) modal.hide();
                    e.target.reset();
                }
            });
        }

        // Agregar listeners para limpiar modales al cerrar
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('hidden.bs.modal', () => {
                this.limpiarModales();
            });
        });
    }

    agregarMateria(nombre, profesor, horario, aula, creditos, limiteInasistencias, ponderaciones) {
        // Convertir los porcentajes a números
        const ponderacionesNum = ponderaciones.map(p => ({
            nombre: p.nombre,
            porcentaje: parseInt(p.porcentaje)
        }));

        // Validar que las ponderaciones sumen 100%
        const sumaPonderaciones = ponderacionesNum.reduce((sum, p) => sum + p.porcentaje, 0);
        if (sumaPonderaciones !== 100) {
            this.mostrarKawaiiToast('sistema', 'error');
            return false;
        }

        const nuevaMateria = {
            id: Date.now().toString(),
            nombre,
            profesor,
            horario,
            aula,
            creditos: parseInt(creditos),
            limiteInasistencias: parseInt(limiteInasistencias),
            ponderaciones: ponderacionesNum,
            notas: [],
            inasistencias: [],
            asistencia: 100,
            fechaCreacion: new Date().toISOString()
        };

        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (semestreActual) {
            semestreActual.materias.push(nuevaMateria);
            this.guardarSemestres();
            this.actualizarGraficos();
            this.mostrarKawaiiToast('materias', 'nueva');
            return true;
        }
        return false;
    }

    verDetalles(materiaId) {
        this.limpiarModales();
        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (!semestreActual) return;

        const materia = semestreActual.materias.find(m => m.id === materiaId);
        if (!materia) return;

        const detallesHTML = `
            <h4>Detalles de ${materia.nombre}</h4>
            <p><strong>Profesor:</strong> ${materia.profesor}</p>
            <p><strong>Horario:</strong> ${materia.horario}</p>
            <p><strong>Aula:</strong> ${materia.aula}</p>
            <p><strong>Créditos:</strong> ${materia.creditos}</p>
            <p><strong>Promedio Actual:</strong> ${this.calcularPromedio(materia)}</p>
            
            <h5>Ponderaciones y Notas:</h5>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Porcentaje</th>
                            <th>Nota</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${materia.ponderaciones.map(ponderacion => {
                            const nota = materia.notas.find(n => n.tipoPonderacion === ponderacion.nombre);
                            return `
                                <tr>
                                    <td>${ponderacion.nombre}</td>
                                    <td>${ponderacion.porcentaje}%</td>
                                    <td>${nota ? nota.valor : '<span class="text-warning">Pendiente</span>'}</td>
                                    <td>${nota ? new Date(nota.fecha).toLocaleDateString() : '-'}</td>
                                    <td>
                                        ${nota ? `
                                            <button class="btn btn-kawaii btn-sm" 
                                                    onclick="gestorMaterias.modificarNota('${materiaId}', '${ponderacion.nombre}')">
                                                ✏️ Modificar
                                            </button>
                                        ` : `
                                            <button class="btn btn-kawaii btn-sm" 
                                                    onclick="gestorMaterias.agregarNota('${materiaId}')">
                                                ➕ Agregar
                                            </button>
                                        `}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        const modalDetalles = document.getElementById('modalDetalles');
        if (modalDetalles) {
            modalDetalles.querySelector('.modal-body').innerHTML = detallesHTML;
            new bootstrap.Modal(modalDetalles).show();
        }
    }

    eliminarMateria(id) {
        this.mostrarConfirmacionKawaii('confirmacion', 'eliminar_materia', () => {
            // Encontrar el semestre actual
            const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
            if (!semestreActual) return;

            // Eliminar la materia y sus tareas
            semestreActual.materias = semestreActual.materias.filter(m => m.id !== id);
            this.tareas = this.tareas.filter(tarea => 
                !(tarea.materiaId === id && tarea.semestreId === this.semestreActual)
            );

            // Guardar y actualizar
            this.guardarSemestres();
            this.guardarTareas();
            this.cargarMaterias();
            this.actualizarGraficos();
            this.actualizarTareas();
            
            this.mostrarKawaiiToast('materias', 'eliminada');
        });
    }

    agregarNota(materiaId) {
        this.limpiarModales();
        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (!semestreActual) return;

        const materia = semestreActual.materias.find(m => m.id === materiaId);
        if (!materia) return;

        // Verificar si todas las ponderaciones ya tienen notas
        const todasNotasEstablecidas = materia.ponderaciones.every(p => 
            materia.notas.some(n => n.tipoPonderacion === p.nombre)
        );

        if (todasNotasEstablecidas) {
            this.mostrarKawaiiToast('notas', 'todas_establecidas');
            this.verDetalles(materiaId);
            return;
        }

        // Llenar el select solo con las ponderaciones sin nota
        const selectTipo = document.getElementById('tipoPonderacionNota');
        selectTipo.innerHTML = '';
        
        materia.ponderaciones.forEach(ponderacion => {
            const notaExistente = materia.notas.find(n => n.tipoPonderacion === ponderacion.nombre);
            if (!notaExistente) {
                const option = document.createElement('option');
                option.value = ponderacion.nombre;
                option.textContent = `${ponderacion.nombre} (${ponderacion.porcentaje}%)`;
                selectTipo.appendChild(option);
            }
        });

        document.getElementById('materiaId').value = materiaId;
        
        const modalNota = document.getElementById('modalNuevaNota');
        modalNota.querySelector('.modal-title').textContent = 'Agregar Nueva Nota';
        modalNota.querySelector('button[type="submit"]').textContent = 'Guardar Nota';

        document.getElementById('descripcionNota').value = '';
        document.getElementById('valorNota').value = '';
        document.getElementById('fechaNota').value = '';

        new bootstrap.Modal(modalNota).show();
    }

    guardarNota(materiaId, descripcion, valor, fecha, tipoPonderacion) {
        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (!semestreActual) return;

        const materia = semestreActual.materias.find(m => m.id === materiaId);
        if (!materia) return;

        const valorNota = parseFloat(valor);
        const notaExistente = materia.notas.find(n => n.tipoPonderacion === tipoPonderacion);
        
        if (notaExistente) {
            const notaAnterior = parseFloat(notaExistente.valor);
            
            if (valorNota < notaAnterior) {
                this.mostrarKawaiiToast('notas', 'bajada');
            } else if (valorNota > notaAnterior) {
                this.mostrarKawaiiToast('notas', 'mejora');
            }

            notaExistente.descripcion = descripcion;
            notaExistente.valor = valorNota;
            notaExistente.fecha = fecha;
        } else {
            materia.notas.push({
                id: Date.now().toString(),
                descripcion,
                valor: valorNota,
                fecha,
                tipoPonderacion
            });
            
            if (valorNota >= 4.0) {
                this.mostrarKawaiiToast('notas', 'alta');
            } else if (valorNota >= 3.0) {
                this.mostrarKawaiiToast('notas', 'nueva');
            } else {
                this.mostrarKawaiiToast('notas', 'baja');
            }
        }
        
        this.guardarSemestres();
        this.cargarMaterias();
        this.actualizarGraficos();
        this.limpiarModales();
        
        // Actualizar la vista de detalles si está abierta
        const modalDetalles = document.getElementById('modalDetalles');
        if (modalDetalles && modalDetalles.classList.contains('show')) {
            this.verDetalles(materiaId);
        }
    }

    registrarInasistencia(materiaId) {
        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (!semestreActual) return;

        const materia = semestreActual.materias.find(m => m.id === materiaId);
        if (!materia) return;

        materia.inasistencias = materia.inasistencias || [];
        const totalFaltas = this.calcularInasistencias(materia);
        
        // Verificar si ya superó el límite de inasistencias
        if (totalFaltas >= materia.limiteInasistencias) {
            this.mostrarKawaiiToast('asistencia', 'limite');
            return;
        }

        // Agregar nueva falta
        materia.inasistencias.push({
            fecha: new Date().toISOString()
        });
        
        // Calcular faltas restantes
        const faltasRestantes = materia.limiteInasistencias - (totalFaltas + 1);
        
        if (faltasRestantes === 0) {
            this.mostrarKawaiiToast('asistencia', 'limite');
        } else if (faltasRestantes <= 2) {
            this.mostrarKawaiiToast('asistencia', 'advertencia');
        } else {
            this.mostrarKawaiiToast('asistencia', 'falta');
        }
        
        this.guardarSemestres();
        this.cargarMaterias();
    }

    // Agregar nuevo método para quitar inasistencias
    quitarInasistencia(materiaId) {
        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (!semestreActual) return;

        const materia = semestreActual.materias.find(m => m.id === materiaId);
        if (!materia || !materia.inasistencias || materia.inasistencias.length === 0) return;

        // Quitar la última falta
        materia.inasistencias.pop();
        
        this.mostrarKawaiiToast('asistencia', 'quitar_falta');
        this.guardarSemestres();
        this.cargarMaterias();
    }

    calcularInasistencias(materia) {
        return materia.inasistencias ? materia.inasistencias.length : 0;
    }

    calcularPromedio(materia) {
        if (!materia || !materia.notas || materia.notas.length === 0) {
            return { valor: 0, porcentajeCompletado: 0 };
        }
        
        // Verificar si está perdida por inasistencias
        if (this.calcularInasistencias(materia) > materia.limiteInasistencias) {
            return { valor: 0, porcentajeCompletado: 100, perdidaPorFaltas: true };
        }

        let notaAcumulada = 0;
        let sumaPorcentajesUsados = 0;

        materia.ponderaciones.forEach(ponderacion => {
            const nota = materia.notas.find(n => n.tipoPonderacion === ponderacion.nombre);
            if (nota) {
                // Calcular el valor real según la ponderación
                notaAcumulada += (parseFloat(nota.valor) * ponderacion.porcentaje) / 100;
                sumaPorcentajesUsados += ponderacion.porcentaje;
            }
        });

        return {
            // La nota acumulada es la suma de (nota * porcentaje/100)
            valor: parseFloat(notaAcumulada.toFixed(1)),
            // El porcentaje completado es la suma de los porcentajes de las notas registradas
            porcentajeCompletado: sumaPorcentajesUsados
        };
    }

    calcularPromedioGeneral() {
        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (!semestreActual || !semestreActual.materias.length === 0) return 0;

        let sumaPromedios = 0;
        let materiasConNota = 0;

        semestreActual.materias.forEach(materia => {
            const promedio = this.calcularPromedio(materia);
            if (promedio.valor > 0) {
                sumaPromedios += promedio.valor;
                materiasConNota++;
            }
        });

        return materiasConNota > 0 ? parseFloat((sumaPromedios / materiasConNota).toFixed(1)) : 0;
    }

    agregarTarea(materiaId, descripcion, fechaEntrega) {
        const fechaLimite = new Date(fechaEntrega);
        const fechaHoy = new Date();

        // Verificar si la fecha es en el pasado
        if (fechaLimite < fechaHoy) {
            this.mostrarKawaiiToast('tareas', 'tiempo_pasado');
            return false;
        }

        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (!semestreActual) return false;

        const materia = semestreActual.materias.find(m => m.id === materiaId);
        if (!materia) return false;

        const tarea = {
            id: Date.now().toString(),
            materiaId,
            semestreId: this.semestreActual,
            semestreNombre: semestreActual.nombre,
            materiaNombre: materia.nombre,
            descripcion,
            fechaEntrega,
            fechaCreacion: new Date().toISOString(),
            estado: 'pendiente',
            completadaEn: null
        };

        this.tareas.push(tarea);
        this.guardarTareas();
        this.actualizarTareas();
        this.mostrarKawaiiToast('tareas', 'nueva');
        return true;
    }

    actualizarTareas() {
        const listaTareas = document.getElementById('listaTareas');
        if (!listaTareas) return;

        listaTareas.innerHTML = '';
        const ahora = new Date();

        // Verificar tareas vencidas sin descartar automáticamente
        this.tareas.forEach(tarea => {
            if (tarea.estado === 'pendiente') {
                const fechaEntrega = new Date(tarea.fechaEntrega);
                // Comparar solo las fechas sin la hora
                const fechaHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
                const fechaLimite = new Date(fechaEntrega.getFullYear(), fechaEntrega.getMonth(), fechaEntrega.getDate());
                
                if (fechaLimite < fechaHoy) {
                    tarea.estado = 'vencida';
                    tarea.completadaEn = new Date().toISOString();
                    this.mostrarKawaiiToast('tareas', 'vencida');
                }
            }
        });
        this.guardarTareas();

        // Filtrar y mostrar tareas pendientes
        const tareasPendientes = this.tareas
            .filter(tarea => 
                tarea.semestreId === this.semestreActual && 
                tarea.estado === 'pendiente'
            )
            .sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega));

        if (tareasPendientes.length === 0) {
            listaTareas.innerHTML = `
                <div class="text-center text-muted p-3">
                    No hay tareas pendientes (◠‿◠)
                </div>
            `;
            return;
        }

        tareasPendientes.forEach(tarea => {
            const fechaEntrega = new Date(tarea.fechaEntrega);
            const fechaHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
            const fechaLimite = new Date(fechaEntrega.getFullYear(), fechaEntrega.getMonth(), fechaEntrega.getDate());
            
            // Calcular días restantes comparando solo fechas sin hora
            const tiempoRestante = fechaLimite - fechaHoy;
            const diasRestantes = Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24));
            
            let estadoTarea = '';
            if (diasRestantes === 0) {
                estadoTarea = '<span class="text-warning ms-2">¡Vence hoy!</span>';
            } else if (diasRestantes === 1) {
                estadoTarea = '<span class="text-warning ms-2">¡Vence mañana!</span>';
            } else if (diasRestantes > 1) {
                estadoTarea = `<span class="ms-2">(${diasRestantes} días restantes)</span>`;
            }

            listaTareas.innerHTML += `
                <div class="tarea-card ${diasRestantes <= 1 ? 'border-warning' : ''}">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0">📚 ${tarea.materiaNombre}</h6>
                        <div class="btn-group">
                            <button class="btn btn-kawaii btn-sm" onclick="gestorMaterias.completarTarea('${tarea.id}')">
                                ✅ Completar
                            </button>
                            <button class="btn btn-kawaii btn-sm" onclick="gestorMaterias.descartarTarea('${tarea.id}')">
                                ❌ Descartar
                            </button>
                        </div>
                    </div>
                    <p class="mb-1">${tarea.descripcion}</p>
                    <small class="text-muted">
                        ⏰ ${fechaEntrega.toLocaleString()}
                        ${estadoTarea}
                    </small>
                </div>
            `;
        });
    }

    completarTarea(tareaId) {
        const tarea = this.tareas.find(t => t.id === tareaId);
        if (tarea) {
            tarea.estado = 'completada';
            tarea.completadaEn = new Date().toISOString();
            this.guardarTareas();
            this.actualizarTareas();
            this.mostrarKawaiiToast('tareas', 'completada');
        }
    }

    descartarTarea(tareaId) {
        const tarea = this.tareas.find(t => t.id === tareaId);
        if (tarea) {
            tarea.estado = 'vencida';
            tarea.completadaEn = new Date().toISOString();
            this.guardarTareas();
            this.actualizarTareas();
            this.mostrarKawaiiToast('tareas', 'vencida');
        }
    }

    mostrarHistorialTareas() {
        this.limpiarModales();
        const completadas = document.getElementById('tareasCompletadas');
        const vencidas = document.getElementById('tareasVencidas');
        
        // Filtrar tareas por estado Y semestre actual
        const tareasCompletadas = this.tareas.filter(t => 
            t.estado === 'completada' && 
            t.semestreId === this.semestreActual
        );
        const tareasVencidas = this.tareas.filter(t => 
            t.estado === 'vencida' && 
            t.semestreId === this.semestreActual
        );

        // Función para renderizar tareas
        const renderizarTareas = (tareas) => {
            return tareas.map(tarea => `
                <div class="tarea-card">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">📚 ${tarea.materiaNombre}</h6>
                            <small class="text-muted d-block">Semestre: ${tarea.semestreNombre}</small>
                        </div>
                        <span class="badge ${tarea.estado === 'completada' ? 'bg-success' : 'bg-danger'}">
                            ${tarea.estado === 'completada' ? '✅ Completada' : '⚠️ No entregada'}
                        </span>
                    </div>
                    <p class="mb-1">${tarea.descripcion}</p>
                    <div class="text-muted small">
                        <div>Fecha de entrega: ${new Date(tarea.fechaEntrega).toLocaleString()}</div>
                        <div>${tarea.estado === 'completada' ? 'Completada' : 'Descartada'} el: 
                            ${new Date(tarea.completadaEn).toLocaleString()}
                        </div>
                    </div>
                </div>
            `).join('');
        };

        // Actualizar contenido de las pestañas
        completadas.innerHTML = tareasCompletadas.length ? 
            renderizarTareas(tareasCompletadas) : 
            '<div class="text-center p-3">No hay tareas completadas</div>';

        vencidas.innerHTML = tareasVencidas.length ? 
            renderizarTareas(tareasVencidas) : 
            '<div class="text-center p-3">No hay tareas vencidas</div>';

        // Mostrar modal
        new bootstrap.Modal(document.getElementById('modalHistorialTareas')).show();
    }

    guardarTareas() {
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }

    // Modificar el método borrarDatos
    borrarDatos() {
        this.mostrarConfirmacionKawaii('confirmacion', 'borrar_todo', () => {
            localStorage.clear();
            this.semestres = [];
            this.tareas = [];
            this.inicializar();
            this.mostrarKawaiiToast('sistema', 'borradoTotal');
        });
    }

    // Modificar el método mostrarModalNuevaTarea
    mostrarModalNuevaTarea() {
        this.limpiarModales();
        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (!semestreActual || !semestreActual.materias.length) {
            this.mostrarKawaiiToast('sistema', 'error');
            return;
        }

        const selectMateria = document.getElementById('materiaIdTarea');
        selectMateria.innerHTML = ''; // Limpiar opciones existentes
        
        semestreActual.materias.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.id;
            option.textContent = materia.nombre;
            selectMateria.appendChild(option);
        });

        new bootstrap.Modal(document.getElementById('modalNuevaTarea')).show();
    }

    guardarCambios() {
        localStorage.setItem('materias', JSON.stringify(this.materias));
        this.cargarMaterias();
        this.actualizarGraficos();
    }

    actualizarGraficos() {
        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (!semestreActual || !semestreActual.materias) {
            this.graficoMaterias.data.labels = [];
            this.graficoMaterias.data.datasets[0].data = [];
            this.graficoMaterias.update();
            return;
        }

        const datos = semestreActual.materias.map(materia => {
            const promedio = this.calcularPromedio(materia);
            return {
            nombre: materia.nombre,
                promedio: promedio.valor,
                porcentaje: promedio.porcentajeCompletado
            };
        });

        this.graficoMaterias.data.labels = datos.map(d => `${d.nombre} (${d.porcentaje}%)`);
        this.graficoMaterias.data.datasets[0].data = datos.map(d => d.promedio);

        // Actualizar colores según el promedio
        this.graficoMaterias.data.datasets[0].backgroundColor = datos.map(d => {
            if (d.promedio === 0) return 'rgba(200, 200, 200, 0.6)'; // Gris para materias sin notas
            if (d.promedio >= 4.0) return 'rgba(183, 255, 216, 0.6)'; // Verde para notas altas
            if (d.promedio >= 3.0) return 'rgba(255, 229, 183, 0.6)'; // Amarillo para notas medias
            return 'rgba(255, 183, 197, 0.6)'; // Rojo para notas bajas
        });

        this.graficoMaterias.data.datasets[0].borderColor = datos.map(d => {
            if (d.promedio === 0) return 'rgba(200, 200, 200, 1)';
            if (d.promedio >= 4.0) return 'rgba(183, 255, 216, 1)';
            if (d.promedio >= 3.0) return 'rgba(255, 229, 183, 1)';
            return 'rgba(255, 183, 197, 1)';
        });

        // Configurar opciones adicionales
        this.graficoMaterias.options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 0.5
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const promedio = context.raw;
                            if (promedio === 0) return 'Sin notas registradas';
                            return `Promedio: ${promedio}`;
                        }
                    }
                }
            }
        };

        this.graficoMaterias.update();
    }

    async mostrarKawaiiToast(categoria, tipo) {
        try {
            console.log('Mostrando toast para:', categoria, tipo); // Para debug
            await this.respuestasListas;
            
            const respuesta = this.obtenerRespuestaAleatoria(categoria, tipo);
            console.log('Respuesta obtenida:', respuesta); // Para debug
            
            if (!respuesta) {
                console.warn('No se encontró respuesta');
                return;
            }
            
            const toast = document.createElement('div');
            toast.className = 'kawaii-toast';
            toast.innerHTML = `
                <div class="kawaii-face">${respuesta.emoji}</div>
                <div class="kawaii-message">${respuesta.texto}</div>
            `;
            
            document.querySelectorAll('.kawaii-toast').forEach(t => t.remove());
            document.body.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 5000);
            }, 5000);
        } catch (error) {
            console.error('Error mostrando toast:', error);
        }
    }

    // Agregar método para modificar nota específica
    modificarNota(materiaId, tipoPonderacion) {
        const semestreActual = this.semestres.find(s => s.id === this.semestreActual);
        if (!semestreActual) return;

        const materia = semestreActual.materias.find(m => m.id === materiaId);
        if (!materia) return;

        const nota = materia.notas.find(n => n.tipoPonderacion === tipoPonderacion);
        if (!nota) {
            this.mostrarKawaiiToast('sistema', 'error');
            return;
        }

        // Ocultar el modal de detalles sin remover su backdrop
        const modalDetalles = bootstrap.Modal.getInstance(document.getElementById('modalDetalles'));
        if (modalDetalles) {
            modalDetalles._element.classList.add('d-none'); // Ocultar pero mantener backdrop
        }

        const modalNota = document.getElementById('modalNuevaNota');
        const selectTipo = document.getElementById('tipoPonderacionNota');
        
        // Configurar el modal de nota
        selectTipo.innerHTML = '';
        const option = document.createElement('option');
        option.value = tipoPonderacion;
        const ponderacion = materia.ponderaciones.find(p => p.nombre === tipoPonderacion);
        option.textContent = `${tipoPonderacion} (${ponderacion.porcentaje}%)`;
        selectTipo.appendChild(option);

        modalNota.querySelector('.modal-title').textContent = `Modificar Nota de ${tipoPonderacion}`;
        modalNota.querySelector('button[type="submit"]').textContent = 'Actualizar Nota';

        // Prellenar campos
        document.getElementById('materiaId').value = materiaId;
        document.getElementById('tipoPonderacionNota').value = tipoPonderacion;
        document.getElementById('descripcionNota').value = nota.descripcion;
        document.getElementById('valorNota').value = nota.valor;
        document.getElementById('fechaNota').value = nota.fecha.split('T')[0];

        // Configurar evento para cuando se cierre el modal de nota
        modalNota.addEventListener('hidden.bs.modal', () => {
            if (modalDetalles) {
                modalDetalles._element.classList.remove('d-none'); // Mostrar modal de detalles nuevamente
            }
        }, { once: true }); // El evento se ejecuta solo una vez

        // Mostrar modal de nota
        new bootstrap.Modal(modalNota).show();
    }

    // Agregar este método a la clase GestorMaterias
    limpiarModales() {
        // No limpiar si hay un modal activo que queremos mantener
        const modalActivo = document.querySelector('.modal.show');
        if (modalActivo && modalActivo.id === 'modalDetalles') {
            // Si el modal de detalles está activo, mantener su backdrop
            return;
        }

        // Remover modales y backdrops innecesarios
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.classList.contains('show') && modal.id !== 'modalDetalles') {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        });

        // Limpiar backdrops solo si no hay modales activos
        if (!document.querySelector('.modal.show')) {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            
            // Restaurar el scroll y remover la clase modal-open del body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    }

    focusMateria(materiaId) {
        const filaMateria = document.querySelector(`tr[data-materia-id="${materiaId}"]`);
        if (filaMateria) {
            filaMateria.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            document.querySelectorAll('.focus-kawaii').forEach(el => {
                el.classList.remove('focus-kawaii');
            });

            filaMateria.classList.add('focus-kawaii');
        }
    }

    // Agregar este método a la clase GestorMaterias
    obtenerRespuestaAleatoria(categoria, tipo) {
        if (!this.respuestas || !this.respuestas[categoria] || !this.respuestas[categoria][tipo]) {
            console.warn(`No se encontraron respuestas para ${categoria}.${tipo}`);
            return null; // Retornar null en lugar de una respuesta por defecto
        }

        const respuestas = this.respuestas[categoria][tipo];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }

    async mostrarConfirmacionKawaii(categoria, tipo, onConfirm) {
        const respuesta = this.obtenerRespuestaAleatoria('confirmacion', tipo);
        
        // Crear el modal de confirmación
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border-radius: 20px; border: none;">
                    <div class="modal-body text-center p-4">
                        <div class="display-1 mb-3">${respuesta.emoji}</div>
                        <p class="mb-4" style="font-size: 1.1rem;">${respuesta.texto}</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-kawaii confirm-btn">
                                ¡Sí, hazlo! (｀∀´)Ψ
                            </button>
                            <button class="btn btn-secondary cancel-btn" data-bs-dismiss="modal">
                                ¡No, perdón! (╥﹏╥)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Manejar los eventos de los botones
        modal.querySelector('.confirm-btn').onclick = () => {
            modalInstance.hide();
            onConfirm();
        };

        // Limpiar el modal cuando se cierre
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    inicializarPerfilEditable() {
        const profileImage = document.getElementById('profileImage');
        const profileName = document.getElementById('profileName');
        const editOverlay = document.querySelector('.edit-overlay');

        // Cargar datos guardados
        const savedImage = localStorage.getItem('profileImage');
        const savedName = localStorage.getItem('profileName');

        if (savedImage) {
            profileImage.src = savedImage;
            document.getElementById('previewImage').src = savedImage;
        }
        if (savedName) {
            profileName.textContent = savedName;
            document.getElementById('nombreInput').value = savedName.replace(/✨/g, '').trim();
        }

        // Mostrar overlay al hover
        profileImage.parentElement.addEventListener('mouseenter', () => {
            editOverlay.style.display = 'block';
        });

        profileImage.parentElement.addEventListener('mouseleave', () => {
            editOverlay.style.display = 'none';
        });

        // Abrir modal al hacer click en imagen o nombre
        profileImage.addEventListener('click', () => this.mostrarModalPerfil());
        profileName.addEventListener('click', () => this.mostrarModalPerfil());

        // Preview de imagen en el modal
        document.getElementById('imageInputModal').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('previewImage').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    mostrarModalPerfil() {
        const modal = new bootstrap.Modal(document.getElementById('modalEditarPerfil'));
        modal.show();
    }

    guardarPerfil() {
        const newImage = document.getElementById('previewImage').src;
        const newName = document.getElementById('nombreInput').value.trim();

        if (newName) {
            const nombreFormateado = `✨ ${newName} ✨`;
            document.getElementById('profileName').textContent = nombreFormateado;
            document.getElementById('profileImage').src = newImage;
            
            localStorage.setItem('profileName', nombreFormateado);
            localStorage.setItem('profileImage', newImage);
            
            this.mostrarKawaiiToast('sistema', 'perfil_actualizado');
            bootstrap.Modal.getInstance(document.getElementById('modalEditarPerfil')).hide();
        }
    }
}

// Inicializar el gestor de materias cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.gestorMaterias = new GestorMaterias();
});

// Funciones auxiliares para el manejo de ponderaciones
function agregarPonderacion() {
    const ponderaciones = document.getElementById('ponderaciones');
    const nuevaPonderacion = document.createElement('div');
    nuevaPonderacion.className = 'row ponderacion-item mb-2';
    nuevaPonderacion.innerHTML = `
        <div class="col-5">
            <input type="text" class="form-control" placeholder="Nombre" required>
        </div>
        <div class="col-5">
            <input type="number" class="form-control" placeholder="%" min="0" max="100" required>
        </div>
        <div class="col-2">
            <button type="button" class="btn btn-danger btn-sm" onclick="eliminarPonderacion(this)">×</button>
        </div>
    `;
    ponderaciones.appendChild(nuevaPonderacion);
}

function eliminarPonderacion(button) {
    button.closest('.ponderacion-item').remove();
}

function aplicarAnimacionNuevoElemento(elemento) {
    elemento.classList.add('new-item');
    setTimeout(() => {
        elemento.classList.remove('new-item');
    }, 500);
}

// Agregar evento para el formulario de nuevo semestre
document.addEventListener('DOMContentLoaded', () => {
    const formNuevoSemestre = document.getElementById('formNuevoSemestre');
    if (formNuevoSemestre) {
        formNuevoSemestre.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombreInput = document.getElementById('nombreSemestre');
            const nombre = nombreInput.value.trim();
            if (nombre) {
                window.gestorMaterias.agregarSemestre(nombre);
                nombreInput.value = '';
            }
        });
    }
});
 