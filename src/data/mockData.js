// Mock Data Store - simulates database
export const mockData = {
  escola: {
    id: 1,
    nome: 'EMEI Mundo Encantado',
    cidade: 'São Paulo',
    uf: 'SP',
    logo: null,
  },
  professor: {
    id: 1,
    nome: 'Ana Paula Ferreira',
    email: 'ana.paula@mundoencantado.edu.br',
    turma: 'Turma Girassol',
    periodo: 'Manhã',
  },
  alunos: [
    { id: 1, nome: 'Arthur Souza Lima', idade: 5, turma: 'Turma Girassol', periodo: 'Manhã', avatarColor: 'bg-primary-200 text-primary-700' },
    { id: 2, nome: 'Beatriz Oliveira', idade: 4, turma: 'Turma Girassol', periodo: 'Manhã', avatarColor: 'bg-coral-200 text-coral-700' },
    { id: 3, nome: 'Carlos Eduardo Nunes', idade: 5, turma: 'Turma Girassol', periodo: 'Manhã', avatarColor: 'bg-sage-200 text-sage-700' },
    { id: 4, nome: 'Daniela Mendes', idade: 4, turma: 'Turma Girassol', periodo: 'Manhã', avatarColor: 'bg-amber-200 text-amber-700' },
    { id: 5, nome: 'Eduardo Santos', idade: 3, turma: 'Turma Girassol', periodo: 'Manhã', avatarColor: 'bg-primary-200 text-primary-700' },
    { id: 6, nome: 'Fernanda Costa', idade: 5, turma: 'Turma Girassol', periodo: 'Manhã', avatarColor: 'bg-coral-200 text-coral-700' },
  ],
  turmas: ['Turma Girassol', 'Turma Borboleta', 'Turma Estrela', 'Turma Arco-Íris'],
  habilidadesBNCC: [
    { id: 'EI03EO01', campo: 'O eu, o outro e o nós', descricao: 'Demonstrar empatia pelos outros, percebendo que as pessoas têm diferentes sentimentos.' },
    { id: 'EI03EO02', campo: 'O eu, o outro e o nós', descricao: 'Agir de maneira independente, com confiança em suas capacidades.' },
    { id: 'EI03EO03', campo: 'O eu, o outro e o nós', descricao: 'Ampliar as relações interpessoais, desenvolvendo atitudes de participação.' },
    { id: 'EI03EO04', campo: 'O eu, o outro e o nós', descricao: 'Comunicar suas ideias e sentimentos a pessoas e grupos diversos.' },
    { id: 'EI03EO05', campo: 'O eu, o outro e o nós', descricao: 'Demonstrar valorização das características de seu corpo e das pessoas.' },
    { id: 'EI03CG01', campo: 'Corpo, gestos e movimentos', descricao: 'Criar com o corpo formas diversificadas de expressão de sentimentos.' },
    { id: 'EI03CG02', campo: 'Corpo, gestos e movimentos', descricao: 'Demonstrar controle e adequação do uso de seu corpo em brincadeiras.' },
    { id: 'EI03CG03', campo: 'Corpo, gestos e movimentos', descricao: 'Criar movimentos, gestos, olhares e mímicas com o corpo.' },
    { id: 'EI03CG04', campo: 'Corpo, gestos e movimentos', descricao: 'Adotar hábitos de autocuidado relacionados a higiene, alimentação e conforto.' },
    { id: 'EI03TS01', campo: 'Traços, sons, cores e formas', descricao: 'Utilizar sons produzidos por materiais, objetos e instrumentos musicais.' },
    { id: 'EI03TS02', campo: 'Traços, sons, cores e formas', descricao: 'Expressar-se livremente por meio de desenho, pintura, colagem, dobradura e escultura.' },
    { id: 'EI03TS03', campo: 'Traços, sons, cores e formas', descricao: 'Reconhecer as qualidades do som: altura, intensidade, timbre e duração.' },
    { id: 'EI03EF01', campo: 'Escuta, fala, pensamento e imaginação', descricao: 'Expressar ideias, desejos e sentimentos sobre as experiências.' },
    { id: 'EI03EF02', campo: 'Escuta, fala, pensamento e imaginação', descricao: 'Inventar brincadeiras cantadas, poemas e canções, criando rimas e aliterações.' },
    { id: 'EI03EF03', campo: 'Escuta, fala, pensamento e imaginação', descricao: 'Escolher e folhear livros, procurando orientar-se por temas e ilustrações.' },
    { id: 'EI03EF04', campo: 'Escuta, fala, pensamento e imaginação', descricao: 'Recontar histórias ouvidas e planejar coletivamente roteiros de vídeos.' },
    { id: 'EI03EF05', campo: 'Escuta, fala, pensamento e imaginação', descricao: 'Recontar e recriar histórias ouvidas, com o suporte de imagens.' },
    { id: 'EI03EF06', campo: 'Escuta, fala, pensamento e imaginação', descricao: 'Produzir suas próprias histórias orais e escritas (ortografia inventada).' },
    { id: 'EI03EF07', campo: 'Escuta, fala, pensamento e imaginação', descricao: 'Levantar hipóteses sobre gêneros textuais veiculados em portadores conhecidos.' },
    { id: 'EI03ET01', campo: 'Espaços, tempos, quantidades, relações e transformações', descricao: 'Estabelecer relações de comparação entre objetos, observando suas propriedades.' },
    { id: 'EI03ET02', campo: 'Espaços, tempos, quantidades, relações e transformações', descricao: 'Observar e descrever mudanças em diferentes materiais, resultantes de ações sobre eles.' },
    { id: 'EI03ET03', campo: 'Espaços, tempos, quantidades, relações e transformações', descricao: 'Identificar e selecionar fontes de informações, para responder a questões sobre a natureza.' },
    { id: 'EI03ET04', campo: 'Espaços, tempos, quantidades, relações e transformações', descricao: 'Registrar observações, manipulações e medidas, usando múltiplas linguagens.' },
    { id: 'EI03ET05', campo: 'Espaços, tempos, quantidades, relações e transformações', descricao: 'Classificar objetos e figuras de acordo com suas semelhanças e diferenças.' },
    { id: 'EI03ET06', campo: 'Espaços, tempos, quantidades, relações e transformações', descricao: 'Relatar fatos importantes sobre seu nascimento e desenvolvimento, a história dos seus familiares.' },
  ],
  planosAula: [
    {
      id: 1,
      tema: 'Histórias e Narrativas: O mundo dos contos de fada',
      objetivos: 'Ampliar o vocabulário oral e escrito; estimular a imaginação e a criatividade; desenvolver o gosto pela leitura e pela escrita.',
      camposExperiencia: ['Escuta, fala, pensamento e imaginação', 'O eu, o outro e o nós'],
      habilidades: ['EI03EF01', 'EI03EF03', 'EI03EF05', 'EI03EO01'],
      atividades: 'Roda de leitura com o livro "Chapeuzinho Vermelho"; dramatização da história com fantoches; produção de desenhos ilustrando o conto; reconto oral em duplas.',
      duracao: '2 semanas',
      data: '2026-04-01',
    },
    {
      id: 2,
      tema: 'Natureza Viva: Descobrindo o mundo das plantas',
      objetivos: 'Desenvolver o interesse pela natureza; estimular a observação científica; promover cuidado com o meio ambiente.',
      camposExperiencia: ['Espaços, tempos, quantidades, relações e transformações', 'Traços, sons, cores e formas'],
      habilidades: ['EI03ET01', 'EI03ET02', 'EI03TS02'],
      atividades: 'Plantio de sementes em copos plásticos; observação diária do crescimento; registro em diário de ciências com desenhos; roda de conversa sobre a importância das plantas.',
      duracao: '3 semanas',
      data: '2026-04-15',
    },
  ],
  avaliacoes: [
    {
      id: 1,
      alunoId: 1,
      planoId: 1,
      participacao: 'ativa',
      comportamento: 'interativo',
      desenvolvimento: 'avancado',
      linguagemOral: 'fluente',
      linguagemEscrita: 'em_processo',
      interesseLeitura: 'alto',
      matematicaContagem: 'avancado',
      matematicaNumeroQuantidade: 'avancado',
      motorFino: 'bom',
      motorAmplo: 'excelente',
      observacoes: 'Arthur demonstra excelente capacidade de liderança positiva em atividades em grupo. Sua participação é sempre entusiasta e contribui significativamente para a aprendizagem dos colegas.',
      data: '2026-04-30',
    },
    {
      id: 2,
      alunoId: 2,
      planoId: 1,
      participacao: 'moderada',
      comportamento: 'timido',
      desenvolvimento: 'em_processo',
      linguagemOral: 'em_processo',
      linguagemEscrita: 'inicial',
      interesseLeitura: 'medio',
      matematicaContagem: 'em_processo',
      matematicaNumeroQuantidade: 'em_processo',
      motorFino: 'em_processo',
      motorAmplo: 'bom',
      observacoes: 'Beatriz está em processo de adaptação ao ambiente escolar. Demonstra maior conforto em atividades individuais e gradualmente está se abrindo para interações em grupo.',
      data: '2026-04-30',
    },
  ],
  relatorios: [],
};

// Local storage persistence
export const saveData = (key, data) => {
  try {
    localStorage.setItem(`bncc_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
};

export const loadData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`bncc_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Initialize from localStorage or defaults
export const initStore = () => {
  return {
    alunos: loadData('alunos', mockData.alunos),
    planosAula: loadData('planosAula', mockData.planosAula),
    avaliacoes: loadData('avaliacoes', mockData.avaliacoes),
    relatorios: loadData('relatorios', mockData.relatorios),
  };
};
