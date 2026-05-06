const escapeCsvCell = (value) => {
  if (value == null) {
    return '';
  }

  const stringValue = String(value);

  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export const createCsvExporter = () => {
  const exportCompanies = (companies = []) => {
    const headers = [
      'ID',
      'Nome Fantasia',
      'Razão Social',
      'CNPJ',
      'Segmento / Atividade',
      'Telefone',
      'WhatsApp Status',
      'Website',
      'Endereço',
      'Cidade',
      'UF',
      'CEP',
      'País',
      'Score de Qualidade',
      'Avaliação',
      'Status Operacional',
      'Fonte',
    ];

    const rows = companies.map((company) => [
      company.id || company.sourceId || '',
      company.nome_fantasia || '',
      company.razao_social || company['razão_social'] || '',
      company.cnpj || '',
      company.atividade_principal || company.segment || '',
      company.telefone || '',
      company.whatsappStatus || '',
      company.website || '',
      company.endereco || '',
      company.cidade || '',
      company.uf || '',
      company.cep || '',
      company.pais || '',
      company.score || 0,
      company.rating || '',
      company.businessStatus || company.business_status || '',
      company.source || '',
    ]);

    const csvContent = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map((row) => row.map(escapeCsvCell).join(',')),
    ].join('\n');

    return csvContent;
  };

  return {
    exportCompanies,
  };
};
