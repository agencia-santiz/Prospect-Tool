export const SEGMENT_TAXONOMY_VERSION = '2026-05-05';

const dedupeStrings = (values = []) => [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];

const createSegment = (segment) => {
  const aliases = dedupeStrings(segment.aliases);
  const positiveTerms = dedupeStrings([
    ...(segment.positiveTerms || []),
    segment.label,
    segment.category,
    ...aliases,
  ]);

  return {
    id: segment.id,
    label: segment.label,
    category: segment.category,
    aliases,
    positiveTerms,
    negativeTerms: dedupeStrings(segment.negativeTerms),
    googleTypes: dedupeStrings(segment.googleTypes),
    cnaeCodes: dedupeStrings(segment.cnaeCodes),
    broadParent: segment.broadParent || '',
  };
};

const RAW_SEGMENTS = [
  {
    id: 'administrativo_escritorio',
    label: 'Administrativo / Escritório',
    category: 'Operações',
    aliases: ['adm', 'admin', 'administracao', 'administrativo', 'escritorio', 'backoffice'],
    googleTypes: ['office'],
    cnaeCodes: ['8211-3/00'],
    broadParent: 'operacoes',
  },
  {
    id: 'administracao_publica',
    label: 'Administração Pública',
    category: 'Setor Público',
    aliases: ['adm publica', 'governo', 'prefeitura', 'orgao publico', 'setor publico'],
    googleTypes: ['local_government_office'],
    broadParent: 'publico',
  },
  {
    id: 'tecnologia_informacao_saas',
    label: 'Tecnologia da Informação / SaaS',
    category: 'Tecnologia',
    aliases: ['ti', 'tech', 'tecnologia', 'software', 'saas', 'dev'],
    googleTypes: ['software_company', 'computer_store'],
    cnaeCodes: ['6201-5/01', '6202-3/00', '6203-1/00', '6209-1/00'],
    broadParent: 'tecnologia',
  },
  {
    id: 'consultoria_empresarial',
    label: 'Consultoria Empresarial',
    category: 'Serviços',
    aliases: ['consultoria', 'consultoria de negocios', 'b2b', 'advisory'],
    googleTypes: ['consultant'],
    cnaeCodes: ['7020-4/00'],
    broadParent: 'servicos',
  },
  {
    id: 'contabilidade',
    label: 'Contabilidade',
    category: 'Serviços',
    aliases: ['contabil', 'contador', 'escritorio contabil', 'fiscal'],
    googleTypes: ['accounting'],
    cnaeCodes: ['6920-6/01'],
    broadParent: 'servicos',
  },
  {
    id: 'financeiro_bancario',
    label: 'Financeiro / Bancário',
    category: 'Financeiro',
    aliases: ['financeiro', 'banco', 'fintech', 'investimentos', 'credit'],
    googleTypes: ['bank', 'atm'],
    cnaeCodes: ['6410-7/00'],
    broadParent: 'financeiro',
  },
  {
    id: 'marketing_publicidade',
    label: 'Marketing / Publicidade',
    category: 'Serviços',
    aliases: ['marketing', 'publicidade', 'agencia', 'mkt', 'comunicacao'],
    googleTypes: ['advertising_agency'],
    cnaeCodes: ['7311-4/00'],
    broadParent: 'servicos',
  },
  {
    id: 'recursos_humanos_recrutamento',
    label: 'Recursos Humanos / Recrutamento',
    category: 'Serviços',
    aliases: ['rh', 'recrutamento', 'headhunter', 'dp', 'people'],
    googleTypes: ['employment_agency'],
    cnaeCodes: ['7810-8/00'],
    broadParent: 'servicos',
  },
  {
    id: 'juridico_advocacia',
    label: 'Jurídico / Advocacia',
    category: 'Serviços',
    aliases: ['juridico', 'advocacia', 'advogado', 'law'],
    googleTypes: ['lawyer'],
    cnaeCodes: ['6911-7/01'],
    broadParent: 'servicos',
  },
  {
    id: 'educacao_cursos',
    label: 'Educação / Cursos',
    category: 'Educação',
    aliases: ['educacao', 'escola', 'curso', 'treinamento', 'edtech'],
    googleTypes: ['school', 'university'],
    cnaeCodes: ['8599-6/04'],
    broadParent: 'educacao',
  },
  {
    id: 'saude_clinica_medica',
    label: 'Saúde / Clínica Médica',
    category: 'Saúde',
    aliases: ['saude', 'clinica', 'medico', 'hospital', 'health'],
    googleTypes: ['doctor', 'hospital'],
    cnaeCodes: ['8630-5/01', '8630-5/03'],
    broadParent: 'saude',
  },
  {
    id: 'odontologia',
    label: 'Odontologia',
    category: 'Saúde',
    aliases: ['dentista', 'odonto', 'odontologico'],
    googleTypes: ['dentist'],
    cnaeCodes: ['8630-5/04'],
    broadParent: 'saude',
  },
  {
    id: 'farmacia',
    label: 'Farmácia',
    category: 'Saúde',
    aliases: ['farmacia', 'drogaria', 'drugstore'],
    googleTypes: ['pharmacy'],
    cnaeCodes: ['4771-7/01'],
    broadParent: 'saude',
  },
  {
    id: 'beleza_estetica',
    label: 'Beleza e Estética',
    category: 'Serviços',
    aliases: ['beleza', 'estetica', 'salao', 'barbearia', 'spa'],
    googleTypes: ['beauty_salon', 'hair_care', 'spa'],
    broadParent: 'servicos',
  },
  {
    id: 'academia_fitness',
    label: 'Academia / Fitness',
    category: 'Serviços',
    aliases: ['academia', 'fitness', 'gym', 'pilates', 'crossfit'],
    googleTypes: ['gym'],
    broadParent: 'servicos',
  },
  {
    id: 'restaurante_gastronomia',
    label: 'Restaurante / Gastronomia',
    category: 'Alimentação',
    aliases: ['restaurante', 'gastronomia', 'bar', 'food service', 'japa', 'comida'],
    negativeTerms: ['supermercado', 'atacado de alimentos', 'distribuidora', 'industria alimenticia'],
    googleTypes: ['restaurant', 'bar', 'cafe'],
    cnaeCodes: ['5611-2/01', '5611-2/03', '5620-1/02'],
    broadParent: 'alimentacao',
  },
  {
    id: 'pizzaria',
    label: 'Pizzaria',
    category: 'Alimentação',
    aliases: ['pizzas', 'pizza', 'delivery de pizza'],
    googleTypes: ['pizza_restaurant', 'restaurant'],
    cnaeCodes: ['5611-2/01'],
    broadParent: 'alimentacao',
  },
  {
    id: 'churrascaria',
    label: 'Churrascaria',
    category: 'Alimentação',
    aliases: ['churrasco', 'steakhouse', 'espetinho'],
    googleTypes: ['steak_house', 'restaurant'],
    cnaeCodes: ['5611-2/01'],
    broadParent: 'alimentacao',
  },
  {
    id: 'hamburgueria',
    label: 'Hamburgueria',
    category: 'Alimentação',
    aliases: ['burguer', 'burger', 'hamburgueres', 'hamburguinhos'],
    googleTypes: ['hamburger_restaurant', 'restaurant'],
    cnaeCodes: ['5611-2/03'],
    broadParent: 'alimentacao',
  },
  {
    id: 'lanchonetes_fast_food',
    label: 'Lanchonetes / Fast Food',
    category: 'Alimentação',
    aliases: ['lanche', 'lanchonete', 'hamburguer', 'burguer', 'hot dog', 'cachorro quente', 'salgado', 'pastel', 'fast food', 'sanduiche'],
    negativeTerms: ['supermercado', 'restaurante de luxo'],
    googleTypes: ['restaurant', 'meal_takeaway'],
    cnaeCodes: ['5611-2/03'],
    broadParent: 'alimentacao',
  },
  {
    id: 'alimentacao_food_service',
    label: 'Alimentação / Food Service',
    category: 'Alimentação',
    aliases: ['alimentacao', 'alimentos', 'bebidas', 'cafeteria', 'padaria', 'confeitaria', 'doceria'],
    negativeTerms: ['supermercado', 'atacado de alimentos', 'distribuidora', 'industria alimenticia'],
    googleTypes: ['restaurant', 'meal_takeaway', 'bakery', 'cafe'],
    cnaeCodes: ['5620-1/02', '5620-1/04'],
    broadParent: 'alimentacao',
  },
  {
    id: 'supermercado_varejo',
    label: 'Supermercado / Varejo',
    category: 'Comércio',
    aliases: ['varejo', 'supermercado', 'mercado', 'loja', 'comercio'],
    negativeTerms: ['restaurante', 'lanchonete', 'padaria'],
    googleTypes: ['supermarket', 'convenience_store', 'department_store'],
    cnaeCodes: ['4711-3/02'],
    broadParent: 'comercio',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    category: 'Comércio',
    aliases: ['ecommerce', 'lojavirtual', 'marketplace', 'commerce'],
    googleTypes: ['store', 'electronics_store'],
    cnaeCodes: ['4791-9/01'],
    broadParent: 'comercio',
  },
  {
    id: 'vestuario_moda',
    label: 'Vestuário / Moda',
    category: 'Comércio',
    aliases: ['vestuario', 'moda', 'roupas', 'fashion'],
    negativeTerms: ['lavanderia', 'costura industrial', 'tecido por atacado'],
    googleTypes: ['clothing_store', 'shoe_store'],
    cnaeCodes: ['4781-4/00'],
    broadParent: 'comercio',
  },
  {
    id: 'industria',
    label: 'Indústria',
    category: 'Indústria',
    aliases: ['industria', 'fabrica', 'manufatura'],
    googleTypes: ['factory'],
    broadParent: 'industria',
  },
  {
    id: 'industria_alimenticia',
    label: 'Indústria Alimentícia',
    category: 'Indústria',
    aliases: ['ind alimenticia', 'alimentos industriais', 'bebidas industriais'],
    googleTypes: ['factory'],
    broadParent: 'industria',
  },
  {
    id: 'industria_metalurgica',
    label: 'Indústria Metalúrgica',
    category: 'Indústria',
    aliases: ['metalurgica', 'metalmecanica', 'usinagem', 'siderurgia'],
    googleTypes: ['factory'],
    broadParent: 'industria',
  },
  {
    id: 'industria_plastica_embalagens',
    label: 'Indústria Plástica / Embalagens',
    category: 'Indústria',
    aliases: ['plastico', 'embalagem', 'packaging', 'polimeros'],
    googleTypes: ['factory'],
    broadParent: 'industria',
  },
  {
    id: 'construcao_civil',
    label: 'Construção Civil',
    category: 'Construção',
    aliases: ['construcao', 'obra', 'engenharia civil', 'incorporacao'],
    googleTypes: ['general_contractor', 'construction_company'],
    cnaeCodes: ['4120-4/00', '4321-5/00'],
    broadParent: 'construcao',
  },
  {
    id: 'arquitetura_engenharia',
    label: 'Arquitetura / Engenharia',
    category: 'Construção',
    aliases: ['arquitetura', 'engenharia', 'projetos', 'projetista'],
    googleTypes: ['architect', 'engineer'],
    cnaeCodes: ['7111-1/00', '7112-0/00'],
    broadParent: 'construcao',
  },
  {
    id: 'imobiliario',
    label: 'Imobiliário',
    category: 'Imobiliário',
    aliases: ['imobiliario', 'imoveis', 'corretora', 'imobiliaria'],
    googleTypes: ['real_estate_agency'],
    cnaeCodes: ['6810-2/01', '6821-8/01'],
    broadParent: 'imobiliario',
  },
  {
    id: 'logistica_transporte',
    label: 'Logística / Transporte',
    category: 'Logística',
    aliases: ['logistica', 'transporte', 'frete', 'distribuicao'],
    googleTypes: ['moving_company', 'storage'],
    cnaeCodes: ['4930-2/01', '4930-2/02'],
    broadParent: 'logistica',
  },
  {
    id: 'automotivo',
    label: 'Automotivo',
    category: 'Automotivo',
    aliases: ['automotivo', 'auto', 'oficina', 'mecanica', 'garagem'],
    googleTypes: ['car_repair'],
    cnaeCodes: ['4520-0/01', '4520-0/02'],
    broadParent: 'automotivo',
  },
  {
    id: 'autopecas',
    label: 'Autopeças',
    category: 'Automotivo',
    aliases: ['autopecas', 'pecas', 'repuestos'],
    googleTypes: ['car_repair', 'store'],
    cnaeCodes: ['4530-7/01'],
    broadParent: 'automotivo',
  },
  {
    id: 'concessionaria',
    label: 'Concessionária',
    category: 'Automotivo',
    aliases: ['concessionaria', 'revenda', 'dealer'],
    googleTypes: ['car_dealer'],
    cnaeCodes: ['4511-1/01'],
    broadParent: 'automotivo',
  },
  {
    id: 'assistencia_tecnica',
    label: 'Assistência Técnica',
    category: 'Serviços',
    aliases: ['assistencia tecnica', 'suporte tecnico', 'reparo'],
    googleTypes: ['electronics_store', 'computer_store'],
    cnaeCodes: ['9511-8/00', '9521-5/00'],
    broadParent: 'servicos',
  },
  {
    id: 'telecomunicacoes',
    label: 'Telecomunicações',
    category: 'Tecnologia',
    aliases: ['telecom', 'telefonia', 'internet', 'operadora'],
    googleTypes: ['telecommunications_service_provider'],
    cnaeCodes: ['6110-8/03', '6120-5/01'],
    broadParent: 'tecnologia',
  },
  {
    id: 'energia_solar',
    label: 'Energia Solar',
    category: 'Energia',
    aliases: ['energia solar', 'fotovoltaica', 'solar'],
    googleTypes: ['electrician'],
    broadParent: 'energia',
  },
  {
    id: 'seguranca_eletronica',
    label: 'Segurança Eletrônica',
    category: 'Serviços',
    aliases: ['seguranca', 'monitoramento', 'cftv', 'alarme'],
    googleTypes: ['security_service'],
    cnaeCodes: ['8020-0/01'],
    broadParent: 'servicos',
  },
  {
    id: 'facilities_limpeza',
    label: 'Facilities / Limpeza',
    category: 'Serviços',
    aliases: ['facilities', 'limpeza', 'conservacao', 'terceirizacao'],
    googleTypes: ['cleaning_service'],
    cnaeCodes: ['8121-4/00', '8129-0/00'],
    broadParent: 'servicos',
  },
  {
    id: 'eventos_buffet',
    label: 'Eventos / Buffet',
    category: 'Serviços',
    aliases: ['eventos', 'buffet', 'cerimonial'],
    googleTypes: ['event_venue', 'caterer'],
    cnaeCodes: ['8230-0/01', '5620-1/02'],
    broadParent: 'servicos',
  },
  {
    id: 'hotelaria_turismo',
    label: 'Hotelaria / Turismo',
    category: 'Serviços',
    aliases: ['hotelaria', 'turismo', 'hotel', 'pousada', 'viagem'],
    googleTypes: ['lodging', 'travel_agency'],
    cnaeCodes: ['5510-8/01', '7911-2/00'],
    broadParent: 'servicos',
  },
  {
    id: 'pet_shop',
    label: 'Pet Shop',
    category: 'Serviços',
    aliases: ['pet', 'petshop', 'animais', 'veterinaria'],
    googleTypes: ['pet_store', 'veterinary_care'],
    cnaeCodes: ['4771-7/04'],
    broadParent: 'servicos',
  },
  {
    id: 'laboratorio',
    label: 'Laboratório',
    category: 'Saúde',
    aliases: ['laboratorio', 'analises', 'diagnostico'],
    googleTypes: ['laboratory'],
    cnaeCodes: ['8640-2/01', '8640-2/02'],
    broadParent: 'saude',
  },
  {
    id: 'otica',
    label: 'Ótica',
    category: 'Saúde',
    aliases: ['otica', 'lentes', 'armacoes', 'oculos'],
    googleTypes: ['optician'],
    cnaeCodes: ['4774-1/00'],
    broadParent: 'saude',
  },
  {
    id: 'papelaria_material_escritorio',
    label: 'Papelaria / Material de Escritório',
    category: 'Comércio',
    aliases: ['papelaria', 'material de escritorio', 'suprimentos', 'insumos'],
    googleTypes: ['store'],
    cnaeCodes: ['4761-0/03'],
    broadParent: 'comercio',
  },
  {
    id: 'distribuidora_atacado',
    label: 'Distribuidora / Atacado',
    category: 'Comércio',
    aliases: ['distribuidora', 'atacado', 'wholesale', 'revenda'],
    googleTypes: ['wholesaler'],
    cnaeCodes: ['4691-5/00'],
    broadParent: 'comercio',
  },
  {
    id: 'importacao_exportacao',
    label: 'Importação / Exportação',
    category: 'Comércio',
    aliases: ['importacao', 'exportacao', 'comex', 'trading'],
    googleTypes: ['office'],
    cnaeCodes: ['4619-2/00'],
    broadParent: 'comercio',
  },
  {
    id: 'startups',
    label: 'Startups',
    category: 'Tecnologia',
    aliases: ['startup', 'scaleup', 'inovacao', 'venture'],
    googleTypes: ['software_company'],
    cnaeCodes: ['6201-5/01'],
    broadParent: 'tecnologia',
  },
  {
    id: 'cooperativa',
    label: 'Cooperativa',
    category: 'Serviços',
    aliases: ['cooperativa', 'co-op', 'associacao'],
    googleTypes: ['cooperative'],
    broadParent: 'servicos',
  },
  {
    id: 'energia_utilities',
    label: 'Energia / Utilities',
    category: 'Energia',
    aliases: ['utilities', 'saneamento', 'servicos publicos'],
    googleTypes: ['electrician'],
    cnaeCodes: ['3511-5/01', '3512-3/00', '3600-6/01'],
    broadParent: 'energia',
  },
  {
    id: 'call_center_bpo',
    label: 'Call Center / BPO',
    category: 'Serviços',
    aliases: ['call center', 'bpo', 'contact center', 'atendimento'],
    googleTypes: ['office'],
    cnaeCodes: ['8220-2/00'],
    broadParent: 'servicos',
  },
  {
    id: 'ti_infraestrutura',
    label: 'TI / Infraestrutura',
    category: 'Tecnologia',
    aliases: ['infra', 'nuvem', 'cloud', 'data center', 'network'],
    googleTypes: ['computer_store', 'office'],
    cnaeCodes: ['6209-1/00', '6311-9/00'],
    broadParent: 'tecnologia',
  },
];

export const SEGMENT_DATABASE = RAW_SEGMENTS.map(createSegment);

export const normalizeSegmentText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

const getSegmentSearchTokens = (segment) =>
  [
    segment.id,
    segment.label,
    segment.category,
    ...segment.aliases,
    ...segment.positiveTerms,
    ...segment.googleTypes,
    ...segment.cnaeCodes,
  ].map(normalizeSegmentText);

const scoreSegment = (segment, normalizedQuery, index) => {
  const normalizedId = normalizeSegmentText(segment.id);
  const normalizedLabel = normalizeSegmentText(segment.label);
  const normalizedCategory = normalizeSegmentText(segment.category);
  const normalizedAliases = segment.aliases.map(normalizeSegmentText);
  const normalizedPositives = segment.positiveTerms.map(normalizeSegmentText);
  const tokens = getSegmentSearchTokens(segment);

  let score = 0;
  let matchedBy = '';

  if (normalizedId === normalizedQuery) {
    score += 130;
    matchedBy = 'id-exact';
  }

  if (normalizedLabel === normalizedQuery) {
    score += 125;
    matchedBy = matchedBy || 'label-exact';
  }

  if (normalizedAliases.includes(normalizedQuery) || normalizedPositives.includes(normalizedQuery)) {
    score += 120;
    matchedBy = matchedBy || 'term-exact';
  }

  if (normalizedLabel.startsWith(normalizedQuery)) {
    score += 90;
    matchedBy = matchedBy || 'label-prefix';
  }

  if (normalizedAliases.some((alias) => alias.startsWith(normalizedQuery)) || normalizedPositives.some((term) => term.startsWith(normalizedQuery))) {
    score += 85;
    matchedBy = matchedBy || 'term-prefix';
  }

  if (normalizedCategory.startsWith(normalizedQuery)) {
    score += 75;
    matchedBy = matchedBy || 'category-prefix';
  }

  if (
    normalizedQuery.length >= 3 &&
    !normalizedLabel.startsWith(normalizedQuery) &&
    !normalizedAliases.some((alias) => alias.startsWith(normalizedQuery)) &&
    !normalizedPositives.some((term) => term.startsWith(normalizedQuery)) &&
    !normalizedCategory.startsWith(normalizedQuery) &&
    tokens.some((token) => token.includes(normalizedQuery))
  ) {
    score += 25;
    matchedBy = matchedBy || 'token-contains';
  }

  if (segment.negativeTerms.some((term) => normalizeSegmentText(term).includes(normalizedQuery))) {
    score -= 10;
  }

  if (score === 0) {
    return null;
  }

  score += Math.max(0, 20 - index);

  return {
    ...segment,
    canonicalId: segment.id,
    score,
    matchedBy,
  };
};

export const getSegmentSuggestions = (query, limit = 8, taxonomy = SEGMENT_DATABASE) => {
  const normalizedQuery = normalizeSegmentText(query);

  if (!normalizedQuery) {
    return [];
  }

  const scored = taxonomy.map((segment, index) => scoreSegment(segment, normalizedQuery, index)).filter(Boolean);

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.label.localeCompare(b.label);
    })
    .slice(0, limit)
    .map(({ score, ...segment }) => segment);
};

export const getSegmentByCanonicalId = (canonicalId, taxonomy = SEGMENT_DATABASE) =>
  taxonomy.find((segment) => segment.id === String(canonicalId || '').trim()) || null;

export const resolveSegmentRecord = (query, { allowLooseFallback = false } = {}, taxonomy = SEGMENT_DATABASE) => {
  const normalizedQuery = normalizeSegmentText(query);
  if (normalizedQuery.length < 2) {
    return null;
  }

  const suggestion = getSegmentSuggestions(query, 1, taxonomy)[0];
  if (suggestion) {
    return {
      ...suggestion,
      taxonomyVersion: SEGMENT_TAXONOMY_VERSION,
      query: String(query || '').trim(),
      normalizedQuery,
      resolved: true,
    };
  }

  if (!allowLooseFallback) {
    return null;
  }

  return {
    canonicalId: null,
    id: null,
    label: String(query || '').trim(),
    category: '',
    aliases: [],
    positiveTerms: [],
    negativeTerms: [],
    googleTypes: [],
    cnaeCodes: [],
    broadParent: '',
    score: 0,
    matchedBy: 'free-text',
    taxonomyVersion: SEGMENT_TAXONOMY_VERSION,
    query: String(query || '').trim(),
    normalizedQuery,
    resolved: false,
  };
};

export const resolveSegmentQuery = (query, taxonomy = SEGMENT_DATABASE) => {
  const resolved = resolveSegmentRecord(query, { allowLooseFallback: true }, taxonomy);
  return resolved?.label || '';
};
