export function formatCPF(value: string): string {
  // Remove todos os caracteres não numéricos
  value = value.replace(/\D/g, '');

  // Limita o comprimento para 11 caracteres
  value = value.slice(0, 11);

  // Aplica a formatação CPF
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  return value;
}

export function formatCNPJ(value: string): string {
  // Remove todos os caracteres não numéricos
  value = value.replace(/\D/g, '');

  // Limita o comprimento para 14 caracteres
  value = value.slice(0, 14);

  // Aplica a formatação CNPJ
  value = value.replace(/^(\d{2})(\d)/, '$1.$2');
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
  value = value.replace(/(\d{4})(\d)/, '$1-$2');

  return value;
}

export function formatPhone(value: string): string {
  // Remove todos os caracteres não numéricos
  value = value.replace(/\D/g, '');

  // Limita o comprimento para 11 caracteres
  value = value.slice(0, 11);

  // Aplica a formatação de telefone
  value = value.replace(/^(\d{2})(\d)/, '($1)$2');

  return value;
}

export function formatCEP(value: string): string {
  // Remove todos os caracteres não numéricos
  value = value.replace(/\D/g, '');

  // Limita o comprimento para 8 caracteres
  value = value.slice(0, 8);

  // Aplica a formatação CEP
  value = value.replace(/(\d{5})(\d)/, '$1-$2');

  return value;
}
