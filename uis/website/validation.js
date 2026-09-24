const form = document.querySelector('#application-form');
const success = document.querySelector('#success-message');
const comments = document.querySelector('#comments');
const volume = document.querySelector('#volume');
const warning = document.querySelector('#volume-warning');
const serviceInputs = [...document.querySelectorAll('input[name="services"]')];
const thirdPartyInputs = [...document.querySelectorAll('input[name="thirdParty"]')];

const messages = {
  companyName: 'El nombre de la empresa debe tener al menos 2 caracteres',
  contactName: 'Ingresa nombre y apellido del contacto',
  corporateEmail: 'Ingresa un email corporativo válido (ejemplo: nombre@empresa.com)',
  phone: 'El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)',
  website: 'Si incluyes sitio web, debe ser una URL válida',
  country: 'Selecciona el país de operación principal',
  productType: 'Selecciona el tipo de producto que manejas',
  volume: 'Selecciona el volumen mensual estimado',
  services: 'Selecciona al menos un servicio de interés',
  thirdParty: 'Indica si actualmente trabajas con otro proveedor logístico',
  privacy: 'Debes aceptar la política de privacidad para continuar'
};

function setError(id, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(`${id}-error`);
  if (error) {
    error.textContent = message;
    error.classList.toggle('hidden', !message);
    error.style.display = message ? 'block' : 'none';
  }
  if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (field && field.tagName !== 'SELECT') {
    field.classList.toggle('border-red-500', Boolean(message));
    field.classList.toggle('border-slate-300', !message);
  }
}

function clearErrors() {
  document.querySelectorAll('[id$="-error"]').forEach(error => {
    error.textContent = '';
    error.classList.add('hidden');
    error.style.display = 'none';
  });
  document.querySelectorAll('[aria-invalid="true"]').forEach(field => {
    field.setAttribute('aria-invalid', 'false');
    field.classList.remove('border-red-500');
    field.classList.add('border-slate-300');
  });
}

function hasTwoWords(value) {
  return value.trim().split(/\s+/).filter(Boolean).length >= 2;
}

function validPhone(value) {
  return /^\+\d{1,3}\s[\d\s().-]{6,}$/.test(value.trim());
}

function validWebsite(value) {
  const normalized = value.trim();
  if (!normalized) return true;
  try {
    const url = new URL(/^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`);
    return Boolean(url.hostname && url.hostname.includes('.'));
  } catch {
    return false;
  }
}

function validateForm(shouldFocusFirstError = true) {
  clearErrors();
  const invalidIds = [];
  const companyName = document.querySelector('#companyName');
  const contactName = document.querySelector('#contactName');
  const email = document.querySelector('#corporateEmail');
  const phone = document.querySelector('#phone');
  const website = document.querySelector('#website');
  const country = document.querySelector('#country');
  const productType = document.querySelector('#productType');
  const privacy = document.querySelector('#privacy');

  function invalid(id, message) {
    setError(id, message);
    invalidIds.push(id);
  }

  if (companyName.value.trim().length < 2) invalid('companyName', messages.companyName);
  if (!hasTwoWords(contactName.value)) invalid('contactName', messages.contactName);
  if (!email.validity.valid) invalid('corporateEmail', messages.corporateEmail);
  if (!validPhone(phone.value)) invalid('phone', messages.phone);
  if (!validWebsite(website.value)) invalid('website', messages.website);
  if (!country.value) invalid('country', messages.country);
  if (!productType.value) invalid('productType', messages.productType);
  if (!volume.value) invalid('volume', messages.volume);
  if (!serviceInputs.some(input => input.checked)) {
    const servicesError = document.querySelector('#services-error');
    servicesError.textContent = messages.services;
    servicesError.classList.remove('hidden');
    servicesError.style.display = 'block';
    invalidIds.push('services-group');
  }
  if (!thirdPartyInputs.some(input => input.checked)) {
    const thirdPartyError = document.querySelector('#thirdParty-error');
    thirdPartyError.textContent = messages.thirdParty;
    thirdPartyError.classList.remove('hidden');
    thirdPartyError.style.display = 'block';
    invalidIds.push('thirdPartyGroup');
  }
  if (comments.value.length > 500) invalid('comments', `Los comentarios no pueden exceder 500 caracteres (quedan ${500 - comments.value.length})`);
  if (!privacy.checked) invalid('privacy', messages.privacy);

  if (invalidIds.length) {
    if (shouldFocusFirstError) document.getElementById(invalidIds[0]).focus();
    return false;
  }
  return true;
}

function updateCounter() {
  document.querySelector('#comments-count').textContent = `${comments.value.length}/500`;
  const error = document.querySelector('#comments-error');
  const tooLong = comments.value.length > 500;
  error.textContent = tooLong ? `Los comentarios no pueden exceder 500 caracteres (quedan ${500 - comments.value.length})` : '';
  error.classList.toggle('hidden', !tooLong);
  error.style.display = tooLong ? 'block' : 'none';
  comments.setAttribute('aria-invalid', tooLong ? 'true' : 'false');
}

function updateVolumeWarning() {
  warning.classList.toggle('hidden', volume.value !== '0-100');
}

form.addEventListener('submit', event => {
  event.preventDefault();
  success.classList.add('hidden');
  if (!validateForm()) return;
  form.classList.add('hidden');
  success.classList.remove('hidden');
  success.focus();
});

form.addEventListener('reset', () => {
  window.setTimeout(() => {
    clearErrors();
    updateCounter();
    updateVolumeWarning();
    form.classList.remove('hidden');
    success.classList.add('hidden');
  }, 0);
});

comments.addEventListener('input', updateCounter);
volume.addEventListener('change', updateVolumeWarning);

form.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('blur', () => {
    if (field.id === 'comments') updateCounter();
    else if (field.id) validateForm(false);
  });
});

updateCounter();
updateVolumeWarning();