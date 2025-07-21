  document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const clearButtons = document.querySelectorAll("#clear-filters, #clear-filters-mobile");
    const tarjetas = document.querySelectorAll(".tarjeta");
    const mobileFilters = document.getElementById("mobile-filters");

    let filtrosSeleccionados = [];

    // Función para aplicar filtros
    const aplicarFiltros = () => {
    let hayResultados = false;

    tarjetas.forEach(tarjeta => {
      const etiquetas = Array.from(tarjeta.querySelectorAll("span")).flatMap(span =>
        Array.from(span.classList)
      );

      const cumpleTodos = filtrosSeleccionados.every(filtro =>
        etiquetas.includes(filtro)
      );

      if (cumpleTodos) {
        tarjeta.style.display = "flex";
        hayResultados = true;
      } else {
        tarjeta.style.display = "none";
      }
    });

    // Mostrar/ocultar mensaje de "no resultados"
    const mensaje = document.getElementById("no-results-message");
    if (mensaje) {
      mensaje.classList.toggle("hidden", hayResultados);
    }
  };


    // Activar/desactivar filtros (1 por grupo)
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        const filtro = button.dataset.filter.toLowerCase();
        const grupo = button.dataset.group;

        const botonesDelGrupo = Array.from(document.querySelectorAll(`.filter-btn[data-group="${grupo}"]`));

        const yaActivo = button.classList.contains("bg-[#1a1a1a]");

        // Desactiva todos del grupo
        botonesDelGrupo.forEach(btn => {
          btn.classList.remove("bg-[#1a1a1a]", "text-white", "border-[#1a1a1a]", "shadow-md");
          filtrosSeleccionados = filtrosSeleccionados.filter(f => f !== btn.dataset.filter.toLowerCase());
        });

        // Si no estaba activo, activar este
        if (!yaActivo) {
          button.classList.add("bg-[#1a1a1a]", "text-white", "border-[#1a1a1a]", "shadow-md");
          filtrosSeleccionados.push(filtro);
        }

        aplicarFiltros();
      });
    });

    // Limpiar filtros
    clearButtons.forEach(clearBtn => {
      clearBtn.addEventListener("click", () => {
        filtrosSeleccionados = [];

        filterButtons.forEach(button =>
          button.classList.remove("bg-[#1a1a1a]", "text-white", "border-[#1a1a1a]", "shadow-md")
        );

        tarjetas.forEach(tarjeta => {
          tarjeta.style.display = "flex";
        });
      });
    });

    // Mostrar/ocultar filtros móviles
    window.toggleMobileFilters = () => {
      mobileFilters.classList.toggle("hidden");
    };
  });

  // Menú hamburguesa
  const btn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        menu.classList.add('hidden');
      }, 100);
    });
  });
// Funcionalidad para botón "Limpiar filtros" desde el mensaje de no resultados
const resetFiltersBtn = document.getElementById("reset-filters");
if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener("click", () => {
    filtrosSeleccionados = [];

    document.querySelectorAll(".filter-btn").forEach(button => {
      button.classList.remove("bg-[#1a1a1a]", "text-white", "border-[#1a1a1a]", "shadow-md");
    });

    document.querySelectorAll(".tarjeta").forEach(tarjeta => {
      tarjeta.style.display = "flex";
    });

    const mensaje = document.getElementById("no-results-message");
    if (mensaje) mensaje.classList.add("hidden");
  });
}


const doorTypeSelect = document.getElementById('door-type');
const materialSelect = document.getElementById('material');
const totalPriceElement = document.getElementById('total-price');
const form = document.getElementById('quote-form');
const priceBox = document.getElementById('price-box');

const materialsMap = {
  entrada: [
    { value: 'contraplacada-reforzada', label: 'Contraplacada Reforzada', price: 1500 },
    { value: 'cachimbo', label: 'Cachimbo', price: 2600 },
    { value: 'mohena', label: 'Mohena', price: 2700 },
    { value: 'caoba', label: 'Caoba', price: 3300 },
    { value: 'cedro', label: 'Cedro', price: 3300 }
  ],
  interior: [
    { value: 'contraplacada-triplay', label: 'Contraplacada Triplay (Cedro)', price: 690 }
  ],
  garaje: [
    { value: 'cachimbo', label: 'Cachimbo', price: 2600 },
    { value: 'mohena', label: 'Mohena', price: 2700 },
    { value: 'caoba', label: 'Caoba', price: 3300 },
    { value: 'cedro', label: 'Cedro', price: 3300 }
  ]
};

function updateMaterials() {
  const selectedType = doorTypeSelect.value;
  materialSelect.innerHTML = '<option value="" disabled selected>Selecciona un material</option>';
  if (selectedType && materialsMap[selectedType]) {
    materialsMap[selectedType].forEach(material => {
      const option = document.createElement('option');
      option.value = material.value;
      option.textContent = material.label;
      materialSelect.appendChild(option);
    });
  }
}

function calculatePrice() {
  const type = doorTypeSelect.value;
  const materialValue = materialSelect.value;
  const materialData = materialsMap[type]?.find(m => m.value === materialValue);
  const height = parseFloat(document.getElementById("height").value);
  const width = parseFloat(document.getElementById("width").value);
  if (!materialData || !height || !width) return;

  const area = (width / 100) * (height / 100);
  const baseArea = 2.4 * 1.0;
  let price = materialData.price;
  if (area > baseArea) {
    price *= area / baseArea;
  }
  const total = Math.round(price);
  totalPriceElement.textContent = `S/${total}`;
  return total;
}

function mostrarPrecio() {
  const total = calculatePrice();
  if (total) {
    priceBox.classList.remove('hidden');
  }
}

function enviarWhatsapp(nombre, apellido, tipo, material, alto, ancho, precio) {
  const mensaje = `Hola! soy ${nombre} ${apellido} y quiero una cotización para una puerta de ${tipo} ${material} de ${alto}x${ancho} cms. Precio estimado: S/${precio}`;
  const url = `https://wa.me/51948660856?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const nombre = document.getElementById("first-name").value.trim();
  const apellido = document.getElementById("last-name").value.trim();
  const tipo = doorTypeSelect.options[doorTypeSelect.selectedIndex].text;
  const material = materialSelect.options[materialSelect.selectedIndex].text;
  const alto = document.getElementById("height").value;
  const ancho = document.getElementById("width").value;
  const precio = totalPriceElement.textContent.replace("S/", "").trim();
  if (!nombre || !apellido || !tipo || !material || !alto || !ancho || !precio) {
    alert("Por favor, completa todos los campos.");
    return;
  }
  enviarWhatsapp(nombre, apellido, tipo, material, alto, ancho, precio);
});

doorTypeSelect.addEventListener('change', () => {
  updateMaterials();
  priceBox.classList.add('hidden');
});
materialSelect.addEventListener('change', () => {
  priceBox.classList.add('hidden');
});
